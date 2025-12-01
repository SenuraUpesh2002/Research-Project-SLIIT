import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./fuel-form.module.css";

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
  });

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

  const handleFindStations = () => {
    if (!validateForm()) return;

    navigate(`/results?type=fuel&vehicleType=${formData.vehicleType}&fuelType=${formData.fuelType}&preferredBrand=${formData.preferredBrand}&province=${formData.province}&town=${formData.town}`);
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
        <p className={styles.title}>Enter Your Preferences</p>
        <p className={styles.subtitle}>Help us find the best fuel station for you</p>
      </div>

      <div className={styles.form}>
        {renderDropdown("vehicleType", VEHICLE_TYPES, "Vehicle Type")}
        {renderDropdown("fuelType", FUEL_TYPES, "Fuel Type")}
        {renderDropdown("preferredBrand", BRANDS, "Preferred Brand")}
        {renderDropdown("province", SRI_LANKAN_PROVINCES, "Province")}
        {formData.province ? renderDropdown("town", TOWNS[formData.province] || [], "Town") : null}
      </div>

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

