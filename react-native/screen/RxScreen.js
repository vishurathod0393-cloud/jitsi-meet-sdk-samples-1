// screens/RxScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function RxScreen() {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");

  const tabs = ["Active", "History", "Drafts"];

  const prescriptions = [
    {
      id: "1",
      patientName: "James Carter",
      patientAge: 54,
      patientGender: "M",
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      prescribedDate: "21 Feb 2026",
      status: "active",
      refills: 2,
      doctor: "Dr. Michael Smith",
      avatar: "JC",
      avatarBg: "#FFE8E8",
      avatarColor: "#FF5E5E"
    },
    {
      id: "2",
      patientName: "Emily Johnson",
      patientAge: 32,
      patientGender: "F",
      medication: "Amoxicillin 500mg",
      dosage: "Twice daily for 7 days",
      prescribedDate: "21 Feb 2026",
      status: "active",
      refills: 0,
      doctor: "Dr. Michael Smith",
      avatar: "EJ",
      avatarBg: "#E8F5EE",
      avatarColor: "#10B981"
    },
    {
      id: "3",
      patientName: "Robert Miller",
      patientAge: 68,
      patientGender: "M",
      medication: "Metformin 850mg",
      dosage: "Twice daily with meals",
      prescribedDate: "20 Feb 2026",
      status: "active",
      refills: 3,
      doctor: "Dr. Michael Smith",
      avatar: "RM",
      avatarBg: "#FFF3E0",
      avatarColor: "#E65100"
    },
    {
      id: "4",
      patientName: "Sarah Thompson",
      patientAge: 28,
      patientGender: "F",
      medication: "Prenatal Vitamins",
      dosage: "Once daily",
      prescribedDate: "19 Feb 2026",
      status: "history",
      refills: 0,
      doctor: "Dr. Michael Smith",
      avatar: "ST",
      avatarBg: "#D9EAF5",
      avatarColor: "#3D5A80"
    },
    {
      id: "5",
      patientName: "David Brown",
      patientAge: 71,
      patientGender: "M",
      medication: "Atorvastatin 20mg",
      dosage: "Once daily at night",
      prescribedDate: "18 Feb 2026",
      status: "history",
      refills: 1,
      doctor: "Dr. Michael Smith",
      avatar: "DB",
      avatarBg: "#E3F2FD",
      avatarColor: "#0E2A47"
    },
    {
      id: "6",
      patientName: "Lisa Anderson",
      patientAge: 29,
      patientGender: "F",
      medication: "Ibuprofen 400mg",
      dosage: "As needed for pain",
      prescribedDate: "17 Feb 2026",
      status: "draft",
      refills: 0,
      doctor: "Dr. Michael Smith",
      avatar: "LA",
      avatarBg: "#F3E8FF",
      avatarColor: "#9333EA"
    }
  ];

  const filteredPrescriptions = prescriptions
    .filter(item => {
      if (activeTab === "Active") return item.status === "active";
      if (activeTab === "History") return item.status === "history";
      if (activeTab === "Drafts") return item.status === "draft";
      return true;
    })
    .filter(item =>
      item.patientName.toLowerCase().includes(search.toLowerCase()) ||
      item.medication.toLowerCase().includes(search.toLowerCase())
    );

  const getActiveCount = () => prescriptions.filter(p => p.status === "active").length;
  const getHistoryCount = () => prescriptions.filter(p => p.status === "history").length;
  const getDraftCount = () => prescriptions.filter(p => p.status === "draft").length;

  const renderPrescriptionCard = (item) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
          <Text style={[styles.avatarText, { color: item.avatarColor }]}>
            {item.avatar}
          </Text>
        </View>
        
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {item.patientName} · {item.patientAge}{item.patientGender}
          </Text>
          <Text style={styles.doctorName}>{item.doctor}</Text>
        </View>

        <View style={[
          styles.statusBadge,
          item.status === "active" && styles.activeBadge,
          item.status === "history" && styles.historyBadge,
          item.status === "draft" && styles.draftBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === "active" && styles.activeStatusText,
            item.status === "history" && styles.historyStatusText,
            item.status === "draft" && styles.draftStatusText
          ]}>
            {item.status === "active" ? "● Active" : 
             item.status === "history" ? "✓ History" : "✎ Draft"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.medicationRow}>
          <Icon name="pill" size={16} color="#00A8E8" />
          <Text style={styles.medicationText}>{item.medication}</Text>
        </View>
        
        <View style={styles.dosageRow}>
          <Icon name="clock" size={14} color="#64748B" />
          <Text style={styles.dosageText}>{item.dosage}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={12} color="#94A3B8" />
            <Text style={styles.metaText}>Prescribed: {item.prescribedDate}</Text>
          </View>
          
          {item.refills > 0 && (
            <View style={styles.metaItem}>
              <Icon name="repeat" size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{item.refills} refill{item.refills > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="eye" size={16} color="#00A8E8" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="edit" size={16} color="#00A8E8" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="printer" size={16} color="#00A8E8" />
          <Text style={styles.actionText}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-2" size={16} color="#00A8E8" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerEm}>Prescriptions</Text>
          </Text>
          
          <TouchableOpacity style={styles.newButton}>
            <Icon name="plus" size={18} color="#fff" />
            <Text style={styles.newButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.5)" />
          <TextInput
            placeholder="Search prescriptions..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getActiveCount()}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getHistoryCount()}</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getDraftCount()}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>
      </View>

      {/* Fixed Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Prescriptions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map(item => renderPrescriptionCard(item))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="file-text" size={50} color="#CBD5E1" />
            <Text style={styles.emptyText}>No prescriptions found</Text>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create New Prescription</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Bottom padding */}
        <View style={{ height: 30 }} />
      </ScrollView>
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
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height:200,
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
  },

  headerEm: {
    fontStyle: "italic",
    color: "#00A8E8",
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00A8E8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 5,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    marginLeft: 8,
    padding: 0,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 10,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },

  /* TABS */
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },

  activeTab: {
    backgroundColor: "#00A8E8",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0A1B2A",
  },

  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  /* SCROLL VIEW */
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A1B2A",
    marginBottom: 2,
  },

  doctorName: {
    fontSize: 12,
    color: "#64748B",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  activeBadge: {
    backgroundColor: "#E8F5EE",
  },

  historyBadge: {
    backgroundColor: "#F1F5F9",
  },

  draftBadge: {
    backgroundColor: "#F3E8FF",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  activeStatusText: {
    color: "#10B981",
  },

  historyStatusText: {
    color: "#64748B",
  },

  draftStatusText: {
    color: "#9333EA",
  },

  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginBottom: 12,
  },

  medicationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  medicationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A1B2A",
    marginLeft: 8,
  },

  dosageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  dosageText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontSize: 11,
    color: "#94A3B8",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  actionText: {
    fontSize: 11,
    color: "#00A8E8",
    fontWeight: "500",
  },

  /* EMPTY STATE */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 16,
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: "#00A8E8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
