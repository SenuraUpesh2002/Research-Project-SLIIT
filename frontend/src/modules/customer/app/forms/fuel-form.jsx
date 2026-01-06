import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./fuel-form.module.css";
import { API_ENDPOINTS, API_BASE, GEOAPIFY_API_KEY } from "../../../../constants/api";

/* ===============================
   CONSTANTS
================================ */

const VEHICLE_TYPES = ["Car", "Van", "Bus", "Truck", "Motorcycle", "Three Wheeler"];
const FUEL_TYPES = [
  "Petrol (Octane 92)", "Petrol (Octane 95) / Super Petrol", "Diesel",
  "Auto Diesel", "Lubricants", "Kerosene", "Any Fuel Type"
];
const BRANDS_DISPLAY = [
  { id: "IOC", name: "IOC" },
  { id: "CPC", name: "CPC" },
  { id: "Shell", name: "Shell" },
];

export default function FuelFormScreen() {
  const navigate = useNavigate();

  /* ===============================
     FORM STATE
  ================================ */
  const [formData, setFormData] = useState({
    vehicleType: "",
    fuelType: "",
    preferredBrand: "",
    latitude: null,
    longitude: null,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState(false);

  /* ===============================
     DROPDOWNS
  ================================ */
  const [showDropdowns, setShowDropdowns] = useState({
    vehicleType: false,
    fuelType: false,
  });

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  const handleBrandSelect = (brandId) => {
    setFormData((prev) => ({
      ...prev,
      preferredBrand: brandId,
    }));
  };

  /* ===============================
     FIND BEST STATION
  ================================ */
  const handleContinueToRecommendations = async () => {
    // Prepare submission data
    const submissionData = {
      submissionType: "FUEL_FORM",
      data: {
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        preferredBrand: formData.preferredBrand,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
    };

    try {
      // Send to backend
      await fetch(`${API_BASE}${API_ENDPOINTS.SUBMISSIONS.CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(submissionData),
      });
      // Optionally, show success message or redirect
    } catch (error) {
      console.error("Failed to submit fuel form:", error);
    }

    // Existing navigation logic
    const queryParams = new URLSearchParams({
      type: "fuel",
      preferredBrand: formData.preferredBrand || "",
      vehicleType: formData.vehicleType || "",
      fuelType: formData.fuelType || "",
    });
    navigate(`/fuel-results?${queryParams.toString()}`);
  };

  /* ===============================
     USE BROWSER GPS + GEOAPIFY REVERSE GEOCODE
  ================================ */
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    setLocationError("");
    setConfirmedLocation(false); // Reset confirmation on new location attempt

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          setFormData((p) => ({ ...p, latitude: lat, longitude: lon }));

          // reverse geocode via Geoapify to get readable label
          if (GEOAPIFY_API_KEY && GEOAPIFY_API_KEY !== "REPLACE_WITH_YOUR_KEY") {
            const res = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`
            );
            const data = await res.json();
            const formatted = data?.features?.[0]?.properties?.formatted || data?.features?.[0]?.properties?.display_name || "";
            setLocationLabel(formatted || `${lat.toFixed(6)}, ${lon.toFixed(6)}`);
          } else {
            setLocationError("Geoapify key not set. Add VITE_GEOAPIFY_KEY to .env.");
          }
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
    setFormData((p) => ({ ...p, latitude: null, longitude: null }));
    setLocationLabel("");
    setLocationError("");
    setConfirmedLocation(false);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const renderDropdown = (field, options, label) => (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <button
        className={styles.dropdown}
        onClick={() => setShowDropdowns((p) => ({ ...p, [field]: !p[field] }))}
      >
        <span className={styles.dropdownText}>
          {formData[field] || `Select ${label}`}
        </span>
      </button>
      {showDropdowns[field] && (
        <div className={styles.dropdownList}>
          {options.map((o) => (
            <button key={o} className={styles.dropdownItem} onClick={() => handleSelect(field, o)}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Fuel Station Request</h1>
      <p className={styles.subHeader}>Fill in your requirements to find the best match</p>

      <div className={styles.formGrid}>
        {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
        {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Preferred Brand</label>
        <div className={styles.brandSelection}>
          {BRANDS_DISPLAY.map((brand) => (
            <button
              key={brand.id}
              className={`${styles.brandButton} ${formData.preferredBrand === brand.id ? styles.selected : ""}`}
              onClick={() => handleBrandSelect(brand.id)}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Select Your Exact Location</label>
        <div className={styles.mapPlaceholder}>
          <img src="/icons/map-pin.png" alt="Map Pin" className={styles.mapPinIcon} />
          <p>Click on the map to select your location</p>
          <button
            className={styles.findButton}
            onClick={handleUseCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? "Locating..." : "Use my current location"}
          </button>
          {locationError && <p className={styles.errorText}>{locationError}</p>}
        </div>
      </div>

      {locationLabel && (
        <div className={styles.detectedAddress}>
          <img src="/icons/location-pin.png" alt="Location Pin" className={styles.locationPinIcon} />
          <div>
            <p className={styles.addressLabel}>Detected Address</p>
            <p className={styles.addressText}>{locationLabel}</p>
            {formData.latitude && formData.longitude && (
              <p className={styles.coordinatesText}>
                Coordinates: {formData.latitude.toFixed(4)}° N, {formData.longitude.toFixed(4)}° E
              </p>
            )}
          </div>
          <div className={styles.locationActions}>
            <button
              className={styles.confirmLocationButton}
              onClick={handleConfirmLocation}
              disabled={confirmedLocation}
            >
              Confirm Location
            </button>
            <button
              className={styles.selectAgainButton}
              onClick={handleSelectAgain}
            >
              Select Again
            </button>
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button
          className={styles.continueButton}
          onClick={handleContinueToRecommendations}
          disabled={!confirmedLocation || !formData.vehicleType || !formData.fuelType || !formData.preferredBrand}
        >
          Continue to Recommendations →
        </button>
      </div>
    </div>
  );
}
