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
const BRANDS = [
  "Ceylon Petroleum Corporation (CPC)", "Ceylon Petroleum Storage Terminal Ltd (CPSTL)",
  "Indian Oil Corporation (IOC)", "Lanka IOC", "Shell", "Sinopec (China Petroleum)", "Any Brand"
];

export default function FuelFormScreen() {
  const navigate = useNavigate();

  /* ===============================
     FORM STATE
  ================================ */
  const [formData, setFormData] = useState({
    vehicleType: "", fuelType: "", preferredBrand: "",
    stationId: "",
    latitude: null, longitude: null,
  });

  const [, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [locationLabel, setLocationLabel] = useState("");

  /* ===============================
     DROPDOWNS
  ================================ */
  const [showDropdowns, setShowDropdowns] = useState({
    vehicleType: false, fuelType: false, preferredBrand: false,
  });

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "province" ? { town: "" } : {}),
    }));
    setShowDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  /* ===============================
     MAP CENTER UPDATE
  ================================ */
  // No map/province sync when using GPS-only flow

  /* ===============================
     FIND BEST STATION
     - Directly render result page
  ================================ */
  const handleFindStations = async () => {
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

  /* ===============================
     LOAD STATIONS (ONCE)
  ================================ */
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoadingStations(true);
        const res = await fetch(`${API_BASE}${API_ENDPOINTS.STATIONS.GET_ALL}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await res.json();
        setStations(data || []);
        if (data?.length) {
          setFormData((p) => {
            if (p.stationId) return p;
            return { ...p, stationId: data[0].id || data[0]._id };
          });
        }
      } catch {
        console.error("Failed to load stations");
      } finally {
        setLoadingStations(false);
      }
    };
    fetchStations();
  }, []);

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
      {loadingStations && <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading fuel stations...</p>}

      <div className={styles.form}>
        {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
        {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
        {renderDropdown("preferredBrand", BRANDS, "Preferred Brand")}
      </div>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <button
          className={styles.findButton}
          onClick={handleUseCurrentLocation}
          disabled={loadingLocation}
          style={{ marginRight: 8 }}
        >
          {loadingLocation ? "Locating..." : "Use my current location"}
        </button>
        {locationError && <p style={{ color: "#dc2626", marginTop: 8 }}>{locationError}</p>}
        {locationLabel && <p style={{ color: "#0f172a", marginTop: 8 }}>{locationLabel}</p>}
      </div>
      <button
        className={styles.findButton}
        onClick={handleFindStations}
        disabled={!formData.latitude || !formData.longitude}
      >
        Find Best Station
      </button>
    </div>
  );
}
