import { StyleSheet, Text, View, Pressable, StatusBar, ScrollView } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../theme/Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Security = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const styles = createStyles(colors);
  const handlePasscodePress = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(storedUser);

    const res = await axios.get(
      `https://indiaapay.com/api/security/has-passcode/${user.id}`
    );

    if (res.data.hasPasscode) {
      navigation.navigate("ChangePassword");
    } else {
      navigation.navigate("SetupPasscode");
    }

  } catch (error) {
    console.log("Passcode check error:", error);
  }
};
  const securityOptions = [
    {
      id: 1,
      title: "Permissions",
      subtitle: "Manage app permissions and access controls",
      icon: "shield-outline",
      route: "Permissions",
    },
      {
      id: 2,
      title: "Passcode",
      subtitle: "Manage your account passcode",
      icon: "lock-closed-outline",
      onPress: handlePasscodePress,
    },

    // {
    //   id: 3,
    //   title: "Change Passcode",
    //   subtitle: "Update your existing passcode",
    //   icon: "key-outline",
    //   route: "ChangePassword",
    // },
  ];
   
  
  const SecurityOption = ({ title, subtitle, icon, route, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.optionCard,
      pressed && styles.optionCardPressed,
    ]}
    onPress={() => {
  console.log("CARD PRESSED", title);

  if (onPress) onPress();
  else if (route) navigation.navigate(route);
}}

  >
    <View style={styles.optionIconBox}>
      <Ionicons name={icon} size={24} color={colors.text} />
    </View>

    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>

    <Ionicons name="chevron-forward" size={24} color={colors.upi} />
  </Pressable>
);

  


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.card}
        barStyle={colors.background === "#ffffff" ? "dark-content" : "light-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("Drawer")}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Keep Your Account Secure</Text>
            <Text style={styles.infoText}>
              Manage your security settings to protect your account and data
            </Text>
          </View>
        </View>

        {/* Security Options */}
        <View style={styles.optionsContainer}>
          {securityOptions.map((option) => (
          <SecurityOption
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            icon={option.icon}
            route={option.route}
            onPress={option.onPress}   // ✅ VERY IMPORTANT
          />
        ))}

        </View>

        {/* Additional Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Security Tips</Text>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Use a strong, unique passcode</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Review app permissions regularly</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Update your security settings frequently</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Security;

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },

    infoBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      backgroundColor: colors.option,
      borderRadius: 12,
      padding: 14,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: colors.text,
    },

    infoContent: {
      flex: 1,
    },

    infoTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    infoText: {
      fontSize: 12,
      color: colors.upi,
      marginTop: 4,
      fontWeight: "400",
      lineHeight: 16,
    },

    optionsContainer: {
      gap: 12,
      marginBottom: 28,
    },

    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    optionCardPressed: {
      backgroundColor: colors.option,
    },

    optionIconBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.option,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },

    optionContent: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    optionSubtitle: {
      fontSize: 12,
      color: colors.upi,
      marginTop: 4,
      fontWeight: "400",
    },

    tipsSection: {
      backgroundColor: colors.option,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    tipsTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },

    tipItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },

    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.text,
    },

    tipText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "500",
      flex: 1,
    },
  });