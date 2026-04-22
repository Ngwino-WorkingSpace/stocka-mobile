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
            <AnimatedBox delay={100} type="slideUp">
              <Image
                source={require("../assets/images/ppl.png")}
                style={styles.logo}
                tintColor="#09111E"
              />
            </AnimatedBox>

            <AnimatedBox delay={200} type="slideUp">
              <Text style={styles.welcometext}>
                Welcome to Stocka ! Let's get you signed up
              </Text>
            </AnimatedBox>

            <AnimatedBox delay={300} type="slideUp" style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Fullname"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                value={fullname}
                onChangeText={setFullname}
              />
            </AnimatedBox>

            <AnimatedBox delay={400} type="slideUp" style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </AnimatedBox>

            <AnimatedBox delay={500} type="slideUp" style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Email (Optional)"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </AnimatedBox>

            <AnimatedBox delay={600} type="slideUp" style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Recovery Pin"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                value={recoveryPin}
                onChangeText={setRecoveryPin}
                keyboardType="numeric"
              />
            </AnimatedBox>

            <AnimatedBox delay={700} type="slideUp" style={{ width: '100%' }}>
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

            <AnimatedBox delay={800} type="slideUp" style={{ width: '100%' }}>
              <Text style={styles.signinText}>
                Already have an account?{" "}
                <Text
                  style={styles.highlighted}
                  onPress={() => navigation.navigate("Login")}
                >
                  Sign in
                </Text>
              </Text>
            </AnimatedBox>

            <TouchableOpacity onPress={handleRegister} style={[styles.button, { opacity: loading ? 0.7 : 1 }]}>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(9, 17, 30, 0.1)",
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
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
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
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
    marginVertical: 10,
    alignSelf: "center",
    fontFamily: "Urbanist_400Regular",
  },

  highlighted: {
    color: "#09111E",
    fontFamily: "Urbanist_700Bold",
  },
});




