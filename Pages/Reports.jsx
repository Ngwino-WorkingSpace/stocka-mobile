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

export default function ReportsScreen({ navigation }) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Reports");
  const [selectedTab, setSelectedTab] = useState("Daily");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
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
    <View style={styles.container}>
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
              backgroundColor: "#fff",
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.header}>
              {navigation?.canGoBack() && (
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
              )}
              <View style={styles.logoContainerHeader}>
                <Image
                  source={require("../assets/images/stock.png")}
                  style={{ width: 36, height: 36 }}
                />
                <Text style={styles.stockaText}>Stocka</Text>
              </View>
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

          {/* SALES REPORT SECTION */}
          <Text style={styles.sectionTitle}>Sales Report</Text>
          <View style={styles.salesReportContainer}>
            <View style={styles.salesItem}>
              <View style={styles.salesIconContainer}>
                <Ionicons name="cube-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.salesLabel}>Vegetables</Text>
              <Text style={styles.salesValue}>23,000 FRW</Text>
            </View>

            <View style={styles.salesItem}>
              <View style={styles.salesIconContainer}>
                <Ionicons name="basket-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.salesLabel}>Fruits</Text>
              <Text style={styles.salesValue}>30,000 FRW</Text>
            </View>

            <View style={styles.salesItem}>
              <View style={styles.salesIconContainer}>
                <Ionicons name="bag-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.salesLabel}>Grains</Text>
              <Text style={styles.salesValue}>11,000 FRW</Text>
            </View>

            <View style={styles.salesItem}>
              <View style={styles.salesIconContainer}>
                <Ionicons name="cart-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.salesLabel}>Perishables</Text>
              <Text style={styles.salesValue}>18,000 FRW</Text>
            </View>
          </View>

          {/* TOP SELLING PRODUCTS SECTION */}
          <Text style={styles.sectionTitle}>Top Selling products</Text>
          <View style={styles.topProductsContainer}>
            <View style={[styles.productCard, styles.productCardSecond]}>
              <View style={styles.medalContainer}>
                <Ionicons name="medal" size={32} color="#C0C0C0" />
              </View>
              <Text style={styles.productName}>Water Melons</Text>
            </View>

            <View style={[styles.productCard, styles.productCardFirst]}>
              <View style={styles.medalContainer}>
                <Ionicons name="medal" size={32} color="#FFD700" />
              </View>
              <Text style={styles.productName}>Irish Potatoes</Text>
            </View>

            <View style={[styles.productCard, styles.productCardThird]}>
              <View style={styles.medalContainer}>
                <Ionicons name="medal" size={32} color="#CD7F32" />
              </View>
              <Text style={styles.productName}>Sweet Potatoes</Text>
            </View>
          </View>

          {/* STOCK REPORT SECTION */}
          <Text style={styles.sectionTitle}>Stock report</Text>
          <View style={styles.stockReportContainer}>
            <View style={styles.stockItem}>
              <View style={styles.stockIconContainer}>
                <Ionicons name="bar-chart-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.stockLabel}>Total stock</Text>
              <Text style={styles.stockValue}>427,000 FRW</Text>
            </View>

            <View style={styles.stockItem}>
              <View style={styles.stockIconContainer}>
                <Ionicons name="cart-outline" size={28} color={MAIN} />
              </View>
              <Text style={styles.stockLabel}>Expired products price</Text>
              <Text style={styles.stockValue}>23,000 FRW</Text>
            </View>
          </View>

          {/* GAIN / LOSS SUMMARY SECTION */}
          <Text style={styles.sectionTitle}>Gain / Loss Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>🥳</Text>
              <Text style={styles.summaryText}>
                Congratulations dear user you made a profit.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>😔</Text>
              <Text style={styles.summaryText}>
                Unfortunately you made a loss wonder how this happened let me help you out.
              </Text>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
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
    justifyContent: "flex-start",
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
    fontFamily: "Poppins_700Bold",
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
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
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
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  salesValue: {
    fontFamily: "Poppins_600SemiBold",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontFamily: "Poppins_600SemiBold",
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
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  stockValue: {
    fontFamily: "Poppins_600SemiBold",
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
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});

