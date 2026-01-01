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
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
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
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
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
              source={require("../assets/images/stocka.png")}
              style={styles.logo}
            />

            <Text style={styles.welcometext}>
              Welcome to TradeWise! Let's get you signed up
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Fullname"
              placeholderTextColor="#107EBA"
              value={fullname}
              onChangeText={setFullname}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#107EBA"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <TextInput
              style={styles.input}
              placeholder="Email (Optional)"
              placeholderTextColor="#107EBA"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Recovery Pin"
              placeholderTextColor="#107EBA"
              value={recoveryPin}
              onChangeText={setRecoveryPin}
              keyboardType="numeric"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#107EBA"
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
                  color="#107EBA"
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
  },

  welcometext: {
    color: "#fff",
    fontSize: 15, // was 16
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins_500Medium",
  },

  input: {
    width: "100%",
    backgroundColor: "#09364D",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#0F4461",
    fontSize: 16, // was 17
    fontFamily: "Poppins_400Regular",

    shadowColor: "#0A5E8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "#09364D",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#0F4461",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0A5E8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 15,
    color: "#107EBA",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
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

    shadowColor: "#0A5E8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17, // was 18
    fontFamily: "Poppins_600SemiBold",
  },

  signinText: {
    color: "#fff",
    fontSize: 15, // was 16
    margin: 5,
    alignSelf: "flex-start",
    fontFamily: "Poppins_400Regular",
  },

  highlighted: {
    color: "#1E90FF",
    fontFamily: "Poppins_600SemiBold",
  },
});
