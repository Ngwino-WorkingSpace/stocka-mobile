import Background from "../components/Background.jsx";
import React from "react";
import {View, Text, StyleSheet,Image, TouchableOpacity} from "react-native";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";

export default function LandingScreen({navigation}){

 const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  if (!fontsLoaded) return null;
    return(
        <View style={styles.container}>
          <Background/>
           <View style={styles.content}>
                 <View style={styles.logoContainer}>
                   <Image source={require("../assets/images/ppl.png")}  style={styles.logo}/>
                   <Text style={styles.title}>Stocka</Text>
                 </View>
            <View style={styles.GetStarted}>
  <TouchableOpacity style={styles.getStartedBtn}
    onPress={()=> navigation.navigate("Welcome")}
   >
    <Text style={styles.getStartedText}>Get started</Text>
  </TouchableOpacity>
</View>

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
    fontFamily:"Urbanist_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 8,
     fontFamily:"Urbanist_400Regular",
  },
  GetStarted: {
  alignItems: "center",
},

getStartedBtn: {
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 25,
  borderWidth: 1,
  borderColor: "#fff", // MAIN color
  backgroundColor: "transparent", // 👈 key part
},

getStartedText: {
  fontFamily: "Urbanist_600SemiBold",
  fontSize: 16,
  color: "#fff",
},

   bottomText: {
    position: 'absolute',
    bottom: 20, // distance from the bottom
    right: 20,  // distance from the right
    fontSize: 23,
    color: '#fff',
    fontWeight:"600", // your color
     fontFamily:"Urbanist_400Regular",
  },
  logoContainer:{
    flexDirection: "row",
    alignItems: "center",
    marginRight: 13,
  },
  logo: {
    width: 70,
    height: 70,
    tintColor:"#fff",
  },
  title:{
    fontSize: 30,
    color: "#fff",
    marginLeft: 2,
    fontFamily:"Urbanist_700Bold",
  }
});

