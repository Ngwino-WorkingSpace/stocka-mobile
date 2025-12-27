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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addStockVisible, setAddStockVisible] = useState(false);

const [formData, setFormData] = useState({
  quantity: "",
  price: "",
  purchaseDate: "",
  expiryDate: "",
  description: "",
});
const handleChange = (key, value) => {
  setFormData({ ...formData, [key]: value });
};

const [recordSaleVisible, setRecordSaleVisible] = useState(false);

const [saleData, setSaleData] = useState({
  quantity: "",
  unitPrice: "",
  totalPrice: "",
});

const handleSaleChange = (field, value) => {
  setSaleData((prev) => ({
    ...prev,
    [field]: value,
  }));
};


  const StockProducts = [
    {
      id: 1,
      Image: require("../assets/images/irishPotatoes.png"),
      TextHead: "Irish Potatoes",
      subText: "Vegetables",
      kilos: "54kg",
      ViewText: "Expiration in 2 months",
      PurchaseDate: "12th November 2025",
      ExpiryDate: "2nd January 2026",
    },
    {
      id: 2,
      Image: require("../assets/images/Maize.png"),
      TextHead: "Maize",
      subText: "Grains",
      kilos: "112kg",
      ViewText: "Expiration in 2 months",
      PurchaseDate: "12th November 2025",
      ExpiryDate: "2nd January 2026",
    },
    {
      id: 3,
      Image: require("../assets/images/Tomato.png"),
      TextHead: "Tomatoes",
      subText: "Vegetables",
      kilos: "23kg",
      ViewText: "Expiration in 2 months",
      PurchaseDate: "12th November 2025",
      ExpiryDate: "2nd January 2026",
    },
    {
      id: 4,
      Image: require("../assets/images/WaterMelon.png"),
      TextHead: "WaterMelons",
      subText: "Fruits",
      kilos: "11kg",
      ViewText: "Expiration in 2 months",
      PurchaseDate: "12th November 2025",
      ExpiryDate: "2nd January 2026",
    },
    {
      id: 5,
      Image: require("../assets/images/Digestive.png"),
      TextHead: "Biscuits(Vegetables)",
      subText: "Biscuits",
      kilos: "2 boxes (50 pieces each)",
      ViewText: "Expiration in 2 months",
      PurchaseDate: "12th November 2025",
      ExpiryDate: "2nd January 2026",
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

        {/* Search & Category */}
        <View style={styles.searchCategoryContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
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

        <Text style={styles.title}>Products in Stock</Text>

        {/* Products */}
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
                  <Ionicons name="warning" size={18} color={MAIN} />
                  <Text style={styles.productExpiry}>{item.ViewText}</Text>
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
      </ScrollView>

      {/* ================= PRODUCT DETAILS MODAL ================= */}
      <Modal visible={!!selectedProduct} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.detailsCard}>
            {/* Header */}
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Product Details</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.detailsContent}>
              {/* Left */}
              <View style={styles.detailsLeft}>
                <Detail label="Product" value={selectedProduct?.TextHead} />
                <Detail label="Category" value={selectedProduct?.subText} />
                <Detail label="Remaining Stock" value={selectedProduct?.kilos} />
                <Detail label="Purchase Date" value={selectedProduct?.PurchaseDate} />
                <Detail label="Expiry Date" value={selectedProduct?.ExpiryDate} />
              </View>

              {/* Right */}
              <View style={styles.detailsRight}>
                <Image
                  source={selectedProduct?.Image}
                  style={styles.detailsImage}
                />
                <Text style={styles.descriptionText}>
                  Irish potatoes are a high-demand crop that requires cool,
                  dry, well-ventilated storage to maintain quality and avoid loss.
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.detailsActions}>
              <TouchableOpacity style={styles.actionButton}
                 onPress={() => setRecordSaleVisible(true)}
              >
                <Text style={styles.actionText}>Record Sale</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonOutline}
                 onPress={() => setAddStockVisible(true)}
              >
                <Text style={styles.actionTextOutline}>Add Stock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

  {/* ================= ADD STOCK MODAL ================= */}
