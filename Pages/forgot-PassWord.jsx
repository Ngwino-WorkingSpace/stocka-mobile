import BackgroundScreen from "../components/Background2.jsx";
import React, { useState } from "react";
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

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

import { api } from "../src/services/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [Phonenumber, setPhonenumber] = useState("");
  const [recoveryPin, setRecoveryPin] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleVerify = async () => {
    if (!Phonenumber || !recoveryPin) {
      alert("Please enter both phone number and recovery code");
      return;
    }

    try {
      setLoading(true);
      const res = await api.verifyRecoveryPin({
        phoneNumber: Phonenumber,
        recoveryPin: recoveryPin
      });
      setLoading(false);

      if (res && res.token) {
        // Navigate to reset password with params, passing the recovery token
        navigation.navigate("reset-Password", {
          phoneNumber: Phonenumber,
          recoveryToken: res.token
        });
      } else {
        alert(res.error || res.message || "Verification failed");
      }
    } catch (e) {
      setLoading(false);
      alert("Error: " + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundScreen />

      <KeyboardAvoidingView
        style={styles.contentWrapper}
        behavior={Platform.OS === "ios" ? "padding" : null}
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
              Please input your phone number and recovery code to reset your password.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#107EBA"
              value={Phonenumber}
              onChangeText={setPhonenumber}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Recovery Code"
              placeholderTextColor="#107EBA"
              value={recoveryPin}
              onChangeText={setRecoveryPin}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>{loading ? "VERIFYING..." : "VERIFY CODE"}</Text>
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
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
    fontFamily: "Poppins_500Medium",
  },

  input: {
    width: "100%",
    backgroundColor: "#09364D",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 15,
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
    textAlign: "left",
    marginTop: 20,
    alignSelf: "flex-start",
    fontFamily: "Poppins_400Regular",
  },

  highlighted: {
    color: "#1E90FF",
    fontFamily: "Poppins_600SemiBold",
  },

  forgot: {
    fontSize: 16,
    color: "#1FA5ED",
    textAlign: "right",
    fontWeight: "500",       // medium weight
    marginTop: 10,           // spacing from input fields above
    fontFamily: "Poppins_400Regular",
  }

});
