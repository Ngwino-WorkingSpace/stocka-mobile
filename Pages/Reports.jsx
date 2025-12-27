import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

const MAIN = "#09364D";
const ACTIVE_TAB = "#FFD700";

export default function ReportScreen() {
  const [activeTab, setActiveTab] = useState("Daily");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const tabs = ["Daily", "Weekly", "Monthly", "Annually"];

  return (
    <ScrollView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sales Report */}
      <Text style={styles.headerText}>Sales Reports</Text>

      <View style={styles.cropsContainer}>
        {[
          { name: "Vegetables", price: "23,000 FRW" },
          { name: "Fruits", price: "15,000 FRW" },
          { name: "Grains", price: "18,000 FRW" },
          { name: "Perishables", price: "20,000 FRW" },
        ].map((item, index) => (
          <View key={index} style={styles.oneContent}>
            <Image
              source={require("../assets/images/veg.png")}
              style={styles.cropImage}
            />
            <View style={styles.priceContainer}>
              <Text style={styles.cropLabel}>{item.name}</Text>
              <Text style={styles.cropPrice}>{item.price}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Products */}
      <Text style={styles.headerText}>Top Selling Products</Text>

      <View style={styles.topProductsContainer}>
        {/* Big Card */}
        <View style={styles.bigProductCard}>
          <Image
            source={require("../assets/images/irish.png")}
            style={styles.bigProductImage}
          />
          <Text style={styles.topText}>Irish Potatoes</Text>
        </View>

        {/* Small Cards */}
        <View style={styles.smallCardsRow}>
          <View style={styles.smallProductCard}>
            <Image
              source={require("../assets/images/melon.png")}
              style={styles.smallProductImage}
            />
            <Text style={styles.topText}>Tomatoes</Text>
          </View>

          <View style={styles.smallProductCard}>
            <Image
              source={require("../assets/images/third.png")}
              style={styles.smallProductImage}
            />
            <Text style={styles.topText}>Onions</Text>
          </View>
        </View>
      </View>

      {/* Gain / Loss */}
      <Text style={styles.headerText}>Gain / Loss Summary</Text>

      <View style={styles.summaryContainer}>
        <View style={[styles.reactionCard, styles.gain]}>
          <Ionicons name="trending-up" size={28} color="#2ecc71" />
          <Text style={styles.messageText}>
            Congratulations! You made a profit 🎉
          </Text>
        </View>

        <View style={[styles.reactionCard, styles.loss]}>
          <Ionicons name="trending-down" size={28} color="#e74c3c" />
          <Text style={styles.messageText}>
            Unfortunately, you made a loss. Let’s analyze this together.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
  },
  activeTab: {
    backgroundColor: MAIN,
  },
  tabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#333",
  },
  activeTabText: {
    color: ACTIVE_TAB,
  },

  /* Headers */
  headerText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginVertical: 15,
    color: MAIN,
  },

  /* Sales cards */
  cropsContainer: {
    gap: 12,
  },
  oneContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 12,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  priceContainer: {
    flexDirection: "column",
  },
  cropLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
  cropPrice: {
    fontFamily: "Poppins_400Regular",
    color: "#777",
    marginTop: 2,
  },

  /* Top products */
  topProductsContainer: {
    marginBottom: 20,
  },
  bigProductCard: {
    backgroundColor: MAIN,
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  bigProductImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  smallCardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  smallProductCard: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  smallProductImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 6,
  },
  topText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },

  /* Gain / Loss */
  summaryContainer: {
    gap: 12,
    marginBottom: 30,
  },
  reactionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  gain: {
    backgroundColor: "#EAF8F1",
  },
  loss: {
    backgroundColor: "#FDECEC",
  },
  messageText: {
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
});
