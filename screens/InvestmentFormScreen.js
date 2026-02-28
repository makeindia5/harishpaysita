import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const InvestmentFormScreen = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    age: '',
    timeperiod: '',
    amount: '',
    expectedinterest: '',
    additionalRequirement: '',
  });

  const [selectedInterest, setSelectedInterest] = useState('');
  const interestRates = ['4-6%', '6-8%', '8-10%', '10-12%'];

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleReset = () => {
    setForm({
      name: '',
      contact: '',
      email: '',
      age: '',
      timeperiod: '',
      amount: '',
      expectedinterest: '',
      additionalRequirement: '',
    });
    setSelectedInterest('');
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    if (!form.email.trim()||!isEmailValid(form.email))
        return Alert.alert(t('home_service_form.validation_error'), t('home_service_form.enter_email'));
      if (form.serviceType.length === 0)
    
    if (!form.contact.trim() || form.contact.length !== 10 || !/^\d+$/.test(form.contact)) {
      Alert.alert('Error', 'Please enter a valid 10-digit contact number.');
      return;
    }

    try {
      const response = await fetch('https://freepe.in/submit-investment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        Alert.alert('Success', 'Form submitted successfully!', [
          { text: 'OK', onPress: () => handleReset() },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Network error while submitting the form.');
    }
  };

  const isFormValid = form.name.trim() && form.contact.trim();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formWrapper}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Investment Form</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Contact (10-digit)"
              keyboardType="phone-pad"
              value={form.contact}
              onChangeText={(text) => {
                if (/^\d*$/.test(text) && text.length <= 10) {
                  handleChange('contact', text);
                }
              }}
              maxLength={10}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(text) => handleChange('age', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Investment Time Period"
            value={form.timeperiod}
            onChangeText={(text) => handleChange('timeperiod', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Investment Amount"
            keyboardType="numeric"
            value={form.amount}
            onChangeText={(text) => handleChange('amount', text)}
          />

          <Text style={styles.label}>Expected Interest</Text>
          {interestRates.reduce((rows, rate, index) => {
            if (index % 2 === 0) {
              rows.push([rate]);
            } else {
              rows[rows.length - 1].push(rate);
            }
            return rows;
          }, []).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((rate, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.rateButton, selectedInterest === rate && styles.selectedRate]}
                  onPress={() => {
                    setSelectedInterest(rate);
                    handleChange('expectedinterest', rate);
                  }}
                >
                  <Text style={[styles.rateButtonText, selectedInterest === rate && styles.selectedRateText]}>
                    {rate}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TextInput
            style={styles.textArea}
            placeholder="Additional Requirements"
            multiline
            numberOfLines={3}
            value={form.additionalRequirement}
            onChangeText={(text) => handleChange('additionalRequirement', text)}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf7ff',
  },
  formWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#1D154A',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1D154A',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    height: 80,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1D154A',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  rateButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedRate: {
    backgroundColor: '#FFA500',
    borderColor: '#FF8C00',
  },
  rateButtonText: {
    fontWeight: 'bold',
    color: '#1D154A',
  },
  selectedRateText: {
    color: '#FFF',
  },
});

export default InvestmentFormScreen;
