import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

const MAIN_COLOR = "#09364D";

export default function PlainDashboardScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const DashboardContents = [
    { id: 1, text: "Total Sales", amount: "200,000 FRW", button: "Reload" },
    { id: 2, text: "Total Profit", amount: "50,000 FRW", button: "View More" },
    { id: 3, text: "Total Stock", amount: "150,000 FRW", button: "Graph" },
  ];

  const TransactionCardContent = [
    {
      id: 1,
      icon: "car-truck-outline",
      bigText: "Sold 30kg of potatoes",
      smallText: "24th December 2025",
      priceAmount: "+260,000 FRW",
    },
    {
      id: 2,
      icon: "cart-outline",
      bigText: "Bought 2 tons of kiwi",
      smallText: "20th December 2025",
      priceAmount: "-360,000 FRW",
    },
    {
      id: 3,
      icon: "car-truck-outline",
      bigText: "50% expired stock",
      smallText: "15th December 2025",
      priceAmount: "-160,000 FRW",
    },
  ];

  const AlertCardContents = [
    {
      id: 1,
      icon: "warning-outline",
      alertName: "Low Stock",
      alertdetails:
        "80% of your stock has been sold. Please refill your stock.",
    },
    {
      id: 2,
      icon: "warning-outline",
      alertName: "Expiration",
      alertdetails:
        "20% of your products are about to expire. Please sell them.",
    },
  ];

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      {/* SIDEBAR */}
      <View
        style={[
          styles.sideBar,
          { width: sidebarOpen ? 180 : 50 },
        ]}
      >
        <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)}>
          <Ionicons
            name={sidebarOpen ? "arrow-back" : "arrow-forward"}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        {sidebarOpen && (
          <Text style={styles.sideBarText}>TRADEWISE</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingLeft: sidebarOpen ? 190 : 60 }}>
        <View style={styles.container}>
          {/* TOP BAR */}
          <View style={styles.topIcons}>
            <Image
              source={require("../assets/images/stocka.png")}
              style={{ width: 40, height: 40 }}
            />
            <Ionicons name="search" size={22} color="#000" />
          </View>

          {/* NAVIGATION */}
          <View style={styles.TopNavigation}>
            {["Daily", "Weekly", "Monthly", "Annually"].map((item) => (
              <View key={item} style={styles.navigator}>
                <Text style={styles.navText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>Your Dashboard</Text>

          {/* DASHBOARD CARDS */}
          <View style={styles.realDashboard}>
            {DashboardContents.map((item) => (
              <View key={item.id} style={styles.dashboardCard}>
                <Text style={styles.cardTitle}>{item.text}</Text>
                <Text style={styles.cardAmount}>{item.amount}</Text>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>{item.button}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.title}>Recent Transactions</Text>

          {/* TRANSACTIONS */}
          {TransactionCardContent.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <Ionicons name={item.icon} size={30} color={MAIN_COLOR} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.transactionBig}>{item.bigText}</Text>
                <Text style={styles.transactionSmall}>{item.smallText}</Text>
              </View>
              <Text
                style={[
                  styles.price,
                  item.priceAmount.startsWith("-") && { color: "red" },
                ]}
              >
                {item.priceAmount}
              </Text>
            </View>
          ))}

          <Text style={styles.title}>Alerts</Text>

          {/* ALERTS */}
          {AlertCardContents.map((item) => (
            <View key={item.id} style={styles.alertCard}>
              <Ionicons name={item.icon} size={24} color="#fff" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.alertTitle}>{item.alertName}</Text>
                <Text style={styles.alertText}>{item.alertdetails}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sideBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: MAIN_COLOR,
    alignItems: "center",
    paddingTop: 50,
    zIndex: 10,
  },
  sideBarText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    marginTop: 20,
    transform: [{ rotate: "-90deg" }],
  },

  container: {
    padding: 20,
  },

  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  TopNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  navigator: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E6EEF2",
  },
  navText: {
    fontFamily: "Poppins_500Medium",
    color: MAIN_COLOR,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginVertical: 15,
  },

  realDashboard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardCard: {
    width: "30%",
    backgroundColor: MAIN_COLOR,
    borderRadius: 14,
    padding: 12,
  },
  cardTitle: {
    color: "#fff",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  cardAmount: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    marginVertical: 8,
  },
  cardButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 4,
  },
  cardButtonText: {
    color: MAIN_COLOR,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionBig: {
    fontFamily: "Poppins_600SemiBold",
  },
  transactionSmall: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#666",
  },
  price: {
    fontFamily: "Poppins_600SemiBold",
  },

  alertCard: {
    flexDirection: "row",
    backgroundColor: MAIN_COLOR,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  alertTitle: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
  alertText: {
    color: "#E6EEF2",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
});
