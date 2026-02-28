// screens/CartScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList
} from "react-native";

const CartScreen = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const carts = [
    // Online carts
    {
      id: "1",
      name: "Cart A · Room 101",
      location: "St. Mary Clinic · Bed 3",
      status: "Online",
      meta: "HD · Pan/Tilt/Zoom",
      icon: "🤖",
      section: "online"
    },
    {
      id: "2",
      name: "Cart B · Room 102",
      location: "St. Mary Clinic · Bed 7",
      status: "Online",
      meta: "HD · Pan/Tilt/Zoom",
      icon: "🤖",
      section: "online"
    },
    {
      id: "3",
      name: "Cart C · Wing B",
      location: "Riverside Clinic · Bed 2",
      status: "Online",
      meta: "SD · Pan/Tilt",
      icon: "🤖",
      section: "online"
    },
    // Busy carts
    {
      id: "4",
      name: "Cart D · Room 104",
      location: "Valley Hospital · Bed 1",
      status: "Busy",
      meta: "Dr. Patel using now",
      icon: "🤖",
      section: "busy"
    },
    // Offline carts
    {
      id: "5",
      name: "Cart E · Emergency",
      location: "Sunset Medical · ER Bay",
      status: "Offline",
      meta: "Last seen 2h ago",
      icon: "🤖",
      section: "offline"
    }
  ];

  // Filter carts based on active tab
  const filterByTab = () => {
    if (activeTab === "All") {
      return carts;
    }
    return carts.filter(item => item.status === activeTab);
  };

  const filteredCarts = filterByTab().filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  // Group carts by section for display
  const getOnlineCarts = () => filteredCarts.filter(c => c.status === "Online");
  const getBusyCarts = () => filteredCarts.filter(c => c.status === "Busy");
  const getOfflineCarts = () => filteredCarts.filter(c => c.status === "Offline");

  const onlineCount = carts.filter(c => c.status === "Online").length;
  const busyCount = carts.filter(c => c.status === "Busy").length;
  const offlineCount = carts.filter(c => c.status === "Offline").length;

  const renderCartCard = (item) => (
    <View
      key={item.id}
      style={[
        styles.card,
        item.status === "Online" && styles.onlineCard,
        item.status === "Busy" && styles.busyCard,
        item.status === "Offline" && styles.offlineCard,
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[
          styles.cartIcon,
          item.status === "Online" && styles.onlineIcon,
          item.status === "Busy" && styles.busyIcon,
          item.status === "Offline" && styles.offlineIcon,
        ]}>
          <Text style={styles.iconText}>🤖</Text>
        </View>

        <View style={styles.cartInfo}>
          <Text style={styles.cartName}>{item.name}</Text>
          <Text style={styles.cartLocation}>{item.location}</Text>

          <View style={styles.statusRow}>
            <View style={[
              styles.statusPill,
              item.status === "Online" && styles.onlinePill,
              item.status === "Busy" && styles.busyPill,
              item.status === "Offline" && styles.offlinePill,
            ]}>
              <Text style={[
                styles.statusPillText,
                item.status === "Online" && styles.onlinePillText,
                item.status === "Busy" && styles.busyPillText,
                item.status === "Offline" && styles.offlinePillText,
              ]}>
                ● {item.status}
              </Text>
            </View>
            <Text style={styles.metaText}>{item.meta}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        disabled={item.status !== "Online"}
        style={[
          styles.connectBtn,
          item.status !== "Online" && styles.disabledBtn,
        ]}
      >
        <Text style={[
          styles.connectText,
          item.status !== "Online" && styles.disabledBtnText
        ]}>
          {item.status === "Online" ? "📡 Connect" : item.status}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header - No Scroll */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerEm}>Carts</Text>
          </Text>
          <Text style={styles.headerSub}>
            {onlineCount} Online · {busyCount} Busy
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search cart or room…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Fixed Tabs - No Scroll */}
      <View style={styles.tabContainer}>
        {["All", "Online", "Busy", "Offline"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Carts List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Available Now Section */}
        {getOnlineCarts().length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Available Now</Text>
            {getOnlineCarts().map(item => renderCartCard(item))}
          </>
        )}

        {/* In Use Section */}
        {getBusyCarts().length > 0 && (
          <>
            <Text style={[styles.sectionHeader, styles.sectionHeaderMargin]}>In Use</Text>
            {getBusyCarts().map(item => renderCartCard(item))}
          </>
        )}

        {/* Offline Section */}
        {getOfflineCarts().length > 0 && (
          <>
            <Text style={[styles.sectionHeader, styles.sectionHeaderMargin]}>Offline</Text>
            {getOfflineCarts().map(item => renderCartCard(item))}
          </>
        )}

        {/* Empty State */}
        {filteredCarts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No carts found</Text>
          </View>
        )}

        {/* Bottom padding for scroll */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  /* HEADER - Fixed */
  header: {
    backgroundColor: "#0A1B2A",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
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
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 25,
  },

  headerEm: {
    fontStyle: "italic",
    color: "#00A8E8",
  },

  headerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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

  /* TABS - Fixed */
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
    paddingHorizontal: 16,
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
    paddingTop: 8,
    paddingBottom: 20,
  },

  /* SECTION HEADERS */
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },

  sectionHeaderMargin: {
    marginTop: 12,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  onlineCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },

  busyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },

  offlineCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },

  cardRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  cartIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  onlineIcon: {
    backgroundColor: "#E8F5EE",
  },

  busyIcon: {
    backgroundColor: "#FFF3E0",
  },

  offlineIcon: {
    backgroundColor: "#FFE8E8",
  },

  iconText: {
    fontSize: 24,
  },

  cartInfo: {
    flex: 1,
  },

  cartName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A1B2A",
    marginBottom: 2,
  },

  cartLocation: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },

  onlinePill: {
    backgroundColor: "#E8F5EE",
  },

  busyPill: {
    backgroundColor: "#FFF3E0",
  },

  offlinePill: {
    backgroundColor: "#FFE8E8",
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  onlinePillText: {
    color: "#10B981",
  },

  busyPillText: {
    color: "#F59E0B",
  },

  offlinePillText: {
    color: "#EF4444",
  },

  metaText: {
    fontSize: 11,
    color: "#94A3B8",
  },

  connectBtn: {
    backgroundColor: "#00A8E8",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "#F1F5F9",
  },

  connectText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },

  disabledBtnText: {
    color: "#94A3B8",
  },

  /* EMPTY STATE */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
});

export default CartScreen;
