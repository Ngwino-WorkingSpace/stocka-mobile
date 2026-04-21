import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedBox from "./AnimatedBox";

const { width } = Dimensions.get("window");
const MAIN = "#4a9eff"; // Assuming this is your main color

const AppSidebar = ({
  sidebarState,
  setSidebarState,
  selectedItem,
  onNavItemPress,
  darkMode,
  toggleTheme,
  onLogout,
  onHelp,
}) => {
  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const handleCloseSidebar = () => setSidebarState("press");
  const handleArrowPress = () => setSidebarState("expanded");
  const handlePressTextClick = () => setSidebarState("collapsed");

  const menuItems = [
    { label: "Dashboard", icon: "battery-charging-outline" },
    { label: "Stock", icon: "cube-outline" },
    { label: "Sales", icon: "flash-outline" },
    { label: "Reports", icon: "document-text-outline" },
    { label: "Debtors", icon: "wallet-outline" },
    { label: "Profile", icon: "person-outline" },
  ];

  return (
    <>
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
        {/* Toggle Arrows */}
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
          <>
            {/* Logo */}
            <View style={[styles.logoContainer, isExpanded && styles.logoContainerExpanded]}>
              <Image
                source={require("../assets/images/ppl.png")}
                style={{ width: 36, height: 36 }}
                tintColor="#fff"
              />
              {isExpanded && <Text style={styles.stockText}>Stocka</Text>}
            </View>

            {/* Menu Container */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <AnimatedBox
                  key={item.label}
                  isButton={true}
                  onPress={() => onNavItemPress(item.label)}
                  style={[
                    styles.navItem,
                    isExpanded && styles.navItemExpanded,
                    selectedItem.toLowerCase() === item.label.toLowerCase() && isExpanded && styles.navItemSelected
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={item.icon} size={22} color="#fff" />
                    {isExpanded && (
                      <Text style={styles.navText}>
                        {item.label}
                      </Text>
                    )}
                  </View>
                </AnimatedBox>
              ))}
            </View>

            {/* Divider */}
            {isExpanded && <View style={styles.divider} />}

            {/* Utilities */}
            <View style={styles.utilityContainer}>
              <TouchableOpacity
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={onHelp}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="help-circle-outline" size={22} color="#fff" />
                  {isExpanded && <Text style={styles.navText}>Help</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={onLogout}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="log-out-outline" size={22} color="#fff" />
                  {isExpanded && <Text style={styles.navText}>Logout</Text>}
                </View>
              </TouchableOpacity>
            </View>

            {/* Theme Toggle */}
            {isExpanded && (
              <View style={styles.themeToggleContainer}>
                <View style={styles.themeToggle}>
                  <Ionicons name="sunny" size={20} color={!darkMode ? MAIN : "#999"} />
                  <TouchableOpacity
                    style={[styles.themeToggleSwitch, darkMode && styles.themeToggleSwitchActive]}
                    onPress={toggleTheme}
                  >
                    <View style={[styles.themeToggleKnob, darkMode && styles.themeToggleKnobActive]} />
                  </TouchableOpacity>
                  <Ionicons name="moon" size={20} color={darkMode ? "#fff" : "#999"} />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 8,
    fontFamily: "Urbanist_700Bold",
    lineHeight: 9,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 17, 30, 0.4)",
    zIndex: 150, // Higher than everything else
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 50,
    zIndex: 200, // Top-most
    justifyContent: "flex-start",
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
  },
  navItemExpanded: {
    justifyContent: "flex-start",
  },
  navItemSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    width: "80%",
    alignSelf: "center",
  },
  utilityContainer: {
    width: "100%",
  },
  themeToggleContainer: {
    position: "absolute",
    bottom: 30,
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginHorizontal: 10,
  },
  themeToggleSwitchActive: {
    backgroundColor: "#fff",
  },
  themeToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MAIN,
  },
  themeToggleKnobActive: {
    alignSelf: "flex-end",
  },
});

export default AppSidebar;