<Modal visible={addStockVisible} transparent animationType="fade">
  <View style={formStyles.overlay}>
    <View style={formStyles.card}>

      {/* Header */}
      <View style={formStyles.header}>
        <Text style={formStyles.title}>Add to Stock</Text>
        <TouchableOpacity onPress={() => setAddStockVisible(false)}>
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={formStyles.body}>

        {/* LEFT SIDE */}
        <View style={formStyles.left}>

          <Text style={formStyles.staticLabel}>Product Name</Text>
          <Text style={formStyles.staticValue}>
            {selectedProduct?.TextHead}
          </Text>

          <Text style={formStyles.staticLabel}>Category</Text>
          <Text style={formStyles.staticValue}>
            {selectedProduct?.subText}
          </Text>

          <FormInput
            label="Quantity purchased"
            placeholder="Ex: 54kg"
            value={formData.quantity}
            onChangeText={(v) => handleChange("quantity", v)}
             style={formStyles.input}
          />

          <FormInput
            label="Purchase price per unit"
            placeholder="Ex: 200 RWF"
            value={formData.price}
            onChangeText={(v) => handleChange("price", v)}
            style={formStyles.input}
          />

          <FormInput
            label="Purchase Date"
            placeholder="Ex: 15 June 2025"
            value={formData.purchaseDate}
            onChangeText={(v) => handleChange("purchaseDate", v)}
             style={formStyles.input}
          />

          <FormInput
            label="Expiry Date"
            placeholder="Ex: 15 September 2025"
            value={formData.expiryDate}
            onChangeText={(v) => handleChange("expiryDate", v)}
             style={formStyles.input}
          />

        </View>

        {/* RIGHT SIDE */}
        <View style={formStyles.right}>
          <Image
            source={selectedProduct?.Image}
            style={formStyles.image}
          />

          <FormInput
  label="Description (Optional)"
  placeholder="Key notes about the product..."
  multiline
  value={formData.description}
  onChangeText={(v) => handleChange("description", v)}
  inputStyle={formStyles.descriptionInput}
/>

        </View>

      </View>

      {/* Button */}
      <TouchableOpacity style={formStyles.addButton}>
        <Text style={formStyles.addText}>ADD</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

{/* ================= SALES RECORD MODAL ================= */}
<Modal visible={recordSaleVisible} transparent animationType="fade">
  <View style={saleStyles.overlay}>
    <View style={saleStyles.card}>

      {/* Header */}
      <View style={saleStyles.header}>
        <Text style={saleStyles.title}>Product Details</Text>
        <TouchableOpacity onPress={() => setRecordSaleVisible(false)}>
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={saleStyles.body}>

        {/* LEFT */}
        <View style={saleStyles.left}>
          <Text style={saleStyles.label}>Product Name</Text>
          <Text style={saleStyles.value}>{selectedProduct?.TextHead}</Text>

          <Text style={saleStyles.label}>Category</Text>
          <Text style={saleStyles.value}>{selectedProduct?.subText}</Text>

          <Text style={saleStyles.label}>Remaining stock</Text>
          <Text style={saleStyles.value}>{selectedProduct?.kilos}</Text>

          <Text style={saleStyles.label}>Purchase date</Text>
          <Text style={saleStyles.value}>{selectedProduct?.PurchaseDate}</Text>

          <Text style={saleStyles.label}>Expiry date</Text>
          <Text style={saleStyles.value}>{selectedProduct?.ExpiryDate}</Text>
        </View>

        {/* RIGHT */}
        <View style={saleStyles.right}>
          <Image
            source={selectedProduct?.Image}
            style={saleStyles.image}
          />

          <Text style={saleStyles.descTitle}>Description</Text>
          <Text style={saleStyles.description}>
            Irish potatoes are a high-demand root vegetable with steady
            market turnover. They should be stored in a cool, dry,
            well-ventilated area away from direct light.
          </Text>
        </View>

      </View>

      {/* SALE FORM */}
      <Text style={saleStyles.sectionTitle}>Record a sale</Text>

      <View style={saleStyles.formRow}>
        <FormInput
          label="Quantity sold"
          placeholder="Ex: 54kg"
          value={saleData.quantity}
          onChangeText={(v) => handleSaleChange("quantity", v)}
        />

        <FormInput
          label="Unit Selling Price"
          placeholder="Ex: 54kg"
          value={saleData.unitPrice}
          onChangeText={(v) => handleSaleChange("unitPrice", v)}
        />
      </View>

      <FormInput
        label="Total Price"
        placeholder="0 RWF"
        value={saleData.totalPrice}
        onChangeText={(v) => handleSaleChange("totalPrice", v)}
      />

      {/* BUTTON */}
      <TouchableOpacity style={saleStyles.recordButton}>
        <Text style={saleStyles.recordText}>RECORD</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


    </View>
  );
}

