import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { PlacePrediction } from '../types';

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  suggestions: PlacePrediction[];
  onSelectSuggestion: (suggestion: PlacePrediction) => void;
  placeholder?: string;
  icon?: string;
  showGPSButton?: boolean;
  onGPSPress?: () => void;
  loading?: boolean;
}

export default function AddressAutocomplete({
  label,
  value,
  onChangeText,
  suggestions,
  onSelectSuggestion,
  placeholder,
  icon = 'map-marker',
  showGPSButton = false,
  onGPSPress,
  loading = false,
}: AddressAutocompleteProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          mode="outlined"
          style={styles.input}
          placeholder={placeholder}
          left={<TextInput.Icon icon={icon} />}
        />
        {showGPSButton && (
          <IconButton
            icon="crosshairs-gps"
            mode="contained"
            onPress={onGPSPress}
            loading={loading}
            disabled={loading}
            size={24}
          />
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <ScrollView
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.placeId}
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(item)}
                activeOpacity={0.7}
              >
                <View style={styles.suggestionIcon}>
                  <Text style={styles.iconText}>📍</Text>
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionMain}>{item.mainText}</Text>
                  <Text style={styles.suggestionSecondary} numberOfLines={1}>
                    {item.secondaryText}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000, // Match dropdown z-index so parent doesn't block child
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 64, // Below the input
    left: 0,
    right: 0, // Fixed: was an invalid arrow function
    maxHeight: 250,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1, // Add visible border
    borderColor: '#ddd',
    elevation: 8, // Higher elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdown: {
    // Removed flex: 1 which can cause rendering issues in ScrollView
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMain: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  suggestionSecondary: {
    fontSize: 13,
    color: '#666',
  },
});

