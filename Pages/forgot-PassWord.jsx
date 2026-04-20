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
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
} from "@expo-google-fonts/urbanist";

import { api } from "../src/services/api";
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen({ navigation }) {
  const [Phonenumber, setPhonenumber] = useState("");
  const [recoveryPin, setRecoveryPin] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleVerify = async () => {
    if (!Phonenumber || !recoveryPin) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter both phone number and recovery code' });
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
        Toast.show({ type: 'error', text1: 'Verification Failed', text2: res.error || res.message || "Verification failed" });
      }
    } catch (e) {
      setLoading(false);
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || "An error occurred" });
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Image
              source={require("../assets/images/ppl.png")}
              style={styles.logo}
              tintColor="#fff"
            />

            <Text style={styles.welcometext}>
              Please input your phone number and recovery code to reset your password.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={Phonenumber}
              onChangeText={setPhonenumber}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Recovery Code"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
    fontSize: 16,
    color: "#1FA5ED",
    textAlign: "right",
    fontWeight: "500",       // medium weight
    marginTop: 10,           // spacing from input fields above
    fontFamily: "Urbanist_400Regular",
  }

});




