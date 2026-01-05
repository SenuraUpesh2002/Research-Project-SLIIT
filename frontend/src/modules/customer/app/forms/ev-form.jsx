import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ev-form.module.css";
import { API_ENDPOINTS } from "../../../../constants/api";
import { SRI_LANKA_GEO_DATA } from "../../../../constants/sriLankaGeoData";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

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
  "Western Province": [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Negombo",
    "Moratuwa",
    "Dehiwala",
    "Mount Lavinia",
    "Sri Jayawardenepura Kotte",
    "Kesbewa",
    "Homagama",
    "Boralesgamuwa",
    "Panadura",
    "Piliyandala",
    "Wattala",
    "Ja-Ela",
    "Kandana",
    "Kelaniya",
    "Kadawatha",
    "Kiribathgoda",
    "Ragama",
    "Mahara",
  ],
  "Central Province": [
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Gampola",
    "Hatton",
    "Dambulla",
    "Dickoya",
    "Kadugannawa",
    "Nawalapitiya",
    "Talawakele",
    "Rambukkana",
    "Peradeniya",
    "Delthota",
    "Hapugastalawa",
    "Bogawantalawa",
    "Talawakele",
    "Ginigathhena",
    "Pussellawa",
    "Wattegama",
  ],
  "Southern Province": [
    "Galle",
    "Matara",
    "Hambantota",
    "Weligama",
    "Tangalle",
    "Ambalangoda",
    "Hikkaduwa",
    "Dickwella",
    "Unawatuna",
    "Balapitiya",
    "Kataragama",
    "Ahungalla",
    "Bentota",
    "Induruwa",
    "Koggala",
    "Mirissa",
    "Polhena",
  ],
  "Northern Province": [
    "Jaffna",
    "Vavuniya",
    "Mannar",
    "Kilinochchi",
    "Mullaitivu",
    "Point Pedro",
    "Valvettithurai",
    "Chavakachcheri",
    "Tellippalai",
    "Navatkuli",
    "Kayts",
    "Poonakary",
    "Madu",
    "Uduvil",
    "Thenmarachchi",
  ],
  "Eastern Province": [
    "Trincomalee",
    "Batticaloa",
    "Ampara",
    "Kalmunai",
    "Eravur",
    "Akkaraipattu",
    "Vakarai",
    "Kalkudah",
    "Chenkalady",
    "Maha Oya",
    "Pottuvil",
    "Sainthamaruthu",
    "Oddamavadi",
    "Komari",
    "Arayampathy",
  ],
  "North Western Province": [
    "Kurunegala",
    "Puttalam",
    "Chilaw",
    "Mawathagama",
    "Kuliyapitiya",
    "Nikaweratiya",
    "Wennappuwa",
    "Mundalama",
    "Pannala",
    "Wariyapola",
    "Anamaduwa",
    "Chilaw",
    "Nattandiya",
    "Marawila",
  ],
  "North Central Province": [
    "Anuradhapura",
    "Polonnaruwa",
    "Hingurakgoda",
    "Medawachchiya",
    "Mihintale",
    "Thamankaduwa",
    "Nochchiyagama",
    "Kebithigollewa",
    "Bakamuna",
    "Elahera",
    "Kaduruwela",
  ],
  "Uva Province": [
    "Badulla",
    "Monaragala",
    "Bandarawela",
    "Haputale",
    "Welimada",
    "Ella",
    "Mahiyanganaya",
    "Passara",
    "Rathnapura",
    "Demodara",
    "Talawakelle",
    "Bogawantalawa",
  ],
  "Sabaragamuwa Province": [
    "Ratnapura",
    "Kegalle",
    "Balangoda",
    "Embilipitiya",
    "Belihuloya",
    "Dehiowita",
    "Kuruwita",
    "Pelmadulla",
    "Eheliyagoda",
    "Mawanella",
    "Aranayake",
    "Yatiyantota",
    "Rambukkana",
    "Warakapola",
  ],
};

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
    stationId: "",
    latitude: null,
    longitude: null,
  });

  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationLabel, setLocationLabel] = useState("");

  // Remove province/town dropdown state and logic
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

  // Remove province/town map logic

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

  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]);
  const [mapZoom, setMapZoom] = useState(10);
  const [suggestedMarkerPosition, setSuggestedMarkerPosition] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [confirmedLocationName, setConfirmedLocationName] = useState("");

  useEffect(() => {
    if (tempMarkerPosition) {
      const fetchLocationName = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${tempMarkerPosition.lat}&lon=${tempMarkerPosition.lng}`
          );
          const data = await response.json();
          if (data.display_name) {
            setConfirmedLocationName(data.display_name);
          } else {
            setConfirmedLocationName("Unknown location");
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
          setConfirmedLocationName("Error fetching location");
        }
      };
      fetchLocationName();
    }
  }, [tempMarkerPosition]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setTempMarkerPosition(e.latlng);
        setShowConfirmation(true);
        setSuggestedMarkerPosition(null);
      },
    });

    return markerPosition === null ? null : <Marker position={markerPosition} />;
  }

  const handleConfirmLocation = () => {
    setMarkerPosition(tempMarkerPosition);
    setFormData((prev) => ({
      ...prev,
      latitude: tempMarkerPosition.lat,
      longitude: tempMarkerPosition.lng,
    }));
    setShowConfirmation(false);
    setTempMarkerPosition(null);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setTempMarkerPosition(null);
  };

  // Remove province/town validation
  const validateForm = () => {
    // Add any required validation for the remaining fields if needed
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (formData.stationId) {
      try {
        const submissionData = {
          station: formData.stationId,
          submissionType: "EV_CHARGE",
          data: {
            chargerType: formData.chargerType,
            powerRating: formData.powerRating,
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        };

        const response = await fetch(API_ENDPOINTS.SUBMISSIONS.CREATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Submission failed:", errorData);
        }
      } catch (error) {
        console.error("EV form submission error:", error);
      }
    }

    const queryParams = new URLSearchParams({
      type: "ev",
      chargerType: formData.chargerType || "",
      powerRating: formData.powerRating || "",
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    // CHANGE THIS LINE:
    navigate(`/ev-results?${queryParams.toString()}`);
  };

  const handleFindStations = () => {
    if (!validateForm()) return;
    handleSubmit();
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoadingStations(true);
        const res = await fetch(API_ENDPOINTS.STATIONS.GET_ALL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load stations (${res.status})`);
        }

        const data = await res.json();
        setStations(data || []);

        if (data && data.length > 0 && !formData.stationId) {
          setFormData((prev) => ({
            ...prev,
            stationId: data[0].id || data[0]._id || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load stations", err);
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
