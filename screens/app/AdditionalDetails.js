import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../theme/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
const STORAGE_KEY = "user_additional_details";
const USER_ID_KEY = "userId";

const dropdownOptions = {
  1: ["Male", "Female", "Other"],
  2: ["18-25", "26-35", "36-45", "46+"],
  3: ["Single", "Married", "Divorced", "Widowed"],
  4: ["School", "High School", "Graduate", "Postgraduate", "PhD"],
  5: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  6: ["Often", "Sometimes", "Rarely", "Never"],
  7: ["Often", "Sometimes", "Rarely", "Never"],
  8: ["Music", "Reading", "Sports", "Cooking", "Gaming", "Dance", "Art Craft"],
  9: ["Action", "Drama", "Comedy", "Romance", "Horror"],
};

const DetailField = ({ id, label, subtext, value, onSelect, options, colors, styles }) => {
  return (
    <View style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldInfo}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldSubtext}>{subtext}</Text>
        </View>
        {value && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.text} />
          </View>
        )}
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value || ""}
          onValueChange={(val) => onSelect(id, val)}
          style={styles.picker}
          dropdownIconColor={colors.text}
          mode="dropdown"
        >
          <Picker.Item label="Select option" value="" />
          {(options || []).map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>

      {value && (
        <View style={styles.selectedValueContainer}>
          <Text style={styles.selectedLabel}>Selected:</Text>
          <Text style={styles.selectedValue}>{value}</Text>
        </View>
      )}
    </View>
  );
};

const AdditionalDetails = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const styles = createStyles(colors);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const id = await AsyncStorage.getItem(USER_ID_KEY);
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (id) setUserId(id);
      if (savedData) setSelectedOptions(JSON.parse(savedData));
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id, value) => {
    const updated = { ...selectedOptions, [id]: value };
    setSelectedOptions(updated);
    saveData(updated);
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };



