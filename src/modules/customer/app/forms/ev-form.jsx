import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SRI_LANKAN_PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

const TOWNS = {
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern Province": ["Galle", "Matara", "Hambantota"],
  "Northern Province": ["Jaffna", "Vavuniya", "Mannar"],
  "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "Uva Province": ["Badulla", "Monaragala"],
  "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
};

const CHARGER_TYPES = ["Type 2 (AC)", "CCS (DC)", "CHAdeMO (DC)", "Any Type"];
const POWER_RATINGS = ["7kW (Slow)", "22kW (Fast)", "50kW (Rapid)", "150kW+ (Ultra Fast)", "Any Rating"];

export default function EVFormScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    chargerType: "",
    powerRating: "",
    province: "",
    town: "",
  });

  const [showDropdowns, setShowDropdowns] = useState({
    chargerType: false,
    powerRating: false,
    province: false,
    town: false,
  });

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "province" ? { town: "" } : {}),
    }));
    setShowDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    if (!formData.province) {
      Alert.alert("Error", "Please select your province");
      return false;
    }
    if (!formData.town) {
      Alert.alert("Error", "Please select your town");
      return false;
    }
    return true;
  };

  const handleFindStations = () => {
    if (!validateForm()) return;

    router.push({
      pathname: "/(tabs)/results",
      params: {
        type: "ev",
        ...formData,
      },
    });
  };

  const renderDropdown = (field, options, label) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field]: !prev[field],
          }))
        }
      >
        <Text style={[styles.dropdownText, !formData[field] && styles.placeholderText]}>
          {formData[field] || `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons name={showDropdowns[field] ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
      </TouchableOpacity>

      {showDropdowns[field] && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelect(field, option)}>
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e40af" />
        </TouchableOpacity>
        <Text style={styles.title}>Find EV Charging Station</Text>
        <Text style={styles.subtitle}>Locate the best charging stations for your electric vehicle</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#1e40af" />
          <Text style={styles.infoText}>
            Optional filters help us find the most suitable charging stations for your EV
          </Text>
        </View>

        {renderDropdown("chargerType", CHARGER_TYPES, "Charger Type (Optional)")}
        {renderDropdown("powerRating", POWER_RATINGS, "Power Rating (Optional)")}
        {renderDropdown("province", SRI_LANKAN_PROVINCES, "Province")}
        {formData.province ? renderDropdown("town", TOWNS[formData.province] || [], "Town") : null}

        <View style={styles.chargerInfo}>
          <Text style={styles.chargerInfoTitle}>Charger Types Available in Sri Lanka:</Text>
          <View style={styles.chargerTypeItem}>
            <Text style={styles.chargerTypeName}>Type 2 (AC)</Text>
            <Text style={styles.chargerTypeDesc}>Most common, suitable for home and public charging</Text>
          </View>
          <View style={styles.chargerTypeItem}>
            <Text style={styles.chargerTypeName}>CCS (DC)</Text>
            <Text style={styles.chargerTypeDesc}>Fast DC charging for compatible vehicles</Text>
          </View>
          <View style={styles.chargerTypeItem}>
            <Text style={styles.chargerTypeName}>CHAdeMO (DC)</Text>
            <Text style={styles.chargerTypeDesc}>DC charging standard for older EVs</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.findButton, !formData.town && styles.buttonDisabled]}
          onPress={handleFindStations}
          disabled={!formData.town}
        >
          <Ionicons name="flash" size={20} color="#ffffff" />
          <Text style={styles.findButtonText}>Find Charging Station</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  form: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#1e40af",
  },
  infoText: {
    fontSize: 14,
    color: "#1e40af",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  placeholderText: {
    color: "#9ca3af",
  },
  dropdownList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
  },
  chargerInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chargerInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  chargerTypeItem: {
    marginBottom: 12,
  },
  chargerTypeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
  },
  chargerTypeDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  footer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  findButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  findButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});

