import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ev-form.module.css";
import { API_ENDPOINTS, API_BASE } from "../../../../constants/api";

const CHARGER_TYPES = ["Type 2 (AC)", "CCS (DC)", "CHAdeMO (DC)", "Any Type"];
const POWER_RATINGS = [
  "7kW (Slow)",
  "22kW (Fast)",
  "50kW (Rapid)",
  "150kW+ (Ultra Fast)",
  "Any Rating",
];

export default function EVFormScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chargerType: "",
    powerRating: "",
    latitude: null,
    longitude: null,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState(false);

  const [showDropdowns, setShowDropdowns] = useState({
    chargerType: false,
    powerRating: false,
  });

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  // GPS location logic (copied/adapted from fuel-form.jsx)
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          setFormData((p) => ({ ...p, latitude: lat, longitude: lon }));

          // Use OpenStreetMap reverse geocode for label
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const formatted = data?.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          setLocationLabel(formatted);
          setConfirmedLocation(true); // Automatically confirm location after fetching
        } catch (err) {
          console.error(err);
          setLocationError("Failed to determine address from coordinates.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError(err.message || "Unable to retrieve location.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirmLocation = () => {
    setConfirmedLocation(true);
  };

  const handleSelectAgain = () => {
    setConfirmedLocation(false);
    setLocationLabel("");
    setFormData((prev) => ({ ...prev, latitude: null, longitude: null }));
  };

  const validateForm = () => {
    // Add any required validation for the remaining fields if needed
    return true;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not logged in. Please log in to submit.");
      return;
    }
    // Prepare submission data
    const submissionData = {
      submissionType: "EV_FORM",
      data: {
        chargerType: formData.chargerType,
        powerRating: formData.powerRating,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
    };

    try {
      await fetch(`${API_BASE}${API_ENDPOINTS.SUBMISSIONS.CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });
      // Optionally, show success message or redirect
    } catch (error) {
      console.error("EV form submission error:", error);
    }

    const queryParams = new URLSearchParams({
      type: "ev",
      chargerType: formData.chargerType || "",
      powerRating: formData.powerRating || "",
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    navigate(`/ev-results?${queryParams.toString()}`);
  };

  const handleFindStations = () => {
    if (!validateForm()) return;
    handleSubmit();
  };

  const renderDropdown = (field, options, label) => (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <button
        className={styles.dropdown}
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field]: !prev[field],
          }))
        }
      >
        <span
          className={`${styles.dropdownText} ${
            !formData[field] ? styles.placeholderText : ""
          }`}
        >
          {formData[field] || `Select ${label.toLowerCase()}`}
        </span>
        <span style={{ fontSize: 20, color: "#64748b" }}>
          {showDropdowns[field] ? "⬆️" : "⬇️"}
        </span>
      </button>

      {showDropdowns[field] && (
        <div className={styles.dropdownList}>
          {options.map((option, index) => (
            <button
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleSelect(field, option)}
            >
              <span className={styles.dropdownItemText}>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <span style={{ fontSize: 24, color: "#1e40af" }}>⬅️</span>
        </button>
        <p className={styles.title}>Find EV Charging Station</p>
        <p className={styles.subtitle}>
          Locate the best charging stations for your electric vehicle
        </p>
      </div>

      <div className={styles.form}>
        <div className={styles.infoCard}>
          <span style={{ fontSize: 24, color: "#1e40af" }}>ℹ️</span>
          <p className={styles.infoText}>
            Optional filters help us find the most suitable charging stations for your EV
          </p>
        </div>

        {renderDropdown("chargerType", CHARGER_TYPES, "Charger Type (Optional)")}
        {renderDropdown("powerRating", POWER_RATINGS, "Power Rating (Optional)")}

        <div className={styles.inputContainer}>
          <label className={styles.label}>Select Your Exact Location</label>
          <button
            className={styles.locationButton}
            onClick={handleUseCurrentLocation}
            disabled={loadingLocation || confirmedLocation}
          >
            {loadingLocation
              ? "Locating..."
              : confirmedLocation
              ? "Location Confirmed"
              : "Use My Current Location"}
          </button>
          {locationError && (
            <p className={styles.errorMessage}>{locationError}</p>
          )}
        </div>

        {confirmedLocation && locationLabel && (
          <div className={styles.detectedAddressContainer}>
            <div className={styles.detectedAddressHeader}>
              <span style={{ fontSize: 20, color: "#1e40af" }}>📍</span>
              <p className={styles.detectedAddressTitle}>Detected Address</p>
            </div>
            <p className={styles.detectedAddressText}>{locationLabel}</p>
            <p className={styles.detectedAddressCoords}>
              Coordinates: {formData.latitude?.toFixed(6)} N,{" "}
              {formData.longitude?.toFixed(6)} E
            </p>
            <div className={styles.detectedAddressActions}>
              <button
                className={styles.confirmLocationButton}
                onClick={handleConfirmLocation}
              >
                <span style={{ fontSize: 20, color: "#16a34a" }}>✔️</span>
                Confirm Location
              </button>
              <button
                className={styles.selectAgainButton}
                onClick={handleSelectAgain}
              >
                <span style={{ fontSize: 20, color: "#dc2626" }}>✖️</span>
                Select Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.findButton} ${
            !formData.latitude || !formData.longitude ? styles.buttonDisabled : ""
          }`}
          onClick={handleFindStations}
          disabled={!formData.latitude || !formData.longitude}
        >
          <span style={{ fontSize: 20, color: "#ffffff" }}>⚡</span>
          <span className={styles.findButtonText}>
            Find Charging Station
          </span>
        </button>
      </div>
    </div>
  );
}