const handleSaveToDatabase = async () => {

  const storedUser = await AsyncStorage.getItem("user");

  if (!storedUser) {
    Alert.alert("Error", "User not found. Please login again.");
    return;
  }

  const user = JSON.parse(storedUser);
  const userId = user?.id;

  if (!userId) {
    Alert.alert("Error", "User ID not found. Please login again.");
    return;
  }

  const completedCount = Object.keys(selectedOptions).length;

  if (completedCount === 0) {
    Alert.alert("Error", "Please select at least one detail before saving.");
    return;
  }

  setSaving(true);

  try {
    const res = await axios.post(
      "https://indiaapay.com/api/userDetails",   // ✅ FIXED URL
      {
        user_id: Number(userId),
        details: selectedOptions,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    Alert.alert("Success", "Details saved successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("profile"),
      },
    ]);

  } catch (error) {

    console.log(error?.response?.data || error.message);

    Alert.alert(
      "Error",
      error?.response?.data?.message || "Failed to save details"
    );

  } finally {
    setSaving(false);
  }
};


  const getCompletionPercentage = () => {
    const total = 9;
    const completed = Object.keys(selectedOptions).length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={colors.card}
          barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.card}
        barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={saving}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Additional Details</Text>
          <Text style={styles.headerSubtitle}>{getCompletionPercentage()}% Complete</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!saving}
      >
        {/* Personal Information Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name="person-outline" size={20} color={colors.text} />
            <Text style={styles.categoryTitle}>Personal Information</Text>
          </View>
          <View style={styles.categoryDivider} />

          <DetailField
            id={1}
            label="Gender"
            subtext="Select your gender"
            value={selectedOptions[1]}
            onSelect={handleSelect}
            options={dropdownOptions[1]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={2}
            label="Age"
            subtext="Choose your age group"
            value={selectedOptions[2]}
            onSelect={handleSelect}
            options={dropdownOptions[2]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={3}
            label="Marital Status"
            subtext="What is your marital status"
            value={selectedOptions[3]}
            onSelect={handleSelect}
            options={dropdownOptions[3]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={4}
            label="Education Qualification"
            subtext="Your highest qualification"
            value={selectedOptions[4]}
            onSelect={handleSelect}
            options={dropdownOptions[4]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={5}
            label="Family Members"
            subtext="How many family members do you have"
            value={selectedOptions[5]}
            onSelect={handleSelect}
            options={dropdownOptions[5]}
            colors={colors}
            styles={styles}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name="heart-outline" size={20} color={colors.text} />
            <Text style={styles.categoryTitle}>Preferences</Text>
          </View>
          <View style={styles.categoryDivider} />

          <DetailField
            id={6}
            label="Domestic Travel"
            subtext="How often do you travel domestically"
            value={selectedOptions[6]}
            onSelect={handleSelect}
            options={dropdownOptions[6]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={7}
            label="International Travel"
            subtext="How often do you travel internationally"
            value={selectedOptions[7]}
            onSelect={handleSelect}
            options={dropdownOptions[7]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={8}
            label="Personal Interests"
            subtext="What are your interests"
            value={selectedOptions[8]}
            onSelect={handleSelect}
            options={dropdownOptions[8]}
            colors={colors}
            styles={styles}
          />

          <DetailField
            id={9}
            label="Movies"
            subtext="What are your favorite movie genres"
            value={selectedOptions[9]}
            onSelect={handleSelect}
            options={dropdownOptions[9]}
            colors={colors}
            styles={styles}
          />
        </View>

        {/* Completion Summary */}
        <View style={styles.summaryBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              {Object.keys(selectedOptions).length}/9 Details Completed
            </Text>
            <Text style={styles.summaryText}>
              {Object.keys(selectedOptions).length === 9
                ? "All details completed!"
                : `${9 - Object.keys(selectedOptions).length} more to go`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.saveButton,
            (saving || Object.keys(selectedOptions).length === 0) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveToDatabase}
          disabled={saving || Object.keys(selectedOptions).length === 0}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.background} />
              <Text style={styles.saveButtonText}>Save to Profile</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AdditionalDetails;

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    backButton: {
      padding: 6,
      borderRadius: 8,
    },

    headerContent: {
      flex: 1,
      marginLeft: 12,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    headerSubtitle: {
      fontSize: 12,
      color: colors.upi,
      marginTop: 2,
      fontWeight: "500",
    },

    progressContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    progressTrack: {
      height: 6,
      backgroundColor: colors.option,
      borderRadius: 3,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: colors.text,
      borderRadius: 3,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 100,
    },

    categorySection: {
      marginBottom: 28,
    },

    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },

    categoryTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    categoryDivider: {
      height: 2,
      backgroundColor: colors.border,
      borderRadius: 1,
      marginBottom: 14,
    },

    fieldCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    fieldHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    fieldInfo: {
      flex: 1,
    },

    fieldLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    fieldSubtext: {
      fontSize: 12,
      color: colors.upi,
      marginTop: 4,
      fontWeight: "400",
    },

    selectedBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.option,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 12,
    },

    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      height: 44,
      overflow: "hidden",
      backgroundColor: colors.option,
      justifyContent: "center",
      marginBottom: 10,
    },

    picker: {
      height: 48,
      marginTop: -2,
      fontSize: 14,
      width: "100%",
      color: colors.text,
      fontWeight: "500",
    },

    selectedValueContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: colors.option,
      borderRadius: 6,
    },

    selectedLabel: {
      fontSize: 11,
      color: colors.upi,
      fontWeight: "600",
    },

    selectedValue: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "700",
    },

    summaryBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.option,
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: colors.text,
    },

    summaryContent: {
      flex: 1,
    },

    summaryTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    summaryText: {
      fontSize: 12,
      color: colors.upi,
      marginTop: 4,
      fontWeight: "400",
    },

    buttonContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
      paddingTop: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    saveButton: {
      backgroundColor: colors.text,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },

    saveButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },

    saveButtonText: {
      color: colors.background,
      fontSize: 15,
      fontWeight: "700",
    },
  });