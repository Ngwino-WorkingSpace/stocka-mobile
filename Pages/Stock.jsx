import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-web";

export default function StockScreen(){
    const StockProducts = [
        {
            id:1,
            Image: require("../assets/images/irishPotatoes.png"),
            TextHead:"Irish Potatoes",
            subText: "Vegetables",
            kilos: "54kg",
            Viewicon:"warning",
            ViewText:"Expiration in 2 months",
            ViewButtonText:"View Details",
        },
        {
            id:1,
            Image: require("../assets/images/Maize.png"),
            TextHead:"Maize",
            subText: "Grains",
            kilos: "112kg",
            Viewicon:"warning",
            ViewText:"Expiration in 2 months",
            ViewButtonText:"View Details",
        },
        {
            id:1,
            Image: require("../assets/images/Tomato.png"),
            TextHead:"Tomatoes",
            subText: "Vegetables",
            kilos: "23kg",
            Viewicon:"warning",
            ViewText:"Expiration in 2 months",
            ViewButtonText:"View Details",
        },
        {
            id:1,
            Image: require("../assets/images/WaterMelon.png"),
            TextHead:"WaterMelons",
            subText: "Fruits",
            kilos: "11kg",
            Viewicon:"warning",
            ViewText:"Expiration in 2 months",
            ViewButtonText:"View Details",
        },
        {
            id:1,
            Image: require("../assets/images/Digestive.png"),
            TextHead:"Biscuits(Vegetables)",
            subText: "Vegetables",
            kilos: "2boxes(50 pieces each)",
            Viewicon:"warning",
            ViewText:"Expiration in 2 months",
            ViewButtonText:"View Details",
        },
        
    ]

     const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return null;
    return(

    <View style={{flex:1}}>
         <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            paddingBottom: 20,
          }}>
             <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/stock.png")}
                style={{ width: 36, height: 36 }}
              />
              <Text style={[styles.stockaText, darkMode && styles.darkText]}>Stocka</Text>
            </View>
            <View style={styles.twoDivs}>
                <View style={SearchInput}>
                    <TextInput style={styles.input}
                      placeholder="Search..."
                      placeholderTextColor={"#444"}
                    />
                </View>
                <View style={SearchInput}>
                    <Text >Sort by</Text>
                     <View style={styles.Category}>
                          <Ionicons name="arrow-down" color={"#fff"} size={24}/>
                          <Text >Category</Text>
                          // make a dropdown here to select the category?
                     </View>
                </View>

            </View>

            <Text style={styles.title}>Products in Stock</Text>
               // render the divs here as called stock Products render them here in the divs?

               <View style={styles.AddProduct}>
                  <Ionicons name="plus" size={24} color={"#fff"}  style={{backgroundColor:"#09364D"}}/>
                  <Text style={styles.buttonText}>Add a product</Text>
               </View>

          </ScrollView>
    </View>

    );
}