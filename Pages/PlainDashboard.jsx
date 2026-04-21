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
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import AnimatedBox from "../components/AnimatedBox.jsx";
import AppSidebar from "../components/AppSidebar";
import {useFonts} from "@expo-google-fonts/urbanist";

const MAIN = "#09111E";

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

import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { useFonts } from "@expo-google-fonts/urbanist";

// ... imports

export default function PlainDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode;
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addStockVisible, setAddStockVisible] = useState(false);
  // duplicate removed
  const [refreshing, setRefreshing] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const rangeMap = {
        "Daily": "today",
        "Weekly": "7d",
        "Monthly": "30d",
        "Annually": "all"
      };
      const range = rangeMap[selectedTab] || "today";
      // Note: Dashboard metrics always returns today's data (backend doesn't support range)
      const metricsData = await api.getDashboardMetrics();
      setMetrics(metricsData);

      // Fetch recent sales and stock for transactions
      const salesRes = await api.getSalesHistory(range);
      const stockRes = await api.getAllStockBatches();

      const sales = (salesRes.sales || []).map(s => ({
        type: 'sale',
        txt: `Sold ${s.quantity_sold} of ${s.product_name}`,
        date: new Date(s.created_at).toLocaleDateString(),
        price: `+${Number(s.total_price).toLocaleString()} FRW`,
        icon: "checkmark-circle",
        timestamp: new Date(s.created_at)
      }));

      const purchases = (stockRes.stockBatch || []).map(s => ({
        type: 'purchase',
        txt: `Bought ${s.quantity_added} of ${s.product_name}`,
        date: new Date(s.purchase_date).toLocaleDateString(),
        price: `-${(Number(s.quantity_added) * Number(s.purchase_price)).toLocaleString()} FRW`,
        icon: "cart",
        timestamp: new Date(s.purchase_date)
      }));

      const allTrans = [...sales, ...purchases].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      setTransactions(allTrans);

    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [selectedTab]);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [selectedTab])
  );

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

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

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>
      {/* CONTENT (Rendered first so absolute elements can overlay it) */}
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <AnimatedBox type="fade" duration={600}>
              <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 20 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {navigation?.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                    </TouchableOpacity>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Image source={require("../assets/images/ppl.png")} style={{ width: 36, height: 36 }} />
                    <Text style={[styles.title, { marginBottom: 0 }, darkMode && styles.darkText]}>Stocka</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
                  <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : "#09111E"} />
                </TouchableOpacity>
              </View>
            </AnimatedBox>

            {/* TABS */}
            <AnimatedBox type="slideUp" delay={100}>
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
            </AnimatedBox>

            {/* TITLE */}
            <AnimatedBox type="slideUp" delay={200}>
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Your Dashboard</Text>
            </AnimatedBox>

            {/* DASHBOARD CARDS - SINGLE BG */}
            <View style={styles.cardsContainer}>
              {(() => {
                const profitDiff = metrics ? Number(metrics.totalProfitToday) : 0;
                const isLoss = profitDiff < 0;

                return [
                  {
                    label: "Total Sales (Today)",
                    value: metrics ? `${metrics.totalSalesToday.toLocaleString()} FRW` : "Loading...",
                    btn: "Reload"
                  },
                  {
                    label: isLoss ? "Total Loss (Today)" : "Total Profit (Today)",
                    value: metrics ? `${Math.abs(profitDiff).toLocaleString()} FRW` : "Loading...",
                    valueColor: isLoss ? "red" : "#fff",
                    btn: "Reload"
                  },
                  {
                    label: darkMode ? "Purchase Costs" : "Total Stock Value",
                    value: metrics ? `${metrics.totalStockValue.toLocaleString()} FRW` : "Loading...",
                    btn: "Reload"
                  },
                ].map((c, i) => (
                  <AnimatedBox key={i} delay={300 + (i * 100)} type="zoomIn" style={styles.card}>
                    <Text style={styles.cardLabel}>{c.label}</Text>
                    <Text style={[styles.cardValue, c.valueColor && { color: c.valueColor }]}>{c.value}</Text>
                    {c.btn && (
                      <AnimatedBox isButton={true} style={styles.cardBtn}>
                        <TouchableOpacity onPress={c.btn === 'Reload' ? fetchDashboardData : undefined}>
                          <Text style={styles.cardBtnText}>{c.btn}</Text>
                        </TouchableOpacity>
                      </AnimatedBox>
                    )}
                  </AnimatedBox>
                ));
              })()}
            </View>

            {/* TRANSACTIONS */}
            <AnimatedBox delay={600} type="slideUp">
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Recent transactions</Text>
            </AnimatedBox>
            {transactions.length === 0 && !loading && (
              <Text style={[{ marginLeft: 20, fontFamily: "Urbanist_400Regular" }, darkMode && styles.darkText]}>No recent transactions</Text>
            )}
            {transactions.map((t, i) => (
              <AnimatedBox key={i} delay={700 + (i * 50)} type="fade">
                <View style={[styles.transaction, darkMode && styles.darkTransaction]}>
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
              </AnimatedBox>
            ))}

            {/* ALERTS */}
            <AnimatedBox delay={1000} type="slideUp">
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Alerts</Text>
            </AnimatedBox>
            {[
              { title: "Low Stock", text: metrics ? `${metrics.lowStockCount} products are low on stock` : "Checking..." },
              { title: "Expiration", text: metrics ? `${metrics.expiringBatchesCount} batches expire within 2 days` : "Checking..." },
            ].map((a, i) => (
              <AnimatedBox key={i} delay={1100 + (i * 100)} type="slideRight">
                <View style={[styles.alert, darkMode && styles.darkAlert]}>
                  <Ionicons name="warning-outline" size={22} color="red" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.alertTitle}>{a.title}</Text>
                    <Text style={[styles.alertText, darkMode && { color: "#aaa" }]}>{a.text}</Text>
                  </View>
                </View>
              </AnimatedBox>
            ))}

            {/* BOTTOM BUTTONS */}
            <View style={styles.bottomBtns}>
              <AnimatedBox usePulse={true} isButton={true} style={styles.actionBtn}
                onPress={() => navigation.navigate("Stock")}
              >
                <Text style={styles.actionText}>Record a sale</Text>
              </AnimatedBox>

              <AnimatedBox isButton={true} style={[styles.actionBtnOutline, darkMode && styles.darkActionBtnOutline]}
                onPress={() => navigation.navigate("Stock")}
              >
                <Text style={[styles.actionTextOutline, darkMode && styles.darkActionTextOutline]}>Add a product</Text>
              </AnimatedBox>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* ================= ADD STOCK MODAL ================= */}
      <Modal visible={addStockVisible} transparent animationType="slide">
        <View style={formStyles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setAddStockVisible(false)}
          />
          <KeyboardAvoidingView
            style={formStyles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={formStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[formStyles.card, darkMode && formStyles.darkCard]}>

                {/* Header */}
                <View style={[formStyles.header, darkMode && { borderBottomColor: "#444" }]}>
                  <Text style={[formStyles.title, darkMode && styles.darkText]}>Add to Stock</Text>
                  <TouchableOpacity onPress={() => setAddStockVisible(false)}>
                    <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={formStyles.body}>

                  {/* LEFT SIDE */}
                  <View style={formStyles.left}>

                    <Text style={[formStyles.staticLabel, darkMode && { color: "#aaa" }]}>Product Name</Text>
                    <Text style={[formStyles.staticValue, darkMode && styles.darkText]}>
                      {selectedProduct?.TextHead}
                    </Text>

                    <Text style={[formStyles.staticLabel, darkMode && { color: "#aaa" }]}>Category</Text>
                    <Text style={[formStyles.staticValue, darkMode && styles.darkText]}>
                      {selectedProduct?.subText}
                    </Text>

                    <FormInput
                      label="Quantity purchased"
                      placeholder="Ex: 54kg"
                      value={formData.quantity}
                      onChangeText={(v) => handleChange("quantity", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Purchase price per unit"
                      placeholder="Ex: 200 RWF"
                      value={formData.price}
                      onChangeText={(v) => handleChange("price", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Purchase Date"
                      placeholder="Ex: 15 June 2025"
                      value={formData.purchaseDate}
                      onChangeText={(v) => handleChange("purchaseDate", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Expiry Date"
                      placeholder="Ex: 15 September 2025"
                      value={formData.expiryDate}
                      onChangeText={(v) => handleChange("expiryDate", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
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
                      darkMode={darkMode}
                    />

                  </View>

                </View>

                {/* Button */}
                <TouchableOpacity style={formStyles.addButton}>
                  <Text style={formStyles.addText}>ADD</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ================= SALES RECORD MODAL ================= */}
      <Modal visible={recordSaleVisible} transparent animationType="slide">
        <View style={saleStyles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setRecordSaleVisible(false)}
          />
          <KeyboardAvoidingView
            style={saleStyles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={saleStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[saleStyles.card, darkMode && saleStyles.darkCard]}>

                {/* Header */}
                <View style={[saleStyles.header, darkMode && { borderBottomColor: "#444" }]}>
                  <Text style={[saleStyles.title, darkMode && styles.darkText]}>Product Details</Text>
                  <TouchableOpacity onPress={() => setRecordSaleVisible(false)}>
                    <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={saleStyles.body}>

                  {/* LEFT */}
                  <View style={saleStyles.left}>
                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Product Name</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.TextHead}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Category</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.subText}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Remaining stock</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.kilos}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Purchase date</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.PurchaseDate}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Expiry date</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.ExpiryDate}</Text>
                  </View>

                  {/* RIGHT */}
                  <View style={saleStyles.right}>
                    <Image
                      source={selectedProduct?.Image}
                      style={saleStyles.image}
                    />

                    <Text style={[saleStyles.descTitle, darkMode && styles.darkText]}>Description</Text>
                    <Text style={[saleStyles.description, darkMode && { color: "#aaa" }]}>
                      {selectedProduct?.description || "No description available."}
                    </Text>
                  </View>

                </View>

                {/* SALE FORM */}
                <Text style={[saleStyles.sectionTitle, darkMode && styles.darkText]}>Record a sale</Text>

                <View style={saleStyles.formRow}>
                  <View style={saleStyles.formInputWrapper}>
                    <FormInput
                      label="Quantity sold"
                      placeholder="Ex: 54kg"
                      value={saleData.quantity}
                      onChangeText={(v) => handleSaleChange("quantity", v)}
                      inputStyle={saleStyles.input}
                      labelStyle={{
                        fontFamily: "Urbanist_400Regular",
                        color: "#93d81aff"
                      }}
                      darkMode={darkMode}
                    />
                  </View>

                  <View style={saleStyles.formInputWrapper}>
                    <FormInput
                      label="Unit Selling Price"
                      placeholder="Ex: 200 RWF"
                      value={saleData.unitPrice}
                      onChangeText={(v) => handleSaleChange("unitPrice", v)}
                      inputStyle={saleStyles.input}
                      darkMode={darkMode}
                    />
                  </View>
                </View>

                <FormInput
                  label="Total Price"
                  placeholder="0 RWF"
                  value={saleData.totalPrice}
                  onChangeText={(v) => handleSaleChange("totalPrice", v)}
                  inputStyle={saleStyles.input}
                  darkMode={darkMode}
                />

                {/* BUTTON */}
                <TouchableOpacity style={saleStyles.recordButton}>
                  <Text style={saleStyles.recordText}>RECORD</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
              color="#09111E"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.logoutModalText}>
              Are you sure about logging out?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.logoutYesButton}
                onPress={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
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
      {/* ================= HELP MODAL ================= */}
      <Modal visible={helpModalVisible} transparent animationType="fade">
        <View style={styles.helpOverlay}>
          <View style={[styles.helpModalCard, darkMode && { backgroundColor: '#121d2b' }]}>
            <Ionicons name="help-circle-outline" size={48} color={darkMode ? "#4a9eff" : MAIN} style={{ marginBottom: 15 }} />
            <Text style={[styles.helpModalTitle, darkMode && styles.darkText]}>Need Help?</Text>
            <Text style={[styles.helpModalText, darkMode && { color: '#aaa' }]}>
              Any problem? Text us via SMS or WhatsApp on +250792050511
            </Text>
            <TouchableOpacity style={styles.helpModalButton} onPress={() => setHelpModalVisible(false)}>
              <Text style={styles.helpModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const FormInput = ({
  label,
  multiline,
  inputStyle,
  labelStyle,
  containerStyle,
  darkMode,
  ...props
}) => (
  <View style={[styles.formGroup, containerStyle]}>
    {label && (
      <Text style={[styles.formLabel, labelStyle, darkMode && styles.darkText]}>
        {label}
      </Text>
    )}

    <TextInput
      style={[
        styles.formInput,
        multiline && styles.formTextarea,
        inputStyle,
        darkMode && { backgroundColor: "#09111E", color: "#fff", borderColor: "#444" },
      ]}
      placeholderTextColor={darkMode ? "#aaa" : "#999"}
      multiline={multiline}
      {...props}
    />
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", position: "relative" },

  floatingPress: {
    position: "absolute",
    left: 0,
    top: "45%",
    width: 34,
    height: 60,              // ✅ small height
    backgroundColor: MAIN,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 6,
  },


  pressTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  pressText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Urbanist_600SemiBold",
    lineHeight: 12,
  },



  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 17, 30, 0.3)", // Soft blue overlay
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
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    letterSpacing: 2,
    textAlign: "center",
    includeFontPadding: false,
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
  stockText: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  menuContainer: {
    width: "100%",
    marginTop: 2,
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
    fontFamily: "Urbanist_500Medium",
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
    marginTop: 2,
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
    backgroundColor: "#09111E",
    alignSelf: "center",
  },
  themeToggleKnobActive: {
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logoContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockaText: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 22,
    color: MAIN,
    marginLeft: 10,
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
    fontFamily: "Urbanist_500Medium",
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
    fontFamily: "Urbanist_500Medium",
    color: MAIN,
  },
  sectionTitle: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 16,
    marginVertical: 12,
    color: "#000",
  },
  darkText: {
    color: "#fff",
    fontFamily: "Urbanist_400Regular",
  },
  darkScrollView: {
    backgroundColor: "#09111E",
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
  cardLabel: { color: "#fff", fontSize: 11, fontFamily: "Urbanist_400Regular" },
  cardValue: { color: "#fff", fontFamily: "Urbanist_400Regular", marginVertical: 6, fontSize: 12 },
  cardBtn: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 4 },
  cardBtnText: { color: MAIN, textAlign: "center", fontSize: 11, fontFamily: "Urbanist_400Regular" },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    fontFamily: "Urbanist_400Regular"
  },
  darkTransaction: {
    backgroundColor: "#121d2b",
  },
  transTitle: { fontFamily: "Urbanist_600SemiBold", fontSize: 13, color: "#000" },
  transDate: { fontSize: 11, color: "#777", fontFamily: "Urbanist_400Regular" },
  transPrice: { fontFamily: "Urbanist_600SemiBold" },
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
    backgroundColor: "#121d2b",
    borderColor: "#444",
  },
  alertTitle: { fontFamily: "Urbanist_600SemiBold", color: "red" },
  alertText: { fontSize: 11.5, color: "#555", fontFamily: "Urbanist_400Regular" },
  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  actionBtn: {
    backgroundColor: MAIN,
    paddingVertical: 15,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionBtnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: MAIN,
    paddingVertical: 15,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  darkActionBtnOutline: {
    backgroundColor: "transparent",
    borderColor: "#4a9eff",
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
  },
  actionTextOutline: {
    color: MAIN,
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
  },
  darkActionTextOutline: {
    color: "#4a9eff",
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
    fontFamily: "Urbanist_500Medium",
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },
  logoutModalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },
  logoutYesButton: {
    backgroundColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutYesText: {
    color: "#fff",
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
  },
  logoutNoButton: {
    borderWidth: 1,
    borderColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutNoText: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
    color: "#09111E",
  },
  /* Help Modal Styles */
  helpOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  helpModalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      },
    }),
  },
  helpModalTitle: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: MAIN,
    marginBottom: 10,
  },
  helpModalText: {
    fontFamily: "Urbanist_400Regular",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  helpModalButton: {
    backgroundColor: MAIN,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
  },
  helpModalButtonText: {
    color: "#fff",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },
});


