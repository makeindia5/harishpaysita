import React, { useRef, useState, useContext, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../theme/Theme';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ChangePassword = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  const [passcode, setPasscode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  // Hide the default navigator header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const verifyOldPasscode = async (enteredPasscode) => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(storedUser);

    const res = await axios.post(
      "https://freepe.in/api/security/verify-passcode",
      {
        userId: user.id,
        passcode: enteredPasscode
      }
    );

    if (res.data.valid) {
      navigation.navigate("SetNewPasscode");
    } else {
      Alert.alert("Wrong passcode", "The passcode you entered is incorrect");
      setPasscode(["", "", "", ""]);
      inputs.current[0]?.focus();
    }

  } catch (err) {
    console.log("verify passcode error:", err);
    Alert.alert("Error", "Unable to verify passcode");
  }
};


  const handleChange = (text, index) => {
    const newPasscode = [...passcode];
    newPasscode[index] = text;
    setPasscode(newPasscode);

    if (text && index < passcode.length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newPasscode.every((digit) => digit !== '')) {
  const finalPasscode = newPasscode.join("");

  setTimeout(() => {
    verifyOldPasscode(finalPasscode);
  }, 200);
}

  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !passcode[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const styles = createStyles(colors);

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
        <Text style={styles.headerTitle}>Change Passcode</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name="lock-open" size={64} color={colors.warning} />
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>
          {t('enter_current_passcode', 'Enter Current Passcode')}
        </Text>
        <Text style={styles.subtitle}>
          Please verify your current passcode to continue
        </Text>

        {/* Passcode Inputs */}
        <View style={styles.passcodeContainer}>
          {passcode.map((value, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                styles.passcodeBox,
                passcode[index] && styles.passcodeBoxFilled,
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={passcode[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              autoFocus={index === 0}
              secureTextEntry
              placeholderTextColor={colors.muted}
            />
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={22} color={colors.warning} />
            <Text style={styles.securityTitle}>Security Verification</Text>
          </View>
          <View style={styles.securityContent}>
            <SecurityTip
              icon="checkmark-circle"
              text="Passcode required to change settings"
              colors={colors}
              styles={styles}
            />
            <SecurityTip
              icon="checkmark-circle"
              text="New passcode will be set next"
              colors={colors}
              styles={styles}
            />
            <SecurityTip
              icon="checkmark-circle"
              text="Keep your passcode secure"
              colors={colors}
              styles={styles}
            />
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.accent} />
          <Text style={styles.infoText}>
            Passcode auto-submits when all digits are entered
          </Text>
        </View>

        {/* Forgot Passcode */}
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot your passcode? </Text>
          <Text style={styles.forgotLink}>Reset Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SecurityTip = ({ icon, text, colors,styles }) => (
  <View style={styles.securityTip}>
    <Ionicons name={icon} size={16} color={colors.warning} />
    <Text style={[styles.securityTipText, { color: colors.text }]}>{text}</Text>
  </View>
);

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

    // Content
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      alignItems: 'center',
    },

    // Icon
    iconWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.warningBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },

    // Title & Subtitle
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: 0.2,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subtext,
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 20,
      paddingHorizontal: 20,
    },

    // Passcode Container
    passcodeContainer: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
    },
    passcodeBox: {
      width: 64,
      height: 72,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      textAlign: 'center',
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      backgroundColor: colors.option,
    },
    passcodeBoxFilled: {
      borderColor: colors.warning,
      borderWidth: 2.5,
    },

    // Security Card
    securityCard: {
      width: '100%',
      backgroundColor: colors.option,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    securityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
    },
    securityTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    securityContent: {
      gap: 10,
    },
    securityTip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    securityTipText: {
      fontSize: 14,
      fontWeight: '500',
      flex: 1,
    },

    // Info Banner
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.accent + '10',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.accent + '30',
      width: '100%',
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '500',
      color: colors.text,
      lineHeight: 18,
    },

    // Forgot Passcode
    forgotButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    forgotText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.subtext,
    },
    forgotLink: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.accent,
    },
  });

export default ChangePassword;