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
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";

import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import AppSidebar from "../components/AppSidebar";
import AnimatedBox from "../components/AnimatedBox";
import {Nosifer_400Regular} from "@expo-google-fonts/nosifer";  

const MAIN = "#09111E"; 

// Helper function to map display names to route names
const getRouteName = (itemName) => {
  const routeMap = {
    "Dashboard": "dashboard",
    "Stock": "Stock",
    "Sales": "Sales",
    "Reports": "Reports",
    "Profile": "Profile",
    "debtors": "debtors",
  };
  return routeMap[itemName] || itemName;
};

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode; // Alias for easier refactoring
  const [selectedItem, setSelectedItem] = useState("Profile");
  const [editable, setEditable] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.getProfile();
      // Assuming res.user contains name, phone, created_at
      // Adjust based on actual API response structure
      if (res && res.user) {
        const u = res.user;
        setProfile(p => ({
          ...p,
          name: u.full_name || u.fullName || u.name || "User",
          phone: u.phone_number || u.phoneNumber || u.phone || "",
          email: u.email || "",
          dob: u.created_at ? new Date(u.created_at).toDateString() : "Unknown"
        }));
      }
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, []);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Nosifer_400Regular 
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  if (!fontsLoaded) return null;

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  return (
    <View style={[styles.mainContainer, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>

      {/* CONTENT (Rendered first so absolute elements can overlay it) */}
      <View style={{ 
        flex: 1, 
        marginLeft: isPressState ? 34 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#09111E" : "#fff" 
        }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
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
                    <Text style={[{ fontFamily: "Nosifer_400Regular", fontSize: 19 }, darkMode && styles.darkText]}>Stocka</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
                  <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : MAIN} />
                </TouchableOpacity>
              </View>
            </AnimatedBox>

            <AnimatedBox type="slideUp" delay={50}>
              <Text style={[styles.title, darkMode && styles.darkText]}>Profile info</Text>
            </AnimatedBox>

            {/* Profile Image */}
            <AnimatedBox delay={100} type="slideUp">
              <View style={styles.avatarWrapper}>
                <View style={[styles.avatar, darkMode && styles.darkAvatar]}>
                  <Ionicons name="person" size={60} color={darkMode ? "#fff" : "#000"} />
                </View>
              </View>
            </AnimatedBox>

            {/* Inputs */}
            <AnimatedBox delay={200} type="slideUp">
              <ProfileInput
                label="Full name"
                value={profile.name}
                editable={editable}
                onChangeText={(v) => setProfile({ ...profile, name: v })}
                darkMode={darkMode}
              />
            </AnimatedBox>

            <AnimatedBox delay={300} type="slideUp">
              <ProfileInput
                label="Phone number"
                value={profile.phone}
                editable={editable}
                onChangeText={(v) => setProfile({ ...profile, phone: v })}
                darkMode={darkMode}
              />
            </AnimatedBox>

            <AnimatedBox delay={400} type="slideUp">
              <ProfileInput
                label="Email"
                value={profile.email}
                editable={editable}
                onChangeText={(v) => setProfile({ ...profile, email: v })}
                darkMode={darkMode}
              />
            </AnimatedBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* REUSABLE SIDEBAR COMPONENTS */}
      <AppSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
        selectedItem="Profile"
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
              color="#09111E"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.modalText}>
              Are you sure about logging out?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
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

    </View >
  );
}

/* Reusable input */
const ProfileInput = ({
  label,
  value,
  editable,
  onChangeText,
  secureTextEntry,
  darkMode,
}) => {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // If it's a password field (secureTextEntry is true), we use the internal isVisible state
  // If undefined/false, it's just a normal input so it's "visible" (secure=false)
  const isSecure = secureTextEntry ? !isVisible : false;

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, darkMode && styles.darkText]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          style={[
            styles.input,
            !editable && styles.disabledInput,
            darkMode && styles.darkInput,
            darkMode && !editable && { color: "#aaa" },
            { flex: 1 }
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleVisibility} style={{ marginLeft: -35, padding: 5 }}>
            <Ionicons
              name={isVisible ? "eye" : "eye-off"}
              size={20}
              color={darkMode ? "#aaa" : "#555"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    position: "relative",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  darkContainer: {
    backgroundColor: "#09111E",
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
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 18,
  },
  darkText: {
    color: "#fff",
  },
  darkScrollView: {
    backgroundColor: "#09111E",
  },
  darkAvatar: {
    backgroundColor: "#121d2b",
  },
  darkInput: {
    backgroundColor: "#121d2b",
    color: "#fff",
  },
  darkGrayButton: {
    backgroundColor: "#121d2b",
  },
  darkGrayText: {
    color: "#fff",
  },
  title: {
    fontFamily: "Urbanist_500Medium",
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
    backgroundColor: "#09111E",
    padding: 6,
    borderRadius: 6,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  label: {
    fontFamily: "Urbanist_400Regular",
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F1F4F6",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontFamily: "Urbanist_500Medium",
    color: "#000",
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
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
  },

  logoutButton: {
    backgroundColor: "#09111E",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  logoutText: {
    color: "#fff",
    fontFamily: "Urbanist_500Medium",
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
    fontFamily: "Urbanist_500Medium",
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },

  yesButton: {
    backgroundColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },

  yesText: {
    color: "#fff",
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
  },

  noButton: {
    borderWidth: 1,
    borderColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  noText: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
});




