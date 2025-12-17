import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./fuel-form.module.css";
import { API_ENDPOINTS } from "../../../../constants/api";
import { SRI_LANKA_GEO_DATA } from "../../../../constants/sriLankaGeoData";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet's default icon issue with Webpack
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

const VEHICLE_TYPES = ["Car", "Van", "Bus", "Truck", "Motorcycle", "Three Wheeler"];
const FUEL_TYPES = ["Petrol", "Diesel", "Super Petrol"];
const BRANDS = ["Ceylon Petroleum Corporation (CPC)", "Indian Oil Corporation (IOC)", "Shell", "Any Brand"];

export default function FuelFormScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleType: "",
    fuelType: "",
    preferredBrand: "",
    province: "",
    town: "",
    stationId: "",
    latitude: null,
    longitude: null,
  });
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]); // Default to Sri Lanka center
  const [mapZoom, setMapZoom] = useState(10); // Default zoom
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
    const map = useMapEvents({
      click(e) {
        setTempMarkerPosition(e.latlng);
        setShowConfirmation(true);
        setSuggestedMarkerPosition(null); // Clear suggested marker when user clicks
      },
    });

    return markerPosition === null ? null : (
      <Marker position={markerPosition}></Marker>
    );
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

  const [showDropdowns, setShowDropdowns] = useState({
    vehicleType: false,
    fuelType: false,
    preferredBrand: false,
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

  useEffect(() => {
    if (formData.province && SRI_LANKA_GEO_DATA[formData.province]) {
      let newCenter = SRI_LANKA_GEO_DATA[formData.province].center;
      let newZoom = SRI_LANKA_GEO_DATA[formData.province].zoom;

      if (formData.town && SRI_LANKA_GEO_DATA[formData.province].towns[formData.town]) {
        newCenter = SRI_LANKA_GEO_DATA[formData.province].towns[formData.town].center;
        newZoom = SRI_LANKA_GEO_DATA[formData.province].towns[formData.town].zoom;
      }
      setMapCenter(newCenter);
      setMapZoom(newZoom);
      setSuggestedMarkerPosition(newCenter);
    }
  }, [formData.province, formData.town]);

  const validateForm = () => {
    if (!formData.vehicleType) {
      alert("Please select your vehicle type");
      return false;
    }
    if (!formData.fuelType) {
      alert("Please select fuel type");
      return false;
    }
    if (!formData.province) {
      alert("Please select your province");
      return false;
    }
    if (!formData.town) {
      alert("Please select your town");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // If we have a station ID, submit the form
    if (formData.stationId) {
      try {
        const submissionData = {
          station: formData.stationId,
          submissionType: "FUEL_REPORT",
          data: {
            vehicleType: formData.vehicleType,
            fuelType: formData.fuelType,
            preferredBrand: formData.preferredBrand,
            province: formData.province,
            town: formData.town,
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        };

        const response = await fetch(API_ENDPOINTS.SUBMISSIONS.CREATE,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(submissionData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Submission failed:", errorData);
          // Continue to results page even if submission fails
        }
      } catch (error) {
        console.error("Fuel form submission error:", error);
        // Continue to results page even if submission fails
      }
    }

    // Navigate to results page with form data
    const queryParams = new URLSearchParams({
      type: 'fuel',
      province: formData.province,
      town: formData.town,
      vehicleType: formData.vehicleType,
      fuelType: formData.fuelType,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
    navigate(`/results?${queryParams.toString()}`);
  };

  const handleFindStations = () => {
    if (!validateForm()) return;
    handleSubmit();
  };

  // Fetch stations once to ensure we submit a valid station_id (FK constraint)
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
          setFormData((prev) => ({ ...prev, stationId: data[0].id || data[0]._id || "" }));
        }
      } catch (err) {
        console.error("Failed to load stations", err);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <span className={`${styles.dropdownText} ${!formData[field] ? styles.placeholderText : ""}`}>
          {formData[field] || `Select ${label.toLowerCase()}`}
        </span>
        <span style={{ fontSize: 20, color: '#64748b' }}>{showDropdowns[field] ? "⬆️" : "⬇️"}</span>
      </button>

      {showDropdowns[field] && (
        <div className={styles.dropdownList}>
          {options.map((option, index) => (
            <button key={index} className={styles.dropdownItem} onClick={() => handleSelect(field, option)}>
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
          <span style={{ fontSize: 24, color: '#1e40af' }}>⬅️</span>
        </button>
        <p className={styles.title}>Find Fuel Station</p>
        <p className={styles.subtitle}>Help us find the best fuel station for you</p>
      </div>

      <div className={styles.form}>
        {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
        {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
        {renderDropdown("preferredBrand", BRANDS, "Preferred Brand")}
        {renderDropdown("province", SRI_LANKAN_PROVINCES, "Province")}
        {formData.province ? renderDropdown("town", TOWNS[formData.province] || [], "Town") : null}
      </div>

      <div className={styles.mapContainer}>
          <MapContainer key={JSON.stringify(mapCenter)} center={mapCenter} zoom={mapZoom} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markerPosition && <Marker position={markerPosition}></Marker>}
            {!markerPosition && suggestedMarkerPosition && !showConfirmation && <Marker position={suggestedMarkerPosition}></Marker>}
            {showConfirmation && tempMarkerPosition && <Marker position={tempMarkerPosition}></Marker>}
            <LocationMarker />
          </MapContainer>
        </div>

        {showConfirmation && tempMarkerPosition && (
            <div className={styles.confirmationDialog}>
              <p>Confirm this location? {confirmedLocationName}</p>
              <div className={styles.dialogActions}>
                <button onClick={handleConfirmLocation} className={styles.confirmButton}>Yes</button>
                <button onClick={handleCancelConfirmation} className={styles.cancelButton}>No</button>
              </div>
            </div>
          )}
      

      <div className={styles.footer}>
        <button
          className={`${styles.findButton} ${!formData.town ? styles.buttonDisabled : ""}`}
          onClick={handleFindStations}
          disabled={!formData.town}
        >
          <span style={{ fontSize: 20, color: '#ffffff' }}>🔍</span>
          <span className={styles.findButtonText}>Find Best Station</span>
        </button>
      </div>
    </div>
  );
}

