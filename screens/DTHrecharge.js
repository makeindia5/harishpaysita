import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ThemeContext } from '../theme/Theme';

const DTHrecharge = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [selectedOperatorName, setSelectedOperatorName] = useState('');
  const [token1, setToken1] = useState(null);
  const [token2, setToken2] = useState(null);
  const [token3, setToken3] = useState(null);
  const [processingPlans, setProcessingPlans] = useState(false);

  // Hide the default navigator header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

        const jsondata = response.data;
        if (jsondata && Array.isArray(jsondata.data)) {
          const dthOperators = jsondata.data
            .filter(item => item.category === 'DTH')
            .map(item => ({
              name: item.name,
              id: item.id,
            }));

          setProviders(dthOperators);
        } else {
          console.warn('Invalid DTH response format');
          setProviders([]);
        }
      } catch (error) {
        console.error('Error fetching DTH operators:', error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, [token3]);

  const handleViewPlans = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter DTH Customer ID');
      return;
    }

    if (!selectedOperatorId) {
      Alert.alert('Validation Error', 'Please select a DTH provider');
      return;
    }

    try {
      setProcessingPlans(true);

      const hlrResponse = await axios.post(
        'https://api.paysprint.in/api/v1/service/recharge/hlrapi/hlrcheck',
        {
          number: phoneNumber,
          type: 'dth',
        },
        {
          headers: {
            accept: 'application/json',
            Token: token1,
            'Content-Type': 'application/json',
          },
        }
      );

      const hlrData = hlrResponse.data?.info || {};
      const circle = hlrData.circle || '';
      const operatorName = hlrData.operator || '';
      console.log('HLR Response:', hlrResponse.data);

      if (!circle) {
        Alert.alert('Error', 'Circle information missing from HLR response.');
        return;
      }

      const plansResponse = await axios.post(
        'https://api.paysprint.in/api/v1/service/recharge/hlrapi/dthinfo',
        {
          canumber: phoneNumber,
          op: operatorName,
        },
        {
          headers: {
            accept: 'application/json',
            Token: token2,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Plans Response:', plansResponse.data);

      navigation.navigate('dthplan', {
        operatorName: selectedOperatorName,
        phoneNumber,
        selectedOperatorId,
        plans: plansResponse.data,
      });
    } catch (err) {
      console.error('❌ Error fetching plans:', err.response?.data || err.message);
      Alert.alert('Error', 'Something went wrong while checking HLR or fetching plans.');
    } finally {
      setProcessingPlans(false);
    }
  };

  const styles = createStyles(colors);

  const renderProvider = ({ item, index }) => {
    const isSelected = selectedOperatorId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.provider,
          isSelected && styles.providerSelected,
          index < providers.length - 1 && styles.providerDivider,
        ]}
        onPress={() => {
          setSelectedOperatorId(item.id);
          setSelectedOperatorName(item.name);
        }}
      >
        <View style={[styles.providerIconWrapper, isSelected && styles.providerIconWrapperSelected]}>
          <Ionicons name="tv" size={20} color={isSelected ? colors.accentText : colors.accent} />
        </View>
        <Text style={styles.providerName}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name="search" size={44} color={colors.muted} />
      </View>
      <Text style={styles.emptyTitle}>No Providers Found</Text>
      <Text style={styles.emptySubtitle}>Please try again later</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DTH Recharge</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading providers...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Providers List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business" size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>Select Provider</Text>
            </View>

            <View style={styles.providersCard}>
              <FlatList
                data={providers}
                keyExtractor={(item) => item.id}
                renderItem={renderProvider}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          </View>

          {/* Customer ID Input */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>Customer ID</Text>
            </View>

            <View style={styles.inputCard}>
              <Ionicons name="person-outline" size={20} color={colors.muted} />
              <TextInput
                placeholder="Enter DTH Customer ID"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="number-pad"
              />
              {phoneNumber.length > 0 && (
                <TouchableOpacity onPress={() => setPhoneNumber('')}>
                  <Ionicons name="close-circle" size={20} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* View Plans Button */}
      {!loading && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.proceedButton,
              processingPlans && styles.proceedButtonDisabled,
            ]}
            onPress={handleViewPlans}
            disabled={processingPlans}
          >
            {processingPlans ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.proceedText}>View Plans</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
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
      color: colors.text,
      letterSpacing: 0.3,
    },
    headerSpacer: {
      width: 40,
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subtext,
      marginTop: 12,
    },

    // Content
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },

    // Section
    section: {
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
    },

    // Providers
    providersCard: {
      backgroundColor: colors.option,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    provider: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 14,
      backgroundColor: colors.option,
    },
    providerSelected: {
      backgroundColor: colors.accent + '10',
    },
    providerDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    providerIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    providerIconWrapperSelected: {
      backgroundColor: colors.accent,
    },
    providerName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },

    // Input
    inputCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.option,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },

    // Empty state
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyIconWrapper: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 18,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.muted,
    },

    // Footer
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.background,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    proceedButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.button,
      paddingVertical: 16,
      borderRadius: 16,
      gap: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    proceedButtonDisabled: {
      opacity: 0.6,
    },
    proceedText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
  });

export default DTHrecharge;