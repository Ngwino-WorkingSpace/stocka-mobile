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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ProfileScreen({navigation}) {
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
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);


  if (!fontsLoaded) return null;

  return (
    <View>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>Stocka</Text>

      <Text style={styles.title}>Profile info</Text>

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

      <TouchableOpacity style={styles.logoutButton}
         onPress={() => setShowLogoutModal(true)}
       >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>

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
            // 🔥 logout logic here
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
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },

  logo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },

  title: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    marginBottom: 20,
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
