import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./fuel-form.module.css";
import { API_ENDPOINTS } from "../../../../constants/api";
import { SRI_LANKA_GEO_DATA } from "../../../../constants/sriLankaGeoData";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/* ===============================
   LEAFLET ICON FIX
================================ */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

/* ===============================
   CONSTANTS
================================ */
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
const BRANDS = [
  "Ceylon Petroleum Corporation (CPC)",
  "Indian Oil Corporation (IOC)",
  "Shell",
  "Any Brand",
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
    province: "",
    town: "",
    stationId: "",
    latitude: null,
    longitude: null,
  });

  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);

  /* ===============================
     MAP STATE
  ================================ */
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]);
  const [mapZoom, setMapZoom] = useState(10);

  // eslint-disable-next-line no-unused-vars
  const [suggestedMarkerPosition, setSuggestedMarkerPosition] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [confirmedLocationName, setConfirmedLocationName] = useState("");

  /* ===============================
     POPUP STATE
  ================================ */
  const [popup, setPopup] = useState(null);

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 3000);
  };

  /* ===============================
     LOCATION NAME
  ================================ */
  useEffect(() => {
    if (!tempMarkerPosition) return;

    const fetchLocationName = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${tempMarkerPosition.lat}&lon=${tempMarkerPosition.lng}`
        );
        const data = await res.json();
        setConfirmedLocationName(data.display_name || "Unknown location");
      } catch {
        setConfirmedLocationName("Error fetching location");
      }
    };

    fetchLocationName();
  }, [tempMarkerPosition]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setTempMarkerPosition(e.latlng);
        setShowConfirmation(true);
        setSuggestedMarkerPosition(null);
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition}>
        <Popup>Selected Location</Popup>
      </Marker>
    ) : null;
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

  /* ===============================
     DROPDOWNS
  ================================ */
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

  /* ===============================
     MAP CENTER UPDATE
  ================================ */
  useEffect(() => {
    if (!formData.province || !SRI_LANKA_GEO_DATA[formData.province]) return;

    let center = SRI_LANKA_GEO_DATA[formData.province].center;
    let zoom = SRI_LANKA_GEO_DATA[formData.province].zoom;

    if (
      formData.town &&
      SRI_LANKA_GEO_DATA[formData.province].towns[formData.town]
    ) {
      center = SRI_LANKA_GEO_DATA[formData.province].towns[formData.town].center;
      zoom = SRI_LANKA_GEO_DATA[formData.province].towns[formData.town].zoom;
    }

    setMapCenter(center);
    setMapZoom(zoom);
    setSuggestedMarkerPosition(center);
  }, [formData.province, formData.town]);

  /* ===============================
     VALIDATION
  ================================ */
  const validateForm = () => {
    if (!formData.vehicleType) return showPopup("Select vehicle type", "error"), false;
    if (!formData.fuelType) return showPopup("Select fuel type", "error"), false;
    if (!formData.province) return showPopup("Select province", "error"), false;
    if (!formData.town) return showPopup("Select town", "error"), false;
    return true;
  };

  /* ===============================
     SUBMIT
  ================================ */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (formData.stationId) {
        const res = await fetch(API_ENDPOINTS.SUBMISSIONS.CREATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            station: formData.stationId,
            submissionType: "FUEL_REPORT",
            data: formData,
          }),
        });

        if (!res.ok) {
          showPopup("Submission failed, continuing...", "error");
        } else {
          showPopup("Fuel request submitted successfully!", "success");
        }
      }
    } catch {
      showPopup("Network error while submitting", "error");
    }

    const queryParams = new URLSearchParams({
      type: "fuel",
      province: formData.province,
      town: formData.town,
      vehicleType: formData.vehicleType,
      fuelType: formData.fuelType,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    navigate(`/results?${queryParams.toString()}`);
  };

  const handleFindStations = () => handleSubmit();

  /* ===============================
     LOAD STATIONS (ONCE)
  ================================ */
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoadingStations(true);
        const res = await fetch(API_ENDPOINTS.STATIONS.GET_ALL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setStations(data || []);
        if (data?.length && !formData.stationId) {
          setFormData((p) => ({ ...p, stationId: data[0].id || data[0]._id }));
        }
      } catch {
        showPopup("Failed to load stations", "error");
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
          setShowDropdowns((p) => ({ ...p, [field]: !p[field] }))
        }
      >
        <span className={styles.dropdownText}>
          {formData[field] || `Select ${label}`}
        </span>
      </button>

      {showDropdowns[field] && (
        <div className={styles.dropdownList}>
          {options.map((o) => (
            <button
              key={o}
              className={styles.dropdownItem}
              onClick={() => handleSelect(field, o)}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* POPUP */}
      {popup && (
        <div
          className={`${styles.popup} ${
            popup.type === "error" ? styles.popupError : styles.popupSuccess
          }`}
        >
          {popup.message}
        </div>
      )}

      {loadingStations && (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          Loading fuel stations...
        </p>
      )}

      <div className={styles.form}>
        {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
        {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
        {renderDropdown("preferredBrand", BRANDS, "Preferred Brand")}
        {renderDropdown("province", SRI_LANKAN_PROVINCES, "Province")}
        {formData.province &&
          renderDropdown("town", TOWNS[formData.province], "Town")}
      </div>

      <div className={styles.mapContainer}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: 400 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markerPosition && <Marker position={markerPosition} />}
          {showConfirmation && tempMarkerPosition && (
            <Marker position={tempMarkerPosition} />
          )}
          <LocationMarker />
        </MapContainer>
      </div>

      {showConfirmation && (
        <div className={styles.confirmationDialog}>
          <p>Confirm location: {confirmedLocationName}</p>
          <div className={styles.dialogActions}>
            <button onClick={handleConfirmLocation} className={styles.confirmButton}>Yes</button>
            <button onClick={handleCancelConfirmation} className={styles.cancelButton}>No</button>
          </div>
        </div>
      )}

      <button
        className={styles.findButton}
        onClick={handleFindStations}
        disabled={!formData.town || stations.length === 0}
      >
        Find Best Station
      </button>
    </div>
  );
}
