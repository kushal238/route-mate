import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RouteResultsScreen from '../screens/RouteResultsScreen';
import MapViewScreen from '../screens/MapViewScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RouteResults" component={RouteResultsScreen} />
        <Stack.Screen name="MapView" component={MapViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

