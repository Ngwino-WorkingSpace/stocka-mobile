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
} from "react-native";

import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
} from "@expo-google-fonts/urbanist";

export default function LastOTPScreen({ navigation }) {
  const [Email, setEmail] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
  });

  if (!fontsLoaded) return null;

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
             <AnimatedBox type="zoomIn" delay={100} style={styles.congzIcon}>
                <Image source={require("../assets/images/ppl.png")} style={styles.logo} tintColor="#09111E" />
             </AnimatedBox>

            <AnimatedBox type="slideUp" delay={200}>
              <Text style={styles.welcometext}>
                   Hello dear user, Your password has been successfully reset. You will be using the new password when logging in.
              </Text>
            </AnimatedBox>

            <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>CONTINUE</Text>
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
    marginBottom: 40,
    fontFamily: "Urbanist_500Medium",
    opacity: 0.8,
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

    ...Platform.select({
      ios: {
        shadowColor: "#0A5E8C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 5px rgba(10,94,140,0.5)",
      },
    }),
  },

  button: {
    width: "100%",
    backgroundColor: "#09111E",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
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
  fontSize: 16,           
  color: "#1FA5ED",        
  textAlign: "right",      
  fontWeight: "500",       // medium weight
  marginTop: 10,           // spacing from input fields above
 fontFamily:"Urbanist_400Regular",
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
    backgroundColor: "#09111E",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#107EBA",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#0F4461",
    fontSize: 16, // was 17
    fontFamily: "Urbanist_400Regular",

    ...Platform.select({
      ios: {
        shadowColor: "#0A5E8C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 5px rgba(10,94,140,0.5)",
      },
    }),
  },

  congzIcon: {
  justifyContent: "center",   // centers vertically
  alignItems: "center",       // centers horizontally
  marginBottom: 40,         // spacing above and below
  width: 100,                 // make the container square
  height: 100,
  borderRadius: 50,           // make it circular
},

summaryEmoji: {
  fontSize: 90,               // big emoji
  textAlign: "center",
},
logo: {
  width: 70,
  height: 70,
  resizeMode: "contain",
},
});