const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9, 17, 30, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "93%",
    maxHeight: "90%",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0px 12px 18px rgba(0,0,0,0.25)",
      },
    }),
  },
  darkCard: {
    backgroundColor: "#121d2b",
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
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: "#09111E",
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
    fontFamily: "Urbanist_400Regular",
    marginTop: 6,
  },

  staticValue: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 13,
    color: "#09111E",
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
    fontFamily: "Urbanist_400Regular",
    color: "#000",
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
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },

  /* BUTTON */
  addButton: {
    marginTop: 22,
    backgroundColor: "#09111E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#09111E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 6px 10px rgba(9,17,30,0.35)",
      },
    }),
  },

  addText: {
    color: "#fff",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 15,
    letterSpacing: 1,
  },
});


const saleStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,17,30,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "93%",
    maxHeight: "90%",
  },
  formInputWrapper: {
    fontFamily: "Urbanist_400Regular",
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FAFAFA",
    fontFamily: "Urbanist_400Regular",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
      },
    }),
  },
  darkCard: {
    backgroundColor: "#121d2b",
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
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: "#09111E",
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
    fontFamily: "Urbanist_400Regular",
  },

  value: {
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
    marginBottom: 8,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#dededeff",
    borderWidth: 2,
  },

  descTitle: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
    marginBottom: 4,
  },

  description: {
    fontSize: 11,
    color: "#555",
    fontFamily: "Urbanist_400Regular",
  },

  sectionTitle: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 14,
    marginVertical: 10,
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  formLabel: {
    fontFamily: "Urbanist_400Regular",
  },


  recordButton: {
    backgroundColor: "#09111E",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#09111E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(9,17,30,0.3)",
      },
    }),
  },

  recordText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },

  formLabel: {
    color: "#093"
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  helpModalButtonText: {
    color: "#fff",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },

});




