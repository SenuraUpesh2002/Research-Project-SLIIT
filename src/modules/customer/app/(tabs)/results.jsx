import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock data for demonstration
  const mockStations = [
    {
      id: 1,
      name: 'Ceylon Petroleum Corporation',
      type: params.type || 'fuel',
      address: '123 Main Street, ' + (params.town || 'Colombo'),
      distance: '2.5 km',
      rating: 4.2,
      availability: 'Available',
      queueStatus: 'Low',
      brand: 'CPC',
    },
    {
      id: 2,
      name: 'Indian Oil Station',
      type: params.type || 'fuel',
      address: '456 Galle Road, ' + (params.town || 'Colombo'),
      distance: '3.8 km',
      rating: 4.0,
      availability: 'Available',
      queueStatus: 'Medium',
      brand: 'IOC',
    },
    {
      id: 3,
      name: 'Shell Station',
      type: params.type || 'fuel',
      address: '789 Kandy Road, ' + (params.town || 'Colombo'),
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e40af" />
        </TouchableOpacity>
        <Text style={styles.title}>Recommended Stations</Text>
        <Text style={styles.subtitle}>
          Found {mockStations.length} stations near {params.town || 'your location'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockStations.map((station, index) => (
          <View key={station.id} style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.stationAddress}>{station.address}</Text>
              </View>
              <View style={styles.stationIcon}>
                <Ionicons
                  name={station.type === 'ev' ? 'flash' : 'car'}
                  size={32}
                  color={station.type === 'ev' ? '#f59e0b' : '#1e40af'}
                />
              </View>
            </View>

            <View style={styles.stationDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={16} color="#64748b" />
                <Text style={styles.detailText}>{station.distance}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.detailText}>{station.rating}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(station.availability) }
                ]} />
                <Text style={styles.detailText}>{station.availability}</Text>
              </View>
            </View>

            <View style={styles.stationActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={16} color="#1e40af" />
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={16} color="#1e40af" />
                <Text style={styles.actionButtonText}>Add to Favorites</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.noResultsCard}>
          <Ionicons name="information-circle" size={48} color="#64748b" />
          <Text style={styles.noResultsTitle}>No More Stations</Text>
          <Text style={styles.noResultsText}>
            Try adjusting your search criteria or expanding your search area
          </Text>
          <TouchableOpacity
            style={styles.searchAgainButton}
            onPress={() => router.back()}
          >
            <Text style={styles.searchAgainText}>Search Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stationInfo: {
    flex: 1,
    marginRight: 16,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  stationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 6,
    fontWeight: '500',
  },
  noResultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  searchAgainButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  searchAgainText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
