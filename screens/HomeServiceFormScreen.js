import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Animated, PanResponder
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const HomeServiceFormScreen = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '', contact: '', email: '',
    district: '', taluka: '', pinCode: '',
    serviceType: [], propertyType: '',
    area: '', date: new Date(),
    additionalRequirement: '',
  });

  const MAX_VALUE = 2000;
  const STEP = 5;
  const [value, setValue] = useState(200);
  const animatedValue = new Animated.Value(value);

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  const toggleSelection = (field, val) => {
    const arr = form[field].includes(val)
      ? form[field].filter(i => i !== val)
      : [...form[field], val];
    handleChange(field, arr);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      let newVal = Math.min(MAX_VALUE, Math.max(0, (g.moveX / 300) * MAX_VALUE));
      newVal = Math.round(newVal / STEP) * STEP;
      setValue(newVal);
      animatedValue.setValue(newVal);
      handleChange('area', newVal.toString());
    },
  });

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: form.date,
      onChange: handleDateChange,
      mode: 'date',
      is24Hour: true,
      display: 'default',
    });
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      handleChange('date', selectedDate);
    }
  };

  const handleReset = () => {
    setForm({
      name: '', contact: '', email: '',
      district: '', taluka: '', pinCode: '',
      serviceType: [], propertyType: '',
      area: '', date: new Date(),
      additionalRequirement: '',
    });
    setValue(200);
    animatedValue.setValue(200);
  };

