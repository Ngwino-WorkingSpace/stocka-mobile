import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

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

export default function ProfileScreen({navigation}) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Profile");
  const [editable, setEditable] = useState(false);

  const [profile, setProfile] = useState({
    name: "NIZIWIHINDA Divin",
    phone: "+250 780 602 022",
    password: "********",
    dob: "12th January 2025",
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    <View style={[styles.mainContainer, { backgroundColor: darkMode ? "#1a1a2e" : "#fff" }]}>
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
      <SafeAreaView style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 58 : 0 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              {navigation?.canGoBack() && (
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                </TouchableOpacity>
              )}
              <Text style={[styles.logo, darkMode && styles.darkText]}>Stocka</Text>
            </View>

            <Text style={[styles.title, darkMode && styles.darkText]}>Profile info</Text>

      {/* Profile Image */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="#000" />
        </View>

        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => setEditable(!editable)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <ProfileInput
        label="Full name"
        value={profile.name}
        editable={editable}
        onChangeText={(v) => setProfile({ ...profile, name: v })}
      />

      <ProfileInput
        label="Phone number"
        value={profile.phone}
        editable={editable}
        onChangeText={(v) => setProfile({ ...profile, phone: v })}
      />

      <ProfileInput
        label="Password"
        value={profile.password}
        editable={false}
        secureTextEntry
      />

      <ProfileInput
        label="Date of joining"
        value={profile.dob}
        editable={false}
      />

      {/* Buttons */}
      <TouchableOpacity style={styles.grayButton}>
        <Text style={styles.grayText}>CHANGE PASSWORD</Text>
      </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

    <Modal
  transparent
  animationType="fade"
  visible={showLogoutModal}
>
  <View style={styles.overlay}>
    <View style={styles.modalCard}>
      <Ionicons
        name="warning-outline"
        size={38}
        color="#0A2A3F"
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.modalText}>
        Are you sure about logging out?
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.yesButton}
          onPress={() => {
            setShowLogoutModal(false);
            navigation.navigate("Login")
            
          }}
        >
          <Text style={styles.yesText}>YES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.noButton}
          onPress={() => setShowLogoutModal(false)}
        >
          <Text style={styles.noText}>NO</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}

/* Reusable input */
const ProfileInput = ({
  label,
  value,
  editable,
  onChangeText,
  secureTextEntry,
}) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,
        !editable && styles.disabledInput,
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
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
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  darkContainer: {
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  darkText: {
    color: "#fff",
  },
  title: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    marginBottom: 20,
    color: "#000",
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#E1E6EA",
    alignItems: "center",
    justifyContent: "center",
  },

  editIcon: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#0A2A3F",
    padding: 6,
    borderRadius: 6,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  label: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F1F4F6",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontFamily: "Poppins_500Medium",
  },

  disabledInput: {
    color: "#777",
  },

  grayButton: {
    backgroundColor: "#C9CED3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  grayText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },

  logoutButton: {
    backgroundColor: "#0A2A3F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  logoutText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
},

modalCard: {
  width: "80%",
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 20,
  alignItems: "center",
},

modalText: {
  fontFamily: "Poppins_500Medium",
  fontSize: 13,
  marginVertical: 10,
  textAlign: "center",
},

modalButtons: {
  flexDirection: "row",
  marginTop: 14,
},

yesButton: {
  backgroundColor: "#0A2A3F",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
  marginRight: 10,
},

yesText: {
  color: "#fff",
  fontFamily: "Poppins_500Medium",
  fontSize: 12,
},

noButton: {
  borderWidth: 1,
  borderColor: "#0A2A3F",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
},

noText: {
  fontFamily: "Poppins_500Medium",
  fontSize: 12,
  color: "#0A2A3F",
},

});
