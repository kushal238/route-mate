import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, IconButton, Card, Chip } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Route, Address } from '../types';
import { decodePolyline } from '../utils/polyline';

interface MapViewScreenProps {
  navigation: any;
  route: {
    params: {
      selectedRoute: Route;
      from: Address;
      to: Address;
    };
  };
}

export default function MapViewScreen({
  navigation,
  route: { params },
}: MapViewScreenProps) {
  const { selectedRoute, from, to } = params;

  // Decode the overview polyline
  const routeCoordinates = decodePolyline(selectedRoute.overviewPolyline);

  // Calculate map region to fit the route
  const getRegion = () => {
    if (routeCoordinates.length === 0) {
      return {
        latitude: from.coordinates.lat,
        longitude: from.coordinates.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const lats = routeCoordinates.map((c) => c.latitude);
    const lngs = routeCoordinates.map((c) => c.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latDelta = (maxLat - minLat) * 1.3; // Add padding
    const lngDelta = (maxLng - minLng) * 1.3;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  // Get polylines for each step with colors
  const getStepPolylines = () => {
    return selectedRoute.steps.map((step, index) => {
      const coordinates = decodePolyline(step.polyline);
      const color = step.type === 'walk' ? '#4CAF50' : '#2196F3'; // Green for walk, Blue for transit
      const width = step.type === 'walk' ? 4 : 6;

      return (
        <Polyline
          key={index}
          coordinates={coordinates}
          strokeColor={color}
          strokeWidth={width}
          lineDashPattern={step.type === 'walk' ? [1, 10] : undefined}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={getRegion()}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Origin Marker */}
        <Marker
          coordinate={{
            latitude: from.coordinates.lat,
            longitude: from.coordinates.lng,
          }}
          title="Start"
          description={from.formatted}
          pinColor="green"
        />

        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: to.coordinates.lat,
            longitude: to.coordinates.lng,
          }}
          title="Destination"
          description={to.formatted}
          pinColor="red"
        />

        {/* Route Polylines */}
        {getStepPolylines()}
      </MapView>

      {/* Header Overlay */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerText}>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Route Map
          </Text>
        </View>
      </View>

      {/* Route Summary Card (Bottom) */}
      <View style={styles.bottomCard}>
        <Card>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text variant="headlineSmall" style={styles.duration}>
                {selectedRoute.duration}
              </Text>
              <Text variant="bodyMedium" style={styles.distance}>
                {selectedRoute.distance}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Chip icon="transfer" style={styles.chip}>
                {selectedRoute.transferCount} transfer{selectedRoute.transferCount !== 1 ? 's' : ''}
              </Chip>
              <Chip icon="walk" style={styles.chip}>
                {selectedRoute.walkingDistance}
              </Chip>
            </View>

            <ScrollView
              horizontal
              style={styles.stepsScroll}
              showsHorizontalScrollIndicator={false}
            >
              {selectedRoute.steps.map((step, index) => (
                <Chip
                  key={index}
                  icon={step.type === 'walk' ? 'walk' : step.type === 'bus' ? 'bus' : 'subway-variant'}
                  style={[
                    styles.stepChip,
                    {
                      backgroundColor:
                        step.type === 'walk' ? '#4CAF5020' : '#2196F320',
                    },
                  ]}
                  textStyle={{
                    color: step.type === 'walk' ? '#4CAF50' : '#2196F3',
                  }}
                >
                  {step.type === 'bus' || step.type === 'metro'
                    ? step.busNumber
                    : step.distance}
                </Chip>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Walking</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Transit</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingTop: 40,
    paddingBottom: 12,
    elevation: 4,
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  duration: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  distance: {
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    height: 32,
  },
  stepsScroll: {
    marginTop: 8,
  },
  stepChip: {
    marginRight: 8,
  },
  legend: {
    position: 'absolute',
    top: 110,
    right: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendLine: {
    width: 20,
    height: 4,
    marginRight: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

