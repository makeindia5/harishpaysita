import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ThemeContext } from '../theme/Theme';

const DthDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  const {
    selectedPlans = [],
    totalAmount = 0,
    customerName,
    phoneNumber,
    operatorName,
    selectedOperatorId,
  } = route.params || {};

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const refid = `REF${Date.now()}`;

  // Hide the default navigator header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://indiaapay.com/api/token');
        const data = await response.json();
        setToken(data.token);
        console.log('📲 Token from server:', data.token);
      } catch (err) {
        console.error('❌ Error fetching token:', err);
      }
    };
    fetchToken();
  }, []);

  const DoRecharge = async () => {
    if (!token) {
      Alert.alert('Token Missing', 'Please wait, authentication in progress.');
      return;
    }

    setLoading(true);

    const rechargeData = {
      operator: selectedOperatorId,
      canumber: phoneNumber,
      amount: totalAmount,
      referenceid: refid,
    };

    const options = {
      method: 'POST',
      url: 'https://api.paysprint.in/api/v1/service/recharge/recharge/dorecharge',
      headers: {
        accept: 'text/plain',
        'content-type': 'application/json',
        Token: token,
      },
      data: rechargeData,
    };

    try {
      const res = await axios.request(options);
      const result = res.data;

      console.log('✅ Recharge Success:', result);

      if (!result.status) {
        setLoading(false);
        Alert.alert('Recharge Failed', result.message || 'Transaction failed.');
        return;
      }

      setLoading(false);
      navigation.navigate('successdth', {
        successdata: result,
        customerName,
        phoneNumber,
        selectedPlans,
        totalAmount,
      });
    } catch (err) {
      setLoading(false);
      const errorMessage = err?.response?.data?.message || 'Something went wrong';
      console.error('❌ Recharge Error:', err?.response?.data);
      Alert.alert('Recharge Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>DTH Recharge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Customer Info Card */}
        <View style={[styles.customerCard, { backgroundColor: colors.option }]}>
          <View style={[styles.customerIconWrapper, { backgroundColor: colors.accent }]}>
            <Ionicons name="tv" size={24} color={colors.accentText} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={[styles.customerLabel, { color: colors.subtext }]}>
              {t('dth_account')}
            </Text>
            <Text style={[styles.customerName, { color: colors.text }]}>
              {customerName}
            </Text>
          </View>
        </View>

        {/* Payment Summary Card */}
        <View style={[styles.card, { backgroundColor: colors.option }]}>
          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: colors.subtext }]}>
              {t('total_payable')}
            </Text>
            <Text style={[styles.amountValue, { color: colors.text }]}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.detailsSection}>
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="business" size={16} color={colors.accent} />
              </View>
              <Text style={[styles.label, { color: colors.subtext }]}>
                {t('operator')}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {operatorName}
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="call" size={16} color={colors.accent} />
              </View>
              <Text style={[styles.label, { color: colors.subtext }]}>
                {t('phone_number')}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {phoneNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Plans Card */}
        <View style={[styles.plansCard, { backgroundColor: colors.option }]}>
          <View style={styles.plansHeader}>
            <Ionicons name="list" size={20} color={colors.accent} />
            <Text style={[styles.plansTitle, { color: colors.text }]}>
              {t('selected_plans')}
            </Text>
          </View>

          {selectedPlans.map((plan, index) => (
            <View
              key={index}
              style={[
                styles.planItem,
                index < selectedPlans.length - 1 && [
                  styles.planItemBorder,
                  { borderBottomColor: colors.divider },
                ],
              ]}
            >
              <View style={styles.planContent}>
                <View style={[styles.planBullet, { backgroundColor: colors.accent }]} />
                <View style={styles.planText}>
                  <Text style={[styles.planName, { color: colors.text }]}>
                    {plan.name}
                  </Text>
                  <Text style={[styles.planAmount, { color: colors.subtext }]}>
                    {t('amount')}: ₹{plan.amount}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Pay Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: colors.button },
            loading && styles.payButtonDisabled,
          ]}
          onPress={DoRecharge}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <Text style={styles.payButtonText}>
                {t('proceed_to_pay')} ₹{totalAmount.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DthDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Customer card
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  customerIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '700',
  },

  // Payment card
  card: {
    marginTop: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  amountSection: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
  },
  detailsSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 28,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Plans card
  plansCard: {
    marginTop: 14,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  plansHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  plansTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  planItem: {
    paddingVertical: 10,
  },
  planItemBorder: {
    borderBottomWidth: 1,
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  planBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  planText: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  planAmount: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});