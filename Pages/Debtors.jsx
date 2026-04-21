import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppSidebar from "../components/AppSidebar";
import AnimatedBox from "../components/AnimatedBox.jsx";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";

const { width } = Dimensions.get("window");
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
import Toast from 'react-native-toast-message';
import { useTheme } from '../src/context/ThemeContext';

export default function DebtorsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode;
  const [selectedItem, setSelectedItem] = useState("Debtors");

  const [activeTab, setActiveTab] = useState("debtors");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Phone");
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const [DebtModalVisible, setDebtModalVisible] = useState(false);
  const [DebtAmount, setDebtAmount] = useState("");

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [entryInfo, setEntryInfo] = useState({
    name: "",
    phone: "",
    amount: "",
    date: "",
    type: "",
  });
  const [debtorsList, setDebtorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);

  const fetchDebtors = async () => {
    try {
      setLoading(true);
      // activeTab is either "debtors" or "creditors"
      const res = await api.getDebtors(activeTab);
      // Fallback if backend returns array directly or under 'debtors' key
      const data = res.debtors || (Array.isArray(res) ? res : []);

      if (data) {
        // Map to UI Structure
        const mapped = data.map(d => {
          // Backend returns balance as string, parse it to number
          const balance = parseFloat(d.balance || 0);
          return {
            id: d.id,
            name: d.full_name || d.name || "Unknown",
            phone: d.phone_number || d.phone || "",
            // Display absolute value for amount, but preserve sign for rawAmount
            amount: `${Math.abs(balance).toLocaleString()} FRW`,
            rawAmount: balance, // Keep original sign for calculations
            type: activeTab === "debtors" ? "DEBTOR" : "CREDITOR",
            date: new Date(d.created_at || Date.now()).toLocaleDateString()
          };
        });
        setDebtorsList(mapped);
      } else {
        setDebtorsList([]);
      }
    } catch (e) {
      console.log("Error fetching debtors:", e);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch debtors. Please try again.' });
      setDebtorsList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDebtors();
  }, [activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      fetchDebtors();
    }, [activeTab])
  );

  // No more filtering out based on local activeTab state, API handles it
  const currentData = debtorsList;

  const filteredData = currentData
    .filter((item) =>
      (item.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.phone || "").includes(searchText)
    )
    .sort((a, b) => {
      if (sortBy === "Phone") {
        return (a.phone || "").localeCompare(b.phone || "");
      }
      return 0;
    });

  const handleCreateDebtor = async () => {
    if (!formName || !formPhone) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Name and Phone required' });
      return;
    }
    try {
      setLoading(true);
      // 1. Create the person
      const res = await api.createDebtor({
        fullName: formName,
        phoneNumber: formPhone,
      });

      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: `${activeTab === "debtors" ? "Debtor" : "Creditor"} added` });
        setModalVisible(false);
        fetchDebtors();
        setFormName("");
        setFormPhone("");
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: `Error adding ${activeTab}` });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedDebtor || !paymentAmount) return;
    try {
      const res = await api.recordPayment({
        debtorId: selectedDebtor.id,
        amount: parseFloat(paymentAmount)
      });
      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Payment recorded' });
        setPaymentModalVisible(false);
        fetchDebtors();
        setPaymentAmount("");
        setInfoModalVisible(false);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error recording payment' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  const handleRecordDebt = async () => {
    if (!selectedDebtor || !DebtAmount) return;
    try {
      const res = await api.recordDebt({
        debtorId: selectedDebtor.id,
        amount: parseFloat(DebtAmount)
      });
      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Debt recorded' });
        setDebtModalVisible(false);
        fetchDebtors();
        setDebtAmount("");
        setInfoModalVisible(false);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error recording debt' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  const handleDeleteDebtor = async () => {
    if (!selectedDebtor) return;
    try {
      setLoading(true);
      const res = await api.deleteDebtor(selectedDebtor.id);
      if (res && (res.message)) { // Adjust based on api response
        Toast.show({ type: 'success', text1: 'Deleted', text2: 'Person deleted successfully' });
        setInfoModalVisible(false);
        fetchDebtors();
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error deleting person' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const renderDebtorItem = (item, index) => (
    <AnimatedBox delay={index * 100} type="slideUp" key={item.id}>
      <TouchableOpacity onPress={() => {
        setSelectedDebtor(item);
        setEntryInfo(item);
        setInfoModalVisible(true);
      }}>
        <View style={[styles.card, darkMode && styles.darkCard]}>
          <View style={[styles.avatar, darkMode && styles.darkAvatar]}>
            <Ionicons name="person-outline" size={22} color={darkMode ? "#fff" : "#0B3A53"} />
          </View>

          <View style={styles.cardText}>
            <Text style={[styles.name, darkMode && styles.darkText]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.phone, darkMode && { color: "#aaa" }]}>{item.phone}</Text>
          </View>

          <Text style={[styles.amount, darkMode && styles.darkText]}>{item.amount}</Text>
        </View>
      </TouchableOpacity>
    </AnimatedBox>
  );



  return (
    <View style={[styles.mainContainer, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>
      {/* CONTENT (Rendered first so absolute elements can overlay it) */}
      <View style={{ flex: 1, marginLeft: isPressState ? 70 : isCollapsed ? 70 : 0 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#09111E"]} />
            }
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
              <View style={[styles.tabs, darkMode && styles.darkTabs]}>
                {["debtors", "creditors"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText, darkMode && !(activeTab === tab) && styles.darkText]}>
                      {tab === "debtors" ? "To Receive" : "To Pay"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </AnimatedBox>

            {/* SUMMARY CARD */}
            <AnimatedBox type="zoomIn" delay={200}>
              <View style={[styles.summaryCard, darkMode && styles.darkSummaryCard]}>
                <View>
                  <Text style={[styles.summaryLabel, darkMode && { color: "#ccc" }]}>
                    {activeTab === "debtors" ? "Total Debtors Balance" : "Total Creditors Balance"}
                  </Text>
                  <Text style={styles.summaryValue}>
                    {Math.abs(debtorsList.reduce((acc, d) => acc + (Number(d.rawAmount) || 0), 0)).toLocaleString()} FRW
                  </Text>
                </View>
                <View style={styles.summaryIconBox}>
                  <Ionicons name={activeTab === "debtors" ? "arrow-down-circle" : "arrow-up-circle"} size={32} color="#fff" />
                </View>
              </View>
            </AnimatedBox>

            {/* TITLE */}
            <AnimatedBox type="slideUp" delay={300}>
                <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
                {activeTab === "debtors" ? "Current Debtors" : "Current Creditors"}
                </Text>
            </AnimatedBox>

            {/* SEARCH & SORT */}
            <AnimatedBox type="fade" delay={400}>
                <View style={styles.searchRow}>
                <TextInput
                    placeholder="Search by name or phone..."
                    placeholderTextColor="#777"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                />

                <TouchableOpacity
                    style={styles.sortBtn}
                    onPress={() => setSortOpen(!sortOpen)}
                >
                    <Text style={styles.sortText}>{sortBy}</Text>
                    <Ionicons name="chevron-down" size={14} color="#fff" />
                </TouchableOpacity>
                </View>
            </AnimatedBox>

            {/* LIST */}
            <View style={{ paddingBottom: 100 }}>
              {filteredData.map((item, index) => renderDebtorItem(item, index))}
            </View>

            {/* ADD BUTTON */}
            <AnimatedBox usePulse={true} isButton={true} style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addText}>
                {activeTab === "debtors" ? "Add Person" : "Add Person"}
              </Text>
            </AnimatedBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, darkMode && styles.darkModalBox]}>

            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>
              Add {activeTab === "debtors" ? " a new Person" : " a new Person"}
            </Text>

            <TextInput
              placeholder="Full name"
              placeholderTextColor={darkMode ? "#aaa" : "#777"}
              value={formName}
              onChangeText={setFormName}
              style={[styles.modalInput, darkMode && styles.darkModalInput]}
            />

            <TextInput
              placeholder="Phone number"
              placeholderTextColor={darkMode ? "#aaa" : "#777"}
              value={formPhone}
              onChangeText={setFormPhone}
              keyboardType="phone-pad"
              style={[styles.modalInput, darkMode && styles.darkModalInput]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setFormName("");
                  setFormPhone("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleCreateDebtor}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>

      {/* ==================INFO MODAL ====================*/}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.infoOverlay}>
          <View style={[styles.infoModal, darkMode && styles.darkInfoModal]}>

            <TouchableOpacity
              style={[styles.closeIcon, darkMode && styles.darkCloseIcon]}
              onPress={() => {
                setInfoModalVisible(false);
              }}
            >
              <Ionicons name="close" size={20} color={darkMode ? "#fff" : "#555"} />
            </TouchableOpacity>

            <Text style={[styles.infoTitle, darkMode && styles.darkText]}>
              {activeTab === "debtors" ? "Person info" : "Person info"}
            </Text>

            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Full name:</Text>
                <Text style={[styles.infoValue, darkMode && styles.darkText]}>{selectedDebtor?.name}</Text>

                <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Phone number:</Text>
                <Text style={[styles.infoValue, darkMode && styles.darkText]}>{selectedDebtor?.phone}</Text>

                <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Current balance:</Text>
                <Text style={[styles.infoValue, darkMode && styles.darkText]}>{selectedDebtor?.amount}</Text>

                <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Date:</Text>
                <Text style={[styles.infoValue, darkMode && styles.darkText]}>{selectedDebtor?.date}</Text>
              </View>

              <View style={[styles.avatarBox, darkMode && styles.darkAvatarBox]}>
                <Ionicons name="person" size={40} color={darkMode ? "#fff" : "#000"} />
              </View>
            </View>

            <View style={styles.infoActions}>
              <TouchableOpacity style={styles.secondaryBtn}
                onPress={() => {
                  setDebtModalVisible(true);
                }}
              >
                <Text style={styles.secondaryText}>Record debt</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn}
                onPress={() => {
                  setPaymentModalVisible(true);
                }}
              >
                <Text style={styles.primaryText}>Record payment</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginTop: 15, alignSelf: 'center', padding: 5 }}
              onPress={handleDeleteDebtor}
            >
              <Text style={{ color: "red", fontSize: 13, fontFamily: "Urbanist_500Medium" }}>Delete Person</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* ============ RECORD PAYMENT MODAL ==================*/}

      <Modal
        transparent
        animationType="fade"
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={paymentStyles.overlay}>
          <View style={paymentStyles.paymentModalBox}>

            {/* CLOSE ICON */}
            <TouchableOpacity
              style={paymentStyles.closeIcon}
              onPress={() => {
                setPaymentModalVisible(false);
                setPaymentAmount("");
              }}
            >
              <Ionicons name="close" size={20} color="#555" />
            </TouchableOpacity>

            {/* TITLE */}
            <Text style={paymentStyles.modalTitle}>Record Payment</Text>

            {/* INFO + AVATAR */}
            <View style={paymentStyles.infoRow}>

              <View style={paymentStyles.infoText}>
                <Text style={paymentStyles.label}>Full name:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.name}</Text>

                <Text style={paymentStyles.label}>Phone number:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.phone}</Text>

                <Text style={paymentStyles.label}>Type:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.type || "DEBTOR"}</Text>
              </View>

              <View style={paymentStyles.avatarBox}>
                <Ionicons name="person" size={42} color="#555" />
              </View>

            </View>

            {/* PAYMENT INPUT */}
            <View style={paymentStyles.inputGroup}>
              <Text style={paymentStyles.inputLabel}>Payment amount</Text>
              <TextInput
                placeholder="e.g. 25,700 FRW"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="numeric"
                style={paymentStyles.input}
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity style={paymentStyles.updateButton} onPress={handleRecordPayment}>
              <Text style={paymentStyles.updateButtonText}>UPDATE</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* ============ RECORD DEBT MODAL ==================*/}

      <Modal
        transparent
        animationType="fade"
        visible={DebtModalVisible}
        onRequestClose={() => setDebtModalVisible(false)}
      >
        <View style={paymentStyles.overlay}>
          <View style={paymentStyles.paymentModalBox}>

            {/* CLOSE ICON */}
            <TouchableOpacity
              style={paymentStyles.closeIcon}
              onPress={() => {
                setDebtModalVisible(false);
                setDebtAmount("");
              }}
            >
              <Ionicons name="close" size={20} color="#555" />
            </TouchableOpacity>

            {/* TITLE */}
            <Text style={paymentStyles.modalTitle}>Record Debt</Text>

            {/* INFO + AVATAR */}
            <View style={paymentStyles.infoRow}>

              <View style={paymentStyles.infoText}>
                <Text style={paymentStyles.label}>Full name:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.name}</Text>

                <Text style={paymentStyles.label}>Phone number:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.phone}</Text>

                <Text style={paymentStyles.label}>Type:</Text>
                <Text style={paymentStyles.value}>{selectedDebtor?.type || "DEBTOR"}</Text>
              </View>

              <View style={paymentStyles.avatarBox}>
                <Ionicons name="person" size={42} color="#555" />
              </View>

            </View>

            {/* PAYMENT INPUT */}
            <View style={paymentStyles.inputGroup}>
              <Text style={paymentStyles.inputLabel}>Payment amount</Text>
              <TextInput
                placeholder="e.g. 25,700 FRW"
                value={DebtAmount}
                onChangeText={setDebtAmount}
                keyboardType="numeric"
                style={paymentStyles.input}
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity style={paymentStyles.updateButton} onPress={handleRecordDebt}>
              <Text style={paymentStyles.updateButtonText}>UPDATE</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={paymentStyles.logoutOverlay}>
          <View style={paymentStyles.logoutModalCard}>
            <Ionicons
              name="warning-outline"
              size={38}
              color="#09111E"
              style={{ marginBottom: 10 }}
            />

            <Text style={paymentStyles.logoutModalText}>
              Are you sure about logging out?
            </Text>

            <View style={paymentStyles.logoutModalButtons}>
              <TouchableOpacity
                style={paymentStyles.logoutYesButton}
                onPress={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }}
              >
                <Text style={paymentStyles.logoutYesText}>YES</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={paymentStyles.logoutNoButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={paymentStyles.logoutNoText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

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
        selectedItem="Debtors"
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
    </View >
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: MAIN,
  },
  darkSummaryCard: {
    backgroundColor: "#121d2b",
    borderLeftColor: "#4a9eff",
  },
  summaryLabel: {
    fontFamily: "Urbanist_400Regular",
    fontSize: 12,
    color: "#555",
  },
  summaryValue: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: MAIN,
  },
  summaryIconBox: {
    backgroundColor: MAIN,
    padding: 10,
    borderRadius: 10,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
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
    marginTop: 2,
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
    marginTop: 2,
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
  darkText: {
    color: "#fff",
  },
  darkScrollView: {
    backgroundColor: "#09111E",
  },
  darkTabs: {
    backgroundColor: "#121d2b",
  },
  darkCard: {
    backgroundColor: "#121d2b",
  },
  darkAvatar: {
    backgroundColor: "#09111E",
  },
  darkModalBox: {
    backgroundColor: "#121d2b",
  },
  darkModalInput: {
    backgroundColor: "#09111E",
    color: "#fff",
  },
  darkInfoModal: {
    backgroundColor: "#121d2b",
  },
  darkCloseIcon: {
    backgroundColor: "#09111E",
  },
  darkAvatarBox: {
    backgroundColor: "#09111E",
  },
  darkTypeBadge: {
    backgroundColor: "#09111E",
    color: "#fff",
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
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    marginTop: 20,
  },

  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { backgroundColor: MAIN, borderRadius: 12 },

  tabText: { fontFamily: "Urbanist_500Medium", fontSize: 14, color: "#333" },
  activeTabText: { color: "#fff" },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#E8EDF0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },

  sortBtn: {
    backgroundColor: MAIN,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  sortText: { color: "#fff", fontSize: 12, fontFamily: "Urbanist_400Regular", },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: { flex: 1, marginLeft: 12 },

  name: { fontSize: 13, fontFamily: "Urbanist_600SemiBold" },
  phone: { fontSize: 11, color: "#666" },
  amount: { fontSize: 12, fontFamily: "Urbanist_600SemiBold" },

  addBtn: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: MAIN,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },

  addText: { color: "#fff", fontSize: 12, fontFamily: "Urbanist_400Regular" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
  },

  modalTitle: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },

  modalInput: {
    backgroundColor: "#F1F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  cancelText: {
    color: "#777",
    fontFamily: "Urbanist_500Medium",
  },

  saveBtn: {
    backgroundColor: MAIN,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },

  saveText: {
    color: "#fff",
    fontFamily: "Urbanist_500Medium",
  },

  /* ===== INFO MODAL ===== */

  infoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  infoModal: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
  },

  infoTitle: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    color: "#111",
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },

  infoLabel: {
    fontFamily: "Urbanist_400Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 8,
  },

  infoValue: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 13,
    color: "#111",
  },

  typeBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#EAF2F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    fontFamily: "Urbanist_500Medium",
    fontSize: 11,
    color: "#0B3A53",
  },

  avatarBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#F1F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  infoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#0B3A53",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  secondaryText: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
    color: "#0B3A53",
  },

  primaryBtn: {
    backgroundColor: "#0B3A53",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  primaryText: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
    color: "#FFFFFF",
  },

  /* ===== FORM MODAL CLOSE ICON ===== */

  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F4F6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
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



const paymentStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentModalBox: {
    width: "93%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    position: "relative",
    marginHorizontal: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Urbanist_400Regular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    fontFamily: "Urbanist_400Regular",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
    fontFamily: "Urbanist_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#09111E",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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

});



