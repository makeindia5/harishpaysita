import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const TourAndTravelsForm = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    serviceType: 'flight',
    gender: 'male',
    fromDate: new Date(),
    toDate: new Date(),
    Budget: '',
  });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.contact.trim() ||
      form.contact.length !== 10 ||
      !form.Budget.trim() ||
      !form.email.trim() ||
      !isEmailValid(form.email) ||
      form.toDate < form.fromDate
    ) {
      Alert.alert(t('tandtf.error_title'), t('tandtf.error_message'));
      return;
    }

    try {
      const response = await fetch('https://freepe.in/submit-tour-travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fromDate: form.fromDate.toISOString().split('T')[0],
          toDate: form.toDate.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t('tandtf.success_title'), data.message);

        // ✅ Reset form after successful submission
        setForm({
          name: '',
          email: '',
          contact: '',
          serviceType: 'flight',
          gender: 'male',
          fromDate: new Date(),
          toDate: new Date(),
          Budget: '',
        });
      } else {
        Alert.alert(t('tandtf.error_title'), data.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert(t('tandtf.error_title'), 'Something went wrong');
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      contact: '',
      serviceType: 'flight',
      gender: 'male',
      fromDate: new Date(),
      toDate: new Date(),
      Budget: '',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formWrapper}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('tandtf.title')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('tandtf.name')}
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t('tandtf.email')}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t('tandtf.contact')}
              keyboardType="phone-pad"
              value={form.contact}
              onChangeText={(text) => {
                if (/^\d*$/.test(text) && text.length <= 10) {
                  handleChange('contact', text);
                }
              }}
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>{t('tandtf.gender')}</Text>
          <View style={styles.radioContainer}>
            {['male', 'female', 'other'].map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => handleChange('gender', opt)}
                style={styles.customRadioButton}
              >
                <View style={[
                  styles.outerCircle,
                  form.gender === opt && styles.outerCircleSelected
                ]}>
                  {form.gender === opt && <View style={styles.innerCircle} />}
                </View>
                <Text style={{ marginLeft: 6 }}>
                  {t(`tandtf.genders.${opt}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('tandtf.service_type')}</Text>
          <Picker
            selectedValue={form.serviceType}
            onValueChange={(val) => handleChange('serviceType', val)}
          >
            {['flight', 'bus', 'hotel', 'packages'].map(opt => (
              <Picker.Item
                key={opt}
                label={t(`tandtf.services.${opt}`)}
                value={opt}
              />
            ))}
          </Picker>

          <Text style={styles.label}>{t('tandtf.from_date')}</Text>
          <TouchableOpacity
            onPress={() => setShowFromDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>{form.fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={form.fromDate}
              mode="date"
              minimumDate={new Date()} // ✅ disable past dates
              onChange={(_, d) => {
                setShowFromDatePicker(false);
                if (d) handleChange('fromDate', d);
              }}
            />
          )}

          <Text style={styles.label}>{t('tandtf.to_date')}</Text>
          <TouchableOpacity
            onPress={() => setShowToDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>{form.toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={form.toDate}
              mode="date"
              minimumDate={form.fromDate} // ✅ ensure toDate ≥ fromDate
              onChange={(_, d) => {
                setShowToDatePicker(false);
                if (d) handleChange('toDate', d);
              }}
            />
          )}

          <Text style={styles.label}>{t('tandtf.budget')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('tandtf.budget')}
            keyboardType="numeric"
            value={form.Budget}
            onChangeText={(text) => handleChange('Budget', text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{t('tandtf.submit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>{t('tandtf.reset')}</Text>
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
    backgroundColor: "#ebf7ff",
  },
  formWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#1D154A",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#1D154A",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  customRadioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1D154A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircleSelected: {
    borderColor: '#04AA6D',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#04AA6D',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#04AA6D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  resetButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TourAndTravelsForm;
