import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
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
  };
  return routeMap[itemName] || itemName;
};

export default function PlainDashboardScreen({navigation}) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
   const [selectedTab, setSelectedTab] = useState("Daily");
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

  

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return null;

  const handlePressTextClick = () => {
    // From "press" state, go to "collapsed" (icons only)
    setSidebarState("collapsed");
  };

  const handleNavItemPress = (itemName) => {
    // Collapse sidebar when clicking on menu items (go back to icons only)
    setSelectedItem(itemName);
    setSidebarState("press");
    if (navigation) {
      navigation.navigate(getRouteName(itemName));
    }
  };


  
  const handleArrowPress = () => {
    // Expand sidebar when clicking on arrow (go to full sidebar)
    setSidebarState("expanded");
  };

  const handleCloseSidebar = () => {
    // Close sidebar back to icons only
    setSidebarState("press");
  };

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#1a1a2e" : "#fff" }]}>
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
            width: isPressState ? 40 : isCollapsed ? 58 : 250,
            backgroundColor: MAIN,
            alignItems: isPressState ? "center" : isCollapsed ? "center" : "flex-start",
          },
        ]}
      >
        {/* PRESS State - Show only "PRESS" text vertically */}
        {isPressState && (
          <TouchableOpacity
            onPress={handlePressTextClick}
            style={styles.pressContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.pressText}>PRESS</Text>
          </TouchableOpacity>
        )}

        {/* Toggle Arrow - Only visible when collapsed (icons only) */}
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
          <View style={[styles.logoContainer, isExpanded && styles.logoContainerExpanded]}>
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
                onPress={() => handleNavItemPress("Logout")}
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
      <SafeAreaView style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 58 : 0 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              paddingBottom: 20,
            }}
            style={darkMode && styles.darkScrollView}
            showsVerticalScrollIndicator={false}
          >
          {/* HEADER */}
          <View style={styles.header}>
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
            <Ionicons name="search" size={22} color={darkMode ? "#fff" : "#000"} style={{right:10}} />
          </View>

          {/* TABS */}
                    <View style={styles.tabs}>
                      {["Daily", "Weekly", "Monthly", "Annually"].map((tab) => (
                        <TouchableOpacity
                          key={tab}
                          onPress={() => setSelectedTab(tab)}
                          style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab,
                          ]}
                        >
                          <Text
                            style={[
                              styles.tabText,
                              selectedTab === tab && styles.activeTabText,
                            ]}
                          >
                            {tab}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

          {/* TITLE */}
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Your Dashboard</Text>

          {/* DASHBOARD CARDS - SINGLE BG */}
          <View style={styles.cardsContainer}>
            {[
              { label: "Total Sales", value: "200,000 FRW", btn: "Reload" },
              { label: "Total Profit", value: "50,000 FRW", btn: "View more" },
              { label: darkMode ? "Purchase Costs" : "Total Stock", value: "150,000 FRW", btn: "Graph" },
            ].map((c, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardLabel}>{c.label}</Text>
                <Text style={styles.cardValue}>{c.value}</Text>
                <View style={styles.cardBtn}>
                 <TouchableOpacity>
                  <Text style={styles.cardBtnText}>{c.btn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* TRANSACTIONS */}
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Recent transactions</Text>
          {[
            { txt: "Sold 30kg of potatoes", date: "24th Dec 2025", price: "+260,000 FRW", icon: "checkmark-circle" },
            { txt: "Bought 2 tons of kiwi", date: "20th Dec 2025", price: "-360,000 FRW", icon: "cart" },
            { txt: "50% expired stock", date: "15th Dec 2025", price: "-160,000 FRW", icon: "business" },
          ].map((t, i) => (
            <View key={i} style={[styles.transaction, darkMode && styles.darkTransaction]}>
              <Ionicons name={t.icon} size={24} color={MAIN} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.transTitle, darkMode && styles.darkText]}>{t.txt}</Text>
                <Text style={[styles.transDate, darkMode && { color: "#aaa" }]}>{t.date}</Text>
              </View>
              <Text
                style={[
                  styles.transPrice,
                  t.price.startsWith("-") ? { color: "red" } : { color: "green" },
                ]}
              >
                {t.price}
              </Text>
            </View>
          ))}

          {/* ALERTS */}
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Alerts</Text>
          {[
            { title: "Low Stock", text: "80% of your stock has been sold please\nrefill your stock" },
            { title: "Expiration", text: "20% of your products are about to expire.\nPlease put them to sell" },
          ].map((a, i) => (
            <View key={i} style={[styles.alert, darkMode && styles.darkAlert]}>
              <Ionicons name="warning-outline" size={22} color="red" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.alertTitle}>{a.title}</Text>
                <Text style={[styles.alertText, darkMode && { color: "#aaa" }]}>{a.text}</Text>
              </View>
            </View>
          ))}

          {/* BOTTOM BUTTONS */}
          <View style={styles.bottomBtns}>
            <TouchableOpacity style={styles.actionBtn}
              onPress={() => setRecordSaleVisible(true)}
             >
              <Text style={styles.actionText}>Record a sale</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtnOutline, darkMode && styles.darkActionBtnOutline]}
                   onPress={() => setAddStockVisible(true)}
              >
              <Text style={[styles.actionTextOutline, darkMode && styles.darkActionTextOutline]}>Add a product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

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
      </View>
  );
}

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


