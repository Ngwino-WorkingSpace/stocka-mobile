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

export default function SignupScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recoveryPin, setRecoveryPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleRegister = async () => {
    if (!fullname || !password || !phoneNumber || !recoveryPin) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    const result = await register({
      fullName: fullname,
      email: email || undefined,
      password,
      phoneNumber,
      recoverypin: recoveryPin
    });
    setLoading(false);

    if (result.success) {
      Toast.show({ type: 'success', text1: 'Success', text2: 'Registration successful! Please login.' });
      navigation.navigate("Login");
    } else {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: result.error || "Registration failed" });
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
            />

            <Text style={styles.welcometext}>
              Welcome to TradeWise! Let's get you signed up
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Fullname"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={fullname}
              onChangeText={setFullname}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <TextInput
              style={styles.input}
              placeholder="Email (Optional)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Recovery Pin"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={recoveryPin}
              onChangeText={setRecoveryPin}
              keyboardType="numeric"
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
              Already have an account?{" "}
              <Text
                style={styles.highlighted}
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>
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
    tintColor:"#fff",
  },

  welcometext: {
    color: "#fff",
    fontSize: 15, // was 16
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Urbanist_500Medium",
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 8,
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
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17, // was 18
    fontFamily: "Urbanist_600SemiBold",
  },

  signinText: {
    color: "#fff",
    fontSize: 15, // was 16
    margin: 5,
    alignSelf: "flex-start",
    fontFamily: "Urbanist_400Regular",
  },

  highlighted: {
    color: "#1E90FF",
    fontFamily: "Urbanist_600SemiBold",
  },
});




