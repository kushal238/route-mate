import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Divider,
  IconButton,
  Button,
  Badge,
} from 'react-native-paper';
import { Route, Address, RouteStep } from '../types';

interface RouteResultsScreenProps {
  navigation: any;
  route: {
    params: {
      routes: Route[];
      from: Address;
      to: Address;
    };
  };
}

// Calculate minutes from now to a scheduled time
const getMinutesFromNow = (timeString: string): number => {
  try {
    const now = new Date();
    const targetTime = new Date();
    
    // Parse time string like "11:15 AM" or "2:30 PM"
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    targetTime.setHours(hours, minutes, 0, 0);
    
    // If time is in the past, assume it's tomorrow
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    return Math.round((targetTime.getTime() - now.getTime()) / 60000);
  } catch (error) {
    return -1;
  }
};

// Format relative time like "in 9 min" or "now"
const formatRelativeTime = (minutes: number): string => {
  if (minutes < 0) return '';
  if (minutes === 0) return 'now';
  if (minutes === 1) return 'in 1 min';
  return `in ${minutes} min`;
};

export default function RouteResultsScreen({
  navigation,
  route: { params },
}: RouteResultsScreenProps) {
  const { routes, from, to } = params;
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);

  const toggleRouteExpansion = (index: number) => {
    setExpandedRoute(expandedRoute === index ? null : index);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'walk':
        return 'walk';
      case 'bus':
        return 'bus';
      case 'metro':
        return 'subway-variant';
      default:
        return 'help-circle';
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'walk':
        return '#4CAF50';
      case 'bus':
        return '#2196F3';
      case 'metro':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const renderRouteCard = (routeData: Route, index: number) => {
    const isExpanded = expandedRoute === index;
    
    // Get first transit step for departure time
    const firstTransitStep = routeData.steps.find(
      step => step.type === 'bus' || step.type === 'metro'
    );
    const departureMinutes = firstTransitStep?.departureTime 
      ? getMinutesFromNow(firstTransitStep.departureTime)
      : -1;

    return (
      <Card key={index} style={styles.routeCard}>
        <TouchableOpacity onPress={() => toggleRouteExpansion(index)}>
          <Card.Content>
            {/* Route Summary with Departure Time */}
            <View style={styles.routeHeader}>
              <View style={styles.routeInfo}>
                {/* Departure Time - Prominent Display */}
                {firstTransitStep?.departureTime && departureMinutes >= 0 && (
                  <View style={styles.departureTimeContainer}>
                    <Text variant="titleSmall" style={styles.departureLabel}>
                      Depart
                    </Text>
                    <Text variant="titleMedium" style={styles.departureTime}>
                      {firstTransitStep.departureTime}
                    </Text>
                    {departureMinutes < 60 && (
                      <Chip
                        mode="flat"
                        style={styles.relativeBadge}
                        textStyle={styles.relativeBadgeText}
                      >
                        {formatRelativeTime(departureMinutes)}
                      </Chip>
                    )}
                  </View>
                )}
                
                {/* Duration and Arrival */}
                <View style={styles.durationRow}>
                  <Text variant="titleMedium" style={styles.duration}>
                    {routeData.duration}
                  </Text>
                  {routeData.arrivalTime && (
                    <Text variant="bodySmall" style={styles.arrivalTime}>
                      • Arrive {routeData.arrivalTime}
                    </Text>
                  )}
                </View>
                
                <Text variant="bodySmall" style={styles.distance}>
                  {routeData.distance} • {routeData.transferCount} transfer
                  {routeData.transferCount !== 1 ? 's' : ''}
                </Text>
              </View>
              <IconButton
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </View>

            {/* Quick Overview */}
            <View style={styles.quickOverview}>
              {routeData.steps.map((step, stepIndex) => (
                <Chip
                  key={stepIndex}
                  icon={getStepIcon(step.type)}
                  style={[
                    styles.stepChip,
                    { backgroundColor: getStepColor(step.type) + '20' },
                  ]}
                  textStyle={{ color: getStepColor(step.type) }}
                >
                  {step.type === 'bus'
                    ? step.busNumber
                    : step.type === 'walk'
                    ? step.distance
                    : 'Metro'}
                </Chip>
              ))}
            </View>

            {/* Walking Distance */}
            <View style={styles.walkingInfo}>
              <Text variant="bodySmall" style={styles.walkingText}>
                🚶 Walking: {routeData.walkingDistance}
              </Text>
            </View>

            {/* Expanded Details */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                <Divider style={styles.divider} />

                {routeData.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.stepContainer}>
                    <View
                      style={[
                        styles.stepIconContainer,
                        { backgroundColor: getStepColor(step.type) },
                      ]}
                    >
                      <Text style={styles.stepIcon}>
                        {step.type === 'bus'
                          ? '🚌'
                          : step.type === 'walk'
                          ? '🚶'
                          : '🚇'}
                      </Text>
                    </View>

                    <View style={styles.stepDetails}>
                      {/* Bus/Metro specific info */}
                      {(step.type === 'bus' || step.type === 'metro') && (
                        <>
                          <View style={styles.transitHeader}>
                            <Text variant="titleSmall" style={styles.busNumber}>
                              {step.type === 'bus' ? '🚌 Bus' : '🚇 Metro'}{' '}
                              {step.busNumber || step.busName || 'Line'}
                            </Text>
                            
                            {/* Scheduled Departure Time Badge */}
                            {step.departureTime && (
                              <View style={styles.scheduledBadge}>
                                <Text variant="labelSmall" style={styles.scheduledLabel}>
                                  SCHEDULED
                                </Text>
                                <Text variant="labelLarge" style={styles.scheduledTime}>
                                  {step.departureTime}
                                </Text>
                                {(() => {
                                  const mins = getMinutesFromNow(step.departureTime);
                                  return mins >= 0 && mins < 60 ? (
                                    <Text variant="labelSmall" style={styles.scheduledRelative}>
                                      {formatRelativeTime(mins)}
                                    </Text>
                                  ) : null;
                                })()}
                              </View>
                            )}
                          </View>
                          
                          {step.busName && step.busNumber !== step.busName && (
                            <Text variant="bodySmall" style={styles.busName}>
                              {step.busName}
                            </Text>
                          )}
                          <Text variant="bodySmall" style={styles.stopInfo}>
                            From: {step.departureStop}
                          </Text>
                          <Text variant="bodySmall" style={styles.stopInfo}>
                            To: {step.arrivalStop}
                          </Text>
                          {step.arrivalTime && (
                            <Text variant="bodySmall" style={styles.stopInfo}>
                              Arrives: {step.arrivalTime}
                            </Text>
                          )}
                          {step.numStops && (
                            <Text variant="bodySmall" style={styles.numStops}>
                              {step.numStops} stop{step.numStops !== 1 ? 's' : ''}
                            </Text>
                          )}
                        </>
                      )}

                      {/* Walking info */}
                      {step.type === 'walk' && (
                        <Text variant="bodyMedium" style={styles.walkInstruction}>
                          {step.instruction}
                        </Text>
                      )}

                      <View style={styles.stepMeta}>
                        <Text variant="bodySmall" style={styles.stepDuration}>
                          ⏱️ {step.duration}
                        </Text>
                        <Text variant="bodySmall" style={styles.stepDistance}>
                          📍 {step.distance}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* View on Map Button */}
            {isExpanded && (
              <Button
                mode="contained"
                icon="map"
                onPress={() =>
                  navigation.navigate('MapView', {
                    selectedRoute: routeData,
                    from,
                    to,
                  })
                }
                style={styles.mapButton}
              >
                View on Map
              </Button>
            )}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerText}>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Route Options
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            {routes.length} route{routes.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>

      {/* Addresses */}
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>From:</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {from.formatted}
          </Text>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>To:</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {to.formatted}
          </Text>
        </View>
      </View>

      {/* Routes List */}
      <ScrollView style={styles.routesList}>
        {routes.map((route, index) => renderRouteCard(route, index))}

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Tap any route to see detailed directions
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 50,
  },
  addressText: {
    flex: 1,
    color: '#666',
  },
  routesList: {
    flex: 1,
  },
  routeCard: {
    margin: 8,
    marginHorizontal: 12,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  departureTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  departureLabel: {
    color: '#666',
    fontWeight: '600',
  },
  departureTime: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  relativeBadge: {
    backgroundColor: '#4CAF50',
    height: 24,
  },
  relativeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  arrivalTime: {
    color: '#666',
  },
  distance: {
    color: '#666',
    marginTop: 4,
  },
  quickOverview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  stepChip: {
    marginBottom: 4,
  },
  walkingInfo: {
    marginTop: 12,
  },
  walkingText: {
    color: '#4CAF50',
  },
  expandedContent: {
    marginTop: 16,
  },
  divider: {
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIcon: {
    fontSize: 20,
  },
  stepDetails: {
    flex: 1,
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  busNumber: {
    fontWeight: 'bold',
    flex: 1,
  },
  scheduledBadge: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  scheduledLabel: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 10,
  },
  scheduledTime: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginTop: 2,
  },
  scheduledRelative: {
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 2,
  },
  busName: {
    color: '#666',
    marginBottom: 8,
  },
  stopInfo: {
    color: '#444',
    marginBottom: 4,
  },
  numStops: {
    color: '#666',
    marginTop: 4,
  },
  walkInstruction: {
    marginBottom: 8,
  },
  stepMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  stepDuration: {
    color: '#666',
  },
  stepDistance: {
    color: '#666',
  },
  mapButton: {
    marginTop: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontStyle: 'italic',
  },
});

