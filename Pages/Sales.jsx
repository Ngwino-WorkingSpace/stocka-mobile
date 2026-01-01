import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  RefreshControl,
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
const ACTIVE_TAB = "#FFD700"; // Gold for active tab

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

export default function SalesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Sales");
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Map frontend tabs to backend range keys
      const rangeMap = {
        "Daily": "today",
        "Weekly": "7d",
        "Monthly": "30d",
        "Annually": "all"
      };
      const range = rangeMap[selectedTab] || "today";
      const res = await api.getSalesHistory(range);

      const processed = (res.sales || []).map((s, index) => ({
        id: s.id || index,
        // Use product_image from backend, fallback to local asset
        Image: s.product_image ? { uri: s.product_image } : require("../assets/images/default-product-image.png"),
        TextHead: s.product_name,
        subText: s.category_name || "General",
        label1: "Quantity sold",
        value1: `${s.quantity_sold}`,
        label2: "Unit Price",
        value2: `${s.unit_selling_price}`,
        label3: "Total Price",
        value3: `${Number(s.total_price).toLocaleString()} FRW`,
        label4: "Profit",
        value4: `${Number(s.profit).toLocaleString()} FRW`,
        label5: "Date of Sale",
        value5: new Date(s.created_at).toLocaleDateString(),
        description: `Profit Margin: ${((s.profit / s.total_price) * 100).toFixed(1)}%.`
      }));

      setSales(processed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSales();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSales();
    }, [selectedTab])
  );

  const StockProducts = sales;

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

  const tabs = ["Daily", "Weekly", "Monthly", "Annually"];

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
            width: isPressState ? 40 : isCollapsed ? 70 : 250,
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
                onPress={() => setHelpModalVisible(true)}
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
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#1a1a2e" : "#fff", paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={darkMode && styles.darkScrollView}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0A2A3F"]} />
            }
          >
            <View style={{ padding: 15 }}>
              {/* Header with back button */}
              <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {navigation?.canGoBack() && (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={styles.backButton}
                    >
                      <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                    </TouchableOpacity>
                  )}
                  <Text style={[styles.headerText, darkMode && styles.darkText]}>Sales List</Text>
                </View>
                <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
                  <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : MAIN} />
                </TouchableOpacity>
              </View>

              {/* TABS */}
              <View style={styles.tabs}>
                {tabs.map((tab) => (
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

              {StockProducts.filter((p) =>
                p.TextHead.toLowerCase().includes(searchText.toLowerCase())
              ).map((item) => (
                <View key={item.id} style={[styles.productCard, darkMode && styles.darkProductCard]}>
                  {/* Left side: Image */}
                  <View style={styles.imageWrapper}>
                    <Image source={item.Image} style={styles.productImage} />
                  </View>

                  {/* Right side: Details */}
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, darkMode && styles.darkText]}>{item.TextHead}</Text>
                    <Text style={[styles.productCategory, darkMode && { color: "#aaa" }]}>{item.subText}</Text>

                    <View style={styles.labelsContainer}>
                      <View style={styles.labelColumn}>
                        <View style={styles.labelRow}>
                          <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label1}</Text>
                          <Text style={[styles.value, darkMode && styles.darkText]}>{item.value1}</Text>
                        </View>
                        <View style={styles.labelRow}>
                          <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label2}</Text>
                          <Text style={[styles.value, darkMode && styles.darkText]}>{item.value2}</Text>
                        </View>
                        <View style={styles.labelRow}>
                          <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label3}</Text>
                          <Text style={[styles.value, darkMode && styles.darkText]}>{item.value3}</Text>
                        </View>
                      </View>

                      <View style={styles.labelColumn}>
                        <View style={styles.labelRow}>
                          <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label4}</Text>
                          <Text style={[styles.value, darkMode && styles.darkText]}>{item.value4}</Text>
                        </View>
                        <View style={styles.labelRow}>
                          <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label5}</Text>
                          <Text style={[styles.value, darkMode && styles.darkText]}>{item.value5}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => setSelectedSale(item)}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.MoreButton}>
                <TouchableOpacity style={styles.MoreButtonTouchable}>
                  <Text style={styles.MoreText}>View More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

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
                  logout();
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
        <View style={styles.overlay}>
          <View style={[styles.helpModalCard, darkMode && { backgroundColor: '#2a2a3e' }]}>
            <Ionicons name="help-circle-outline" size={48} color={darkMode ? "#4a9eff" : "#0A2A3F"} style={{ marginBottom: 15 }} />
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

      {/* ================= SALES DETAILS MODAL ================= */}
      <Modal visible={!!selectedSale} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.detailsCard, darkMode && styles.darkDetailsCard]}>
            {/* Header */}
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, darkMode && styles.darkText]}>Sale Details</Text>
              <TouchableOpacity onPress={() => setSelectedSale(null)}>
                <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.detailsContent}>
              {/* Left */}
              <View style={styles.detailsLeft}>
                <Detail label="Product" value={selectedSale?.TextHead} darkMode={darkMode} />
                <Detail label="Category" value={selectedSale?.subText} darkMode={darkMode} />
                <Detail label="Quantity Sold" value={selectedSale?.value1} darkMode={darkMode} />
                <Detail label="Unit Price" value={selectedSale?.value2} darkMode={darkMode} />
                <Detail label="Total Price" value={selectedSale?.value3} darkMode={darkMode} />
                <Detail label="Profit" value={selectedSale?.value4} darkMode={darkMode} />
                <Detail label="Date of Sale" value={selectedSale?.value5} darkMode={darkMode} />
              </View>

              {/* Right */}
              <View style={styles.detailsRight}>
                <Image
                  source={selectedSale?.Image}
                  style={styles.detailsImage}
                />
                <Text style={[styles.descriptionText, darkMode && { color: "#aaa" }]}>
                  {selectedSale?.description || "No description available."}
                </Text>
              </View>
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

  /* Help Modal Styles */
  helpModalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  helpModalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#0A2A3F",
    marginBottom: 10,
  },
  helpModalText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  helpModalButton: {
    backgroundColor: "#0A2A3F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  helpModalButtonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  /* ===== DETAILS MODAL ===== */
  detailsCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  darkDetailsCard: {
    backgroundColor: "#2a2a3e",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailsTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  detailsContent: {
    flexDirection: "row",
  },
  detailsLeft: {
    flex: 1,
  },
  detailsRight: {
    flex: 1,
    alignItems: "center",
  },
  detailsImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#e1dedeff",
    borderWidth: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: "#555",
    textAlign: "left",
    fontFamily: "Poppins_400Regular",
  },
  detailLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Poppins_400Regular",
  },
  detailValue: {
    fontFamily: "Poppins_500Medium",
  },

});
