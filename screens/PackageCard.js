
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const PackageCard = ({ packageData }) => {
  const [days, setDays] = useState(packageData.days);

  return (
    
    <View style={styles.card}>
      <Image source={packageData.image} style={styles.image} resizeMode="cover" />
      
      {/* Title & Duration */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{packageData.destination}</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{days}N/{days + 1}D</Text>
        </View>
      </View>

      {/* Details */}
      <Text style={styles.details}>{packageData.nights}N {packageData.location}</Text>

      {/* Amenities */}
      <View style={styles.amenities}>
        <View style={styles.amenityItem}>
          <Ionicons name="airplane" size={14} color="black" />
          <Text style={styles.amenityText}> Round Trip Flights</Text>
        </View>
        <View style={styles.amenityItem}>
          <Ionicons name="car" size={14} color="black" />
          <Text style={styles.amenityText}> Airport Transfers</Text>
        </View>
        <View style={styles.amenityItem}>
          <Ionicons name="restaurant" size={14} color="black" />
          <Text style={styles.amenityText}> Selected Meals</Text>
        </View>
        <View style={styles.amenityItem}>
          <FontAwesome name="star" size={14} color="gold" />
          <Text style={styles.amenityText}> 4-Star Hotels</Text>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceContainer}>
        <Text style={styles.discountText}>Includes ₹5,553 discount for flights</Text>
        <Text style={styles.price}>₹{packageData.price.toLocaleString()}/Person</Text>
      </View>

    </View>
    
  );
};

