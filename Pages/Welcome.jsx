import BackgroundScreen from "../components/Background2.jsx";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function LandingScreen({navigation}) {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <BackgroundScreen />

      {/* Centered content */}
      <View style={styles.centeredContent}>
        <Image
          source={require("../assets/images/stockaLogo.png")}
          style={styles.logo}
        />

        <Text style={styles.subtitle}>Welcome to</Text>
        <Text style={styles.title}>Stocka</Text>
        <Text style={styles.paragraph}>
          TradeWise is the smart way to run a business without the headache.
          It records every transaction automatically, tracks profits and losses
          in real time, and replaces messy ledgers and complex calculations so
          you can focus on growing your business, not chasing numbers.
        </Text>

        <TouchableOpacity style={styles.button}
         onPress={()=>navigation.navigate("signup")}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward-circle" size={27} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom right text */}
      <Text style={styles.bottomText}>NGWINO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Centered content container
  centeredContent: {
    flex: 1,
    justifyContent: "center", // centers vertically
    alignItems: "center",     // centers horizontally
    paddingHorizontal: 30,
    zIndex: 2,
    paddingTop:150,
  },

  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 25,
    color: "#DCEAF1",
    marginBottom: 5,
  },
  title: {
    fontSize: 55,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily:"Poppins_700Bold",
  },
  paragraph: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 22,
    textAlign: "center",  // centers text horizontally
    marginBottom: 30,
    letterSpacing:0.1,
    fontFamily:"Poppins_400Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09364D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth:1,
    borderColor:"#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginRight: 8,
    fontFamily:"Poppins_400Regular",
  },
  bottomText: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 23,
    color: "#fff",
    fontWeight: "600",
    fontFamily:"Poppins_400Regular",
  },
});
