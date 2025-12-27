import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const MAIN = "#09364D";
const ACTIVE_TAB = "#FFD700"; // Gold for active tab

export default function SalesScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("Daily");

  const StockProducts = [
    {
      id: 1,
      Image: require("../assets/images/irishPotatoes.png"),
      TextHead: "Irish Potatoes",
      subText: "Vegetables",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
    {
      id: 2,
      Image: require("../assets/images/Maize.png"),
      TextHead: "Maize",
      subText: "Grains",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
    {
      id: 3,
      Image: require("../assets/images/Tomato.png"),
      TextHead: "Tomatoes",
      subText: "Vegetables",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
  ];

  if (!fontsLoaded) return null;

  const tabs = ["Daily", "Weekly", "Monthly", "Annually"];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
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

      <Text style={styles.headerText}>Sales List</Text>

      <FlatList
        data={StockProducts.filter((p) =>
          p.TextHead.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {/* Left side: Image */}
            <View style={styles.imageWrapper}>
              <Image source={item.Image} style={styles.productImage} />
            </View>

            {/* Right side: Details */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.TextHead}</Text>
              <Text style={styles.productCategory}>{item.subText}</Text>

              <View style={styles.labelsContainer}>
                <View style={styles.labelColumn}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label1}</Text>
                    <Text style={styles.value}>{item.value1}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label2}</Text>
                    <Text style={styles.value}>{item.value2}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label3}</Text>
                    <Text style={styles.value}>{item.value3}</Text>
                  </View>
                </View>

                <View style={styles.labelColumn}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label4}</Text>
                    <Text style={styles.value}>{item.value4}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label5}</Text>
                    <Text style={styles.value}>{item.value5}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSelectedProduct(item)}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.MoreButton}>
  <TouchableOpacity style={styles.MoreButtonTouchable}>
    <Text style={styles.MoreText}>View More</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: MAIN,
  },
  tabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginBottom: 15,
    color: MAIN,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    gap: 15,
  },
  imageWrapper: {
    borderColor: "#cdccccff",
    borderWidth: 2,
    borderRadius: 12,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  productName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: MAIN,
  },
  productCategory: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  labelColumn: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#000",
  },
  viewButton: {
    backgroundColor: MAIN,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
  MoreButton: {
  marginVertical: 20,
  alignItems: "center",
},
MoreButtonTouchable: {
  backgroundColor: MAIN,
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 5,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 4,
},
MoreText: {
  fontFamily: "Poppins_600SemiBold",
  fontSize: 16,
  color: "#fff",
},

});