const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 54, 77, 0.3)", // Soft blue overlay
    zIndex: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 50,
    paddingHorizontal: 10,
    zIndex: 10,
    justifyContent: "center",
  },
  pressContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  pressText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    transform: [{ rotate: "-90deg" }],
    letterSpacing: 2,
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
  logoContainer: {
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
  stockaText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
 tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 4,
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: MAIN,
  },
  tabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  tab: { 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  darkActiveTab: {
    backgroundColor: "#4a9eff",
  },
  tabText: { 
    fontFamily: "Poppins_500Medium", 
    color: MAIN,
  },
  sectionTitle: { 
    fontFamily: "Poppins_700Bold", 
    fontSize: 16, 
    marginVertical: 12,
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  darkScrollView: {
    backgroundColor: "#1a1a2e",
  },
  cardsContainer: {
    backgroundColor: MAIN,
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  card: { width: "30%" },
  cardLabel: { color: "#fff", fontSize: 11, fontFamily: "Poppins_400Regular" },
  cardValue: { color: "#fff", fontFamily: "Poppins_400Regular", marginVertical: 6, fontSize: 12 },
  cardBtn: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 4 },
  cardBtnText: { color: MAIN, textAlign: "center", fontSize: 11,fontFamily:"Poppins_400Regular" },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    fontFamily:"Poppins_400Regular"
  },
  darkTransaction: {
    backgroundColor: "#2a2a3e",
  },
  transTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 13, color: "#000" },
  transDate: { fontSize: 11, color: "#777",fontFamily:"Poppins_400Regular" },
  transPrice: { fontFamily: "Poppins_600SemiBold" },
  alert: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 11,
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#888",
    borderWidth: 1,
  },
  darkAlert: {
    backgroundColor: "#2a2a3e",
    borderColor: "#444",
  },
  alertTitle: { fontFamily: "Poppins_600SemiBold", color: "red" },
  alertText: { fontSize: 11.5, color: "#555",fontFamily:"Poppins_400Regular" },
  bottomBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  actionBtn: { backgroundColor: MAIN, padding: 12, borderRadius: 12, width: "48%" },
  actionBtnOutline: { borderWidth: 1, borderColor: MAIN, padding: 12, borderRadius: 12, width: "48%" },
  darkActionBtnOutline: {
    borderColor: "#4a9eff",
  },
  actionText: { color: "#fff", textAlign: "center", fontFamily: "Poppins_600SemiBold" },
  actionTextOutline: { color: MAIN, textAlign: "center", fontFamily: "Poppins_600SemiBold" },
  darkActionTextOutline: {
    color: "#4a9eff",
  },
});


const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollView: {
    width: "100%",
  },

  scrollContent: {
    paddingVertical: 30,
    alignItems: "center",
  },

  card: {
    width: "92%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#09364D",
  },

  /* BODY */
  body: {
    flexDirection: "row",
    gap: 14,
  },

  left: {
    flex: 1.2,
  },

  right: {
    flex: 1,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: "#F4F6F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  staticLabel: {
    fontSize: 11,
    color: "#888",
    fontFamily: "Poppins_400Regular",
    marginTop: 6,
  },

  staticValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#09364D",
    marginBottom: 10,
  },

  /* INPUTS */
  input: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    backgroundColor: "#FAFAFA",
    fontFamily: "Poppins_400Regular",
  },

  descriptionInput: {
    height: 130,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 14,
    padding: 14,
    fontSize: 13,
    backgroundColor: "#FAFAFA",
    fontFamily: "Poppins_400Regular",
  },

  /* BUTTON */
  addButton: {
    marginTop: 22,
    backgroundColor: "#09364D",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#09364D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  addText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    letterSpacing: 1,
  },
});


const saleStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.5)",
    justifyContent: "center",
    alignItems: "center",
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
    width: "92%",
    maxWidth: 500,
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
