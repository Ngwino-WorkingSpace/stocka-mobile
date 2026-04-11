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

export default function ResetPasswordScreen({ navigation, route }) {
  const { phoneNumber, otp } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) { 
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter passwords' }); 
      return; 
    }
    if (newPassword !== confirmPassword) { 
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match' }); 
      return; 
    }

    try {
      setLoading(true);
      const { recoveryToken } = route.params || {};
      const res = await api.resetPassword({
        newPassword
      }, recoveryToken);
      setLoading(false);

      if (res && (res.message || res.success || res.status === 200)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Password reset successfully' });
        navigation.navigate("lastOTP");
      } else {
        Toast.show({ type: 'error', text1: 'Reset Failed', text2: res.message || "Unknown error" });
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
              Reset your password. And make sure to put a password
              that is easy for you to remember.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Create Password"
              placeholderTextColor="#107EBA"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#107EBA"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>{loading ? "RESETTING..." : "RESET PASSWORD"}</Text>
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
    fontFamily: "Urbanist_400Regular",
  },

  input: {
    width: "100%",
    backgroundColor: "#09111E",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#0F4461",
    fontSize: 16, // was 17
    fontFamily: "Urbanist_400Regular",

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




