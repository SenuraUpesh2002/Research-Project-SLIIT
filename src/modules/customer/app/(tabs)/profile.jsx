import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import Loader from "../../components/Loader";
import styles from "../../assets/styles/profile.styles";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockFavorites = [
  {
    id: "fav-1",
    name: "Lanka IOC – Galle",
    address: "38 Colombo Rd, Galle",
    status: "Available",
    distance: "2.4 km",
    fuel: "Petrol 92",
    queue: "Low",
    lastUpdated: "5 mins ago",
  },
  {
    id: "fav-2",
    name: "CPC – Kottawa",
    address: "High Level Rd, Kottawa",
    status: "Restocking",
    distance: "6.1 km",
    fuel: "Auto Diesel",
    queue: "Medium",
    lastUpdated: "25 mins ago",
  },
];

const mockAlerts = [
  {
    id: "alert-1",
    station: "Lanka IOC – Matara",
    message: "Petrol 92 arriving in 20 minutes",
    time: "Today • 4:10 PM",
    status: "Active",
  },
  {
    id: "alert-2",
    station: "EV Plug Lanka – Boralesgamuwa",
    message: "Fast DC charger available now",
    time: "Today • 3:40 PM",
    status: "Triggered",
  },
];

const mockHistory = [
  {
    id: "history-1",
    name: "EV Plug Lanka – Colombo 07",
    type: "EV Station",
    status: "Visited",
    time: "Yesterday • 6:30 PM",
  },
  {
    id: "history-2",
    name: "CPC – Dematagoda",
    type: "Fuel Station",
    status: "Checked availability",
    time: "Yesterday • 11:20 AM",
  },
];

export default function Profile() {
  const { user } = useAuthStore();
  const [favorites] = useState(mockFavorites);
  const [alerts] = useState(mockAlerts);
  const [history] = useState(mockHistory);
  const [refreshing, setRefreshing] = useState(false);

  if (!user) return <Loader />;

  const vehiclePreferences = [
    { label: "Vehicle Type", value: user.preferences?.vehicleType || "Fuel Vehicle", icon: "car-sport-outline" },
    { label: "Fuel / Charge", value: user.preferences?.fuelType || "Petrol 92", icon: "flame-outline" },
    { label: "Preferred Brand", value: user.preferences?.preferredBrand || "Lanka IOC", icon: "shield-checkmark-outline" },
    { label: "Province", value: user.preferences?.province || "Western", icon: "compass-outline" },
    { label: "Town", value: user.preferences?.town || "Colombo", icon: "location-outline" },
    { label: "Alerts", value: "Enabled", icon: "notifications-outline" },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(800);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} colors={[COLORS.primary]} tintColor={COLORS.primary} onRefresh={handleRefresh} />
      }
    >
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vehicle Preferences</Text>
          <Text style={styles.sectionSubtitle}>Personalize recommendations</Text>
        </View>

        <View style={styles.preferenceGrid}>
          {vehiclePreferences.map((item) => (
            <View key={item.label} style={styles.preferenceCard}>
              <View style={styles.preferenceIcon}>
                <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.preferenceLabel}>{item.label}</Text>
              <Text style={styles.preferenceValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="options-outline" size={18} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Stations</Text>
          <Text style={styles.sectionSubtitle}>{favorites.length} saved for quick access</Text>
        </View>

        {favorites.map((station) => (
          <View key={station.id} style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <View>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.stationAddress}>{station.address}</Text>
              </View>
              <View style={[styles.statusPill, station.status === "Available" ? styles.statusAvailable : styles.statusPending]}>
                <Text style={styles.statusText}>{station.status}</Text>
              </View>
            </View>

            <View style={styles.stationMetaRow}>
              <View style={styles.stationMeta}>
                <Ionicons name="navigate-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.stationMetaText}>{station.distance}</Text>
              </View>
              <View style={styles.stationMeta}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.stationMetaText}>{station.lastUpdated}</Text>
              </View>
              <View style={styles.stationMeta}>
                <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.stationMetaText}>Queue: {station.queue}</Text>
              </View>
            </View>

            <View style={styles.stationMetaRow}>
              <View style={styles.fuelTag}>
                <Ionicons name="flame-outline" size={14} color={COLORS.primary} />
                <Text style={styles.fuelTagText}>{station.fuel}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Set Alert</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="navigate-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          <Text style={styles.sectionSubtitle}>Stay ahead of restocks</Text>
        </View>

        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="notifications" size={18} color={COLORS.primary} />
              <Text style={styles.alertStatus}>{alert.status}</Text>
            </View>
            <Text style={styles.alertStation}>{alert.station}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Create Alert</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionSubtitle}>{history.length} stations checked recently</Text>
        </View>

        {history.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View>
              <Text style={styles.historyName}>{item.name}</Text>
              <Text style={styles.historyType}>{item.type}</Text>
            </View>
            <View>
              <Text style={styles.historyStatus}>{item.status}</Text>
              <Text style={styles.historyTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
