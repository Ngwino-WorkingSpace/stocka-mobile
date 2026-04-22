import Background from "../components/Background.jsx";
import AnimatedBox from "../components/AnimatedBox.jsx";
import React from "react";
import {View, Text, StyleSheet,Image, TouchableOpacity} from "react-native";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Nosifer_400Regular, Nosifer_700Bold } from "@expo-google-fonts/nosifer";

export default function LandingScreen({navigation}){

 const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Nosifer_400Regular,
  });

  if (!fontsLoaded) return null;
    return(
        <View style={styles.container}>
  <Background />

  <View style={styles.content}>
    
    {/* LOGO */}
    <AnimatedBox delay={200} type="slideUp" >
      <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/ppl.png")}
        style={styles.logo}
        tintColor="#09111E"
      />
      <Text style={styles.title}>Stocka</Text>
      </View>
    </AnimatedBox>

    {/* BUTTON */}
    <AnimatedBox
      delay={400}
      type="slideUp"
      isButton={true}
      style={styles.getStartedBtn}
      onPress={() => navigation.navigate("Welcome")}
    >
      <Text style={styles.getStartedText}>Get Started</Text>
    </AnimatedBox>

  </View>

  {/* BOTTOM TEXT */}
  <AnimatedBox delay={600} type="fade">
    <Text style={styles.bottomText}>NGWINO</Text>
  </AnimatedBox>

</View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingTop: 50,
    flexDirection: "column",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // 🔥 add some space to the right of the logo
    justifyContent: "center" // 🔥 space between logo & button
  },

  logo: {
    width: 70,
    height: 70,
  },

  title: {
    fontSize: 32,
    color: "#09111E",
    marginLeft: 2,
    fontFamily: "Nosifer_400Regular",
  },

  getStartedBtn: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#09111E",
    backgroundColor: "#09111E",
    shadowColor: "#09111E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  getStartedText: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },

  bottomText: {
    position: "absolute",
    bottom: 20,
    right: 20,
    fontSize: 18,
    color: "#09111E",
    fontFamily: "Urbanist_400Regular",
  },
});