// screens/DoctorDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const DoctorDashboard = () => {
  const navigation = useNavigation();
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [callType, setCallType] = useState(null); // 'outgoing' or 'incoming'

  // Generate unique room name for Jitsi
  const generateRoomName = (patientName) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const cleanName = patientName.replace(/\s+/g, '').toLowerCase();
    return `TiaTele_${cleanName}_${timestamp}_${randomNum}`;
  };

  // Request permissions
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
            "Camera and microphone permissions are needed for video calls. Please grant them in settings.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Settings", 
                onPress: () => {
                  if (Platform.OS === 'android') {
                    Alert.alert("Please enable permissions in App Settings");
                  }
                }
              },
            ]
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn("Permission error:", err);
        Alert.alert("Error", "Failed to request permissions");
        return false;
      }
    }
    // iOS permissions are handled in Info.plist
    return true;
  };

  // Start outgoing call to a patient
  const startOutgoingCall = async (patient) => {
    try {
      setLoading(true);
      setCallType('outgoing');

      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setLoading(false);
        setCallType(null);
        return;
      }

      const roomName = generateRoomName(patient.name);
      
      // Navigate to outgoing call screen
      navigation.navigate("OutgoingCallScreen", {
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        clinic: patient.clinic,
        nurseName: patient.nurse || "Sarah",
        roomName: roomName,
        callType: 'outgoing'
      });

    } catch (error) {
      console.error("Error starting outgoing call:", error);
      Alert.alert("Error", "Failed to start video call");
    } finally {
      setLoading(false);
      setCallType(null);
    }
  };

  // Accept incoming call
  const acceptIncomingCall = async () => {
    try {
      setLoading(true);
      setCallType('incoming');

      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setLoading(false);
        setCallType(null);
        return;
      }

      const roomName = generateRoomName(incomingCall.name);
      
      // Navigate to outgoing call screen (same screen, different mode)
      navigation.navigate("OutgoingCallScreen", {
        patientName: incomingCall.name,
        patientAge: incomingCall.age,
        patientGender: "M",
        clinic: incomingCall.hospital,
        nurseName: "Sarah",
        roomName: roomName,
        callType: 'incoming',
        isIncoming: true
      });

    } catch (error) {
      console.error("Error accepting call:", error);
      Alert.alert("Error", "Failed to accept call");
    } finally {
      setLoading(false);
      setCallType(null);
    }
  };

  // Decline incoming call
  const declineIncomingCall = () => {
    Alert.alert(
      "Decline Call",
      "Are you sure you want to decline this call?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Call Declined", "Incoming call has been declined");
          }
        }
      ]
    );
  };

  // View patient notes
  const viewPatientNotes = (patient) => {
    Alert.alert(
      "Patient Notes",
      `Previous consultation notes for ${patient.name}\n\n` +
      `Diagnosis: ${patient.issue}\n` +
      `Prescription: ${patient.prescription}\n` +
      `Duration: ${patient.duration}\n` +
      `Time: ${patient.time}`,
      [{ text: "OK" }]
    );
  };

  const incomingCall = {
    name: "James Carter",
    age: 54,
    condition: "Critical",
    issue: "Chest pain",
    bp: "158/94",
    spo2: "97%",
    hospital: "St. Mary Clinic",
    waiting: "4 min",
    nurse: "Sarah"
  };

  const completedToday = [
    {
      id: "1",
      name: "Emily Johnson",
      age: 32,
      gender: "F",
      issue: "Fever",
      prescription: "Prescribed",
      time: "9:20 AM",
      duration: "18 min",
      avatar: "EJ"
    },
    {
      id: "2",
      name: "Robert Fox",
      age: 45,
      gender: "M",
      issue: "Headache",
      prescription: "Prescribed",
      time: "10:45 AM",
      duration: "22 min",
      avatar: "RF"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0A1B2A" barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Doctor Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarRow}>
            <Text style={styles.brand}>
              Tia<Text style={styles.brandEm}>Tele</Text>
            </Text>
            <TouchableOpacity 
              style={styles.notifBtn}
              onPress={() => Alert.alert("Notifications", "No new notifications")}
            >
              <Icon name="bell" size={20} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.doctorName}>Dr. Michael Smith</Text>
          
          {/* Availability Toggle */}
          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityText}>
              <Text style={styles.availabilityTitle}>
                <Text style={styles.bold}>Available for Video Calls</Text>
              </Text>
              <Text style={styles.availabilitySubtitle}>
                Cardiologist · Apollo Health
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#767577", true: "#00A8E8" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Quick Action - Call a Patient */}
        <LinearGradient
          colors={['#E0F4FF', '#EEF9FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quickActionCard}
        >
          <View style={styles.quickActionIcon}>
            <Icon name="video" size={22} color="#fff" />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Call a Patient</Text>
            <Text style={styles.quickActionDesc}>
              Initiate a video call to your patients
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => startOutgoingCall({
              name: "Emily Johnson",
              age: 32,
              gender: "F",
              clinic: "St. Mary Clinic",
              nurse: "Sarah"
            })}
            disabled={loading}
          >
            {loading && callType === 'outgoing' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.quickActionBtnText}>Go →</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* Queue Section */}
        <View style={styles.queueSection}>
          <Text style={styles.sectionTitle}>📹 Incoming Call</Text>
          
          {/* Incoming Call Card */}
          <View style={[styles.callCard, styles.incomingCall]}>
            <View style={styles.avatarWrapper}>
              <View style={styles.pulseRing} />
              <View style={[styles.avatar, styles.criticalAvatar]}>
                <Text style={styles.avatarText}>JC</Text>
              </View>
            </View>
            
            <View style={styles.callInfo}>
              <Text style={styles.patientName}>
                {incomingCall.name} · {incomingCall.age}M
              </Text>
              <Text style={styles.patientDetail}>
                🔴 {incomingCall.condition} · {incomingCall.issue}{'\n'}
                BP {incomingCall.bp} · SpO₂ {incomingCall.spo2}{'\n'}
                📍 {incomingCall.hospital}
              </Text>
              <Text style={styles.waitTime}>Waiting {incomingCall.waiting}</Text>
            </View>
            
            <View style={styles.callActions}>
              <TouchableOpacity 
                style={styles.acceptBtn}
                onPress={acceptIncomingCall}
                disabled={loading}
              >
                {loading && callType === 'incoming' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.acceptBtnText}>📹 Accept</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineBtn}
                onPress={declineIncomingCall}
                disabled={loading}
              >
                <Text style={styles.declineBtnText}>✕ Decline</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>✅ Completed Today</Text>
          
          {/* Completed Call Cards */}
          {completedToday.map((item) => (
            <View key={item.id} style={styles.callCard}>
              <View style={[styles.avatar, styles.completedAvatar]}>
                <Text style={[styles.avatarText, styles.completedAvatarText]}>
                  {item.avatar}
                </Text>
              </View>
              
              <View style={styles.callInfo}>
                <Text style={styles.patientName}>
                  {item.name} · {item.age}{item.gender}
                </Text>
                <Text style={styles.patientDetail}>
                  {item.issue} · {item.prescription} · {item.time}
                </Text>
                <Text style={styles.waitTime}>Duration {item.duration}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.notesBtn}
                onPress={() => viewPatientNotes(item)}
              >
                <Icon name="file-text" size={18} color="#00A8E8" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Call History Summary */}
          <TouchableOpacity 
            style={styles.historySummary}
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.historySummaryLeft}>
              <Icon name="clock" size={16} color="#00A8E8" />
              <Text style={styles.historySummaryText}>View all call history</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation is handled by Tab Navigator */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topBar: {
    backgroundColor: '#0A1B2A',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  brandEm: {
    color: '#00A8E8',
  },
  notifBtn: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5E5E',
    borderWidth: 1,
    borderColor: '#0A1B2A',
  },
  greeting: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  availabilityText: {
    flex: 1,
  },
  availabilityTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  availabilitySubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,168,232,0.25)',
    backgroundColor: '#FFFFFF',
  },
  quickActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#00A8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A1B2A',
  },
  quickActionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  quickActionBtn: {
    backgroundColor: '#00A8E8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  quickActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  queueSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1B2A',
    marginBottom: 12,
    marginTop: 8,
  },
  callCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  incomingCall: {
    borderWidth: 1,
    borderColor: '#FF5E5E',
    backgroundColor: '#FFF5F5',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,94,94,0.3)',
    top: -4,
    left: -4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  criticalAvatar: {
    backgroundColor: '#FFE8E8',
  },
  completedAvatar: {
    backgroundColor: '#E8F5EE',
    marginRight: 12,
  },
  completedAvatarText: {
    color: '#10B981',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF5E5E',
  },
  callInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A1B2A',
    marginBottom: 2,
  },
  patientDetail: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  waitTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  callActions: {
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  acceptBtn: {
    backgroundColor: '#00A8E8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  declineBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  declineBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  notesBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    alignSelf: 'center',
  },
  historySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historySummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historySummaryText: {
    fontSize: 13,
    color: '#0A1B2A',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default DoctorDashboard;
