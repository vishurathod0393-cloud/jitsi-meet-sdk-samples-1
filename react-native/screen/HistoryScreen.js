// screens/HistoryScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Today");

  const tabs = ["Today", "Week", "Month", "All"];

  const weeklyData = [
    { day: "Mon", value: 55, display: "55m" },
    { day: "Tue", value: 70, display: "1h 10m" },
    { day: "Wed", value: 38, display: "38m" },
    { day: "Thu", value: 70, display: "1h 10m" },
    { day: "Fri", value: 37, display: "37m" },
    { day: "Sat", value: 4, display: "—" },
    { day: "Sun", value: 4, display: "—" }
  ];

  const historyData = [
    {
      dateLabel: "Today — 21 Feb 2026",
      data: [
        {
          id: "1",
          name: "James Carter · 54M",
          clinic: "St. Mary Clinic",
          severity: "Critical",
          duration: "18m 22s",
          time: "9:52 AM",
          status: "Rx Sent",
          avatar: "JC",
          avatarBg: "#FFE8E8",
          avatarColor: "#FF5E5E",
          severityIcon: "🔴",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        },
        {
          id: "2",
          name: "Emily Johnson · 32F",
          clinic: "St. Mary Clinic",
          severity: "Normal",
          duration: "9m 04s",
          time: "8:41 AM",
          status: "Rx Sent",
          avatar: "EJ",
          avatarBg: "#E8F5EE",
          avatarColor: "#10B981",
          severityIcon: "🟡",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        },
        {
          id: "3",
          name: "Robert Miller · 68M",
          clinic: "Riverside Clinic",
          severity: "Urgent",
          duration: "31m 10s",
          time: "3:15 PM",
          status: "Rx Sent",
          avatar: "RM",
          avatarBg: "#FFF3E0",
          avatarColor: "#E65100",
          severityIcon: "🟠",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        }
      ]
    },
    {
      dateLabel: "Yesterday — 20 Feb 2026",
      data: [
        {
          id: "4",
          name: "Sarah Thompson · 28F",
          clinic: "Riverside Clinic",
          severity: "Routine",
          duration: "Declined",
          time: "11:02 AM",
          status: "Declined",
          avatar: "ST",
          avatarBg: "#D9EAF5",
          avatarColor: "#3D5A80",
          severityIcon: "🟢",
          statusBg: "#FFE8E8",
          statusColor: "#FF5E5E"
        },
        {
          id: "5",
          name: "David Brown · 71M",
          clinic: "Valley Medical",
          severity: "Normal",
          duration: "8m 15s",
          time: "9:30 AM",
          status: "Rx Sent",
          avatar: "DB",
          avatarBg: "#E3F2FD",
          avatarColor: "#0E2A47",
          severityIcon: "🟡",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        },
        {
          id: "6",
          name: "Lisa Anderson · 29F",
          clinic: "Apollo Health",
          severity: "Routine",
          duration: "14m 30s",
          time: "2:45 PM",
          status: "Rx Sent",
          avatar: "LA",
          avatarBg: "#E8F5EE",
          avatarColor: "#10B981",
          severityIcon: "🟢",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        }
      ]
    },
    {
      dateLabel: "19 Feb 2026",
      data: [
        {
          id: "7",
          name: "Thomas Wilson · 62M",
          clinic: "St. Mary Clinic",
          severity: "Critical",
          duration: "11m 20s",
          time: "10:15 AM",
          status: "Rx Sent",
          avatar: "TW",
          avatarBg: "#FFE8E8",
          avatarColor: "#FF5E5E",
          severityIcon: "🔴",
          statusBg: "#E8F5EE",
          statusColor: "#2E7D52"
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header Section - No Scroll */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <Text style={styles.brand}>
            Tia<Text style={{ fontStyle: "italic", color: "#00A8E8" }}>Tele</Text>
            <Text style={styles.historyLabel}> · History</Text>
          </Text>

          <TouchableOpacity
            style={styles.monthPill}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.monthText}>
              {selectedDate.toLocaleString("default", {
                month: "short",
                year: "numeric"
              })} ▾
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#4DD9FF" }]}>63</Text>
            <Text style={styles.statLabel}>Total Calls</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>26h 14m</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#F59E0B" }]}>25m</Text>
            <Text style={styles.statLabel}>Avg. Call</Text>
          </View>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Fixed Chart Section - No Scroll */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <Text style={styles.chartTitle}>This Week</Text>
          <Text style={styles.chartSub}>Total: 5h 42m</Text>
        </View>

        <View style={styles.barChart}>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.barCol}>
              <Text style={styles.barValue}>
                {item.display}
              </Text>

              <View
                style={[
                  styles.bar,
                  {
                    height: item.value,
                    backgroundColor: item.value > 4 ? "#00A8E8" : "#E2E8F0",
                    opacity: item.value > 4 ? 0.85 : 1
                  }
                ]}
              />

              <Text style={styles.barDay}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Fixed Tabs - No Scroll */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable History Cards Section */}
      <ScrollView 
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {historyData.map((section, index) => (
          <View key={index}>
            <Text style={styles.dateHeader}>{section.dateLabel}</Text>

            {section.data.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
                  <Text style={[styles.avatarText, { color: item.avatarColor }]}>
                    {item.avatar}
                  </Text>
                </View>

                {/* Patient Info */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.clinic}>{item.clinic}</Text>

                  <View style={styles.rowBetween}>
                    <Text style={[
                      styles.severity,
                      item.severity === "Critical" && styles.criticalText,
                      item.severity === "Urgent" && styles.urgentText,
                      item.severity === "Normal" && styles.normalText,
                      item.severity === "Routine" && styles.routineText,
                    ]}>
                      {item.severityIcon} {item.severity}
                    </Text>
                    <Text style={[
                      styles.duration,
                      item.duration === "Declined" && styles.declinedDuration
                    ]}>
                      {item.duration}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.time}>{item.time}</Text>
                    <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                      <Text style={[styles.statusText, { color: item.statusColor }]}>
                        {item.status === "Rx Sent" ? "✓" : "✕"} {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
        
        {/* Extra bottom padding for scroll */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F7FA" 
  },

  banner: {
    backgroundColor: "#0A1B2A",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 200,
  },

  bannerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  brand: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "bold" 
  },
  
  historyLabel: { 
    fontSize: 14, 
    opacity: 0.6, 
    color: "#fff",
    fontWeight: "500"
  },

  monthPill: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20
  },

  monthText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 12
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,

  },

  statBox: { 
    alignItems: "center", 
    flex: 1 
  },

  statValue: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff",
    marginBottom: 4
  },
  
  statLabel: { 
    fontSize: 12, 
    color: "#94A3B8" 
  },

  /* CHART */
  chartCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  chartTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  chartTitle: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#0A1B2A"
  },
  
  chartSub: { 
    color: "#64748B",
    fontSize: 12
  },

  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },

  barCol: { 
    alignItems: "center", 
    flex: 1 
  },

  barValue: { 
    fontSize: 10, 
    marginBottom: 4,
    color: "#64748B",
    fontWeight: "500"
  },

  bar: { 
    width: 20, 
    borderRadius: 6,
  },

  barDay: { 
    marginTop: 6, 
    fontSize: 11, 
    color: "#64748B",
    fontWeight: "500"
  },

  /* TABS */
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 10
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#F1F5F9"
  },

  activeTab: { 
    backgroundColor: "#00A8E8" 
  },

  tabText: { 
    color: "#0A1B2A", 
    fontWeight: "500",
    fontSize: 13
  },

  activeTabText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },

  /* Scroll View */
  scrollView: {
    flex: 1,
    marginTop: 5,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* HISTORY CARD */
  dateHeader: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
    color: "#0A1B2A",
    fontSize: 14
  },

  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 15,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },

  avatarText: {
    fontWeight: "bold",
    fontSize: 16,
  },

  patientName: { 
    fontWeight: "600", 
    fontSize: 15,
    color: "#0A1B2A",
    marginBottom: 2
  },
  
  clinic: { 
    fontSize: 12, 
    color: "#64748B", 
    marginBottom: 6 
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4
  },

  severity: { 
    fontSize: 12, 
    fontWeight: "500"
  },
  
  criticalText: { color: "#FF5E5E" },
  urgentText: { color: "#E65100" },
  normalText: { color: "#F59E0B" },
  routineText: { color: "#10B981" },
  
  duration: { 
    fontSize: 12, 
    fontWeight: "600",
    color: "#0A1B2A"
  },
  
  declinedDuration: {
    color: "#FF5E5E"
  },
  
  time: { 
    fontSize: 11, 
    color: "#94A3B8" 
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600"
  }
});
