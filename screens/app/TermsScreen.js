import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.date}>Effective Date: [24/6/2025]</Text>
        <Text style={styles.date}>Last Updated: [24/6/2025]</Text>

        <Text style={styles.section}>
          Welcome to PaySita. These Terms and Conditions ("Terms") govern your access to and use of our mobile application, website, and related services ("Platform") that enable you to make digital payments, perform money transfers, manage investments, book travel, explore real estate services, buy insurance, and access various digital services.
        </Text>

        <Text style={styles.section}>
          By using our Platform, you agree to these Terms. If you do not agree, please do not use our services.
        </Text>

        <Text style={styles.heading}>1. Eligibility</Text>
        <Text style={styles.section}>
          You must be an individual aged 18 years or older and capable of entering into a legally binding agreement as per applicable laws in India.
        </Text>

        <Text style={styles.heading}>2. Services Offered</Text>
        <Text style={styles.subheading}>a. Digital Wallet & UPI</Text>
        <Text style={styles.section}>
          You may use our wallet or linked bank account through UPI for transactions. UPI and wallet functionality are subject to RBI guidelines and NPCI terms. We may set limits on wallet top-ups, transfers, and withdrawals.
        </Text>

        <Text style={styles.subheading}>b. Recharge & Bill Payments</Text>
        <Text style={styles.section}>
          We facilitate prepaid/postpaid mobile recharges, DTH, electricity, gas, and other utility bill payments. We are not liable for operator failures or delays in service delivery.
        </Text>

        <Text style={styles.subheading}>c. Money Transfer</Text>
        <Text style={styles.section}>
          You can transfer money using UPI, wallet, or linked bank accounts. All transactions are final. We are not responsible for incorrect transfers caused by incorrect details provided by you.
        </Text>

        <Text style={styles.subheading}>d. Real Estate Services</Text>
        <Text style={styles.section}>
          Property listings are aggregated for your convenience and are not vetted by us. We do not guarantee ownership, legality, or quality of any listed property.
        </Text>

        <Text style={styles.subheading}>e. Investments</Text>
        <Text style={styles.section}>
          Investment options like mutual funds, gold, fixed deposits may be made available via regulated third-party partners. Investments are subject to market risk. We do not offer financial advice.
        </Text>

        <Text style={styles.subheading}>f. Insurance</Text>
        <Text style={styles.section}>
          Insurance services are offered in partnership with IRDAI-licensed third-party insurers. Policies are subject to the terms and conditions of the respective insurer.
        </Text>

        <Text style={styles.subheading}>g. Tours & Travels</Text>
        <Text style={styles.section}>
          We allow flight, hotel, bus, and holiday package bookings through third-party providers. Refunds, cancellations, and delays are governed by the provider’s policy.
        </Text>

        <Text style={styles.subheading}>h. Other Services</Text>
        <Text style={styles.section}>
          We may offer additional digital and financial services that may have specific terms. You agree to such terms when using the respective service.
        </Text>

        <Text style={styles.heading}>3. User Obligations</Text>
        <Text style={styles.section}>
          You must ensure all information provided is accurate and up to date. Do not share your login credentials or authorize others to use your account. You are responsible for any unauthorized use of your account.
        </Text>

        <Text style={styles.heading}>4. KYC & Compliance</Text>
        <Text style={styles.section}>
          You may be required to complete KYC verification in compliance with RBI and other regulatory guidelines. We reserve the right to restrict services if KYC is not completed.
        </Text>

        <Text style={styles.heading}>5. Fees & Charges</Text>
        <Text style={styles.section}>
          We may charge convenience or service fees for certain transactions. These will be displayed before payment. Taxes as applicable may be levied in addition to our charges.
        </Text>

        <Text style={styles.heading}>6. Refunds & Cancellations</Text>
        <Text style={styles.section}>
          Refunds are only applicable in the case of failed transactions or provider-specific policies. Refund timelines may vary depending on the mode of transaction and third-party involvement.
        </Text>

        <Text style={styles.heading}>7. Third-party Links & Partners</Text>
        <Text style={styles.section}>
          Our services are integrated with third-party APIs and services. We are not responsible for the accuracy or performance of third-party services.
        </Text>

        <Text style={styles.heading}>8. Privacy & Data Use</Text>
        <Text style={styles.section}>
          We collect and use your data as described in our Privacy Policy. By using the Platform, you consent to data processing for service delivery, analytics, marketing, and legal compliance.
        </Text>

        <Text style={styles.heading}>9. Intellectual Property</Text>
        <Text style={styles.section}>
          All content, code, and trademarks are owned by or licensed to us. You may not reproduce or distribute any part of the platform without permission.
        </Text>

        <Text style={styles.heading}>10. Suspension & Termination</Text>
        <Text style={styles.section}>
          We may suspend or terminate your access in case of fraud, non-compliance, or violation of these Terms.
        </Text>

        <Text style={styles.heading}>11. Limitation of Liability</Text>
        <Text style={styles.section}>
          We are not liable for indirect, incidental, or consequential damages. Our liability is limited to the amount paid by you for the disputed service.
        </Text>

        <Text style={styles.heading}>12. Indemnification</Text>
        <Text style={styles.section}>
          You agree to indemnify and hold harmless PaySita, its officers, affiliates, and partners from any claims, liabilities, or damages arising from your misuse of the services.
        </Text>

        <Text style={styles.heading}>13. Governing Law</Text>
        <Text style={styles.section}>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai.
        </Text>

      
      </ScrollView>
    </View>
  );
};

export default TermsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // subtle light grey like PhonePe
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2E3A',
    marginBottom: 16,
    textAlign: 'center',
  },
  date: {
    fontSize: 13,
    color: '#6C6C6C',
    textAlign: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginTop: 24,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#5B2EFF',
    paddingLeft: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B3B3B',
    marginTop: 12,
    marginBottom: 4,
  },
  section: {
    fontSize: 15,
    lineHeight: 24,
    color: '#404040',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2, // subtle shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
});