const validateAndSubmit = async () => {
  if (!form.name.trim())
    return Alert.alert(t('home_service_form.validation_error'), t('home_service_form.enter_name'));
  if (!/^\d{10}$/.test(form.contact))
    return Alert.alert(t('home_service_form.validation_error'), t('home_service_form.enter_valid_contact'));
  if (!form.email.trim())
    return Alert.alert(t('home_service_form.validation_error'), t('home_service_form.enter_email'));
  if (form.serviceType.length === 0)
    return Alert.alert(t('home_service_form.validation_error'), t('home_service_form.select_service'));

  try {
    const res = await axios.post('https://freepe.in/api/home-service', form); // ← यहाँ अपने IP का इस्तेमाल करें
    console.log(res.data);
    Alert.alert('✅ Success', 'Form submitted successfully!', [{ text: 'OK', onPress: handleReset }]);
  } catch (err) {
    console.error('❌ Submission Error:', err.message);
    Alert.alert('Error', 'Something went wrong while submitting form.');
  }
};


  const interpolateColor = val => {
    const g = Math.round(165 + (120 - 165) * (val / MAX_VALUE));
    return `rgb(255,${g},0)`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formWrapper}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('home_service_form.name')}
            value={form.name}
            onChangeText={txt => handleChange('name', txt)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t('home_service_form.contact')}
              keyboardType="phone-pad"
              value={form.contact}
              onChangeText={txt => /^\d*$/.test(txt) && txt.length <= 10 && handleChange('contact', txt)}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t('home_service_form.email')}
              keyboardType="email-address"
              value={form.email}
              onChangeText={txt => handleChange('email', txt)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('home_service_form.district')}
            value={form.district}
            onChangeText={txt => handleChange('district', txt)}
          />
          <TextInput
            style={styles.input}
            placeholder={t('home_service_form.taluka')}
            value={form.taluka}
            onChangeText={txt => handleChange('taluka', txt)}
          />
          <TextInput
            style={styles.input}
            placeholder={t('home_service_form.pinCode')}
            keyboardType="numeric"
            value={form.pinCode}
            onChangeText={txt => handleChange('pinCode', txt)}
          />

          <Text style={styles.label}>{t('home_service_form.property_type')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.propertyType}
              onValueChange={val => handleChange('propertyType', val)}
            >
              <Picker.Item label={t('home_service_form.select_property')} value="" />
              {[
                'apartment_flat',
                'bungalow',
                'villa',
                'independent_house',
                'shop',
                'office',
                'commercial',
                'building',
                'others'
              ].map(pt => (
                <Picker.Item key={pt} label={t(`home_service_form.propertyTypes.${pt}`)} value={pt} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>{t('home_service_form.service_type')}</Text>
          <View style={styles.categoryContainer}>
            {[
              'interior_designer',
              'painting',
              'vaastu_consultant',
              'house_cleaning',
              'pest_control',
              'civil_work',
              'wiring_rewiring',
              'water_proofing'
            ].map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.categoryButton, form.serviceType.includes(item) && styles.selectedCategory]}
                onPress={() => toggleSelection('serviceType', item)}
              >
                <Text style={[styles.categoryText, form.serviceType.includes(item) && styles.selectedCategoryText]}>
                  {t(`home_service_form.services.${item}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('home_service_form.service_area')}</Text>
          <View style={styles.Slidercontainer}>
            <Text style={styles.valueText}>{t('home_service_form.area_value', { value })}</Text>
            <View style={styles.trackContainer}>
              <View style={[styles.filledTrack, {
                width: `${(value / MAX_VALUE) * 100}%`, backgroundColor: interpolateColor(value)
              }]} />
            </View>
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.thumb, { left: `${(value / MAX_VALUE) * 92}%` }]}
            />
          </View>

          <Text style={styles.label}>{t('home_service_form.date')}</Text>
          <TouchableOpacity style={styles.input} onPress={showDatePicker}>
            <Text>{form.date.toDateString()}</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textArea}
            placeholder={t('home_service_form.additional_requirement')}
            multiline
            numberOfLines={3}
            value={form.additionalRequirement}
            onChangeText={txt => handleChange('additionalRequirement', txt)}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, !form.name || !form.contact || !form.email ? styles.disabledButton : null]}
              onPress={validateAndSubmit}
              disabled={!form.name || !form.contact || !form.email}
            >
              <Text style={styles.buttonText}>{t('home_service_form.submit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.buttonText}>{t('home_service_form.reset')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.info}>
            {t('home_service_form.agreement_prefix')}{' '}
            <Text style={styles.linkText}>{t('home_service_form.terms')}</Text> {t('home_service_form.and')}{' '}
            <Text style={styles.linkText}>{t('home_service_form.privacy')}</Text>{' '}{t('home_service_form.agreement_suffix')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ebf7ff" },
  formWrapper: {
    flexGrow: 1, backgroundColor: "#FAF9F6", borderRadius: 15,
    elevation: 5, borderWidth: 3, borderColor: "#303030", alignItems: "center"
  },
  formContainer: { width: "100%", padding: 15, backgroundColor: "#ebf7ff" },
  input: {
    marginTop: 5, borderWidth: 1, borderColor: "#303030",
    padding: 12, borderRadius: 10, marginBottom: 15, backgroundColor: "#F5F5F5"
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  label: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1D154A' },
  pickerContainer: {
    borderWidth: 1, borderColor: '#303030', borderRadius: 10,
    backgroundColor: '#F5F5F5', marginBottom: 15
  },
  categoryContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20
  },
  categoryButton: {
    padding: 12, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10,
    backgroundColor: '#f9f9f9', width: '48%', alignItems: 'center', marginBottom: 10
  },
  selectedCategory: { backgroundColor: '#FFA500', borderColor: '#CCCCCC' },
  selectedCategoryText: { color: '#fff' },
  categoryText: { color: '#333', fontWeight: 'bold' },
  textArea: {
    borderWidth: 1, borderColor: '#CCCCCC', padding: 12,
    borderRadius: 10, marginBottom: 15, height: 80, backgroundColor: '#f9f9f9'
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: 'green', padding: 12, borderRadius: 5, width: '48%', alignItems: 'center' },
  resetButton: { backgroundColor: '#FF0000' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },
  info: { padding: 5, marginTop: 20 },
  linkText: { color: '#FFA500', fontWeight: 'bold' },
  Slidercontainer: { width: "90%", alignSelf: "center" },
  valueText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  trackContainer: {
    width: "100%", height: 10, borderRadius: 5,
    backgroundColor: "#D3D3D3", overflow: "hidden", marginBottom: 30
  },
  filledTrack: { position: "absolute", height: "100%", borderRadius: 5, left: 0 },
  thumb: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#FFFFFF", borderWidth: 5,
    borderColor: "#D2691E", position: "absolute", top: 20
  },
});

export default HomeServiceFormScreen;
