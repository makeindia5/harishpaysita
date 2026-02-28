import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../../context/userContext";
import { ThemeContext } from "../../theme/Theme";
import axios from "axios";

const { width } = Dimensions.get("window");

// Quick Action Card Component
const QuickActionCard = React.memo(({ icon, label, onPress, colors, iconBg }) => {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={styles.quickActionCard}
      onPress={onPress}
      android_ripple={{ color: "rgba(79, 70, 229, 0.1)" }}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionLabel} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
});

QuickActionCard.displayName = "QuickActionCard";

// Address Card Component
const AddressCard = React.memo(({ address, onDelete, colors }) => {
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const getIconName = () => {
    switch (address.type) {
      case "Home":
        return "home";
      case "Work":
        return "briefcase";
      default:
        return "location";
    }
  };

  const getIconColor = () => {
    switch (address.type) {
      case "Home":
        return "#10B981";
      case "Work":
        return "#F59E0B";
      default:
        return "#6366F1";
    }
  };

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardHeader}>
        <View style={[styles.addressTypeIcon, { backgroundColor: `${getIconColor()}20` }]}>
          <Ionicons name={getIconName()} size={20} color={getIconColor()} />
        </View>
        <Text style={styles.addressTypeLabel}>{address.type}</Text>
        <Pressable
          style={styles.deleteIconButton}
          onPress={() => onDelete(address.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </Pressable>
      </View>
      <View style={styles.addressCardBody}>
        <Text style={styles.addressDetails} numberOfLines={3}>
          {address.address}
        </Text>
      </View>
    </View>
  );
});

AddressCard.displayName = "AddressCard";

// Stats Card Component
const StatsCard = React.memo(({ icon, label, value, colors, iconColor }) => {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.statsContent}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsLabel}>{label}</Text>
      </View>
    </View>
  );
});

StatsCard.displayName = "StatsCard";

