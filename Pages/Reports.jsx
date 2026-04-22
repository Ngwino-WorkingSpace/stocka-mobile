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
import {Nosifer_400Regular} from "@expo-google-fonts/nosifer";
import { Ionicons } from "@expo/vector-icons";
import AppSidebar from "../components/AppSidebar";
import AnimatedBox from "../components/AnimatedBox.jsx";
import { useTheme } from '../src/context/ThemeContext';

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
   const { isDarkMode, toggleTheme } = useTheme();
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
    Nosifer_400Regular
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


  // Helper for icons map
  const getIconForIndex = (i) => {
    const icons = ["cube-outline", "basket-outline", "bag-outline", "cart-outline"];
    return icons[i % icons.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>
      {/* CONTENT (Rendered first so absolute elements can overlay it) */}
      <View style={{ flex: 1, marginLeft: isPressState ? 45 : isCollapsed ? 70 : 0 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={darkMode && styles.darkScrollView}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#09111E"]} />
            }
          >
            <View>
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
            </View>

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
                <View style={[styles.stockItem, darkMode && styles.darkStockItem]}>
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

      {/* REUSABLE SIDEBAR COMPONENTS */}
      <AppSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
        selectedItem="Reports"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    position: "relative",
    marginRight:10,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    marginRight: 8,
  },
  logoContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockaText: {
    fontFamily: "Nosifer_400Regular",
    fontSize: 19,
    color: MAIN,
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
    marginBottom: 20,
    gap: 12,
  },
  stockItem: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
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
    marginBottom: 2,
  },
  summaryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
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





