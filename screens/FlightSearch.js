import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
const formatForBackend = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const formatForDisplay = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} 00:00:00`;
};
const FlightSearchScreen = ({ navigation }) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [cabinClass, setCabinClass] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [journeyType, setJourneyType] = useState('1');
  const [adultCount, setAdultCount] = useState('');
  const [childCount, setChildCount] = useState('');
  const [infantCount, setInfantCount] = useState('');
  const [directFlight, setDirectFlight] = useState(true);
  const [oneStopFlight, setOneStopFlight] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    handleFetchFlight();
  }, []);

  const handleFetchFlight = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flightAirport`);
      const formattedItems = response.data.map((e) => ({
        label: e.CITYNAME,
        value: e.CITYCODE,
      }));
      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching flights:', error.message);
      Alert.alert('Error', 'Something went wrong while fetching flights.');
    }
  };

  const handleSearchFlights = () => {
    if (!origin || !destination || !cabinClass || !adultCount) {
      Alert.alert('Missing Fields', 'Please fill all required fields');
      return;
    }

    navigation.navigate('flight2', {
      origin,
      destination,
      cabinClass,
      journeyType,
      departureDate,
      adultCount,
      childCount,
      infantCount,
      directFlight,
      oneStopFlight,
    });

    Alert.alert('Search Submitted', 'Searching flights...');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>✈️ Flight Booking</Text>

      {/* From Dropdown with Icon */}
      <Text style={styles.label}>From</Text>
      <View style={styles.iconInputWrapper}>
        <Ionicons name="airplane-outline" size={20} color="#555" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={openFrom}
            value={origin}
            items={items}
            setOpen={setOpenFrom}
            setValue={setOrigin}
            setItems={setItems}
            searchable
            placeholder="Select a city"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="MODAL"
            searchPlaceholder="Type city name..."
          />
        </View>
      </View>

      {/* To Dropdown with Icon */}
      <Text style={styles.label}>To</Text>
      <View style={styles.iconInputWrapper}>
        <Ionicons name="location-outline" size={20} color="#555" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={openTo}
            value={destination}
            items={items}
            setOpen={setOpenTo}
            setValue={setDestination}
            setItems={setItems}
            searchable
            placeholder="Select a city"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="MODAL"
            searchPlaceholder="Type city name..."
          />
        </View>
      </View>

      {/* Cabin Class */}
      <Text style={styles.label}>Cabin Class</Text>
      <RNPickerSelect
        onValueChange={setCabinClass}
        placeholder={{ label: 'Select Cabin Class', value: null }}
        items={[
          { label: 'All', value: '1' },
          { label: 'Economy', value: '2' },
          { label: 'Premium Economy', value: '3' },
          { label: 'Business', value: '4' },
          { label: 'Premium Business', value: '5' },
          { label: 'First', value: '6' },
        ]}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
      />

      {/* Journey Type */}
      <Text style={styles.label}>Journey Type</Text>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          onPress={() => setJourneyType('1')}
          style={[styles.toggleBtn, journeyType === '1' && styles.activeBtn]}>
          <Text style={journeyType === '1' ? styles.activeText : styles.inactiveText}>One Way</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setJourneyType('2')}
          style={[styles.toggleBtn, journeyType === '2' && styles.activeBtn]}>
          <Text style={journeyType === '2' ? styles.activeText : styles.inactiveText}>Two Way</Text>
        </TouchableOpacity>
      </View>

      {/* Departure Date */}
      <Text style={styles.label}>Departure Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Ionicons name="calendar" size={18} color="#666" />
        <Text style={{ marginLeft: 10 }}>{formatForDisplay(departureDate)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              selectedDate.setHours(0, 0, 0, 0);
              setDepartureDate(selectedDate);
            }
            setShowDatePicker(false);
          }}
        />
      )}

      {/* Travelers */}
      <Text style={styles.label}>Travelers</Text>
      <View style={styles.inlineGroup}>
        <View style={styles.iconInputSmall}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <TextInput
            style={styles.smallTextInput}
            placeholder="Adults"
            keyboardType="number-pad"
            value={adultCount}
            onChangeText={setAdultCount}
          />
        </View>
        <View style={styles.iconInputSmall}>
          <Ionicons name="happy-outline" size={18} color="#666" />
          <TextInput
            style={styles.smallTextInput}
            placeholder="Children"
            keyboardType="number-pad"
            value={childCount}
            onChangeText={setChildCount}
          />
        </View>
        <View style={styles.iconInputSmall}>
          <Ionicons name="walk-outline" size={18} color="#666" />
          <TextInput
            style={styles.smallTextInput}
            placeholder="Infants"
            keyboardType="number-pad"
            value={infantCount}
            onChangeText={setInfantCount}
          />
        </View>
      </View>

      {/* Switches */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Direct Flight</Text>
        <Switch value={directFlight} onValueChange={setDirectFlight} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>One Stop Flight</Text>
        <Switch value={oneStopFlight} onValueChange={setOneStopFlight} />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchFlights}>
        <Ionicons name="search" size={20} color="#fff" />
        <Text style={styles.searchText}>Search Flights</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d154a',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  iconInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  iconInputSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginRight: 10,
  },
  smallTextInput: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  inlineGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleGroup: {
    flexDirection: 'row',
    marginTop: 10,
  },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  activeBtn: {
    backgroundColor: '#1d154a',
    borderColor: '#1d154a',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#777',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d154a',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  searchText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    color: '#333',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    color: '#333',
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
};

export default FlightSearchScreen;
