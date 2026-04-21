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
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";

import { Ionicons } from "@expo/vector-icons";
import AppSidebar from "../components/AppSidebar";
import AnimatedBox from "../components/AnimatedBox.jsx";
const MAIN = "#09111E";
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
import { useTheme } from '../src/context/ThemeContext';

export default function SalesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode;
  const [selectedItem, setSelectedItem] = useState("Sales");
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
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
        label4: s.profit < 0 ? "Loss" : "Profit",
        value4: `${Number(Math.abs(s.profit)).toLocaleString()} FRW`,
        value4Color: s.profit < 0 ? "#FF4444" : undefined,
        label5: "Date of Sale",
        value5: new Date(s.created_at).toLocaleDateString(),
        description: s.profit < 0
          ? `Loss Margin: ${Math.abs((s.profit / s.total_price) * 100).toFixed(1)}%.`
          : `Profit Margin: ${((s.profit / s.total_price) * 100).toFixed(1)}%.`
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

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const tabs = ["Daily", "Weekly", "Monthly", "Annually"];

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>
      {/* CONTENT (Rendered first so absolute elements can overlay it) */}
      <View style={{ flex: 1, marginLeft: isPressState ? 34 : isCollapsed ? 70 : 0 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={darkMode && styles.darkScrollView}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#09111E"]} />
            }
          >
            <View style={{ padding: 15 }}>
              {/* Header */}
              <AnimatedBox type="fade" duration={600}>
                <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 20 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {navigation?.canGoBack() && (
                        <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        >
                        <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                        </TouchableOpacity>
                    )}
                    <View style={styles.logoContainerHeader}>
                        <Image source={require("../assets/images/ppl.png")} style={{ width: 36, height: 36 }} />
                        <Text style={[styles.stockaText, darkMode && styles.darkText]}>Stocka</Text>
                    </View>
                    </View>
                    <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
                    <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : MAIN} />
                    </TouchableOpacity>
                </View>
              </AnimatedBox>

              {/* TABS */}
              <AnimatedBox type="slideUp" delay={100}>
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
              </AnimatedBox>


              {StockProducts.filter((p) =>
                p.TextHead.toLowerCase().includes(searchText.toLowerCase())
              ).map((item, index) => (
                <AnimatedBox key={item.id} delay={index * 100} type="slideUp">
                    <View style={[styles.productCard, darkMode && styles.darkProductCard]}>
                    <View style={styles.imageWrapper}>
                        <Image source={item.Image} style={styles.productImage} />
                    </View>

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
                            <Text style={[styles.value, darkMode && styles.darkText, item.value4Color && { color: item.value4Color }]}>{item.value4}</Text>
                            </View>
                            <View style={styles.labelRow}>
                            <Text style={[styles.label, darkMode && { color: "#aaa" }]}>{item.label5}</Text>
                            <Text style={[styles.value, darkMode && styles.darkText]}>{item.value5}</Text>
                            </View>
                        </View>
                        </View>

                        <AnimatedBox isButton={true} onPress={() => setSelectedSale(item)} style={styles.viewButton}>
                            <Text style={styles.viewButtonText}>View Details</Text>
                        </AnimatedBox>
                    </View>
                    </View>
                </AnimatedBox>
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

      {/* ================= SALES DETAILS MODAL ================= */}
      <Modal visible={!!selectedSale} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
                <Detail
                  label={selectedSale?.label4}
                  value={selectedSale?.value4}
                  valueColor={selectedSale?.value4Color}
                  darkMode={darkMode}
                />
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

      {/* REUSABLE SIDEBAR COMPONENTS */}
      <AppSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
        selectedItem="Sales"
        onNavItemPress={(item) => {
          setSelectedItem(item);
          setSidebarState("press");
          navigation.navigate(getRouteName(item));
        }}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onLogout={() => setShowLogoutModal(true)}
        onHelp={() => setHelpModalVisible(true)}
      />
    </View>
  );
}

/* Small reusable component */
const Detail = ({ label, value, valueColor, darkMode }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={[styles.detailLabel, darkMode && { color: "#aaa" }]}>{label}</Text>
    <Text style={[styles.detailValue, darkMode && styles.darkText, valueColor && { color: valueColor }]}>{value}</Text>
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
    backgroundColor: "#09111E",
  },
  darkText: {
    color: "#fff",
  },
  darkProductCard: {
    backgroundColor: "#121d2b",
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
    backgroundColor: "rgba(9, 17, 30, 0.3)",
    zIndex: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(9,17,30,0.25)",
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: "Urbanist_600SemiBold",
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
    fontFamily: "Urbanist_700Bold",
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
  headerText: {
    fontFamily: "Urbanist_600SemiBold",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      },
    }),
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
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    color: MAIN,
  },
  productCategory: {
    fontFamily: "Urbanist_400Regular",
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
    fontFamily: "Urbanist_400Regular",
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontFamily: "Urbanist_500Medium",
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
    fontFamily: "Urbanist_500Medium",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
      },
    }),
  },
  MoreText: {
    fontFamily: "Urbanist_600SemiBold",
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
    width: '100%',
  },
  helpModalButtonText: {
    color: "#fff",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },
  helpOverlay: {
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
    backgroundColor: "#121d2b",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailsTitle: {
    fontFamily: "Urbanist_700Bold",
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
    fontFamily: "Urbanist_400Regular",
  },
  detailLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Urbanist_400Regular",
  },
  detailValue: {
    fontFamily: "Urbanist_500Medium",
  },

});




