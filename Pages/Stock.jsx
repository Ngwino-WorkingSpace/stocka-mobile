import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
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

export default function StockScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");

  const StockProducts = [
    {
      id: 1,
      Image: require("../assets/images/irishPotatoes.png"),
      TextHead: "Irish Potatoes",
      subText: "Vegetables",
      kilos: "54kg",
      ViewText: "Expiration in 2 months",
    },
    {
      id: 2,
      Image: require("../assets/images/Maize.png"),
      TextHead: "Maize",
      subText: "Grains",
      kilos: "112kg",
      ViewText: "Expiration in 2 months",
    },
    {
      id: 3,
      Image: require("../assets/images/Tomato.png"),
      TextHead: "Tomatoes",
      subText: "Vegetables",
      kilos: "23kg",
      ViewText: "Expiration in 2 months",
    },
    {
      id: 4,
      Image: require("../assets/images/WaterMelon.png"),
      TextHead: "WaterMelons",
      subText: "Fruits",
      kilos: "11kg",
      ViewText: "Expiration in 2 months",
    },
    {
      id: 5,
      Image: require("../assets/images/Digestive.png"),
      TextHead: "Biscuits(Vegetables)",
      subText: "Biscuits",
      kilos: "2 boxes (50 pieces each)",
      ViewText: "Expiration in 2 months",
    },
  ];

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Biscuits"];

  if (!fontsLoaded) return null;

  const filteredProducts =
    selectedCategory === "All"
      ? StockProducts
      : StockProducts.filter((p) => p.subText === selectedCategory);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/stock.png")}
            style={{ width: 36, height: 36 }}
          />
          <Text style={styles.stockaText}>Stocka</Text>
        </View>

        {/* Search and Category */}
        <View style={styles.searchCategoryContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />

          <TouchableOpacity
            style={styles.categoryDropdown}
            onPress={() => setCategoryVisible(true)}
          >
            <Text style={styles.categoryText}>{selectedCategory}</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Modal */}
        <Modal visible={categoryVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setCategoryVisible(false)}
          />
          <View style={styles.modalContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setCategoryVisible(false);
                }}
              >
                <Text style={styles.modalText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* Title */}
        <Text style={styles.title}>Products in Stock</Text>

        {/* Stock Products */}
        <FlatList
          data={filteredProducts.filter((p) =>
            p.TextHead.toLowerCase().includes(searchText.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={item.Image} style={styles.productImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productName}>{item.TextHead}</Text>
                <Text style={styles.productCategory}>{item.subText}</Text>
                <Text style={styles.productKilos}>{item.kilos}</Text>
                <View style={styles.warningWrapper}>
                <Ionicons name="warning" color="#09364D" size={20} style={{ marginRight: 8 }} />
                  <Text style={styles.productExpiry}>{item.ViewText}</Text>
               </View>

                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Add Product */}
        <TouchableOpacity style={styles.addProductButton}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addProductText}>Add a product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent:"center"
  },
  stockaText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: MAIN,
    marginLeft: 10,
  },
  searchCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  warningWrapper: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},

  categoryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MAIN,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryText: {
    color: "#fff",
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContainer: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    width: 150,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  productCategory: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  productKilos: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  productExpiry: {
    fontSize: 12,
    color: "red",
    marginVertical: 4,
    fontFamily: "Poppins_400Regular",
  },
  viewButton: {
    backgroundColor: MAIN,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  viewButtonText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  addProductButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MAIN,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginTop: 20,
  },
  addProductText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginLeft: 8,
  },
});
