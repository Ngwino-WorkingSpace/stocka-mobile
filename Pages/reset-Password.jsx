import BackgroundScreen from "../components/Background2.jsx";
import AnimatedBox from "../components/AnimatedBox.jsx";
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
  Touchable,
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
            <AnimatedBox delay={100} type="slideUp">
              <Image
                source={require("../assets/images/ppl.png")}
                style={styles.logo}
                tintColor="#09111E"
              />
            </AnimatedBox>

            <AnimatedBox delay={200} type="slideUp">
              <Text style={styles.welcometext}>
                Reset your password. And make sure to put a password
                that is easy for you to remember.
              </Text>
            </AnimatedBox>

            <AnimatedBox delay={300} type="slideUp" style={{ width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </AnimatedBox>

            <AnimatedBox delay={400} type="slideUp" style={{ width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(9, 17, 30, 0.4)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </AnimatedBox>

            <AnimatedBox delay={500} type="slideUp" style={{width:"100%"}} >
              <TouchableOpacity style={[styles.button, { width: "100%" }]} onPress={handleReset} disabled={loading}>
                 <Text style={styles.buttonText}>{loading ? "RESETTING..." : "RESET PASSWORD"}</Text>
               </TouchableOpacity>
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