/* Small reusable component */
const Detail = ({ label, value }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const FormInput = ({
  label,
  multiline,
  inputStyle,
  containerStyle,
  ...props
}) => (
  <View style={[styles.formGroup, containerStyle]}>
    <Text style={styles.formLabel}>{label}</Text>
    <TextInput
      style={[
        styles.formInput,
        multiline && styles.formTextarea,
        inputStyle,
      ]}
      multiline={multiline}
      {...props}
    />
  </View>
);



/* ================= STYLES ================= */
const styles = StyleSheet.create({
  logoContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  stockaText: { fontFamily: "Poppins_700Bold", fontSize: 22, color: MAIN, marginLeft: 10 },

  searchCategoryContainer: { flexDirection: "row", marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: "#F0F0F0", borderRadius: 8, padding: 10, marginRight: 10 },

  categoryDropdown: { flexDirection: "row", backgroundColor: MAIN, padding: 10, borderRadius: 8 },
  categoryText: { color: "#fff", marginRight: 5 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  modalContainer: { position: "absolute", top: 100, right: 20, backgroundColor: "#fff", borderRadius: 10, width: 160 },

  modalItem: { padding: 12 },
  modalText: { fontFamily: "Poppins_500Medium" },

  title: { fontFamily: "Poppins_700Bold", fontSize: 18, marginBottom: 12 },

  productCard: { flexDirection: "row", backgroundColor: "#F5F5F5", padding: 12, borderRadius: 12, marginBottom: 12 },
  productImage: { width: 80, height: 80, borderRadius: 8 },

  productName: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  productCategory: { fontSize: 12, color: "#555", fontFamily:"Poppins_400Regular" },
  productKilos: { fontSize: 12, color: "#555" , fontFamily:"Poppins_400Regular"},

  warningWrapper: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  productExpiry: { fontSize: 12, color: "red", marginLeft: 6 },

  viewButton: { backgroundColor: MAIN, padding: 8, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
  viewButtonText: { color: "#fff", fontSize: 12 },

  /* ===== MODAL ===== */
  overlay: { flex: 1, backgroundColor: "rgba(9,54,77,0.25)", justifyContent: "center", alignItems: "center" },
  detailsCard: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 20 },

  detailsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  detailsTitle: { fontFamily: "Poppins_700Bold", fontSize: 18 },

  detailsContent: { flexDirection: "row" },
  detailsLeft: { flex: 1 },
  detailsRight: { flex: 1, alignItems: "center" },

  detailsImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10, borderColor:"#e1dedeff", borderWidth:2 },

  descriptionText: { fontSize: 12, color: "#555", textAlign: "left", fontFamily:"Poppins_400Regular" },

  detailLabel: { fontSize: 12, color: "#777",fontFamily:"Poppins_400Regular"  },
  detailValue: { fontFamily: "Poppins_500Medium" },

  detailsActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },

  actionButton: { backgroundColor: MAIN, padding: 10, borderRadius: 8, flex: 1, marginRight: 8 },
  actionText: { color: "#fff", textAlign: "center",fontFamily:"Poppins_400Regular"  },

  actionButtonOutline: { borderWidth: 1, borderColor: MAIN, padding: 10, borderRadius: 8, flex: 1 },
  actionTextOutline: { color: MAIN, textAlign: "center",fontFamily:"Poppins_400Regular"  },

  addStockCard: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 20,
},

input: {
  backgroundColor: "#F0F0F0",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  fontFamily: "Poppins_400Regular",
},

/* ===== ADD STOCK MODAL ===== */
addOverlay: {
  flex: 1,
  backgroundColor: "rgba(9,54,77,0.35)",
  justifyContent: "center",
  alignItems: "center",
},

addCard: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 20,
},

addHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
},

addTitle: {
  fontFamily: "Poppins_700Bold",
  fontSize: 18,
  color: MAIN,
},

addForm: {
  marginBottom: 15,
},

formGroup: {
  marginBottom: 12,
},

formLabel: {
  fontSize: 12,
  color: "#555",
  marginBottom: 4,
  fontFamily: "Poppins_400Regular",
},

formInput: {
  backgroundColor: "#F2F2F2",
  borderRadius: 8,
  padding: 10,
  fontFamily: "Poppins_400Regular",
},

formTextarea: {
  height: 80,
  textAlignVertical: "top",
},

addActions: {
  flexDirection: "row",
  justifyContent: "space-between",
},

addPrimaryBtn: {
  backgroundColor: MAIN,
  padding: 12,
  borderRadius: 8,
  flex: 1,
  marginRight: 8,
},

addPrimaryText: {
  color: "#fff",
  textAlign: "center",
  fontFamily: "Poppins_500Medium",
},

addSecondaryBtn: {
  borderWidth: 1,
  borderColor: MAIN,
  padding: 12,
  borderRadius: 8,
  flex: 1,
},

addSecondaryText: {
  color: MAIN,
  textAlign: "center",
  fontFamily: "Poppins_500Medium",
},


});

const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },

  body: {
    flexDirection: "row",
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  right: {
    flex: 1,
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginBottom: 10,
    borderColor:"#c5c5c5ff",
    borderWidth:2,
  },

  staticLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
    fontFamily:"Poppins_400Regular",
  },

  staticValue: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },

  formGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    fontFamily:"Poppins_400Regular",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    fontFamily:"Poppins_400Regular",
    color:"#555",
  },

  textarea: {
    height: 90,
    textAlignVertical: "top",
  },

  addButton: {
    backgroundColor: "#09364D",
    padding: 14,
    borderRadius: 10,
    marginTop: 14,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  descriptionInput: {
  height: 120,
  textAlignVertical: "top",
  paddingTop: 12,
  color:"#555",
},

});


const saleStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },

  body: {
    flexDirection: "row",
    marginBottom: 15,
  },

  left: {
    flex: 1,
  },

  right: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 10,
  },

  label: {
    fontSize: 11,
    color: "#777",
    fontFamily: "Poppins_400Regular",
  },

  value: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },

  descTitle: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },

  description: {
    fontSize: 11,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },

  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginVertical: 10,
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  recordButton: {
    backgroundColor: "#09364D",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  recordText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
});

