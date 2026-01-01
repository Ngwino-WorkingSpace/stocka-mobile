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
import Toast from 'react-native-toast-message';

export default function OTPScreen({ navigation, route }) {
  const { phoneNumber } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleVerify = async () => {
    if (!otp || otp.length < 5) { 
      Toast.show({ type: 'error', text1: 'Invalid OTP', text2: 'Please enter valid OTP' }); 
      return; 
    }
    if (!phoneNumber) { 
      Toast.show({ type: 'error', text1: 'Missing Field', text2: 'Phone number missing' }); 
      return; 
    }

    try {
      setLoading(true);
      // Assuming the API expects { phoneNumber, recoveryPin }
      const res = await api.verifyRecoveryPin({
        phoneNumber,
        recoveryPin: otp
      });
      setLoading(false);

      if (res && (res.message || res.success || res.status === 200)) {
        navigation.navigate("reset-Password", { phoneNumber, otp });
      } else {
        Toast.show({ type: 'error', text1: 'Invalid OTP', text2: 'The OTP you entered is incorrect' });
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
              source={require("../assets/images/stocka.png")}
              style={styles.logo}
            />

            <Text style={styles.welcometext}>
              An OTP Code has been sent to your phone {phoneNumber}, please
              input the code below.
            </Text>

            <TextInput
              style={styles.otpInputFull}
              placeholder="Enter 5-digit OTP"
              placeholderTextColor="#107EBA"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={5}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>{loading ? "VERIFYING..." : "RESET PASSWORD"}</Text>
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
    marginTop: 5,

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
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    width: "100%",
    backgroundColor: "#09364D",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 5,
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
  otpInputFull: {
    width: "100%",
    backgroundColor: "#09364D",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0F4461",
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    letterSpacing: 10,
    shadowColor: "#0A5E8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

});
