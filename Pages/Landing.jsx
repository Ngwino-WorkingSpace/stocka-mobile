import Background from "../components/Background.jsx";
import React from "react";
import {View, Text, StyleSheet,Image} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function LandingScreen(){

 const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;
    return(
        <View style={styles.container}>
          <Background/>
           <View style={styles.content}>
            <Image source={require("../assets/images/stocka.png")}/>

          </View>
          <Text style={styles.bottomText}>NGWINO</Text>
        </View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingTop:50, // keeps content above background
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily:"Poppins_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#DCEAF1",
    marginTop: 8,
     fontFamily:"Poppins_400Regular",
  },
   bottomText: {
    position: 'absolute',
    bottom: 20, // distance from the bottom
    right: 20,  // distance from the right
    fontSize: 23,
    color: '#fff',
    fontWeight:"600", // your color
     fontFamily:"Poppins_400Regular",
  },
});
