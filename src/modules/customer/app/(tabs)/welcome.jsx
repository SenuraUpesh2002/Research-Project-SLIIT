import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="car" size={60} color="#1e40af" />
            <Ionicons name="flash" size={30} color="#f59e0b" style={styles.evIcon} />
          </View>
          <Text style={styles.appName}>FUELWATCH</Text>
          <Text style={styles.tagline}>
            Find the best Fuel or EV Station smartly
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="location" size={24} color="#1e40af" />
            <Text style={styles.featureText}>Location-based search</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="time" size={24} color="#1e40af" />
            <Text style={styles.featureText}>Real-time availability</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="star" size={24} color="#1e40af" />
            <Text style={styles.featureText}>Smart recommendations</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push('/(tabs)/user-type')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  evIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    width: '100%',
    maxWidth: 300,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e40af',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
