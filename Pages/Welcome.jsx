import BackgroundScreen from "../components/Background2.jsx";
import React from "react";
import {View, Text, StyleSheet,Image} from "react-native";

export default function LandingScreen(){
    return(
        <View style={styles.container}>
          <BackgroundScreen/>
           <View style={styles.content}>
            <Image source={require("../assets/images/stockaLogo.png")}
               style={styles.logo}
            />

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
    
  },
  logo:{
        width: 200,   // set your image width
    height: 100,   // set your image height
    resizeMode: 'contain', // maintain aspect ratio
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#DCEAF1",
    marginTop: 8,
  },
   bottomText: {
    position: 'absolute',
    bottom: 20, // distance from the bottom
    right: 20,  // distance from the right
    fontSize: 23,
    color: '#fff',
    fontWeight:"600" // your color
  },
});
