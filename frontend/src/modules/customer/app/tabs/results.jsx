import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './results.module.css';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Extract query parameters
  const type = params.get('type') || '';
  const town = params.get('town') || '';
  const province = params.get('province') || '';
  const vehicleType = params.get('vehicleType') || '';
  const fuelType = params.get('fuelType') || '';
  const chargerType = params.get('chargerType') || '';
  const powerRating = params.get('powerRating') || '';

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show success message if coming from form submission
    if (town || province) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    const fetchStations = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (type) queryParams.append('type', type);
        if (town) queryParams.append('town', town);
        if (province) queryParams.append('province', province);

        const response = await fetch(`${API_ENDPOINTS.STATIONS.GET_ALL}?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stations: ${response.statusText}`);
        }
        const data = await response.json();
        setStations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching stations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [type, town, province]);

  if (loading) {
    return <div className={styles.container}>Loading stations...</div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return '#10b981';
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successBanner}>
          <span style={{ fontSize: 20 }}>✅</span>
          <p>Form submitted successfully! Here are your recommended stations.</p>
        </div>
      )}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <span style={{ fontSize: 24, color: '#1e40af' }}>⬅️</span>
        </button>
        <p className={styles.title}>Recommended Stations</p>
        <p className={styles.subtitle}>
          Found {stations.length} {type === 'ev' ? 'EV charging' : 'fuel'} stations 
          {town ? ` in ${town}` : province ? ` in ${province}` : ' near your location'}
        </p>
        {(vehicleType || fuelType || chargerType || powerRating) && (
          <div className={styles.filterInfo}>
            <p className={styles.filterText}>
              Filters: {vehicleType && `Vehicle: ${vehicleType}`}
              {fuelType && ` | Fuel: ${fuelType}`}
              {chargerType && ` | Charger: ${chargerType}`}
              {powerRating && ` | Power: ${powerRating}`}
            </p>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {stations.length === 0 && !loading ? (
          <div className={styles.noResultsCard}>
            <span style={{ fontSize: 48, color: '#64748b' }}>ℹ️</span>
            <p className={styles.noResultsTitle}>No Stations Found</p>
            <p className={styles.noResultsText}>
              Try adjusting your search criteria or expanding your search area
            </p>
            <button
              className={styles.searchAgainButton}
              onClick={() => navigate(-1)}
            >
              <p className={styles.searchAgainText}>Search Again</p>
            </button>
          </div>
        ) : (
          stations.map((station) => (
            <div key={station.id || station._id} className={styles.stationCard}>
            <div className={styles.stationHeader}>
              <div className={styles.stationInfo}>
                <p className={styles.stationName}>{station.name}</p>
                <p className={styles.stationAddress}>{station.address}</p>
              </div>
              <div className={styles.stationIcon}>
                <span style={{ fontSize: 32, color: station.type === 'ev' ? '#f59e0b' : '#1e40af' }}>
                  {station.type === 'ev' ? '⚡' : '🚗'}
                </span>
              </div>
            </div>

            <div className={styles.stationDetails}>
              <div className={styles.detailItem}>
                <span style={{ fontSize: 16, color: '#64748b' }}>📍</span>
                <p className={styles.detailText}>{station.distance}</p>
              </div>
              <div className={styles.detailItem}>
                <span style={{ fontSize: 16, color: '#f59e0b' }}>⭐</span>
                <p className={styles.detailText}>{station.rating}</p>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.statusDot} style={{ backgroundColor: getStatusColor(station.availability) }} />
                <p className={styles.detailText}>{station.availability}</p>
              </div>
            </div>

            <div className={styles.stationActions}>
              <button className={styles.actionButton}>
                <span style={{ fontSize: 16, color: '#1e40af' }}>👁️</span>
                <p className={styles.actionButtonText}>View Details</p>
              </button>
              <button className={styles.actionButton}>
                <span style={{ fontSize: 16, color: '#1e40af' }}>❤️</span>
                <p className={styles.actionButtonText}>Add to Favorites</p>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
