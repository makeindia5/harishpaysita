import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../constants/api';
const Flight2 = ({ route }) => {
  // Destructure the passed props
  const { origin, destination, cabinClass, journeyType,
    departureDate,
    adultCount,
    childCount,
    infantCount,
    directFlight,
    oneStopFlight,
  } = route.params;
  const [items, setItems] = useState([]);
  const formatForBackend = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
  };
  console.log(origin,
    destination,
    cabinClass,
    journeyType,
    formatForBackend(departureDate),
    adultCount,
    childCount,
    infantCount,
    directFlight,
    oneStopFlight,)
  // Fetch flight data from backend
  const handleSearchFlight = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/flightSearch`, {
        JourneyType: journeyType,
        AdultCount: adultCount,
        ChildCount: childCount,
        InfantCount: infantCount,
        Origin: origin,
        Destination: destination,
        date: formatForBackend(departureDate),
        CabinClass: cabinClass,
        DirectFlight: directFlight,
        OnestopFlight: oneStopFlight,
      });
      console.log('Flight response data:', response.data);
      //   const formattedItems = response.data.map((e) => ({
      //     label: e.CITYNAME,
      //     value: e.CITYCODE,
      //     origin,
      //     destination,
      //     cabinClass,
      //     journeyType,
      //     departureDate,
      //     adultCount,
      //     childCount,
      //     infantCount,
      //     directFlight,
      //     oneStopFlight,
      //   }));

      //   setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching flights:', error.message);
      Alert.alert('Error', 'Something went wrong while fetching flights.');
    }
  };

  useEffect(() => {
    // Call the function when the component is mounted
    handleSearchFlight();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Origin: {origin}</Text>
      <Text>Destination: {destination}</Text>
      <Text>Cabin Class: {cabinClass}</Text>
      <Text>Journey Type: {journeyType}</Text>
      <Text>Departure Date: {new Date(departureDate).toLocaleDateString()}</Text>
      <Text>Adults: {adultCount}</Text>
      <Text>Children: {childCount}</Text>
      <Text>Infants: {infantCount}</Text>
      <Text>Direct Flight: {directFlight ? 'Yes' : 'No'}</Text>
      <Text>One Stop Flight: {oneStopFlight ? 'Yes' : 'No'}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default Flight2;
