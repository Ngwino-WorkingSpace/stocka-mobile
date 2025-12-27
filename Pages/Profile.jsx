import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

export default function ProfileScreen({ navigation }) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [selectedItem, setSelectedItem] = useState("Profile");

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
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 58 : 0 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            paddingBottom: 20,
            backgroundColor: "#fff",
          }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoContainerHeader}>
              <Image
                source={require("../assets/images/stock.png")}
                style={{ width: 36, height: 36 }}
              />
              <Text style={styles.stockaText}>Stocka</Text>
            </View>
          </View>

          {/* PROFILE SECTION */}
          <Text style={styles.sectionTitle}>Profile</Text>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={60} color={MAIN} />
            </View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>

          {/* Account Settings */}
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="person-outline" size={24} color={MAIN} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personal Information</Text>
                <Text style={styles.settingSubtitle}>Update your personal details</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="lock-closed-outline" size={24} color={MAIN} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change Password</Text>
                <Text style={styles.settingSubtitle}>Update your password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color={MAIN} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Manage notification settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color={MAIN} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help and contact support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="log-out-outline" size={24} color="#ff4444" />
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: "#ff4444" }]}>Logout</Text>
                <Text style={styles.settingSubtitle}>Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E6EEF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  profileEmail: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#666",
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
    marginLeft: 15,
  },
  settingTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#666",
  },
});

