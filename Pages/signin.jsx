import BackgroundScreen from "../components/Background2.jsx";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    console.log("Signup clicked");
  };

  return (
    <View style={styles.container}>
      <BackgroundScreen />

      {/* KeyboardAvoidingView helps with keyboard overlapping */}
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
              Welcome to TradeWise! Let's get you signed up
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#107EBA"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#107EBA"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.signinText}>
                      Don't have an account?{" "}
              <Text style={styles.highlighted} onPress={() => navigation.navigate("signup")}>
              Sign up
            </Text>
          </Text>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign In</Text>
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
    justifyContent: "flex-end", // aligns entire block at bottom
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20, // space from bottom edge
    width: "100%",
  },

  content: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal:20,
  },

  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
    marginBottom: 0,
  },
  welcometext: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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
  fontSize: 17,

  // iOS shadow
  shadowColor: "#0A5E8C",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 5,

  // Android shadow
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

  // Android shadow
  elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

 signinText: {
  color: "#fff",
  fontSize: 16,
  textAlign: "left", // aligns text to the left
  marginTop: 20,
  alignSelf:"flex-start",
},

highlighted: {
  color: "#1E90FF", // bright blue to stand out
  fontWeight: "bold",
},

});
