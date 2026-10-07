#!/usr/bin/env node
/**
 * DEAR security guard.
 *
 * Detects the "PolinRider" style injection that keeps re-infecting our repositories:
 *   - obfuscated JS appended to the last line of a config file behind a run of tabs
 *   - `.vscode/tasks.json` with `runOn: folderOpen` (runs code as soon as the folder is opened)
 *   - `.bat` push helpers, and JS payloads disguised as font files (e.g. fa-solid-400.woff2)
 * It also blocks committed secrets (.env files, private keys, Groq keys, DB URLs with passwords).
 *
 * Usage (zero dependencies, Node 18+):
 *   node scripts/security-guard.mjs staged               files in the git index (pre-commit)
 *   node scripts/security-guard.mjs range <base> <head>  files changed between two commits (pre-push, CI)
 *   node scripts/security-guard.mjs tree                 every tracked file (CI, post-merge)
 *
 * Exit code 1 when anything is found.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
const MAX_BUFFER = 256 * 1024 * 1024;

const git = (args) =>
  execFileSync('git', args, { maxBuffer: MAX_BUFFER, stdio: ['ignore', 'pipe', 'pipe'] });

const SKIP_PATH = /(^|\/)(node_modules|dist|build|coverage|\.expo|\.next)\/|(^|\/)package-lock\.json$|\.min\.(js|css)$|(^|\/)scripts\/security-guard\.mjs$/;
const CODE_EXT = /\.(c|m)?(j|t)sx?$|\.json$|\.sh$|\.html?$|(^|\/)\.husky\/[^/]+$/;
const CONFIG_FILE = /(^|\/)[\w.-]*config\.(c|m)?(j|t)s$/;
const FONT_EXT = /\.(woff2?|ttf|otf|eot)$/i;

const FORBIDDEN_PATHS = [
  [/\.(bat|cmd|vbs|scr)$/i, 'Windows script file (used by the malware to auto-push)'],
  [/(^|\/)\.vscode\/tasks\.json$/, '.vscode/tasks.json can run code when the folder is opened'],
  [/(^|\/)branch_structure\.json$/, 'known malware artifact'],
  [/(^|\/)temp_[\w-]*push[\w-]*\./i, 'known malware push helper'],
  [/(^|\/)\.env(?!\.example$)(\.[^/]*)?$/, 'environment file with secrets must never be committed'],
];

const CONTENT_RULES = [
  {
    id: 'hidden-tab-payload',
    why: 'code hidden behind a long run of tabs (pushed off-screen)',
    test: (t) => /\t{10,}[^\t\r\n]/.test(t),
  },
  {
    id: 'obfuscated-identifiers',
    why: 'obfuscator-style identifiers (_0x1a2b3c)',
    test: (t) => (t.match(/\b_0x[0-9a-f]{4,6}\b/g) || []).length >= 3,
  },
  {
    id: 'global-tag',
    why: "global tag assignment such as global.i = 'A8-7117'",
    test: (t) =>
      /\bglobal(?:This)?\s*(?:\.\s*[A-Za-z_$][\w$]{0,2}|\[\s*['"][^'"]{1,4}['"]\s*\])\s*=\s*['"`]/.test(t),
  },
  {
    id: 'very-long-line',
    why: 'line longer than 3000 characters in source (minified or injected payload)',
    test: (t, file) => !file.endsWith('.json') && t.split('\n').some((l) => l.length > 3000),
  },
  {
    id: 'decode-and-run',
    why: 'decodes a string and executes it (eval / new Function)',
    test: (t) =>
      /\beval\s*\(\s*(?:atob|Buffer\.from|unescape|decodeURIComponent)/.test(t) ||
      /new\s+Function\s*\([^)]*(?:atob|Buffer\.from|fromCharCode)/.test(t),
  },
  {
    id: 'config-runs-code',
    why: 'config file spawns processes or evaluates dynamic code',
    test: (t, file) =>
      CONFIG_FILE.test(file) &&
      /child_process|\beval\s*\(|new\s+Function\s*\(|String\.fromCharCode|\batob\s*\(/.test(t),
  },
  {
    id: 'secret-groq-key',
    why: 'Groq API key',
    test: (t) => /\bgsk_[A-Za-z0-9]{30,}/.test(t),
  },
  {
    id: 'secret-private-key',
    why: 'private key',
    test: (t) => /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/.test(t),
  },
  {
    id: 'secret-db-url',
    why: 'database URL with an embedded password',
    test: (t) =>
      /postgres(?:ql)?:\/\/[^:\s'"@]+:(?!password\b|\*+|<|\$\{|%)[^@\s'"]{6,}@(?!localhost|127\.0\.0\.1)/i.test(t),
  },
];

function isBinary(buf) {
  const len = Math.min(buf.length, 8000);
  for (let i = 0; i < len; i++) if (buf[i] === 0) return true;
  return false;
}

function listFiles(mode, args) {
  if (mode === 'staged') {
    const out = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']);
    return { files: split(out), read: (f) => git(['show', `:${f}`]) };
  }
  if (mode === 'range') {
    const [base, head] = args;
    if (!base || !head) usage();
    const span = base === EMPTY_TREE ? [base, head] : [`${base}...${head}`];
    const out = git(['diff', '--name-only', '--diff-filter=ACMR', '-z', ...span]);
    return { files: split(out), read: (f) => git(['show', `${head}:${f}`]) };
  }
  if (mode === 'tree') {
    return { files: split(git(['ls-files', '-z'])), read: (f) => readFileSync(f) };
  }
  return usage();
}

const split = (out) => out.toString('utf8').split('\0').filter(Boolean);

function usage() {
  console.error('usage: security-guard.mjs staged | range <base> <head> | tree');
  process.exit(2);
}

/** Files that exist on disk but are ignored/untracked: the malware drops them and they still run. */
function workspaceAlarms() {
  const found = [];
  const tasks = '.vscode/tasks.json';
  if (existsSync(tasks) && /folderOpen/.test(readFileSync(tasks, 'utf8'))) {
    found.push([tasks, 'auto-runs on folder open. Delete it and scan this machine for malware.']);
  }
  const settings = '.vscode/settings.json';
  if (existsSync(settings) && /allowAutomaticTasks["']?\s*:\s*(true|["']on["'])/.test(readFileSync(settings, 'utf8'))) {
    found.push([settings, 'enables automatic tasks (used to launch the malware).']);
  }
  for (const name of readdirSync('.')) {
    if (/\.(bat|cmd)$/i.test(name) || name === 'branch_structure.json') {
      found.push([name, 'known malware artifact in the project root.']);
    }
  }
  return found;
}

