import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './results.module.css';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (type) queryParams.append('type', type);
        if (town) queryParams.append('town', town);

        const response = await fetch(`${API_ENDPOINTS.STATIONS.GET_ALL}?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stations: ${response.statusText}`);
        }
        const data = await response.json();
        setStations(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching stations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [type, town]);

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
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <span style={{ fontSize: 24, color: '#1e40af' }}>⬅️</span>
        </button>
        <p className={styles.title}>Recommended Stations</p>
        <p className={styles.subtitle}>
          Found {stations.length} stations near {town || 'your location'}
        </p>
      </div>

      <div className={styles.content}>
        {stations.map((station, index) => ( // eslint-disable-line no-unused-vars
          <div key={station.id} className={styles.stationCard}>
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
        ))}

        <div className={styles.noResultsCard}>
          <span style={{ fontSize: 48, color: '#64748b' }}>ℹ️</span>
          <p className={styles.noResultsTitle}>No More Stations</p>
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
      </div>
    </div>
  );
}
