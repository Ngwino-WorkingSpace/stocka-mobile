import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

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
  };
  return routeMap[itemName] || itemName;
};

export default function SalesScreen({ navigation }) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [selectedItem, setSelectedItem] = useState("Sales");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("Daily");

  const StockProducts = [
    {
      id: 1,
      Image: require("../assets/images/irishPotatoes.png"),
      TextHead: "Irish Potatoes",
      subText: "Vegetables",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
    {
      id: 2,
      Image: require("../assets/images/Maize.png"),
      TextHead: "Maize",
      subText: "Grains",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
    {
      id: 3,
      Image: require("../assets/images/Tomato.png"),
      TextHead: "Tomatoes",
      subText: "Vegetables",
      label1: "Quantity sold",
      value1: "20kg",
      label2: "Unit Price",
      value2: "250",
      label3: "Total Price",
      value3: "25.500 FRW",
      label4: "Profit",
      value4: "3,000 FRW",
      label5: "Date of Sale",
      value5: "2nd Dec 2025",
    },
  ];

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
        )}
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 58 : 0, backgroundColor: "#fff", padding: 15 }}>
        {/* Tabs */}
        <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        <Text style={styles.headerText}>Sales List</Text>

        <FlatList
        data={StockProducts.filter((p) =>
          p.TextHead.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {/* Left side: Image */}
            <View style={styles.imageWrapper}>
              <Image source={item.Image} style={styles.productImage} />
            </View>

            {/* Right side: Details */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.TextHead}</Text>
              <Text style={styles.productCategory}>{item.subText}</Text>

              <View style={styles.labelsContainer}>
                <View style={styles.labelColumn}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label1}</Text>
                    <Text style={styles.value}>{item.value1}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label2}</Text>
                    <Text style={styles.value}>{item.value2}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label3}</Text>
                    <Text style={styles.value}>{item.value3}</Text>
                  </View>
                </View>

                <View style={styles.labelColumn}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label4}</Text>
                    <Text style={styles.value}>{item.value4}</Text>
                  </View>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{item.label5}</Text>
                    <Text style={styles.value}>{item.value5}</Text>
                  </View>
                </View>
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

        <View style={styles.MoreButton}>
          <TouchableOpacity style={styles.MoreButtonTouchable}>
            <Text style={styles.MoreText}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: MAIN,
  },
  tabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
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

});
