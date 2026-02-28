import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';

const GrievanceScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.title}>Grievance Redressal</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.content}>
          If you have any complaints or grievances, please reach out to us at:
          {'\n\n'}Email: support@PaySita.com
      
          {'\n'}Address: PaySita Pvt. Ltd., Mumbai, Maharashtra
        </Text>
      </ScrollView>
    </View>
  );
};

export default GrievanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1D154A',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
