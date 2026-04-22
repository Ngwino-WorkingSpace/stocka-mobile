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
import AnimatedBox from "../components/AnimatedBox.jsx";

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
            <AnimatedBox delay={100} type="slideUp">
              <Image
                source={require("../assets/images/ppl.png")}
                style={styles.logo}
                tintColor="#09111E"
              />
            </AnimatedBox>

            <AnimatedBox delay={200} type="slideUp">
              <Text style={styles.welcometext}>
                Welcome to TradeWise! Let's get you signed in
              </Text>
            </AnimatedBox>

            <AnimatedBox delay={300} type="slideUp" style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </AnimatedBox>

            <AnimatedBox delay={400} type="slideUp" style={{ width: '100%' }}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="rgba(9, 17, 30, 0.4)"
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
                    color="#09111E"
                  />
                </TouchableOpacity>
              </View>
            </AnimatedBox>

            <AnimatedBox delay={500} type="slideUp" style={{ width: '100%' }}>
              <Text style={styles.signinText}>
                Don't have an account?{" "}
                <Text
                  style={styles.highlighted}
                  onPress={() => navigation.navigate("signup")}
                >
                  Sign up
                </Text>
              </Text>
            </AnimatedBox>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            <AnimatedBox delay={700} type="fade">
              <Text style={styles.forgot}
                onPress={() => {
                  navigation.navigate("forgot-password");
                }}
              >Forgot Password?</Text>
            </AnimatedBox>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#09111E",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Urbanist_500Medium",
    opacity: 0.8,
  },

  input: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    color: "#09111E",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(9, 17, 30, 0.1)",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(9, 17, 30, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 15,
    color: "#09111E",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },

  button: {
    width: "100%",
    backgroundColor: "#09111E",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#09111E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Urbanist_600SemiBold",
  },

  signinText: {
    color: "rgba(9, 17, 30, 0.6)",
    fontSize: 15,
    marginTop: 20,
    alignSelf: "center",
    fontFamily: "Urbanist_400Regular",
  },

  highlighted: {
    color: "#09111E",
    fontFamily: "Urbanist_700Bold",
  },

  forgot: {
    fontSize: 16,
    color: "#09111E",
    textAlign: "right",
    fontWeight: "600",
    marginTop: 15,
    fontFamily: "Urbanist_600SemiBold",
  }

});




