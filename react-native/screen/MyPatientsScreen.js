// screens/MyPatientsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const patientsData = [
  {
    id: "1",
    name: "James Carter",
    age: "54",
    gender: "M",
    clinic: "St. Mary Clinic",
    problem: "Hypertensive Crisis",
    lastCall: "21 Feb · 18m 22s",
    type: "followup",
    severity: "critical",
    avatar: "JC",
    avatarBg: "#FFE8E8",
    avatarColor: "#FF5E5E"
  },
  {
    id: "2",
    name: "Emily Johnson",
    age: "32",
    gender: "F",
    clinic: "St. Mary Clinic",
    problem: "Fever",
    lastCall: "21 Feb · 9m 04s",
    type: "followup",
    severity: "medium",
    avatar: "EJ",
    avatarBg: "#E8F5EE",
    avatarColor: "#10B981"
  },
  {
    id: "3",
    name: "Robert Miller",
    age: "68",
    gender: "M",
    clinic: "Riverside Clinic",
    problem: "Diabetes",
    lastCall: "Referred · 20 Feb · Not yet called",
    type: "new-ref",
    severity: "medium",
    avatar: "RM",
    avatarBg: "#FFF3E0",
    avatarColor: "#E65100"
  },
  {
    id: "4",
    name: "Sarah Thompson",
    age: "28",
    gender: "F",
    clinic: "Valley Hospital",
    problem: "Prenatal",
    lastCall: "Referred · 19 Feb · Not yet called",
    type: "new-ref",
    severity: "low",
    avatar: "ST",
    avatarBg: "#D9EAF5",
    avatarColor: "#3D5A80"
  }
];

export default function MyPatientsScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [callingPatient, setCallingPatient] = useState(null);

  // Generate unique room name for Jitsi
  const generateRoomName = (patientName, patientId) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const cleanName = patientName.replace(/\s+/g, '').toLowerCase();
    return `TiaTele_${cleanName}_${patientId}_${timestamp}`;
  };

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const cameraGranted = 
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
        const micGranted = 
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

        if (!cameraGranted || !micGranted) {
          Alert.alert(
            "Permissions Required",
            "Camera and microphone permissions are needed for video calls.",
            [{ text: "OK" }]
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true;
  };

  // Handle video call initiation with Jitsi
  const handleVideoCall = async (patient) => {
    try {
      setLoading(true);
      setCallingPatient(patient.id);

      const hasPermissions = await requestPermissions();
      
      if (!hasPermissions) {
        setLoading(false);
        setCallingPatient(null);
        return;
      }

      const roomName = generateRoomName(patient.name, patient.id);
      
      navigation.navigate("DirectCallScreen", {
        roomName: roomName,
        patientName: patient.name,
        doctorName: "Dr. Michael Smith",
        patientId: patient.id,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientProblem: patient.problem
      });

    } catch (error) {
      console.error("Error starting video call:", error);
      Alert.alert("Error", "Failed to start video call. Please try again.");
    } finally {
      setLoading(false);
      setCallingPatient(null);
    }
  };

  // Show call confirmation
  const confirmCall = (patient) => {
    Alert.alert(
      "Start Video Call",
      `Call ${patient.name} now?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Call Now", 
          onPress: () => handleVideoCall(patient),
          style: "default"
        }
      ]
    );
  };

  // Get problem emoji
  const getProblemEmoji = (problem) => {
    const emojiMap = {
      "Hypertensive Crisis": "🔴",
      "Fever": "🟡",
      "Diabetes": "🟠",
      "Prenatal": "🟢",
    };
    return emojiMap[problem] || "⚪";
  };

  // Filter patients based on search
  const filteredPatients = patientsData.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.clinic.toLowerCase().includes(searchLower) ||
      item.problem.toLowerCase().includes(searchLower)
    );
  });

  // Render patient card
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.type === "followup" && styles.followUpCard,
        item.type === "new-ref" && styles.newRefCard
      ]}
    >
      <View style={styles.row}>
        {/* Avatar */}
        <View 
          style={[
            styles.avatar,
            { backgroundColor: item.avatarBg }
          ]}
        >
          <Text style={[styles.avatarText, { color: item.avatarColor }]}>
            {item.avatar}
          </Text>
        </View>

        {/* Patient Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.patientName}>
            {item.name} · {item.age}{item.gender}
          </Text>
          
          <Text style={styles.patientSub}>
            {item.clinic} · {getProblemEmoji(item.problem)} {item.problem}
          </Text>
          
          <Text style={styles.lastCall}>
            {item.lastCall}
          </Text>
        </View>

        {/* Call Button */}
        <TouchableOpacity
          style={[
            styles.callButton,
            (loading && callingPatient === item.id) && styles.disabledButton
          ]}
          onPress={() => confirmCall(item)}
          disabled={loading && callingPatient === item.id}
        >
          {loading && callingPatient === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.callButtonText}>📹 Call</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0A1B2A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            My <Text style={styles.headerEm}>Patients</Text>
          </Text>

          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => Alert.alert("Settings", "Settings coming soon!")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search by name, ID, hospital…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  /* HEADER */
  header: {
    backgroundColor: "#0A1B2A",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 200,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 25,
  },

  headerEm: {
    fontStyle: "italic",
    color: "#00A8E8",
  },

  settingsButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  settingsIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 15,
  },

  searchIcon: {
    fontSize: 16,
    color: "rgba(255,255,255,0.35)",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    padding: 0,
  },

  /* LIST */
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  followUpCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#00A8E8",
  },

  newRefCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  infoContainer: {
    flex: 1,
  },

  patientName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A1B2A",
    marginBottom: 2,
  },

  patientSub: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },

  lastCall: {
    fontSize: 11,
    color: "#94A3B8",
  },

  callButton: {
    backgroundColor: "#00A8E8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  callButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  disabledButton: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
  },
});
