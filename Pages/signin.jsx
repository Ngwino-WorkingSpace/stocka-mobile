import BackgroundScreen from "../components/Background2.jsx";
import React, { useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";


import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
} from "@expo-google-fonts/urbanist";
import Toast from 'react-native-toast-message';

export default function SignInScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [fontsLoaded] = useFonts({  
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    const result = await login(phoneNumber, password);
    setLoading(false);

    if (result.success) {
      // Navigation is handled by AuthContext state change in MainScreen
      // or explicit navigation if needed, though state change helps.
      // But explicit navigation is safer for stack handling sometimes.
      // However, since MainScreen switches based on `user`, it might just work.
      // But user might need to be redirected manually if stack doesn't unmount/remount.
      // Let's rely on AuthContext for now, but if it fails, I'll add navigation.replace("dashboard").
      // Actually, the stack navigator in index.jsx has initialRouteName. That only affects MOUNT.
      // It DOES NOT change the current screen if the stack is already mounted!
      // So I MUST navigate manually.
      // Wait, if I am in "Login" screen, and `user` becomes set, `MainScreen` re-renders.
      // But `Stack.Navigator` returns the same navigator instance.
      // React Navigation 6/7 doesn't automatically switch screens when initialRouteName changes.
      // So I MUST execute navigation.replace("dashboard").
      navigation.reset({
        index: 0,
        routes: [{ name: 'dashboard' }],
      });
    } else {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: result.error || "Login failed" });
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundScreen />

      <KeyboardAvoidingView
        style={styles.contentWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image
              source={require("../assets/images/ppl.png")}
              style={styles.logo}
              tintColor="#fff"
            />

            <Text style={styles.welcometext}>
              Welcome to TradeWise! Let's get you signed in
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.signinText}>
              Don't have an account?{" "}
              <Text
                style={styles.highlighted}
                onPress={() => navigation.navigate("signup")}
              >
                Sign up
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            <Text style={styles.forgot}
              onPress={() => {
                navigation.navigate("forgot-password");
              }}
            >Forgot Password?</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    width: "100%",
  },

  content: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
  },

  welcometext: {
    color: "#fff",
    fontSize: 15, // was 16
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Urbanist_500Medium",
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },

  button: {
    width: "100%",
    backgroundColor: "#1E90FF",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,

    ...Platform.select({
      ios: {
        shadowColor: "#0A5E8C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 5px rgba(10,94,140,0.5)",
      },
    }),
  },

  buttonText: {
    color: "#fff",
    fontSize: 17, // was 18
    fontFamily: "Urbanist_600SemiBold",
  },

  signinText: {
    color: "#fff",
    fontSize: 15, // was 16
    textAlign: "left",
    marginTop: 20,
    alignSelf: "flex-start",
    fontFamily: "Urbanist_400Regular",
  },

  highlighted: {
    color: "#1E90FF",
    fontFamily: "Urbanist_600SemiBold",
  },

  forgot: {
    fontSize: 16,            // slightly smaller than regular text
    color: "#1FA5ED",        // bright blue for clickable feel
    textAlign: "right",      // align to the right if needed
    fontWeight: "500",       // medium weight
    marginTop: 10,           // spacing from input fields above
    fontFamily: "Urbanist_400Regular",
  }

});




