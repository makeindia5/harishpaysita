import React, { useState, useEffect ,useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,Dimensions,ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
const { width } = Dimensions.get('window');

// const ads = [
//   {
//     // title: 'Ad 1',
//     image: require('../assets/ad1.png'), // Replace with your local image
//   },
//   // {
//   //   // title: 'Ad 2',
//   //   image: require('../assets/ad2.png'),
//   // },
//   // {
//   //   title: 'Ad 3',
//   //   image: require('./assets/ad3.jpg'),
//   // },
// ];
const MobileDetailsScreen = ({ route, navigation }) => {
  const {
    operatorName,
    phoneNumber,
    category: selectedCategory,selectedOperatorId,
    selectedPlan,
  } = route.params || {};
  const [token2, setToken2] = useState(null);
  const [loading, setLoading] = useState(false);

  const refid = `REF${Date.now()}`; // Unique ref id

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://freepe.in/api/token'); // Your backend JWT API
        const data = await response.json();
        setToken2(data.token2);
      } catch (err) {
        console.error('Error fetching token:', err);
        Alert.alert('Error', 'Failed to get authorization token.');
      }
    };
    fetchToken();
  }, []);

  const DoRecharge = async () => {
    if (!token2) {
      Alert.alert('Please wait', 'Authorization token is not yet available.');
      return;
    }

    // Validate phone number - only digits, length 10
    // const cleanedNumber = phoneNumber.replace(/\D/g, '');
    // if (!/^\d{10}$/.test(cleanedNumber)) {
    //   Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
    //   return;
    // }


    const options = {
      method: 'POST',
      url: 'https://api.paysprint.in/api/v1/service/recharge/recharge/dorecharge',
      headers: {
        accept: 'text/plain',
        'content-type': 'application/json',
        Token: token2,
      },
      data: {
        operator: selectedOperatorId,            // Must be numeric
        canumber: phoneNumber,         // 10-digit mobile number
        amount: selectedPlan.amount,
        referenceid: refid, 
      },
    };
    try {
      const res = await axios.request(options);
      const result = res.data;

      if (result.status === false) {
        Alert.alert('Recharge Failed', result.message);
        return;
      }
      navigation.navigate('SuccessScreen', {
        successData: result,
        phoneNumber,
        selectedPlan,
        operatorName,
     amount: selectedPlan.amount,
      } ); 
    }  catch (err) {
      setLoading(false);
      const message = err?.response?.data?.message || 'Something went wrong';
      Alert.alert('Recharge Error', message);
      // console.error('Recharge failed:', err.response?.data || err.message);
      
    }
  };

  if (!selectedPlan) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ fontSize: 18, color: 'red' }}>Plan details not available.</Text>
      </SafeAreaView>
    );
  }
//  const scrollViewRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % ads.length;
//       scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
//       setCurrentIndex(nextIndex);
//     }, 6000);

//     return () => clearInterval(timer);
//   }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container}>
   
      <Text style={styles.header}>Recharge Details</Text>

      {/* Contact Info */}
      <View style={styles.contactContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} // Generic user icon
          style={styles.contactImage}
        />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{phoneNumber}</Text>

          <Text style={styles.contactOperator}>{operatorName} - {selectedCategory}</Text>
        </View>
      </View>

      {/* Plan Summary Card */}
     <View style={styles.card}>
  <View style={styles.topRow}>
    <Text style={styles.amount}>₹{selectedPlan.amount}</Text>

    <View style={styles.planDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Validity</Text>
        <Text style={styles.detailValue}>{selectedPlan.validity || '-'}</Text>
      </View>

      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Data</Text>
        <Text style={styles.detailValue}>
          {selectedPlan.data || selectedPlan.pillTags?.find(tag => /\d+GB/i.test(tag)) || '-'}
        </Text>
      </View>
    </View>
  </View>

  <View style={styles.divider} />

  <Text style={styles.description}>{selectedPlan.description || '-'}</Text>
</View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={DoRecharge}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Proceed to Pay ₹{selectedPlan.amount}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MobileDetailsScreen;

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 12,
},

amount: {
  fontSize: 28,
  fontWeight: '700',
  color: '#000',
},

planDetails: {
  flexDirection: 'row',
  gap: 20,
},

detailItem: {
  alignItems: 'center',
  marginLeft: 10,
},

detailLabel: {
  fontSize: 12,
  color: '#888',
  marginBottom: 2,
},

detailValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1a1a1a',
},

description: {
  fontSize: 14,
  color: '#333',
  lineHeight: 20,
},

  adContainers: {
    width,
    height: 160,
    backgroundColor: '#e6f0ff',
  },
  image: {
    width,
    height: 160,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003087',
    marginBottom: 22,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dbe4f3',
  },
  contactImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  contactOperator: {
    fontSize: 13,
    color: '#607d8b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#f9fbfd',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#d6e3f3',
  },
  totalText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0058cc',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#dfe6ed',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#7b8a97',
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#263238',
    textAlign: 'right',
    flexShrink: 2,
  },
  payButton: {
    backgroundColor: '#003087',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
});