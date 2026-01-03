import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./fuel-form.module.css";
import { API_ENDPOINTS } from "../../../../constants/api";
import { SRI_LANKA_GEO_DATA } from "../../../../constants/sriLankaGeoData";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const SRI_LANKAN_PROVINCES = [
  "Western Province", "Central Province", "Southern Province", "Northern Province",
  "Eastern Province", "North Western Province", "North Central Province",
  "Uva Province", "Sabaragamuwa Province",
];

const TOWNS = {
  "Western Province": ["Colombo","Gampaha","Kalutara","Negombo","Moratuwa","Dehiwala","Mount Lavinia","Sri Jayawardenepura Kotte","Kesbewa","Homagama","Boralesgamuwa","Panadura","Piliyandala","Wattala","Ja-Ela","Kandana","Kelaniya","Kadawatha","Kiribathgoda","Ragama","Mahara"],
  "Central Province": ["Kandy","Matale","Nuwara Eliya","Gampola","Hatton","Dambulla","Dickoya","Kadugannawa","Nawalapitiya","Talawakele","Rambukkana","Peradeniya","Delthota","Hapugastalawa","Bogawantalawa","Talawakele","Ginigathhena","Pussellawa","Wattegama"],
  "Southern Province": ["Galle","Matara","Hambantota","Weligama","Tangalle","Ambalangoda","Hikkaduwa","Dickwella","Unawatuna","Balapitiya","Kataragama","Ahungalla","Bentota","Induruwa","Koggala","Mirissa","Polhena"],
  "Northern Province": ["Jaffna","Vavuniya","Mannar","Kilinochchi","Mullaitivu","Point Pedro","Valvettithurai","Chavakachcheri","Tellippalai","Navatkuli","Kayts","Poonakary","Madu","Uduvil","Thenmarachchi"],
  "Eastern Province": ["Trincomalee","Batticaloa","Ampara","Kalmunai","Eravur","Akkaraipattu","Vakarai","Kalkudah","Chenkalady","Maha Oya","Pottuvil","Sainthamaruthu","Oddamavadi","Komari","Arayampathy"],
  "North Western Province": ["Kurunegala","Puttalam","Chilaw","Mawathagama","Kuliyapitiya","Nikaweratiya","Wennappuwa","Mundalama","Pannala","Wariyapola","Anamaduwa","Chilaw","Nattandiya","Marawila"],
  "North Central Province": ["Anuradhapura","Polonnaruwa","Hingurakgoda","Medawachchiya","Mihintale","Thamankaduwa","Nochchiyagama","Kebithigollewa","Bakamuna","Elahera","Kaduruwela"],
  "Uva Province": ["Badulla","Monaragala","Bandarawela","Haputale","Welimada","Ella","Mahiyanganaya","Passara","Rathnapura","Demodara","Talawakelle","Bogawantalawa"],
  "Sabaragamuwa Province": ["Ratnapura","Kegalle","Balangoda","Embilipitiya","Belihuloya","Dehiowita","Kuruwita","Pelmadulla","Eheliyagoda","Mawanella","Aranayake","Yatiyantota","Rambukkana","Warakapola"]
};

const VEHICLE_TYPES = ["Car", "Van", "Bus", "Truck", "Motorcycle", "Three Wheeler"];
const FUEL_TYPES = ["Petrol (Octane 92)", "Petrol (Octane 95) / Super Petrol", "Diesel", "Auto Diesel", "Any Fuel Type"];
const BRANDS = ["CPC", "IOC", "Lanka IOC", "Shell", "Any Brand"];

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
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]);
  const [mapZoom, setMapZoom] = useState(10);
  const [suggestedMarkerPosition, setSuggestedMarkerPosition] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [confirmedLocationName, setConfirmedLocationName] = useState("");

  const [showDropdowns, setShowDropdowns] = useState({
    vehicleType: false, fuelType: false, preferredBrand: false, province: false, town: false
  });

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      setLoadingStations(true);
      try {
        const res = await fetch(API_ENDPOINTS.STATIONS.GET_ALL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        const data = await res.json();
        setStations(data || []);
        if (data?.length && !formData.stationId) {
          setFormData((p) => ({ ...p, stationId: data[0].id || data[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch stations:", err);
      } finally {
        setLoadingStations(false);
      }
    };
    fetchStations();
  }, []);

  // Update map center on province/town change
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

  // Fetch address for confirmation
  useEffect(() => {
    if (!tempMarkerPosition) return;
    setConfirmedLocationName("Fetching address...");
    const fetchAddress = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${tempMarkerPosition.lat}&lon=${tempMarkerPosition.lng}`);
        const data = await res.json();
        setConfirmedLocationName(data.display_name || "Unknown location");
      } catch {
        setConfirmedLocationName("Error fetching location");
      }
    };
    fetchAddress();
  }, [tempMarkerPosition]);

  // Map marker click
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setTempMarkerPosition(e.latlng);
        setShowConfirmation(true);
        setSuggestedMarkerPosition(null);
      }
    });
    return null;
  }

  const handleConfirmLocation = () => {
    setMarkerPosition(tempMarkerPosition);
    setFormData((p) => ({
      ...p,
      latitude: tempMarkerPosition.lat,
      longitude: tempMarkerPosition.lng
    }));
    setShowConfirmation(false);
    setTempMarkerPosition(null);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setTempMarkerPosition(null);
  };

  const handleSelect = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value, ...(field === "province" ? { town: "" } : {}) }));
    setShowDropdowns((p) => ({ ...p, [field]: false }));
  };

  const validateForm = () => {
    if (!formData.vehicleType || !formData.fuelType || !formData.province || !formData.town) {
      alert("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleFindStations = () => {
    if (!validateForm()) return;
    navigate(`/results?type=fuel&province=${formData.province}&town=${formData.town}&vehicleType=${formData.vehicleType}&fuelType=${formData.fuelType}&latitude=${formData.latitude}&longitude=${formData.longitude}`);
  };

  const renderDropdown = (field, options, label) => (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <button className={styles.dropdown} onClick={() => setShowDropdowns((p) => ({ ...p, [field]: !p[field] }))}>
        {formData[field] || `Select ${label}`}
      </button>
      {showDropdowns[field] && (
        <div className={styles.dropdownList}>
          {options.map((opt) => (
            <button key={opt} onClick={() => handleSelect(field, opt)}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
      {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
      {renderDropdown("preferredBrand", BRANDS, "Preferred Brand")}
      {renderDropdown("province", SRI_LANKAN_PROVINCES, "Province")}
      {formData.province && renderDropdown("town", TOWNS[formData.province], "Town")}

      <div className={styles.mapContainer}>
        <MapContainer key={JSON.stringify(mapCenter)} center={mapCenter} zoom={mapZoom} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
          {markerPosition && <Marker position={markerPosition} />}
          {!markerPosition && suggestedMarkerPosition && !showConfirmation && <Marker position={suggestedMarkerPosition} />}
          {showConfirmation && tempMarkerPosition && <Marker position={tempMarkerPosition} />}
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

      <button className={styles.findButton} onClick={handleFindStations}>Find Best Station</button>
    </div>
  );
}
