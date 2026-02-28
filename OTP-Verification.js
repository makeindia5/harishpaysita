import React, { useRef, useState,useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserContext} from './context/userContext';
export default function OTPVerification({ navigation,route }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [hiddenOtp, setHiddenOtp] = useState("");
    const { user, setUser } = useContext(UserContext);
  const inputs = useRef([]);
  const DEFAULT_OTP=123456;
   const {countryCode,mobileNumber}=route.params ;
   const fullMobileNumber = `${countryCode}${mobileNumber}`; 
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };
  const isValid = otp.every((digit) => digit !== "");
  const handleKeyPress = (e, index) => {
  if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
    inputs.current[index - 1].focus();
  }
};

  const handleVerify = async () => {
    console.log("VERIFY BUTTON CLICKED");

  const enteredOtp = otp.join(""); 

  if (enteredOtp === DEFAULT_OTP.toString()) {
    try {
      const response = await axios.post(
        "https://freepe.in/api/auth/createUser",
        { mobile: mobileNumber,name:mobileNumber,country_code:countryCode }
      );
      console.log("LOGIN API RESPONSE:", response.data);

      if (response.status === 200 || response.status === 201) {
        
        const userToStore = {
          id: response.data.userId,     // ✅ ALWAYS id
          mobileNumber: response.data.mobile,
          name: response.data.name,
          country_code: response.data.countryCode,
          token: response.data.token,
        };
        console.log("LOGIN RESPONSE:", response.data);
        await AsyncStorage.setItem("user",JSON.stringify(userToStore));
        //console.log("OTP CONTEXT SETUSER:", typeof setUser);

        setUser(userToStore);
        console.log("LOGIN RESPONSE:", response.data);

      if(response.status===500){
        Alert.alert("Error","Enter valid Credentials")
      }

       
      }
    } catch (err) {
      console.log("API error:", err.response?.data || err.message);
    }
  } else {
    Alert.alert("Error", "Enter valid OTP");
  }
};

  
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <View style={styles.logoContainer}>
                <Ionicons name="wallet" size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>PaySita</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {fullMobileNumber}
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            <TextInput
              value={hiddenOtp}
              onChangeText={(text) => {
                if (text.length === 6) {
                  setHiddenOtp(text);
                  setOtp(text.split(""));
                }
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              style={{ position: "absolute", opacity: 0 }}
            />

            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e)=>{handleKeyPress(e,index)}}
              />
            ))}
          </View>

          {/* Resend */}
          <TouchableOpacity>
            <Text style={styles.resendText}>
              Didn’t receive OTP? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>

          {/* Bottom */}
          <View style={styles.bottomSection}>
            <View style={styles.securityNotice}>
              <Ionicons name="lock-closed" size={16} color="#6B7280" />
              <Text style={styles.securityText}>
                OTP is encrypted and valid for a short time only.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                { opacity: isValid ? 1 : 0.6 },
              ]}
              disabled={!isValid}
              onPress={handleVerify}
            >
              <Text style={styles.continueButtonText}>Verify & Continue</Text>
            </TouchableOpacity>

            <Text style={styles.copyright}>
              © 2024 PaySita. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  header: {
    marginBottom: 32,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    padding: 8,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: "#F8FAFC",
  },

  resendText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
  },
  resendLink: {
    color: "#2563EB",
    fontWeight: "600",
  },

  bottomSection: {
    marginTop: "auto",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: "#475569",
    marginLeft: 8,
    flex: 1,
  },

  continueButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  copyright: {
    fontSize: 12,
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 16,
  },
});