// Main Profile Component
const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, setUser } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  // State
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);

  // Fetch addresses from database
  const fetchAddresses = useCallback(async () => {
  try {
    setAddressesLoading(true);

    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) {
      setAddressesLoading(false);
      return;
    }

    const user = JSON.parse(userStr);

    const res = await axios.get(
      `https://freepe.in/api/address/${user.id}`
    );

    setSavedAddresses(res.data || []);
  } catch (err) {
    console.log(err.response?.data || err.message);
    setSavedAddresses([]);
  } finally {
    setAddressesLoading(false);
  }
}, []);

  // Load profile image
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage) {
          setProfileImage(storedImage);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };
    loadProfileImage();
  }, []);

  // Fetch addresses when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  // Set temp name when modal opens
  useEffect(() => {
    if (modalVisible) {
      setTempName(user?.name || "");
    }
  }, [modalVisible, user?.name]);

  // Handle save name
  const handleSave = useCallback(async () => {
    if (!tempName.trim()) {
      Alert.alert(t("error"), t("name_cannot_be_empty"));
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        "https://freepe.in/api/auth/updateName",
        {
          userId: user.id,
          name: tempName.trim(),
        }
      );

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          name: tempName.trim(),
        };

        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setModalVisible(false);
      }
    } catch (err) {
      console.error("Error updating name:", err.response?.data || err.message);
      Alert.alert(
        t("error"),
        err.response?.data?.message || t("please_try_again_later")
      );
    } finally {
      setLoading(false);
    }
  }, [tempName, user, setUser, t]);

  // Handle delete address
 const handleDeleteAddress = useCallback(
  async (addressId) => {
    Alert.alert(
      t("delete_address"),
      t("are_you_sure_delete_address"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const userStr = await AsyncStorage.getItem("user");
              if (!userStr) return;

              const userData = JSON.parse(userStr);

              await axios.delete(
                `https://freepe.in/api/address/${addressId}`,
                {
                  headers: {
                    Authorization: `Bearer ${userData.token}`,
                  },
                }
              );

              fetchAddresses();

              Alert.alert(t("success"), t("address_deleted_successfully"));
            } catch (error) {
              console.error(
                "Error deleting address:",
                error.response?.data || error.message
              );
              Alert.alert(t("error"), t("failed_to_delete_address"));
            }
          },
        },
      ],
      { cancelable: true }
    );
  },
  [fetchAddresses, t]
);


  // Handle pick image
  const pickImage = useCallback(async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert(t("permission_required"), t("grant_permission_message"));
      return;
    }

    Alert.alert(
      t("profile_picture_options"),
      t("select_an_option"),
      [
        {
          text: t("choose_from_gallery"),
          onPress: async () => {
            try {
              setImageLoading(true);
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                setProfileImage(uri);
                await AsyncStorage.setItem("profileImage", uri);
              }
            } catch (error) {
              console.error("Error picking image:", error);
            } finally {
              setImageLoading(false);
            }
          },
        },
        {
          text: t("take_photo"),
          onPress: async () => {
            try {
              setImageLoading(true);
              let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                setProfileImage(uri);
                await AsyncStorage.setItem("profileImage", uri);
              }
            } catch (error) {
              console.error("Error taking photo:", error);
            } finally {
              setImageLoading(false);
            }
          },
        },
        {
          text: t("remove_profile_picture"),
          onPress: async () => {
            setProfileImage(null);
            await AsyncStorage.removeItem("profileImage");
          },
          style: "destructive",
        },
        { text: t("cancel"), style: "cancel" },
      ],
      { cancelable: true }
    );
  }, [t]);

  // Quick actions configuration
  const quickActions = useMemo(
    () => [
      {
        id: "coins",
        icon: "wallet",
        label: t("coins_earned"),
        route: "CoinsEarned",
        iconBg: "#8B5CF6",
      },
      {
        id: "notifications",
        icon: "notifications",
        label: t("manage_notification"),
        route: "ManageNotification",
        iconBg: "#EC4899",
      },
      {
        id: "financial",
        icon: "card",
        label: t("financial_details"),
        route: "FinancialDetails",
        iconBg: "#10B981",
      },
      {
        id: "additional",
        icon: "document-text",
        label: t("additional_details"),
        route: "AdditionalDetails",
        iconBg: "#F59E0B",
      },
    ],
    [t]
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Profile */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              android_ripple={{ color: "rgba(255, 255, 255, 0.3)", borderless: true }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.heroTitle}>My Profile</Text>
            <Pressable
              style={styles.settingsButton}
              onPress={() => setModalVisible(true)}
              android_ripple={{ color: "rgba(255, 255, 255, 0.3)", borderless: true }}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.profileSection}>
            <Pressable
              onPress={pickImage}
              style={styles.profileImageWrapper}
              disabled={imageLoading}
            >
              {imageLoading ? (
                <View style={styles.profileImageContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              ) : (
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../../assets/drawer/person.png")
                  }
                  style={styles.profileImageContainer}
                />
              )}
              <View style={styles.editIconBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </Pressable>

            <Text style={styles.userName}>{user?.name || t("user")}</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call" size={14} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.userPhone}>
                {user?.countryCode} {user?.mobileNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatsCard
            icon="star"
            label={t("points")}
            value="2,450"
            colors={colors}
            iconColor="#F59E0B"
          />
          <StatsCard
            icon="location"
            label={t("addresses")}
            value={savedAddresses.length}
            colors={colors}
            iconColor="#10B981"
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("quick_actions")}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                icon={action.icon}
                label={action.label}
                iconBg={action.iconBg}
                onPress={() => navigation.navigate(action.route)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Saved Addresses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("saved_addresses")}</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => navigation.navigate("Addaddress")}
              android_ripple={{ color: "rgba(79, 70, 229, 0.2)" }}
            >
              <Ionicons name="add" size={20} color="#4F46E5" />
              <Text style={styles.addButtonText}>{t("add")}</Text>
            </Pressable>
          </View>

          {addressesLoading ? (
            <View style={styles.loadingAddresses}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : savedAddresses.length > 0 ? (
            <View style={styles.addressesContainer}>
              {savedAddresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onDelete={handleDeleteAddress}
                  colors={colors}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyAddressesCard}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="location-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No Address yet</Text>
              <Text style={styles.emptySubtitle}>
                Add address to get started!
              </Text>
              <Pressable
                style={styles.emptyActionButton}
                onPress={() => navigation.navigate("Addaddress")}
                android_ripple={{ color: "rgba(79, 70, 229, 0.1)" }}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.emptyActionText}>Add Address</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Spacer for bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder={t("enter_your_name")}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t("phone_number")}</Text>
                <View style={[styles.inputWrapper, styles.inputDisabled]}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                  <Text style={styles.inputDisabledText}>
                    {user?.countryCode} {user?.mobileNumber}
                  </Text>
                </View>
                <Text style={styles.inputHint}>Cannot change number</Text>
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
                >
                  <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.modalButton,
                    styles.saveButton,
                    loading && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={loading}
                  android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Save </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

// Stylesheet
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
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    heroSection: {
      backgroundColor: "#4F46E5",
      paddingBottom: 40,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    heroHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    profileSection: {
      alignItems: "center",
      paddingTop: 20,
    },
    profileImageWrapper: {
      position: "relative",
      marginBottom: 16,
    },
    profileImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: "#FFFFFF",
      backgroundColor: "#E5E7EB",
      justifyContent: "center",
      alignItems: "center",
    },
    editIconBadge: {
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#10B981",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "#FFFFFF",
    },
    userName: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: 0.3,
      marginBottom: 8,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    userPhone: {
      fontSize: 15,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.9)",
    },
    statsSection: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginTop: -20,
      gap: 12,
    },
    statsCard: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.option,
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    statsIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    statsContent: {
      flex: 1,
    },
    statsValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1E1E1E",
      marginBottom: 2,
    },
    statsLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: "#6B7280",
    },
    section: {
      marginTop: 28,
      paddingHorizontal: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1E1E1E",
      letterSpacing: 0.2,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      gap: 4,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#4F46E5",
    },
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    quickActionCard: {
      width: (width - 44) / 2,
      backgroundColor: colors.option,
      padding: 20,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    quickActionIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    quickActionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#1E1E1E",
      textAlign: "center",
      lineHeight: 18,
    },
    loadingAddresses: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      gap: 10,
    },
    loadingText: {
      fontSize: 14,
      color: "#6B7280",
    },
    addressesContainer: {
      gap: 12,
    },
    addressCard: {
      backgroundColor: colors.option,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    addressCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    addressTypeIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    addressTypeLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: "#1E1E1E",
    },
    deleteIconButton: {
      padding: 6,
    },
    addressCardBody: {
      paddingLeft: 42,
    },
    addressDetails: {
      fontSize: 13,
      fontWeight: "400",
      color: "#6B7280",
      lineHeight: 18,
    },
    emptyAddressesCard: {
      backgroundColor: colors.option,
      borderRadius: 20,
      padding: 32,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#F3F4F6",
      borderStyle: "dashed",
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#F3F4F6",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1E1E1E",
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: "#9CA3AF",
      textAlign: "center",
      marginBottom: 20,
    },
    emptyActionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: "#4F46E5",
      gap: 8,
    },
    emptyActionText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 8,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: "#E5E7EB",
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1E1E1E",
      marginBottom: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#F9FAFB",
      gap: 12,
    },
    inputDisabled: {
      backgroundColor: "#F3F4F6",
      borderColor: "#E5E7EB",
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#1E1E1E",
    },
    inputDisabledText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#9CA3AF",
    },
    inputHint: {
      fontSize: 12,
      fontWeight: "400",
      color: "#9CA3AF",
      marginTop: 6,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 12,
      gap: 6,
    },
    cancelButton: {
      backgroundColor: "#F3F4F6",
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#6B7280",
    },
    saveButton: {
      backgroundColor: "#4F46E5",
    },
    saveButtonDisabled: {
      backgroundColor: "#9CA3AF",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });