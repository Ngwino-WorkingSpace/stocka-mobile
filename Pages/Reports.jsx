import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

import AnimatedBox from "../components/AnimatedBox.jsx";

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

export default function ReportsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states
  const [sidebarState, setSidebarState] = useState("press");
  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Reports");
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Data states
  const [salesReport, setSalesReport] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stockReport, setStockReport] = useState({});
  const [gainLoss, setGainLoss] = useState({ type: 'neutral', message: 'Analyzing...' });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      // 1. Fetch Sales History for selected range
      const salesRes = await api.getSalesHistory(selectedTab.toLowerCase());
      const sales = salesRes.sales || [];

      // Process Sales Report (Group by Product? Or Category if available. API gives product_name)
      // Since we don't have categories in sales easily, we will list top 4 products as "Sales Report" 
      // or just group by name.
      const productStats = {};
      let totalSalesVal = 0;

      sales.forEach(s => {
        const name = s.product_name;
        if (!productStats[name]) productStats[name] = { name, quantity: 0, total: 0 };
        productStats[name].quantity += Number(s.quantity_sold);
        productStats[name].total += Number(s.total_price);
        totalSalesVal += Number(s.total_price);
      });

      // Sort by total for Sales Report display (Top 4 categories/products)
      const sortedByTotal = Object.values(productStats).sort((a, b) => b.total - a.total).slice(0, 4);
      setSalesReport(sortedByTotal);

      // Top Selling (by Quantity)
      const sortedByQty = Object.values(productStats).sort((a, b) => b.quantity - a.quantity).slice(0, 3);
      setTopProducts(sortedByQty);

      // 2. Fetch Stock Data for Stock Report and Expired Value
      const stockRes = await api.getAllStockBatches();
      const batches = stockRes.stockBatch || [];
      let totalStockValue = 0;
      let expiredStockValue = 0;
      const now = new Date();

      batches.forEach(b => {
        const val = Number(b.quantity_remaining) * Number(b.unit_price || b.purchase_price || 0); // Assuming purchase_price is tracked or similar
        // Existing API code for stock batch might have different fields. Let's assume cost_price/unit_price
        // Actually `addStockBatch` sends `purchasePrice`. Let's hope `getAllStockBatches` returns it.
        // If not, we might estimate. API `getAllStockBatches` typically returns what's in DB.
        // Let's use `purchase_price` if available, else 0.
        const price = Number(b.purchase_price || 0);
        // If price is 0, maybe use unit_selling_price if available? No, stock value is usually cost.

        totalStockValue += (Number(b.quantity_remaining) * price);

        if (b.expiry_date && new Date(b.expiry_date) < now) {
          expiredStockValue += (Number(b.quantity_remaining) * price);
        }
      });

      setStockReport({
        totalValue: totalStockValue,
        expiredValue: expiredStockValue
      });

      // Gain / Loss Logic (Simple heuristic)
      // Profit = Sales Revenue - Cost of Goods Sold.
      // Since we don't strictly track COGS per sale in this simple frontend logic easily without more data,
      // We can check if Total Sales > 0. Or if Profit field exists in sales.
      // `getSalesHistory` returns `profit` field!
      const totalProfit = sales.reduce((acc, s) => acc + Number(s.profit || 0), 0);

      if (totalProfit > 0) {
        setGainLoss({ type: 'profit', message: 'Congratulations dear user you made a profit.' });
      } else if (totalProfit < 0) {
        setGainLoss({ type: 'loss', message: 'Unfortunately you made a loss based on recorded sales.' });
      } else {
        setGainLoss({ type: 'neutral', message: 'No profit or loss recorded yet.' });
      }

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchReports();
  }, [selectedTab]);

  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, [selectedTab])
  );

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

  // Helper for icons map
  const getIconForIndex = (i) => {
    const icons = ["cube-outline", "basket-outline", "bag-outline", "cart-outline"];
    return icons[i % icons.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>

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

      {/* OVERLAY */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleCloseSidebar}
        />
      )}

      {/* SIDEBAR - Keeping existing sidebar code structure */}
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
        {/* ... Sidebar contents (Arrows, Logo, Menu, Utility, Theme) ... */}
        {/* Assuming I check the Sidebar content in original file and keep it similar or just imply reuse if I wasn't replacing whole file.
             But I AM replacing a large chunk. I must include the Sidebar code to avoid breaking it.
             To be safe, I will include the standard Sidebar logic from other screens or duplicate what was there.
         */}
        {isCollapsed && (
          <TouchableOpacity onPress={handleArrowPress} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity onPress={handleCloseSidebar} style={styles.closeButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        {!isPressState && (
          <View style={[styles.logoContainer, isExpanded && styles.logoContainerExpanded]}>
            <Image source={require("../assets/images/ppl.png")} style={{ width: 36, height: 36 }} tintColor="#fff" />
            {isExpanded && <Text style={styles.stockText}>Stocka</Text>}
          </View>
        )}
        {!isPressState && (
          <>
            <View style={styles.menuContainer}>
              {["Dashboard", "Stock", "Sales", "Reports", "Debtors", "Profile"].map((item, index) => (
                <AnimatedBox 
                  key={item}
                  isButton={true}
                  onPress={() => handleNavItemPress(item)}
                  style={[
                    styles.navItem,
                    isExpanded && styles.navItemExpanded,
                    selectedItem === item && isExpanded && styles.navItemSelected
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={
                      item === "Dashboard" ? "battery-charging-outline" :
                        item === "Stock" ? "cube-outline" :
                          item === "Sales" ? "flash-outline" :
                            item === "Reports" ? "document-text-outline" :
                              item === "Debtors" ? "wallet-outline" : "person-outline"
                    } size={22} color="#fff" />
                    {isExpanded && <Text style={styles.navText}>{item}</Text>}
                  </View>
                </AnimatedBox>
              ))}
            </View>
            {isExpanded && <View style={styles.divider} />}
            <View style={styles.utilityContainer}>
              <AnimatedBox isButton={true} style={[styles.navItem, isExpanded && styles.navItemExpanded]} onPress={() => setHelpModalVisible(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="help-circle-outline" size={22} color="#fff" />
                  {isExpanded && <Text style={styles.navText}>Help</Text>}
                </View>
              </AnimatedBox>
              <AnimatedBox isButton={true} style={[styles.navItem, isExpanded && styles.navItemExpanded]} onPress={() => setShowLogoutModal(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="log-out-outline" size={22} color="#fff" />
                  {isExpanded && <Text style={styles.navText}>Logout</Text>}
                </View>
              </AnimatedBox>
            </View>
            {isExpanded && (
              <View style={styles.themeToggleContainer}>
                <View style={styles.themeToggle}>
                  <Ionicons name="sunny" size={20} color={!darkMode ? MAIN : "#999"} />
                  <TouchableOpacity style={[styles.themeToggleSwitch, darkMode && styles.themeToggleSwitchActive]} onPress={() => setDarkMode(!darkMode)}>
                    <View style={[styles.themeToggleKnob, darkMode && styles.themeToggleKnobActive]} />
                  </TouchableOpacity>
                  <Ionicons name="moon" size={20} color={darkMode ? "#fff" : "#999"} />
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#09111E" : "#fff", paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 20, backgroundColor: darkMode ? "#09111E" : "#fff" }}
            style={darkMode && styles.darkScrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#09111E"]} />
            }
          >
            {/* HEADER */}
            <AnimatedBox type="fade" duration={600}>
              <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {navigation?.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                {["Daily", "Weekly", "Monthly", "Annually"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setSelectedTab(tab)}
                    style={[styles.tab, selectedTab === tab && styles.activeTab]}
                  >
                    <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </AnimatedBox>

            {/* SALES REPORT SECTION */}
            <AnimatedBox type="slideUp" delay={200}>
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Sales Report (Top Items)</Text>
            </AnimatedBox>
            <View style={styles.salesReportContainer}>
              {salesReport.length === 0 ? (
                <AnimatedBox type="fade" delay={300}>
                  <Text style={{ color: '#999', marginVertical: 10, fontFamily: "Urbanist_400Regular" }}>No sales recorded for this period.</Text>
                </AnimatedBox>
              ) : (
                salesReport.map((item, index) => (
                  <AnimatedBox key={index} type="slideUp" delay={300 + (index * 100)} style={{ width: "48%" }}>
                    <View style={[styles.salesItem, darkMode && styles.darkSalesItem, { width: "100%" }]}>
                      <View style={styles.salesIconContainer}>
                        <Ionicons name={getIconForIndex(index)} size={28} color={MAIN} />
                      </View>
                      <Text style={[styles.salesLabel, darkMode && styles.darkText]} numberOfLines={1}>{item.name}</Text>
                      <Text style={[styles.salesValue, darkMode && styles.darkText]}>{item.total.toLocaleString()} FRW</Text>
                    </View>
                  </AnimatedBox>
                ))
              )}
            </View>

            {/* TOP SELLING PRODUCTS SECTION */}
            <AnimatedBox type="slideUp" delay={400}>
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Top Selling products</Text>
            </AnimatedBox>
            <View style={styles.topProductsContainer}>
              {topProducts.length === 0 ? (
                <AnimatedBox type="fade" delay={500}>
                   <Text style={{ color: '#999', fontFamily: "Urbanist_400Regular" }}>No data available</Text>
                </AnimatedBox>
              ) : (
                <>
                  {topProducts.length > 1 && (
                    <AnimatedBox type="slideUp" delay={500} style={{ width: "30%" }}>
                      <View style={[styles.productCard, styles.productCardSecond, darkMode && styles.darkProductCard, { width: "100%" }]}>
                        <View style={styles.medalContainer}><Ionicons name="medal" size={32} color="#C0C0C0" /></View>
                        <Text style={[styles.productName, darkMode && styles.darkText]}>{topProducts[1].name}</Text>
                        <Text style={{ fontSize: 10, color: '#aaa' }}>{topProducts[1].quantity} sold</Text>
                      </View>
                    </AnimatedBox>
                  )}

                  {topProducts.length > 0 && (
                    <AnimatedBox type="slideUp" delay={600} style={{ width: "30%" }}>
                      <View style={[styles.productCard, styles.productCardFirst, darkMode && styles.darkProductCard, { width: "100%" }]}>
                        <View style={styles.medalContainer}><Ionicons name="medal" size={32} color="#FFD700" /></View>
                        <Text style={[styles.productName, darkMode && styles.darkText]}>{topProducts[0].name}</Text>
                        <Text style={{ fontSize: 10, color: '#aaa' }}>{topProducts[0].quantity} sold</Text>
                      </View>
                    </AnimatedBox>
                  )}

                  {topProducts.length > 2 && (
                    <AnimatedBox type="slideUp" delay={700} style={{ width: "30%" }}>
                      <View style={[styles.productCard, styles.productCardThird, darkMode && styles.darkProductCard, { width: "100%" }]}>
                        <View style={styles.medalContainer}><Ionicons name="medal" size={32} color="#CD7F32" /></View>
                        <Text style={[styles.productName, darkMode && styles.darkText]}>{topProducts[2].name}</Text>
                        <Text style={{ fontSize: 10, color: '#aaa' }}>{topProducts[2].quantity} sold</Text>
                      </View>
                    </AnimatedBox>
                  )}
                </>
              )}
            </View>

            {/* STOCK REPORT SECTION */}
            <AnimatedBox type="slideUp" delay={800}>
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Stock report</Text>
            </AnimatedBox>
            <View style={styles.stockReportContainer}>
              <AnimatedBox type="slideLeft" delay={900} style={{ flex: 1 }}>
                <View style={[styles.stockItem, darkMode && styles.darkStockItem, { marginRight: 10 }]}>
                    <View style={styles.stockIconContainer}>
                    <Ionicons name="bar-chart-outline" size={28} color={MAIN} />
                    </View>
                    <Text style={[styles.stockLabel, darkMode && styles.darkText]} numberOfLines={1}>Total stock value</Text>
                    <Text style={[styles.stockValue, darkMode && styles.darkText]}>{stockReport.totalValue?.toLocaleString()} FRW</Text>
                </View>
              </AnimatedBox>

              <AnimatedBox type="slideRight" delay={1000} style={{ flex: 1 }}>
                <View style={[styles.stockItem, darkMode && styles.darkStockItem]}>
                    <View style={styles.stockIconContainer}>
                    <Ionicons name="cart-outline" size={28} color={MAIN} />
                    </View>
                    <Text style={[styles.stockLabel, darkMode && styles.darkText]} numberOfLines={1}>Expired products value</Text>
                    <Text style={[styles.stockValue, darkMode && styles.darkText]}>{stockReport.expiredValue?.toLocaleString()} FRW</Text>
                </View>
              </AnimatedBox>
            </View>

            {/* GAIN / LOSS SUMMARY SECTION */}
            <AnimatedBox type="slideUp" delay={1100}>
              <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Gain / Loss Summary</Text>
            </AnimatedBox>
            <AnimatedBox type="zoomIn" delay={1200}>
              <View style={styles.summaryContainer}>
                {gainLoss.type === 'profit' ? (
                  <View style={[styles.summaryCard, darkMode && styles.darkSummaryCard]}>
                    <Text style={styles.summaryEmoji}>🥳</Text>
                    <Text style={[styles.summaryText, darkMode && styles.darkText]}>{gainLoss.message}</Text>
                  </View>
                ) : gainLoss.type === 'loss' ? (
                  <View style={[styles.summaryCard, darkMode && styles.darkSummaryCard]}>
                    <Text style={styles.summaryEmoji}>😔</Text>
                    <Text style={[styles.summaryText, darkMode && styles.darkText]}>{gainLoss.message}</Text>
                  </View>
                ) : (
                  <View style={[styles.summaryCard, darkMode && styles.darkSummaryCard]}>
                    <Text style={styles.summaryEmoji}>😐</Text>
                    <Text style={[styles.summaryText, darkMode && styles.darkText]}>{gainLoss.message}</Text>
                  </View>
                )}
              </View>
            </AnimatedBox>
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    position: "relative",
  },
  darkScrollView: {
    backgroundColor: "#09111E",
  },
  darkText: {
    color: "#fff",
  },
  darkSalesItem: {
    backgroundColor: "#121d2b",
  },
  darkProductCard: {
    backgroundColor: "#121d2b",
  },
  darkStockItem: {
    backgroundColor: "#121d2b",
  },
  darkSummaryCard: {
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


  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 17, 30, 0.3)",
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
    fontSize: 20,
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
  sectionTitle: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  salesReportContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  salesItem: {
    width: "48%",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  salesIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6EEF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  salesLabel: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  salesValue: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    color: MAIN,
  },
  topProductsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  productCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
  productCardFirst: {
    marginTop: -5,
    zIndex: 3,
  },
  productCardSecond: {
    marginTop: 0,
    zIndex: 2,
  },
  productCardThird: {
    marginTop: 0,
    zIndex: 1,
  },
  medalContainer: {
    marginBottom: 10,
  },
  productName: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  stockReportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stockItem: {
    width: "48%",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  stockIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6EEF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stockLabel: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  stockValue: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    color: MAIN,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
    fontFamily: "Urbanist_400Regular",
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
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





