import Background from "../components/Background.jsx";
import React from "react";
import {View, Text, StyleSheet,Image} from "react-native";

export default function WelcomeScreen(){
    return(
        <View style={styles.container}>
          <Background/>
           <View style={styles.content}>
            <Image source={require("../assets/images/stocka.png")}/>
            </View>
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
    zIndex: 1, // keeps content above background
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
});
