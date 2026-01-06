import React, { useState } from "react";
import styles from "./fuel-results.module.css";
import apiClient from "@services/apiClient";

// Dummy data for demonstration
const bestMatchStation = {
  id: 1, // Added ID
  name: "Colombo Fuel & EV",
  address: "100 Main Street, Colombo 01",
  distance: "0.8 km",
  status: "Available",
  contact: "011-1234567",
  hours: "24/7 Open",
  matchScore: 95,
  fuelType: "Petrol",
  pumpCount: 8,
  services: ["Petrol", "Diesel", "Mini Mart", "Restrooms"],
};

const alternativeStations = [
  {
    id: 2, // Added ID
    name: "Kandy Petrol Stop",
    address: "200 Lotus Road, Colombo 02",
    distance: "2.0 km",
    status: "Busy",
    contact: "011-2345678",
    hours: "6AM - 10PM",
    matchScore: 88,
    fuelType: "Diesel",
    pumpCount: 6,
  },
  {
    id: 3, // Added ID
    name: "Moratuwa Charge Point",
    address: "50 York Street, Colombo 01",
    distance: "3.1 km",
    status: "Available",
    contact: "011-3456789",
    hours: "24/7 Open",
    matchScore: 83,
    fuelType: "Petrol",
    pumpCount: 10,
  },
];

export default function FuelResultsScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    setShowConfirm(true);
  };

  const handleConfirmSelection = async () => {
    setLoading(true);
    try {
      const userInfo = {
        userId: localStorage.getItem("userId"),
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("userEmail"),
      };

      // Save submission
      await apiClient.post("/submissions", {
        user: userInfo,
        station: selectedStation,
        vehicleType: "Fuel",
        date: new Date().toISOString(),
      });

      // Send alert to station
      await apiClient.post("/alerts", {
        message: `New fuel request for ${selectedStation.name}`,
        type: "system",
        stationId: selectedStation.id,
        details: selectedStation,
      });

      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <>
          <h2>Fuel Station Recommendations</h2>
          <div className={styles.bestMatchCard}>
            <div className={styles.header}>
              <span className={styles.stationName}>{bestMatchStation.name}</span>
              <span className={styles.bestMatch}>BEST MATCH</span>
              <span className={styles.matchScore}>{bestMatchStation.matchScore}%</span>
            </div>
            <div className={styles.details}>
              <div>
                <strong>Distance:</strong> {bestMatchStation.distance}
              </div>
              <div>
                <strong>Status:</strong> {bestMatchStation.status}
              </div>
              <div>
                <strong>Contact:</strong> {bestMatchStation.contact}
              </div>
              <div>
                <strong>Hours:</strong> {bestMatchStation.hours}
              </div>
              <div>
                <strong>Fuel Type:</strong> {bestMatchStation.fuelType}
              </div>
              <div>
                <strong>Pump Count:</strong> {bestMatchStation.pumpCount}
              </div>
              <div>
                <strong>Available Services:</strong>
                {bestMatchStation.services.map((s) => (
                  <span key={s} className={styles.serviceTag}>{s}</span>
                ))}
              </div>
            </div>
            <button
              className={styles.selectButton}
              onClick={() => handleSelectStation(bestMatchStation)}
            >
              Select This Station
            </button>
          </div>

          <h3>Alternative Stations</h3>
          <div className={styles.alternatives}>
            {alternativeStations.map((station) => (
              <div key={station.name} className={styles.altCard}>
                <div>
                  <span className={styles.altName}>{station.name}</span>
                  <span className={styles.altMatch}>{station.matchScore}% MATCH</span>
                </div>
                <div><strong>Distance:</strong> {station.distance}</div>
                <div><strong>Status:</strong> {station.status}</div>
                <div><strong>Contact:</strong> {station.contact}</div>
                <div><strong>Hours:</strong> {station.hours}</div>
                <div><strong>Fuel Type:</strong> {station.fuelType}</div>
                <div><strong>Pump Count:</strong> {station.pumpCount}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.confirmation}>
          <div className={styles.successIcon}>✓</div>
          <h2>Request Submitted Successfully!</h2>
          <p>Your alert has been sent to the station</p>
          <div className={styles.confirmDetails}>
            <div>
              <strong>Confirmation ID:</strong> FUEL-2024-001234
            </div>
            <div>
              <strong>Submitted On:</strong> Dec 15, 2024 - 2:24 PM
            </div>
            <div>
              <strong>Selected Station Details:</strong>
              <ul>
                <li>{bestMatchStation.name}</li>
                <li>{bestMatchStation.address}</li>
                <li>{bestMatchStation.contact}</li>
                <li>{bestMatchStation.distance} from your location</li>
                <li>Fuel: {bestMatchStation.fuelType} | Pumps: {bestMatchStation.pumpCount}</li>
              </ul>
            </div>
            <div className={styles.nextSteps}>
              <strong>Next Steps</strong>
              <ul>
                <li>The station has been notified of your request</li>
                <li>They will prepare your fueling service</li>
                <li>You may receive a confirmation call shortly</li>
                <li>Please proceed to the station at your convenience</li>
              </ul>
            </div>
          </div>
          <div className={styles.confirmActions}>
            <button className={styles.homeButton}>Back to Home</button>
            <button className={styles.historyButton}>View History</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Selection</h3>
            <p>
              Are you sure you want to select <strong>{selectedStation?.name}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button
                className={styles.homeButton}
                onClick={handleConfirmSelection}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ... Add corresponding CSS in fuel-results.module.css for styling ...