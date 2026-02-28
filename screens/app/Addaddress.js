import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ThemeContext } from "../../theme/Theme";

const AddAddress = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const addressTypes = ["Home", "Work", "Other"];

  const handleSubmit = async () => {
    // Validation
    if (!address.trim()) {
      Alert.alert(t("error"), "Please enter an address");
      return;
    }

    if (!type) {
      Alert.alert(t("error"), "Please select address type");
      return;
    }

    try {
      setLoading(true);

      // Get user from AsyncStorage
      const userStr = await AsyncStorage.getItem("user");
      
      if (!userStr) {
        Alert.alert(t("error"), "User not found. Please login again.");
        return;
      }

      const userData = JSON.parse(userStr);
      const userId = userData.id;

      console.log("Adding address for user_id:", userId);

      // Send POST request to add address
      const response = await axios.post(
        "https://indiaapay.com/api/address",
        {
          userId: userId,
          address: address.trim(),
          type: type,
        }
      );

      console.log("Address added:", response.data);

      Alert.alert(
        t("success"),
        "Address added successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error("Error adding address:", error.response?.data || error.message);
      Alert.alert(
        t("error"),
        error.response?.data?.message || "Failed to add address. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: "rgba(0, 0, 0, 0.1)", borderless: true }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add Address
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Address Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Address <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.option, borderColor: colors.border || "#E5E7EB" }]}>
            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter your complete address"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Address Type */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Address Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.typeContainer}>
            {addressTypes.map((addressType) => (
              <Pressable
                key={addressType}
                style={[
                  styles.typeButton,
                  { backgroundColor: colors.option, borderColor: colors.border || "#E5E7EB" },
                  type === addressType && styles.typeButtonActive,
                ]}
                onPress={() => setType(addressType)}
                android_ripple={{ color: "rgba(79, 70, 229, 0.1)" }}
              >
                <View style={styles.typeIconContainer}>
                  <Ionicons
                    name={
                      addressType === "Home"
                        ? "home"
                        : addressType === "Work"
                        ? "briefcase"
                        : "location"
                    }
                    size={24}
                    color={type === addressType ? "#4F46E5" : "#6B7280"}
                  />
                </View>
                <Text
                  style={[
                    styles.typeText,
                    { color: colors.text },
                    type === addressType && styles.typeTextActive,
                  ]}
                >
                  {addressType}
                </Text>
                {type === addressType && (
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Save Address</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  required: {
    color: "#EF4444",
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 12,
    paddingTop: 0,
  },
  typeContainer: {
    gap: 12,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  typeButtonActive: {
    borderColor: "#4F46E5",
    borderWidth: 2,
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  typeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  typeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  typeTextActive: {
    fontWeight: "700",
    color: "#4F46E5",
  },
  checkIcon: {
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
    elevation: 3,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});