export default function TravelPackages() {
    const categories = {
        Popular: [
          { id: 1, destination: 'Unwind in Krabi and Phuket', nights: 6, location: '2N Krabi • 4N Phuket', days: 6, price: 71915, image: require('../assets/packages/krabi.jpg') },
          { id: 2, destination: 'Explore Bali', nights: 5, location: '5N Bali', days: 5, price: 58999, image: require('../assets/packages/bali.webp') },
          { id: 7, destination: 'Maldives Paradise', nights: 4, location: '4N Maldives', days: 4, price: 84999, image: require('../assets/packages/maldives.jpg') },
          { id: 8, destination: 'Thailand Adventure', nights: 7, location: '3N Bangkok • 4N Phuket', days: 7, price: 69999, image: require('../assets/packages/thailand.jpg') },
        ],
        "Explore India": [
          { id: 3, destination: 'Discover Goa', nights: 4, location: '4N Goa', days: 4, price: 24999, image: require('../assets/packages/goa.jpeg') },
          { id: 4, destination: 'Kerala Backwaters', nights: 5, location: '3N Munnar • 2N Alleppey', days: 5, price: 32999, image: require('../assets/packages/kerala.jpg') },
          { id: 9, destination: 'Royal Rajasthan', nights: 6, location: '2N Jaipur • 2N Jaisalmer • 2N Udaipur', days: 6, price: 38999, image: require('../assets/packages/rajasthan.jpeg') },
          { id: 10, destination: 'Kashmir Valley', nights: 5, location: '3N Srinagar • 2N Gulmarg', days: 5, price: 41999, image: require('../assets/packages/kashmir.jpeg') },
        ],
        "International Tours": [
          { id: 5, destination: 'Paris & Switzerland', nights: 7, location: '4N Paris • 3N Zurich', days: 7, price: 129999, image: require('../assets/packages/paris.jpg') },
          { id: 6, destination: 'Dubai Luxury Trip', nights: 5, location: '5N Dubai', days: 5, price: 89999, image: require('../assets/packages/dubai.jpg') },
          { id: 11, destination: 'Japan Blossoms', nights: 7, location: '4N Tokyo • 3N Kyoto', days: 7, price: 149999, image: require('../assets/packages/japan.jpg') },
          { id: 12, destination: 'USA', nights: 8, location: '4N New York • 4N LA', days: 8, price: 159999, image: require('../assets/packages/usa.jpg') },
        ],
        Maharashtra: [
          { id: 20, destination: 'Lonavala & Khandala Retreat', nights: 3, location: '3N Lonavala', days: 3, price: 21999, image: require('../assets/packages/lonavala.png') },
          { id: 21, destination: 'Ajanta & Ellora Caves', nights: 4, location: '2N Aurangabad • 2N Ellora', days: 4, price: 24999, image: require('../assets/packages/ellora.jpg') },
      ],
      
      Goa: [
          { id: 22, destination: 'South Goa Explorer', nights: 3, location: '3N South Goa', days: 3, price: 23999, image: require('../assets/packages/goa_south.jpg') },
          { id: 23, destination: 'North Goa Adventure', nights: 5, location: '5N North Goa', days: 5, price: 27999, image: require('../assets/packages/goa_north.jpg') },
      ],
      
      Rajasthan: [
          { id: 24, destination: 'Udaipur & Mount Abu', nights: 4, location: '2N Udaipur • 2N Mount Abu', days: 4, price: 32999, image: require('../assets/packages/udaipur.jpeg') },
          { id: 25, destination: 'Jaisalmer Desert Safari', nights: 3, location: '3N Jaisalmer', days: 3, price: 29999, image: require('../assets/packages/jaisalmer.jpg') },
      ],
      
      Kerala: [
          { id: 26, destination: 'Kovalam & Varkala Beach', nights: 4, location: '2N Kovalam • 2N Varkala', days: 4, price: 27999, image: require('../assets/packages/kovalam.jpg') },
          { id: 27, destination: 'Wayanad & Thekkady Wildlife', nights: 5, location: '3N Wayanad • 2N Thekkady', days: 5, price: 34999, image: require('../assets/packages/wayanad.jpg') },
      ],
      
      Himachal: [
          { id: 28, destination: 'Dharamshala & McLeod Ganj', nights: 4, location: '4N Dharamshala', days: 4, price: 29999, image: require('../assets/packages/dharamshala.jpg') },
          { id: 29, destination: 'Spiti Valley Adventure', nights: 7, location: '7N Spiti', days: 7, price: 49999, image: require('../assets/packages/spiti.jpg') },
      ],
      
      Uttarakhand: [
          { id: 30, destination: 'Nainital & Jim Corbett Safari', nights: 4, location: '2N Nainital • 2N Jim Corbett', days: 4, price: 27999, image: require('../assets/packages/nainital.jpg') },
          { id: 31, destination: 'Auli Skiing Adventure', nights: 5, location: '5N Auli', days: 5, price: 35999, image: require('../assets/packages/auli.jpg') },
      ],
      
    };
      

    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        destination: '',
        days: '',
        nights: '',
        priceRange: '',
        adults: '',
        children: '',
    });
