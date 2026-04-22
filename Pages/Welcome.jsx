import BackgroundScreen from "../components/Background2.jsx";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AnimatedBox from "../components/AnimatedBox.jsx";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Nosifer_400Regular} from "@expo-google-fonts/nosifer";

export default function LandingScreen({ navigation }) {

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Nosifer_400Regular,
  });

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <BackgroundScreen />

      {/* Centered content */}
      <View style={styles.centeredContent}>
        <AnimatedBox delay={100} type="slideUp">
          <Image
            source={require("../assets/images/ppl.png")}
            style={styles.logo}
            tintColor="#09111E"
          />
        </AnimatedBox>

        <AnimatedBox delay={300} type="slideUp">
          <Text style={styles.subtitle}>Welcome to</Text>
        </AnimatedBox>

        <AnimatedBox delay={500} type="slideUp">
          <Text style={styles.title}>Stocka</Text>
        </AnimatedBox>

        <AnimatedBox delay={700} type="slideUp">
          <Text style={styles.paragraph}>
            Stocka is the smart way to run a business without the headache.
            It records every transaction automatically, tracks profits and losses
            in real time, and replaces messy ledgers and complex calculations so
            you can focus on growing your business, not chasing numbers.
          </Text>
        </AnimatedBox>

        <TouchableOpacity onPress={() => navigation.navigate("signup")} style={styles.button}>
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
    paddingTop: 150,
  },

  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    color: "#09111E",
    marginBottom: 5,
    fontFamily: "Urbanist_400Regular",
    opacity: 0.8,
  },
  title: {
    fontSize: 55,
    color: "#09111E",
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Nosifer_400Regular",
  },
  paragraph: {
    fontSize: 14,
    color: "rgba(9, 17, 30, 0.7)",
    lineHeight: 22,
    textAlign: "center",  // centers text horizontally
    marginBottom: 10,
    letterSpacing: 0.1,
    fontFamily: "Urbanist_400Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    backgroundColor: "#09111E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#09111E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginRight: 8,
    fontFamily: "Urbanist_400Regular",
  },
  bottomText: {
    position: "absolute",
    bottom: 2,
    right: 6,
    fontSize: 21,
    color: "#09111E",
    fontWeight: "600",
    fontFamily: "Urbanist_400Regular",
  },
  logo: {
    width: 70,
    height: 70,
  }
});




