import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  Alert, FlatList, Modal, ActivityIndicator, Dimensions, Platform, ScrollView, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../theme/Theme';

const { width } = Dimensions.get('window');

const ads = [
  {
    image: require('../assets/ad2.png')
  }
];

const MobileRecharge = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Prepaidoperator, setPrepaidoperator] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token1, setToken1] = useState(null);
  const [token2, setToken2] = useState(null);
  const [token3, setToken3] = useState(null);
  
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  // 🔐 Get Token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://indiaapay.com/api/token');
        const data = await response.json();
        setToken1(data.token1);
        setToken2(data.token2);
        setToken3(data.token3);
      } catch (err) {
        console.error('❌ Token Error:', err);
      }
    };
    fetchToken();
  }, []);

  // 📡 Fetch Prepaid Operators
  useEffect(() => {
    if (!token3) return;
    const fetchOperators = async () => {
      try {
        const response = await axios.post(
          'https://api.paysprint.in/api/v1/service/recharge/recharge/getoperator',
          {},
          {
            headers: {
              accept: 'application/json',
              Token: token3,
            },
          }
        );
        const data = response.data;
        const filtered = data.data.filter((item) => item.category === "Prepaid");
        setPrepaidoperator(filtered);
      } catch (err) {
        console.error('❌ Operator Fetch Error:', err);
      }
    };
    fetchOperators();
  }, [token3]);

  // 📇 Open Contacts
  const openContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to contacts.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
    if (data.length > 0) {
      setContacts(data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0));
      setModalVisible(true);
    } else {
      Alert.alert('No contacts found');
    }
  };

  // 📌 Select Contact
 const handleViewPlans = async () => {

  if (!token1 || !token2) {
    Alert.alert("Please wait", "Authentication is still loading");
    return;
  }

  if (!phoneNumber || phoneNumber.replace(/\D/g, '').length !== 10) {
    Alert.alert("Invalid number", "Enter a valid 10 digit mobile number");
    return;
  }

  if (!selectedOperatorId) {
    Alert.alert("Select operator");
    return;
  }

  const selectedOp = Prepaidoperator.find(
    op => String(op.id) === String(selectedOperatorId)
  );

  if (!selectedOp) {
    Alert.alert("Operator not found");
    return;
  }

  try {
    setLoading(true);

    console.log("token1:", token1);
    console.log("token2:", token2);
    console.log("selectedOp:", selectedOp);

    // 1️⃣ HLR check
    const hlrResponse = await axios.post(
      'https://api.paysprint.in/api/v1/service/recharge/hlrapi/hlrcheck',
      {
        number: phoneNumber.replace(/\D/g, ''),
        type: 'mobile',
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Token": token1,
        },
      }
    );

    const hlrInfo = hlrResponse?.data?.info;

    if (!hlrInfo?.circle) {
      Alert.alert("Failed", "Unable to detect circle");
      setLoading(false);
      return;
    }

    // 2️⃣ Browse plans
    const plansResponse = await axios.post(
      'https://api.paysprint.in/api/v1/service/recharge/hlrapi/browseplan',
      {
        circle: hlrInfo.circle,
        op: selectedOp.name,   // use selected operator, not HLR operator
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Token": token2,
        },
      }
    );

    navigation.navigate('ViewPlans', {
      operatorName: selectedOp.name,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      selectedOperatorId,
      plans: plansResponse.data,
    });

  } catch (err) {

    console.log(
      "Paysprint error:",
      err?.response?.data || err.message
    );

    Alert.alert(
      "Authentication failed",
      err?.response?.data?.message || "Unable to fetch plans"
    );

  } finally {
    setLoading(false);
  }
};

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <StatusBar
              backgroundColor={colors.background}
              barStyle="dark-content"
              translucent={false}
            />
      
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Mobile Recharge</Text>
              <View style={{ width: 40 }} />
            </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ad Banner */}
        <View style={styles.containers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          >
            {ads.map((ad, index) => (
              <View key={index} style={styles.adContainers}>
                <Image source={ad.image} style={styles.image} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.screen}>
          {/* 🔢 Phone Input */}
          <View style={[styles.searchContainer, { backgroundColor: colors.option }]}>
            <Ionicons name="search" size={22} color="#666" />
            <TextInput
              style={[styles.searchtextStyle, { color: colors.text }]}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity onPress={openContacts}>
              <Ionicons name="person-outline" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* 🏢 Operator Picker */}
          <View style={[styles.pickerWrapper, { backgroundColor: colors.option, borderColor: colors.border || '#E0E0E0' }]}>
            <Picker
              selectedValue={selectedOperatorId}
              onValueChange={(value) => setSelectedOperatorId(value)}
              style={{ color: colors.text }}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Select Operator" value={null} />
              {Prepaidoperator.map((op, index) => (
                <Picker.Item key={index} label={op.name} value={op.id} />
              ))}
            </Picker>
          </View>

          {/* 🚀 Proceed Button */}
          <TouchableOpacity
            style={[styles.proceedButtons, loading && styles.proceedButtonDisabled]}
            onPress={handleViewPlans}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.proceedButtonText}>View Plans</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 📇 Contact Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Contact</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectContact(item)}
                  style={[styles.contactItem, { backgroundColor: colors.option }]}
                >
                  <View style={styles.contactAvatar}>
                    <Ionicons name="person" size={20} color="#666" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={styles.contactNumber}>{item.phoneNumbers?.[0]?.number}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MobileRecharge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  containers: {
    width,
    height: 180,
    marginBottom: 20,
  },
  adContainers: {
    width,
    height: 180,
  },
  image: {
    width,
    height: 180,
  },
  screen: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginBottom: 20,
  },
  searchtextStyle: {
    flex: 1,
    fontSize: 15,
    marginLeft: 12,
  },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  proceedButtons: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  proceedButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
    marginTop: 12,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});