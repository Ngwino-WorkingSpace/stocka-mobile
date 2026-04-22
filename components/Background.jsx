import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * A clean, premium background using layered circles (blobs) 
 * for a modern, sophisticated aesthetic.
 * This version is synced with the design in Background2.jsx.
 */
export default function Background() {
  return (
    <View style={styles.container}>
      {/* Top Left — Large soft blob */}
      <View style={[styles.blob, { top: -180, left: -150, width: 350, height: 350, opacity: 0.09 }]} />
      
      {/* Top Right — Medium accent circle */}
      <View style={[styles.blob, { top: 80, right: -40, width: 180, height: 180, opacity: 0.09 }]} />

      {/* Bottom Right — Large focal blob */}
      <View style={[styles.blob, { bottom: -120, right: -120, width: 350, height: 350, opacity: 0.09 }]} />

      {/* Middle Left — Subtle depth circle (Disabled by design preference) */}
      {/* <View style={[styles.blob, { top: '35%', left: -60, width: 220, height: 220, opacity: 0.09 }]} /> */}

      {/* Bottom Left — Small detail circle (Disabled by design preference) */}
      {/* <View style={[styles.blob, { bottom: 150, left: 30, width: 100, height: 100, opacity: 0.04 }]} /> */}
      
      {/* Middle Right — Small floating accent (Disabled by design preference) */}
      {/* <View style={[styles.blob, { top: '60%', right: 40, width: 60, height: 60, opacity: 0.04 }]} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#09111E',
  }
});