const [mode, ...rest] = process.argv.slice(2);
if (!mode) usage();

const findings = [];
const { files, read } = listFiles(mode, rest);

for (const file of files) {
  if (SKIP_PATH.test(file)) continue;

  for (const [rx, why] of FORBIDDEN_PATHS) {
    if (rx.test(file)) findings.push([file, 'forbidden-file', why]);
  }

  let buf;
  try {
    buf = read(file);
  } catch {
    continue; // submodule, deleted, or unreadable
  }
  if (!buf.length) continue;

  const binary = isBinary(buf);
  if (FONT_EXT.test(file) && !binary) {
    findings.push([file, 'fake-font', 'font file that is really text/JavaScript (payload disguised as a font)']);
    continue;
  }
  if (binary || !(CODE_EXT.test(file) || FORBIDDEN_PATHS[0][0].test(file))) continue;

  const text = buf.toString('utf8');
  for (const rule of CONTENT_RULES) {
    if (rule.test(text, file)) findings.push([file, rule.id, rule.why]);
  }
}

for (const [file, why] of workspaceAlarms()) findings.push([file, 'workspace-alarm', why]);

if (findings.length) {
  console.error('\n🚨 DEAR security guard: suspicious content found\n');
  for (const [file, id, why] of findings) console.error(`  ${file}\n    [${id}] ${why}`);
  console.error(
    '\nDo NOT bypass this. If you did not add this yourself, your machine may be infected:\n' +
      '  1. Delete the file/line and do not open this folder in VS Code until the machine is scanned.\n' +
      '  2. Tell the team lead, then rotate your GitHub token / SSH keys.\n' +
      `(checked ${files.length} file(s) in "${mode}" mode from ${path.basename(process.cwd())})\n`,
  );
  process.exit(1);
}
console.log(`✔ security guard: ${files.length} file(s) clean (${mode})`);
