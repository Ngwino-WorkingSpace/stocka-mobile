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

export default function DebtorsScreen() {
  const [activeTab, setActiveTab] = useState("debtors");

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={22} color="#000" />
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
      {/* PRESS TAB */}
      <View style={styles.pressTab}>
        
        <Text style={styles.pressText}>S</Text>
        <Text style={styles.pressText}>S</Text>
        <Text style={styles.pressText}>E</Text>
        <Text style={styles.pressText}>R</Text>
        <Text style={styles.pressText}>P</Text>
      </View>

      {/* HEADER */}
      <Text style={styles.header}>Stocka</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "debtors" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("debtors")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "debtors" && styles.activeTabText,
            ]}
          >
            Debtors
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "creditors" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("creditors")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "creditors" && styles.activeTabText,
            ]}
          >
            Creditors
          </Text>
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <Text style={styles.sectionTitle}>Current Debtors</Text>

      {/* SEARCH & SORT */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons name="call-outline" size={16} color="#fff" />
          <Text style={styles.sortText}>Phone</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  pressTab: {
    position: "absolute",
    left: 0,
    top: "40%",
    backgroundColor: "#0B3A53",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 10,
  },

  pressText: {
    color: "#fff",
    fontSize: 10,
    transform: [{ rotate: "-90deg" }],
  },

  header: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#0B3A53",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginTop: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: "#0B3A53",
  },

  tabText: {
    color: "#333",
    fontSize: 14,
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },

  searchRow: {
    flexDirection: "row",
    marginVertical: 12,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#E8EDF0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },

  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0B3A53",
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  sortText: {
    color: "#fff",
    fontSize: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontWeight: "600",
    fontSize: 13,
  },

  phone: {
    fontSize: 11,
    color: "#666",
  },

  amount: {
    fontWeight: "600",
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
    borderColor: "#0B3A53",
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },

  addIcon: {
    backgroundColor: "#0B3A53",
    borderRadius: 6,
    padding: 4,
  },

  addText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
