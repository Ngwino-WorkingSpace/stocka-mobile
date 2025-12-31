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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");
const MAIN = "#09364D";

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

const DEBTORS_DATA = [
  { id: "1", name: "NDAYAMBAJE Jean Bosco", phone: "+250 780 602 022", amount: "25,000 FRW" },
  { id: "2", name: "NDAYAMBAJE Jean Bosco", phone: "+250 780 602 022", amount: "25,000 FRW" },
];

const CREDITORS_DATA = [
  { id: "1", name: "MUKAMANA Alice", phone: "+250 788 111 222", amount: "40,000 FRW" },
  { id: "2", name: "HABIMANA Eric", phone: "+250 722 333 444", amount: "15,000 FRW" },
];

export default function DebtorsScreen({ navigation }) {
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Debtors");
  
  const [activeTab, setActiveTab] = useState("debtors");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Phone");
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("debtor"); // debtor | creditor
  const [formName, setFormName] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const [DebtModalVisible, setDebtModalVisible] = useState(false);
  const [DebtAmount, setDebtAmount] = useState("");

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [entryInfo, setEntryInfo] = useState({
    name: "",
    phone: "",
    amount: "",
    date: "",
    type: "",
  });
  const currentData =
    activeTab === "debtors" ? DEBTORS_DATA : CREDITORS_DATA;
  

  const filteredData = currentData
  .filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.phone.includes(searchText)
  )
  .sort((a, b) => {
    if (sortBy === "Phone") {
      return a.phone.localeCompare(b.phone);
    }
    return 0;
  });


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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const renderItem = ({ item }) => (
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
  );

  

  return (
    <View style={[styles.mainContainer, { backgroundColor: darkMode ? "#1a1a2e" : "#fff" }]}>
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
            width: isPressState ? 40 : isCollapsed ? 70 : 250,
            backgroundColor: MAIN,
            alignItems: isPressState ? "center" : isCollapsed ? "center" : "flex-start",
            paddingHorizontal: isPressState ? 0 : isCollapsed ? 6 : 10,
          },
        ]}
      >
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
                  selectedItem === "Debtors" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Debtors")}
              >
                <Ionicons name="wallet-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Debtors</Text>}
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
                onPress={handleLogout}
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
      <SafeAreaView style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#1a1a2e" : "#fff" }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, backgroundColor: darkMode ? "#1a1a2e" : "#fff" }}
            style={darkMode && styles.darkScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <Text style={[styles.header, darkMode && styles.darkText]}>Stocka</Text>

        {/* TABS */}
        <View style={[styles.tabs, darkMode && styles.darkTabs]}>
          {["debtors", "creditors"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText, darkMode && !(activeTab === tab) && styles.darkText]}>
                {tab === "debtors" ? "Debtors" : "Creditors"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TITLE */}
        <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
          {activeTab === "debtors" ? "Current Debtors" : "Current Creditors"}
        </Text>

        {/* SEARCH & SORT */}
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

            {/* LIST */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* ADD BUTTON */}
            <TouchableOpacity style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addText}>
                {activeTab === "debtors" ? "Add Debtor" : "Add Creditor"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
         visible={modalVisible}
          transparent
          animationType="fade"
             onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalBox, darkMode && styles.darkModalBox]}>

      <Text style={[styles.modalTitle, darkMode && styles.darkText]}>
        Add {activeTab === "debtors" ? " a new debtor" : " a new creditor"}
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
        value={formAmount}
        onChangeText={setFormAmount}
        style={[styles.modalInput, darkMode && styles.darkModalInput]}
      />

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            setModalVisible(false);
            setFormName("");
            setFormAmount("");
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.saveBtn}
  onPress={() => {
    setEntryInfo({
      name: formName,
      phone: "+250 780 602 022",
      amount: formAmount,
      date: "12th November 2025",
      type: activeTab === "debtors" ? "DEBT" : "CREDIT",
    });

    setModalVisible(false);       // close form modal
    setInfoModalVisible(true);    // open info modal

    setFormName("");
    setFormAmount("");
  }}
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
      setFormName("");
      setFormAmount("");
    }}
  >
    <Ionicons name="close" size={20} color={darkMode ? "#fff" : "#555"} />
  </TouchableOpacity>

      <Text style={[styles.infoTitle, darkMode && styles.darkText]}>
        {activeTab === "debtors" ? "Debtor info" : "Creditor info"}
      </Text>

      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Full name:</Text>
          <Text style={[styles.infoValue, darkMode && styles.darkText]}>{entryInfo.name}</Text>

          <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Phone number:</Text>
          <Text style={[styles.infoValue, darkMode && styles.darkText]}>{entryInfo.phone}</Text>

          <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Current balance:</Text>
          <Text style={[styles.infoValue, darkMode && styles.darkText]}>{entryInfo.amount} FRW</Text>

          <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Date:</Text>
          <Text style={[styles.infoValue, darkMode && styles.darkText]}>{entryInfo.date}</Text>

          <Text style={[styles.infoLabel, darkMode && { color: "#aaa" }]}>Type:</Text>
          <Text style={[styles.typeBadge, darkMode && styles.darkTypeBadge]}>{entryInfo.type}</Text>
        </View>

        <View style={[styles.avatarBox, darkMode && styles.darkAvatarBox]}>
          <Ionicons name="person" size={40} color={darkMode ? "#fff" : "#000"} />
        </View>
      </View>

      <View style={styles.infoActions}>
        <TouchableOpacity style={styles.secondaryBtn}
           onPress={()=>{
            setDebtModalVisible(true);
           }}
          >
          <Text style={styles.secondaryText}>Record debt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn}
            onPress={()=>{
              setPaymentModalVisible(true);
            }}
          >
          <Text style={styles.primaryText}>Record payment</Text>
        </TouchableOpacity>
      </View>

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
              <Text style={paymentStyles.value}>NIZIHINDA Divin</Text>

              <Text style={paymentStyles.label}>Phone number:</Text>
              <Text style={paymentStyles.value}>+250 780 602 022</Text>

              <Text style={paymentStyles.label}>Type:</Text>
              <Text style={paymentStyles.value}>DEBIT</Text>
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
          <TouchableOpacity style={paymentStyles.updateButton}>
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
              <Text style={paymentStyles.value}>NIZIHINDA Divin</Text>

              <Text style={paymentStyles.label}>Phone number:</Text>
              <Text style={paymentStyles.value}>+250 780 602 022</Text>

              <Text style={paymentStyles.label}>Type:</Text>
              <Text style={paymentStyles.value}>DEBIT</Text>
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
          <TouchableOpacity style={paymentStyles.updateButton}>
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
            color="#0A2A3F"
            style={{ marginBottom: 10 }}
          />

          <Text style={paymentStyles.logoutModalText}>
            Are you sure about logging out?
          </Text>

          <View style={paymentStyles.logoutModalButtons}>
            <TouchableOpacity
              style={paymentStyles.logoutYesButton}
              onPress={() => {
                setShowLogoutModal(false);
                if (navigation) {
                  navigation.navigate("Login");
                }
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
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 12,
    transform: [{ rotate: "-90deg" }],
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
    fontFamily: "Poppins_700Bold",
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
    backgroundColor: "#09364D",
    alignSelf: "center",
  },
  themeToggleKnobActive: {
    backgroundColor: "#fff",
  },
  darkText: {
    color: "#fff",
  },
  darkScrollView: {
    backgroundColor: "#1a1a2e",
  },
  darkTabs: {
    backgroundColor: "#2a2a3e",
  },
  darkCard: {
    backgroundColor: "#2a2a3e",
  },
  darkAvatar: {
    backgroundColor: "#1a1a2e",
  },
  darkModalBox: {
    backgroundColor: "#2a2a3e",
  },
  darkModalInput: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },
  darkInfoModal: {
    backgroundColor: "#2a2a3e",
  },
  darkCloseIcon: {
    backgroundColor: "#1a1a2e",
  },
  darkAvatarBox: {
    backgroundColor: "#1a1a2e",
  },
  darkTypeBadge: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },

  header: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: MAIN,
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    marginTop: 20,
  },

  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { backgroundColor: MAIN, borderRadius: 12 },

  tabText: { fontFamily: "Poppins_500Medium", fontSize: 14, color: "#333" },
  activeTabText: { color: "#fff" },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
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
    fontFamily:"Poppins_400Regular",
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

  sortText: { color: "#fff", fontSize: 12,fontFamily:"Poppins_400Regular", },

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

  name: { fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  phone: { fontSize: 11, color: "#666" },
  amount: { fontSize: 12, fontFamily: "Poppins_600SemiBold" },

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

  addText: { color: "#fff", fontSize: 12, fontFamily:"Poppins_400Regular" },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(9,54,77,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 20,
  marginHorizontal: 10,
},

modalTitle: {
  fontFamily: "Poppins_600SemiBold",
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
  fontFamily: "Poppins_400Regular",
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
  fontFamily: "Poppins_500Medium",
},

saveBtn: {
  backgroundColor: MAIN,
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 24,
},

saveText: {
  color: "#fff",
  fontFamily: "Poppins_500Medium",
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
  fontFamily: "Poppins_600SemiBold",
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
  fontFamily: "Poppins_400Regular",
  fontSize: 11,
  color: "#6B7280",
  marginTop: 8,
},

infoValue: {
  fontFamily: "Poppins_500Medium",
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
  fontFamily: "Poppins_500Medium",
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
  fontFamily: "Poppins_500Medium",
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
  fontFamily: "Poppins_500Medium",
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
    fontFamily:"Poppins_400Regular",
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
    fontFamily:"Poppins_400Regular",
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
    fontFamily:"Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily:"Poppins_400Regular",
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#09364D",
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
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },
  logoutModalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },
  logoutYesButton: {
    backgroundColor: "#0A2A3F",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutYesText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  logoutNoButton: {
    borderWidth: 1,
    borderColor: "#0A2A3F",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutNoText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#0A2A3F",
  },
});
