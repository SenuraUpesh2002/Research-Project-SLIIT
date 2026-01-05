import React, { useState } from "react";
import styles from "./fuel-results.module.css";

// Dummy data for demonstration
const bestMatchStation = {
  name: "Shell Fuel Station - Colombo",
  address: "125 Galle Road, Colombo 03",
  distance: "1.2 km",
  status: "Available",
  contact: "011-2345678",
  hours: "24/7 Open",
  matchScore: 98,
  services: ["Petrol", "Diesel", "Super Petrol", "Car Wash", "Shop"],
};

const alternativeStations = [
  {
    name: "IOC Fuel Station - Bambalapitiya",
    address: "78 Galle Road, Colombo 04",
    distance: "2.5 km",
    status: "Available",
    contact: "011-3456789",
    hours: "6AM - 10PM",
    matchScore: 92,
  },
  {
    name: "CPC Fuel Station - Wellawatta",
    address: "245 Galle Road, Colombo 06",
    distance: "3.8 km",
    status: "Busy",
    contact: "011-4567890",
    hours: "24/7 Open",
    matchScore: 88,
  },
];

export default function FuelResultsScreen() {
  const [submitted, setSubmitted] = useState(false);

  const handleSelectStation = () => {
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <>
          <h2>Station Recommendations</h2>
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
                <strong>Available Services:</strong>
                {bestMatchStation.services.map((s) => (
                  <span key={s} className={styles.serviceTag}>{s}</span>
                ))}
              </div>
            </div>
            <button className={styles.selectButton} onClick={handleSelectStation}>
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
              <strong>Confirmation ID:</strong> FC-2024-001234
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
              </ul>
            </div>
            <div className={styles.nextSteps}>
              <strong>Next Steps</strong>
              <ul>
                <li>The station has been notified of your request</li>
                <li>They will prepare your fuel/exchange service</li>
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
    </div>
  );
}

// ... Add corresponding CSS in fuel-results.module.css for styling ...