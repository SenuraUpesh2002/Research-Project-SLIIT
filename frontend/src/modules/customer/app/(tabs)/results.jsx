import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './results.module.css';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const type = params.get('type');
  const town = params.get('town');

  // Mock data for demonstration
  const mockStations = [
    {
      id: 1,
      name: 'Ceylon Petroleum Corporation',
      type: type || 'fuel',
      address: '123 Main Street, ' + (town || 'Colombo'),
      distance: '2.5 km',
      rating: 4.2,
      availability: 'Available',
      queueStatus: 'Low',
      brand: 'CPC',
    },
    {
      id: 2,
      name: 'Indian Oil Station',
      type: type || 'fuel',
      address: '456 Galle Road, ' + (town || 'Colombo'),
      distance: '3.8 km',
      rating: 4.0,
      availability: 'Available',
      queueStatus: 'Medium',
      brand: 'IOC',
    },
    {
      id: 3,
      name: 'Shell Station',
      type: type || 'fuel',
      address: '789 Kandy Road, ' + (town || 'Colombo'),
      distance: '5.2 km',
      rating: 4.5,
      availability: 'Available',
      queueStatus: 'Low',
      brand: 'Shell',
    },
  ];

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
          Found {mockStations.length} stations near {town || 'your location'}
        </p>
      </div>

      <div className={styles.content}>
        {mockStations.map((station, index) => (
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
