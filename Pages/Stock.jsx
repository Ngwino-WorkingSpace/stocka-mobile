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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
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

// Helper function to map display names to route names
const getRouteName = (itemName) => {
  const routeMap = {
    "Dashboard": "dashboard",
    "Stock": "Stock",
    "Sales": "Sales",
    "Reports": "Reports",
    "Profile": "Profile",
    "Debtors": "debtors",
  };
  return routeMap[itemName] || itemName;
};

export default function StockScreen({ navigation }) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Stock");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      description: "Irish potatoes are a high-demand root vegetable with steady market turnover. They should be stored in a cool, dry, well-ventilated area away from direct light.",
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
      description: "Maize is a versatile grain crop that requires proper storage in dry conditions to prevent mold and spoilage. Keep in well-ventilated containers away from moisture.",
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
      description: "Tomatoes are perishable vegetables that should be stored at room temperature until ripe, then refrigerated. Handle with care to avoid bruising.",
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
      description: "Watermelons are refreshing fruits best stored at room temperature before cutting. Once cut, refrigerate and consume within a few days for best quality.",
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
      description: "Biscuits should be stored in a cool, dry place in their original packaging to maintain freshness and prevent them from becoming stale or soft.",
    },
  ];

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Biscuits"];

  if (!fontsLoaded) return null;

  const handlePressTextClick = () => {
    setSidebarState("collapsed");
  };

  const handleNavItemPress = (itemName) => {
    setSelectedItem(itemName);
    setSidebarState("press");
    if (navigation) {
      navigation.navigate(getRouteName(itemName));
    }
  };

  const handleArrowPress = () => {
    setSidebarState("expanded");
  };

  const handleCloseSidebar = () => {
    setSidebarState("press");
  };

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const filteredProducts =
    selectedCategory === "All"
      ? StockProducts
      : StockProducts.filter((p) => p.subText === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#1a1a2e" : "#fff" }]}>

           {/* FLOATING PRESS HANDLE */}
          {isPressState && (
            <TouchableOpacity
              onPress={handlePressTextClick}
              activeOpacity={0.8}
              style={styles.floatingPress}
            >
              <View style={styles.pressTextWrapper}>
                <Text style={styles.pressText}>S</Text>
                <Text style={styles.pressText}>S</Text>
                <Text style={styles.pressText}>E</Text>
                <Text style={styles.pressText}>R</Text>
                <Text style={styles.pressText}>P</Text>
              </View>
            </TouchableOpacity>
          )}
          
      {/* OVERLAY - Shows when sidebar is expanded */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleCloseSidebar}
        />
      )}

      {/* SIDEBAR */}
      <View
        style={[
          styles.sidebar,
          {
            width: isPressState ? 40 : isCollapsed ? 70 : 220,
            backgroundColor: MAIN,
            alignItems: isPressState ? "center" : isCollapsed ? "center" : "flex-start",
            paddingHorizontal: isPressState ? 0 : isCollapsed ? 6 : 10,
          },
        ]}
      >
        {/* Toggle Arrow - Only visible when collapsed */}
        {isCollapsed && (
          <TouchableOpacity
            onPress={handleArrowPress}
            style={styles.arrowButton}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {/* Close Arrow - Only visible when expanded */}
        {isExpanded && (
          <TouchableOpacity
            onPress={handleCloseSidebar}
            style={styles.closeButton}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {/* Stocka Logo - Not shown in press state */}
        {!isPressState && (
          <View style={[styles.logoContainerSidebar, isExpanded && styles.logoContainerExpanded]}>
            <Image
              source={require("../assets/images/stock.png")}
              style={{ width: 36, height: 36 }}
            />
            {isExpanded && <Text style={styles.stockText}>Stocka</Text>}
          </View>
        )}

        {/* Menu Items - Not shown in press state */}
        {!isPressState && (
          <>
            <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Dashboard" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Dashboard")}
            >
              <Ionicons name="battery-charging-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Dashboard</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Stock" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Stock")}
            >
              <Ionicons name="cube-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Stock</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Sales" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Sales")}
            >
              <Ionicons name="flash-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Sales</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Reports" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Reports")}
            >
              <Ionicons name="document-text-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Reports</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Debtors" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Debtors")}
            >
              <Ionicons name="wallet-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Debtors</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navItem, 
                isExpanded && styles.navItemExpanded,
                selectedItem === "Profile" && isExpanded && styles.navItemSelected
              ]}
              onPress={() => handleNavItemPress("Profile")}
            >
              <Ionicons name="person-outline" size={22} color="#fff" />
              {isExpanded && <Text style={styles.navText}>Profile</Text>}
            </TouchableOpacity>
          </View>

            {/* Divider */}
            {isExpanded && <View style={styles.divider} />}

            {/* Utility Items */}
            <View style={styles.utilityContainer}>
              <TouchableOpacity 
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={() => handleNavItemPress("Help")}
              >
                <Ionicons name="help-circle-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Help</Text>}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={() => setShowLogoutModal(true)}
              >
                <Ionicons name="log-out-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Logout</Text>}
              </TouchableOpacity>
            </View>

            {/* Theme Toggle - At the bottom, only when expanded */}
            {isExpanded && (
              <View style={styles.themeToggleContainer}>
                <View style={styles.themeToggle}>
                  <Ionicons
                    name="sunny"
                    size={20}
                    color={!darkMode ? MAIN : "#999"}
                  />
                  <TouchableOpacity
                    style={[
                      styles.themeToggleSwitch,
                      darkMode && styles.themeToggleSwitchActive
                    ]}
                    onPress={() => setDarkMode(!darkMode)}
                  >
                    <View style={[
                      styles.themeToggleKnob,
                      darkMode && styles.themeToggleKnobActive
                    ]} />
                  </TouchableOpacity>
                  <Ionicons
                    name="moon"
                    size={20}
                    color={darkMode ? "#fff" : "#999"}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* CONTENT */}
      <SafeAreaView style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#1a1a2e" : "#fff" }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            contentContainerStyle={{ padding: 20, backgroundColor: darkMode ? "#1a1a2e" : "#fff" }}
            style={darkMode && styles.darkScrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header with back button */}
            <View style={styles.headerRow}>
              {navigation?.canGoBack() && (
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                </TouchableOpacity>
              )}
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/stock.png")}
                  style={{ width: 36, height: 36 }}
                />
                <Text style={[styles.stockaText, darkMode && styles.darkText]}>Stocka</Text>
              </View>
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
          <View style={[styles.modalContainer, darkMode && styles.darkModalContainer]}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.modalItem, darkMode && styles.darkModalItem]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setCategoryVisible(false);
                }}
              >
                <Text style={[styles.modalText, darkMode && styles.darkText]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        <Text style={[styles.title, darkMode && styles.darkText]}>Products in Stock</Text>

        {/* Products */}
        <FlatList
          data={filteredProducts.filter((p) =>
            p.TextHead.toLowerCase().includes(searchText.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.productCard, darkMode && styles.darkProductCard]}>
              <Image source={item.Image} style={styles.productImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.productName, darkMode && styles.darkText]}>{item.TextHead}</Text>
                <Text style={[styles.productCategory, darkMode && { color: "#aaa" }]}>{item.subText}</Text>
                <Text style={[styles.productKilos, darkMode && { color: "#aaa" }]}>{item.kilos}</Text>

                <View style={styles.warningWrapper}>
                  <Ionicons name="warning" size={18} color={MAIN} />
                  <Text style={[styles.productExpiry, darkMode && { color: "#ff6b6b" }]}>{item.ViewText}</Text>
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

         <View style={styles.addProductButton}>
  <TouchableOpacity style={styles.productButton}>
    <Text style={styles.addText}>+ Add Product</Text>
  </TouchableOpacity>
</View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ================= PRODUCT DETAILS MODAL ================= */}
      <Modal visible={!!selectedProduct} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.detailsCard, darkMode && styles.darkDetailsCard]}>
            {/* Header */}
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, darkMode && styles.darkText]}>Product Details</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.detailsContent}>
              {/* Left */}
              <View style={styles.detailsLeft}>
                <Detail label="Product" value={selectedProduct?.TextHead} darkMode={darkMode} />
                <Detail label="Category" value={selectedProduct?.subText} darkMode={darkMode} />
                <Detail label="Remaining Stock" value={selectedProduct?.kilos} darkMode={darkMode} />
                <Detail label="Purchase Date" value={selectedProduct?.PurchaseDate} darkMode={darkMode} />
                <Detail label="Expiry Date" value={selectedProduct?.ExpiryDate} darkMode={darkMode} />
              </View>

              {/* Right */}
              <View style={styles.detailsRight}>
                <Image
                  source={selectedProduct?.Image}
                  style={styles.detailsImage}
                />
                <Text style={[styles.descriptionText, darkMode && { color: "#aaa" }]}>
                  {selectedProduct?.description || "No description available."}
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
<Modal visible={addStockVisible} transparent animationType="slide">
  <KeyboardAvoidingView 
    style={formStyles.overlay}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableOpacity 
      style={formStyles.overlay}
      activeOpacity={1}
      onPress={() => setAddStockVisible(false)}
    >
      <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
        <ScrollView 
          style={formStyles.scrollView}
          contentContainerStyle={formStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
             inputStyle={formStyles.input}
          />

          <FormInput
            label="Purchase price per unit"
            placeholder="Ex: 200 RWF"
            value={formData.price}
            onChangeText={(v) => handleChange("price", v)}
            inputStyle={formStyles.input}
          />

          <FormInput
            label="Purchase Date"
            placeholder="Ex: 15 June 2025"
            value={formData.purchaseDate}
            onChangeText={(v) => handleChange("purchaseDate", v)}
             inputStyle={formStyles.input}
          />

          <FormInput
            label="Expiry Date"
            placeholder="Ex: 15 September 2025"
            value={formData.expiryDate}
            onChangeText={(v) => handleChange("expiryDate", v)}
             inputStyle={formStyles.input}
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
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  </KeyboardAvoidingView>
</Modal>

{/* ================= SALES RECORD MODAL ================= */}
<Modal visible={recordSaleVisible} transparent animationType="slide">
  <KeyboardAvoidingView 
    style={saleStyles.overlay}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableOpacity 
      style={saleStyles.overlay}
      activeOpacity={1}
      onPress={() => setRecordSaleVisible(false)}
    >
      <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
        <ScrollView 
          style={saleStyles.scrollView}
          contentContainerStyle={saleStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            {selectedProduct?.description || "No description available."}
          </Text>
        </View>

      </View>

      {/* SALE FORM */}
      <Text style={saleStyles.sectionTitle}>Record a sale</Text>

      <View style={saleStyles.formRow}>
        <View style={saleStyles.formInputWrapper}>
          <FormInput
            label="Quantity sold"
            placeholder="Ex: 54kg"
            value={saleData.quantity}
            onChangeText={(v) => handleSaleChange("quantity", v)}
            containerStyle={saleStyles.halfWidthContainer}
          />
        </View>

        <View style={saleStyles.formInputWrapper}>
          <FormInput
            label="Unit Selling Price"
            placeholder="Ex: 200 RWF"
            value={saleData.unitPrice}
            onChangeText={(v) => handleSaleChange("unitPrice", v)}
            containerStyle={saleStyles.halfWidthContainer}
          />
        </View>
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
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  </KeyboardAvoidingView>
</Modal>

      {/* LOGOUT MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutModalCard}>
            <Ionicons
              name="warning-outline"
              size={38}
              color="#0A2A3F"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.logoutModalText}>
              Are you sure about logging out?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.logoutYesButton}
                onPress={() => {
                  setShowLogoutModal(false);
                  if (navigation) {
                    navigation.navigate("Login");
                  }
                }}
              >
                <Text style={styles.logoutYesText}>YES</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutNoButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutNoText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      </View>
  );
}

/* Small reusable component */
const Detail = ({ label, value, darkMode }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={[styles.detailLabel, darkMode && { color: "#aaa" }]}>{label}</Text>
    <Text style={[styles.detailValue, darkMode && styles.darkText]}>{value}</Text>
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
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    position: "relative",
  },
  darkScrollView: {
    backgroundColor: "#1a1a2e",
  },
  darkText: {
    color: "#fff",
  },
  darkProductCard: {
    backgroundColor: "#2a2a3e",
  },
  darkModalContainer: {
    backgroundColor: "#2a2a3e",
  },
  darkModalItem: {
    backgroundColor: "#2a2a3e",
  },
  darkDetailsCard: {
    backgroundColor: "#2a2a3e",
  },
  floatingPress: {
    position: "absolute",
    left: 0,
    top: "45%",
    width: 34,
    height: 60,
    backgroundColor: MAIN,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 6,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 54, 77, 0.3)",
    zIndex: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 50,
    paddingHorizontal: 0,
    zIndex: 10,
    justifyContent: "center",
    overflow: "hidden",
  },
  pressContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  pressTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 12,
    transform: [{ rotate: "-90deg" }],
  },
  arrowButton: {
    marginBottom: 25,
    padding: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
    padding: 2,
    marginRight: 10,
  },
  logoContainerSidebar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: "100%",
  },
  logoContainerExpanded: {
    paddingLeft: 10,
    justifyContent: "flex-start",
  },
  stockText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  menuContainer: {
    width: "100%",
    marginTop: 5,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    minHeight: 44,
    overflow: "visible",
  },
  navItemExpanded: {
    justifyContent: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navItemSelected: {
    backgroundColor: "#4a9eff",
  },
  navText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    marginLeft: 15,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 15,
    width: "100%",
  },
  utilityContainer: {
    width: "100%",
    marginTop: 10,
  },
  themeToggleContainer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  themeToggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  themeToggleSwitchActive: {
    backgroundColor: "#4a9eff",
    justifyContent: "flex-end",
  },
  themeToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#09364D",
    alignSelf: "center",
  },
  themeToggleKnobActive: {
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  stockaText: { fontFamily: "Poppins_700Bold", fontSize: 22, color: MAIN, marginLeft: 10 },

  searchCategoryContainer: { flexDirection: "row", marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: "#F0F0F0", borderRadius: 8, padding: 10, marginRight: 10, fontFamily:"Poppins_400Regular", color: "#000" },

  categoryDropdown: { flexDirection: "row", backgroundColor: MAIN, padding: 10, borderRadius: 8 },
  categoryText: { color: "#fff", marginRight: 5 ,fontFamily:"Poppins_400Regular"},

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
  productExpiry: { fontSize: 12, color: "red", marginLeft: 6,fontFamily:"Poppins_400Regular" },

  viewButton: { backgroundColor: MAIN, padding: 8, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
  viewButtonText: { color: "#fff", fontSize: 12,fontFamily:"Poppins_400Regular" },

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
  color: "#000",
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

addProductButton: {
  width: "100%",
  marginTop: 15,
},

productButton: {
  backgroundColor: "#09364D",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",

  // Shadow (iOS)
  shadowColor: "#0A5E8C",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 6,

  // Shadow (Android)
  elevation: 6,
},

addText: {
  color: "#fff",
  fontSize: 16,
  fontFamily: "Poppins_600SemiBold",
},
logoutOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
},
logoutModalCard: {
  width: "80%",
  maxWidth: 350,
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 20,
  alignItems: "center",
},
logoutModalText: {
  fontFamily: "Poppins_500Medium",
  fontSize: 13,
  marginVertical: 10,
  textAlign: "center",
},
logoutModalButtons: {
  flexDirection: "row",
  marginTop: 14,
},
logoutYesButton: {
  backgroundColor: "#0A2A3F",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
  marginRight: 10,
},
logoutYesText: {
  color: "#fff",
  fontFamily: "Poppins_500Medium",
  fontSize: 12,
},
logoutNoButton: {
  borderWidth: 1,
  borderColor: "#0A2A3F",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
},
logoutNoText: {
  fontFamily: "Poppins_500Medium",
  fontSize: 12,
  color: "#0A2A3F",
},

});

const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.5)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#09364D",
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
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily:"Poppins_400Regular",
    color:"#333",
    backgroundColor: "#FAFAFA",
  },

  textarea: {
    height: 90,
    textAlignVertical: "top",
  },

  addButton: {
    backgroundColor: "#09364D",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#09364D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },
  descriptionInput: {
  height: 120,
  textAlignVertical: "top",
  paddingTop: 12,
  color:"#000",
},

});


const saleStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.5)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#09364D",
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
    borderColor:"#dededeff",
    borderWidth:2,
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

  formInputWrapper: {
    flex: 1,
  },

  halfWidthContainer: {
    flex: 1,
    marginBottom: 12,
  },

  recordButton: {
    backgroundColor: "#09364D",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#09364D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  recordText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },



});


