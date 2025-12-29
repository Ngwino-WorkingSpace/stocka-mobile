import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";


const DATA = [
  {
    id: "1",
    name: "NDAYAMBAJE Jean Bosco",
    phone: "+250 780 602 022",
    amount: "25,000 FRW",
  },
  {
    id: "2",
    name: "NDAYAMBAJE Jean Bosco",
    phone: "+250 780 602 022",
    amount: "25,000 FRW",
  },
  {
    id: "3",
    name: "NDAYAMBAJE Jean Bosco",
    phone: "+250 780 602 022",
    amount: "25,000 FRW",
  },
];

export default function CreditorsScreen() {
  const [activeTab, setActiveTab] = useState("debtors");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Phone");

  const handleCreditorspage =()=>{
    Navigation.navigate("creditors");
  }

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color="#0B3A53" />
      </View>

      <View style={styles.cardText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>

      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.pressTab}>
        {["S", "S", "E", "R", "P"].map((l, i) => (
          <Text key={i} style={styles.pressText}>
            {l}
          </Text>
        ))}
      </View> */}

      {/* HEADER */}
      <Text style={styles.header}>Stocka</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {["debtors", "creditors"].map((tab) => (
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
              {tab === "debtors" ? "Debtors" : "Creditors"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "debtors" && (
  <View>
      <DebtorsScreen/>
     </View>
    )}

   {activeTab === "creditors" && (
      <View>
        <Text>Creditors content goes here</Text>
           <CreditorsScreen/>
  </View>
)}


      {/* TITLE */}
      <Text style={styles.sectionTitle}>Current Debtors</Text>

      {/* SEARCH & SORT */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#777"
          style={styles.searchInput}
        />

        <View style={styles.sortWrapper}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortOpen(!sortOpen)}
          >
            <Text style={styles.sortText}>Sort</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
            <Text style={styles.sortText}>{sortBy}</Text>
          </TouchableOpacity>

          {sortOpen && (
            <View style={styles.dropdown}>
              {["Phone", "Name", "Amount"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSortBy(item);
                    setSortOpen(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn}>
        <View style={styles.addIcon}>
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text style={styles.addText}>Add a debtor</Text>
      </TouchableOpacity>
    </View>
  );
}

const MAIN = "#0B3A53";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  pressTab: {
    position: "absolute",
    left: 0,
    top: "42%",
    width: 32,
    height: 58,
    backgroundColor: MAIN,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  pressText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 12,
  },

  header: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: MAIN,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    marginTop: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: MAIN,
  },

  tabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333",
  },

  activeTabText: {
    color: "#fff",
  },

  sectionTitle: {
    marginTop: 22,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  searchRow: {
    flexDirection: "row",
    marginVertical: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#E8EDF0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontFamily: "Poppins_400Regular",
  },

  sortWrapper: {
    position: "relative",
  },

  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: MAIN,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
  },

  sortText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },

  dropdown: {
    position: "absolute",
    top: 46,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    width: 120,
    zIndex: 30,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
  },

  phone: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#666",
  },

  amount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  addBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: MAIN,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },

  addIcon: {
    backgroundColor: MAIN,
    borderRadius: 6,
    padding: 4,
  },

  addText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
});
