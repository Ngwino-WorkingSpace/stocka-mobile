import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

export default function PlainDashboardScreen() {
  const [open, setOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor:"#fff"}}>
      {/* SIDEBAR */}
      <View style={[styles.sidebar, { width: open ? 58 : 15 }]}>
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Ionicons
            name={open ? "chevron-back" : "chevron-forward"}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        {!open && <Text style={styles.verticalText}>PRESS</Text>}

        {open && (
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Ionicons
              name="home-outline"
              size={22}
              color="#fff"
              style={{ marginVertical: 12 }}
            />
            <Ionicons
              name="pricetag-outline"
              size={22}
              color="#fff"
              style={{ marginVertical: 12 }}
            />
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color="#fff"
              style={{ marginVertical: 12 }}
            />
            <Ionicons
              name="settings-outline"
              size={22}
              color="#fff"
              style={{ marginVertical: 12 }}
            />
          </View>
        )}
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          marginLeft: open ? 58 : 15, // space not used by sidebar
          paddingBottom: 20,
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
            <View style={styles.logoContainer}>
  <Image
    source={require("../assets/images/stock.png")}
    style={{ width: 36, height: 36 }}
  />
  <Text style={styles.stockaText}>Stocka</Text>
</View>

          <Ionicons name="search" size={22} />
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {["Daily", "Weekly", "Monthly", "Annually"].map((t) => (
            <View key={t} style={styles.tab}>
              <Text style={styles.tabText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* TITLE */}
        <Text style={styles.sectionTitle}>Your Dashboard</Text>

        {/* DASHBOARD CARDS - SINGLE BG */}
        <View style={styles.cardsContainer}>
          {[
            { label: "Total Sales", value: "200,000 FRW", btn: "Reload" },
            { label: "Total Profit", value: "50,000 FRW", btn: "View more" },
            { label: "Total Stock", value: "150,000 FRW", btn: "Graph" },
          ].map((c, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardLabel}>{c.label}</Text>
              <Text style={styles.cardValue}>{c.value}</Text>
              <View style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>{c.btn}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* TRANSACTIONS */}
        <Text style={styles.sectionTitle}>Recent transactions</Text>

        {[
          { txt: "Sold 30kg of potatoes", date: "24th December 2025", price: "+260,000 FRW" },
          { txt: "Bought 2 tons of kiwi", date: "20th December 2025", price: "-360,000 FRW" },
          { txt: "50% expired stock", date: "15th December 2025", price: "-160,000 FRW" },
        ].map((t, i) => (
          <View key={i} style={styles.transaction}>
            <Ionicons name="cart-outline" size={24} color={MAIN} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.transTitle}>{t.txt}</Text>
              <Text style={styles.transDate}>{t.date}</Text>
            </View>
            <Text
              style={[
                styles.transPrice,
                t.price.startsWith("-") && { color: "red" },
              ]}
            >
              {t.price}
            </Text>
          </View>
        ))}

        {/* ALERTS */}
        <Text style={styles.sectionTitle}>Alerts</Text>

        {[
          { title: "Low Stock", text: "80% of your stock has been sold please refill your stock" },
          { title: "Expiration", text: "20% of your products are about to expire" },
        ].map((a, i) => (
          <View key={i} style={styles.alert}>
            <Ionicons name="warning-outline" size={22} color="red" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.alertTitle}>{a.title}</Text>
              <Text style={styles.alertText}>{a.text}</Text>
            </View>
          </View>
        ))}

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomBtns}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Record a sale</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnOutline}>
            <Text style={styles.actionTextOutline}>Add a product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: MAIN,
    paddingTop: 50,
    alignItems: "center",
    zIndex: 10,
  },
  verticalText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15, // collapsed font size
    marginTop: 30,
    transform: [{ rotate: "-90deg" }],
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
  flexDirection: "row",      // make it horizontal
  alignItems: "center",      // vertically align
  justifyContent: "center",  // horizontally center in parent
  marginVertical: 5,        // optional spacing
},
stockaText: {
  fontFamily: "Poppins_700Bold",
  fontSize: 22,
  color: MAIN,
  marginLeft: 10,            // space between image and text
},


  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    backgroundColor: "#E6EEF2",
    padding: 12,
    borderRadius: 5,
  },
  tab: {
    paddingHorizontal: 12,
  },
  tabText: {
    fontFamily: "Poppins_500Medium",
    color: MAIN,
  },

  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    marginVertical: 12,
  },

  // SINGLE CARDS BACKGROUND
  cardsContainer: {
    backgroundColor: MAIN,
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  card: {
    width: "30%",
  },
  cardLabel: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
  },
  cardValue: {
    color: "#fff",
    fontFamily: "Poppins_400Regular",
    marginVertical: 6,
    fontSize:12,

  },
  cardBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 4,
  },
  cardBtnText: {
    color: MAIN,
    textAlign: "center",
    fontSize: 11,
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  transTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
  },
  transDate: {
    fontSize: 11,
    color: "#777",
  },
  transPrice: {
    fontFamily: "Poppins_600SemiBold",
  },

  alert: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 11,
    borderRadius: 10,
    marginBottom: 8,
    borderColor:"#888",
    borderWidth:1,
  },
  alertTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "red",
  },
  alertText: {
    fontSize: 11.5,
    color: "#555",
  },

  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionBtn: {
    backgroundColor: MAIN,
    padding: 12,
    borderRadius: 12,
    width: "48%",
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: MAIN,
    padding: 12,
    borderRadius: 12,
    width: "48%",
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  actionTextOutline: {
    color: MAIN,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
});
