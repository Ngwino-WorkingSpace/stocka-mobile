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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

const DEBTORS_DATA = [
  { id: "1", name: "NDAYAMBAJE Jean Bosco", phone: "+250 780 602 022", amount: "25,000 FRW" },
  { id: "2", name: "NDAYAMBAJE Jean Bosco", phone: "+250 780 602 022", amount: "25,000 FRW" },
];

const CREDITORS_DATA = [
  { id: "1", name: "MUKAMANA Alice", phone: "+250 788 111 222", amount: "40,000 FRW" },
  { id: "2", name: "HABIMANA Eric", phone: "+250 722 333 444", amount: "15,000 FRW" },
];

export default function DebtorsScreen() {
  const [activeTab, setActiveTab] = useState("debtors");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Phone");

const [modalVisible, setModalVisible] = useState(false);
const [selectedType, setSelectedType] = useState("debtor"); // debtor | creditor
const [formName, setFormName] = useState("");
const [formAmount, setFormAmount] = useState("");
const [paymentModalVisible, setPaymentModalVisible] = useState(false);
const [paymentAmount, setPaymentAmount] = useState("");

const [DebtModalVisible, setDebtModalVisible] = useState(false);
const [DebtAmount, setDebtAmount] = useState("");

const [infoModalVisible, setInfoModalVisible] = useState(false);

const [entryInfo, setEntryInfo] = useState({
  name: "",
  phone: "",
  amount: "",
  date: "",
  type: "",
});



  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color="#0B3A53" />
      </View>

      <View style={styles.cardText}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>

      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );

  const currentData =
    activeTab === "debtors" ? DEBTORS_DATA : CREDITORS_DATA;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <Text style={styles.header}>Stocka</Text>

        {/* TABS */}
        <View style={styles.tabs}>
          {["debtors", "creditors"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === "debtors" ? "Debtors" : "Creditors"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TITLE */}
        <Text style={styles.sectionTitle}>
          {activeTab === "debtors" ? "Current Debtors" : "Current Creditors"}
        </Text>

        {/* SEARCH & SORT */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#777"
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
          data={currentData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
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

      </View>

      <Modal
         visible={modalVisible}
          transparent
          animationType="fade"
             onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>

      <Text style={styles.modalTitle}>
        Add {activeTab === "debtors" ? " a new debtor" : " a new creditor"}
      </Text>

      <TextInput
        placeholder="Full name"
        value={formName}
        onChangeText={setFormName}
        style={styles.modalInput}
      />

      <TextInput
        placeholder="Phone number"
        value={formAmount}
        onChangeText={setFormAmount}
        style={styles.modalInput}
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
    <View style={styles.infoModal}>
             
             <TouchableOpacity
               style={styles.closeIcon}
    onPress={() => {
      setInfoModalVisible(false);
      setFormName("");
      setFormAmount("");
    }}
  >
    <Ionicons name="close" size={20} color="#555" />
  </TouchableOpacity>

      <Text style={styles.infoTitle}>
        {activeTab === "debtors" ? "Debtor info" : "Creditor info"}
      </Text>

      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoLabel}>Full name:</Text>
          <Text style={styles.infoValue}>{entryInfo.name}</Text>

          <Text style={styles.infoLabel}>Phone number:</Text>
          <Text style={styles.infoValue}>{entryInfo.phone}</Text>

          <Text style={styles.infoLabel}>Current balance:</Text>
          <Text style={styles.infoValue}>{entryInfo.amount} FRW</Text>

          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{entryInfo.date}</Text>

          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.typeBadge}>{entryInfo.type}</Text>
        </View>

        <View style={styles.avatarBox}>
          <Ionicons name="person" size={40} color="#000" />
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




    </SafeAreaView>
  );
}

const MAIN = "#0B3A53";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  container: { flex: 1, paddingHorizontal: 16 },

  header: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: MAIN,
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
  width: "92%",
  backgroundColor: "#FFFFFF",
  borderRadius: 10,
  padding: 20,
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
});
