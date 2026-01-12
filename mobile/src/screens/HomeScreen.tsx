import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Button,
  Text,
} from 'react-native-paper';
import * as Location from 'expo-location';
import { getRoute, getPlaceAutocomplete, reverseGeocode } from '../services/api';
import { PlacePrediction } from '../types';
import AddressAutocomplete from '../components/AddressAutocomplete';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<PlacePrediction[]>([]);
  const [toSuggestions, setToSuggestions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const fromTimeoutRef = useRef<NodeJS.Timeout>();
  const toTimeoutRef = useRef<NodeJS.Timeout>();

  // Get autocomplete suggestions
  const fetchSuggestions = async (input: string, isFrom: boolean) => {
    if (input.length < 2) {
      if (isFrom) setFromSuggestions([]);
      else setToSuggestions([]);
      return;
    }

    const predictions = await getPlaceAutocomplete(input);
    if (isFrom) {
      setFromSuggestions(predictions);
    } else {
      setToSuggestions(predictions);
    }
  };

  // Debounced autocomplete
  const handleFromChange = (text: string) => {
    setFromAddress(text);
    if (fromTimeoutRef.current) {
      clearTimeout(fromTimeoutRef.current);
    }
    fromTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(text, true);
    }, 300);
  };

  const handleToChange = (text: string) => {
    setToAddress(text);
    if (toTimeoutRef.current) {
      clearTimeout(toTimeoutRef.current);
    }
    toTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(text, false);
    }, 300);
  };

  // Get current location
  const useCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use current location'
        );
        return;
      }

      // Get location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const result = await reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      if (result.success && result.address) {
        setFromAddress(result.address.formatted);
        setFromSuggestions([]);
      }
    } catch (error: any) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Find routes
  const handleFindRoutes = async () => {
    if (!fromAddress.trim() || !toAddress.trim()) {
      Alert.alert('Error', 'Please enter both From and To addresses');
      return;
    }

    try {
      setLoading(true);

      const response = await getRoute({
        from: fromAddress,
        to: toAddress,
        mode: 'transit',
      });

      if (!response.success) {
        Alert.alert('Error', response.error || 'Failed to get routes');
        return;
      }

      if (response.routes.length === 0) {
        Alert.alert(
          'No Routes Found',
          'No bus routes found between these locations. Try different addresses or use walking mode.'
        );
        return;
      }

      // Navigate to results screen
      navigation.navigate('RouteResults', {
        routes: response.routes,
        from: response.from,
        to: response.to,
      });
    } catch (error: any) {
      console.error('Find routes error:', error);
      Alert.alert('Error', 'Failed to find routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select suggestion
  const selectFromSuggestion = (prediction: PlacePrediction) => {
    setFromAddress(prediction.description);
    setFromSuggestions([]);
  };

  const selectToSuggestion = (prediction: PlacePrediction) => {
    setToAddress(prediction.description);
    setToSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            🚍 BusTracker
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Find bus routes in Hyderabad
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {/* From Address */}
          <View style={{ zIndex: fromSuggestions.length > 0 ? 2000 : 1000 }}>
            <AddressAutocomplete
              label="From"
              value={fromAddress}
              onChangeText={handleFromChange}
              suggestions={fromSuggestions}
              onSelectSuggestion={selectFromSuggestion}
              placeholder="Enter starting point"
              icon="map-marker"
              showGPSButton
              onGPSPress={useCurrentLocation}
              loading={loadingLocation}
            />
          </View>

          {/* To Address */}
          <View style={{ zIndex: toSuggestions.length > 0 ? 2000 : 1000 }}>
            <AddressAutocomplete
              label="To"
              value={toAddress}
              onChangeText={handleToChange}
              suggestions={toSuggestions}
              onSelectSuggestion={selectToSuggestion}
              placeholder="Enter destination"
              icon="map-marker-check"
            />
          </View>

          {/* Find Routes Button */}
          <Button
            mode="contained"
            onPress={handleFindRoutes}
            loading={loading}
            disabled={loading || !fromAddress || !toAddress}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Find Routes
          </Button>
        </View>

        {/* Quick Info */}
        <View style={styles.infoContainer}>
          <Text variant="labelMedium" style={styles.infoText}>
            💡 Enter any two addresses in Hyderabad to find bus routes with
            walking directions
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#6200ee',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  suggestions: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoText: {
    color: '#1565c0',
  },
});