const handleSubmit = async () => {
  try {
    const response = await fetch('https://freepe.in/custom-packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log('Package saved:', data);
Alert.alert("Success", "Form Submitted Successfully");
    setModalVisible(false); // Close modal after successful submit

  } catch (error) {
    console.error('Error submitting package:', error);
  }
};

    const states = ['Maharashtra', 'Goa', 'Rajasthan', 'Kerala', 'Himachal', 'Uttarakhand'];
    const [selectedState, setSelectedState] = useState(states[0]); // Default to first state
    const navigation = useNavigation();
      
      return (
        <SafeAreaView style={{ flex: 1 }}>

            {/* Header */}
            <View style={styles.header}>
                {/* Back Button */}
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                         <Icon name="arrow-back" size={24} color="#333" />
                             </TouchableOpacity>

                {/* Title */}
                <Text style={styles.headerText}>Packages</Text>

                {/* Custom Package Button */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.customPackageButton}>
                  <Entypo name="plus" size={24} color="white" />
                    <Text style={styles.customPackageText}>Customise your Package</Text>
                </TouchableOpacity>
            </View>

                        {/* Custom Package Modal */}
                        <Modal visible={modalVisible} transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.modalContainer}>
                          <Text style={styles.modalTitle}>Create Custom Package</Text>

                          {/* Input Fields */}
                          {['Destination', 'Days', 'Nights', 'Price Range', 'Adults', 'Children'].map((field) => (
                              <TextInput
                                  key={field}
                                  placeholder={field}
                                  style={styles.input}
                                  keyboardType={field === 'Days' || field === 'Nights' || field === 'Adults' || field === 'Children' ? 'numeric' : 'default'}
                                  onChangeText={(text) => setForm({ ...form, [field.toLowerCase().replace(' ', '')]: text })}
                              />
                          ))}

                          {/* Buttons */}
                          <View style={styles.buttonContainer}>
                              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                  <Text style={styles.cancelText}>Cancel</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.submitButton}onPress={handleSubmit}>
                                  <Text style={styles.submitText}>Submit</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
            </Modal>

            <ScrollView style={styles.container}>

        {/* Category Cards */}
        {Object.entries(categories)
            .filter(([category]) => 
                ["Popular", "Explore India", "International Tours"].includes(category)
            )
            .map(([category, packages]) => (
                <View key={category} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {packages.map((pkg) => (
                            <TouchableOpacity 
                                key={pkg.id} 
                                onPress={() => navigation.navigate('PackageDetails', { packageData: pkg })}
                            >
                                <PackageCard packageData={pkg} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ))
        }



        {/* Horizontal Scroll for States */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateScroll}>
            {states.map((state) => (
                <TouchableOpacity 
                    key={state} 
                    onPress={() => setSelectedState(state)} 
                    style={[styles.stateButton, selectedState === state && styles.activeStateButton]}
                >
                    <Text style={[styles.stateText, selectedState === state && styles.activeStateText]}>
                        {state}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Display Selected State Packages */}
        <View style={styles.statePackageContainer}>
            <Text style={styles.stateHeader}>{selectedState} Packages</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories[selectedState]?.map((pkg) => (
                    <PackageCard key={pkg.id} packageData={pkg} />
                )) || <Text>No packages available</Text>}
            </ScrollView>
        </View>
    </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        gap:10,
    },
    
    backButton: {
        padding: 2,
    },
    
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, 
    },
    
    customPackageButton: {
      flexDirection: "row",
      paddingVertical: 1,
      paddingHorizontal: 9,
      backgroundColor: "#1d154a",
      borderRadius: 5,
      alignSelf: "flex-end",  
      justifyContent: "center", 
      alignItems: "center",
  },
    
  customPackageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 150, 
    flexWrap: 'wrap',
    textAlign: 'center', 
},
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    cancelText: {
        color: '#333',
        fontWeight: 'bold',
    },
    submitButton: {
        flex: 1,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },


      title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
    scrollContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
      },
      
      card: {
        width: 290, 
        height: 350,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 3,
      },
      
      image: {
        width: '100%',
        height: 170, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      
      infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginTop: 4,
      },
      
      durationBadge: {
        backgroundColor: '#007bff',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 4,
      },
      
      durationText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
      },
      
      details: {
        fontSize: 12, 
        color: '#555',
        paddingHorizontal: 6,
      },
      
      amenities: {
        paddingHorizontal: 6,
        marginTop: 4,
      },
      
      amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
      },
      
      amenityText: {
        fontSize: 11, 
        color: '#333',
        marginLeft: 3,
      },
      
      priceContainer: {
        backgroundColor: '#f8f9fa',
        padding: 6,
        borderRadius: 5,
        marginHorizontal: 6,
        marginTop: 4,
      },
      
      discountText: {
        fontSize: 10,
        color: 'green',
      },
      
      price: {
        fontSize: 14, 
        fontWeight: 'bold',
        color: '#000',
      },
      
      container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
      },
      
      categoryContainer: {
        marginBottom: 20,  
      },
      
      categoryTitle: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginLeft: 10, 
        color: '#1D154A',
      },
      stateScroll: {
        paddingLeft: 10,
    },
    stateButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        marginRight: 10,
    },
    activeStateButton: {
        backgroundColor: '#FF6F61', 
    },
    stateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    activeStateText: {
        color: '#fff',
    },
    statePackageContainer: {
        marginTop: 15,
        paddingHorizontal: 10,
    },
    stateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1D154A',
    },  

});