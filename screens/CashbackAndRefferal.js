import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../theme/Theme";

const CashbackAndReferral = () => {
  const [activeTab, setActiveTab] = useState("Cashback");
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);

  const [referralData, setReferralData] = useState({
    name: "",
    email: "",
    contact: "",
    category: "",
    message: "",
  });

  const handleInputChange = (field, value) => {
    setReferralData({ ...referralData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://indiaapay.com/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(referralData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(t("cashback_referral.referral_submitted"));
        setReferralData({
          name: "",
          email: "",
          contact: "",
          category: "",
          message: "",
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  const cashbackOffers = {
    [t("cashback_referral.recharge")]: [
      { id: "1", action: t("cashback_referral.mobile_recharge"), cashback: 30 },
      { id: "2", action: t("cashback_referral.friend_recharge"), cashback: 30 },
    ],
    [t("cashback_referral.pay_bills")]: [
      { id: "3", action: t("cashback_referral.electricity_bill"), cashback: 50 },
      { id: "4", action: t("cashback_referral.dth_recharge"), cashback: 25 },
    ],
  };

  const renderCashbackCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.option }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.actionText, { color: colors.text }]}>{item.action}</Text>
      </View>
      <Text style={[styles.descriptionText, { color: colors.text }]}>
        {t("cashback_referral.earn")} <Text style={styles.boldText}>₹{item.cashback}</Text> {t("cashback_referral.on_action", { action: item.action.toLowerCase() })}
      </Text>
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>{t("cashback_referral.claim_now")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
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
          {t("cashback_referral.title")}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Container */}
      <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Cashback" && styles.activeTab]}
          onPress={() => setActiveTab("Cashback")}
        >
          <Text style={[styles.tabText, { color: colors.text }, activeTab === "Cashback" && styles.activeTabText]}>
            {t("cashback_referral.cashback")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Referral" && styles.activeTab]}
          onPress={() => setActiveTab("Referral")}
        >
          <Text style={[styles.tabText, { color: colors.text }, activeTab === "Referral" && styles.activeTabText]}>
            {t("cashback_referral.referral")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "Cashback" ? (
          <FlatList
            data={Object.entries(cashbackOffers)}
            keyExtractor={([category]) => category}
            renderItem={({ item }) => {
              const [category, offers] = item;
              return (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{category}</Text>
                  <FlatList
                    data={offers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCashbackCard}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false}
                  />
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.formContainer, { backgroundColor: colors.option }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t("cashback_referral.refer_and_earn")}
              </Text>

              <TextInput
                style={[styles.input, { borderColor: colors.border || "#ccc", color: colors.text, backgroundColor: colors.background }]}
                placeholder={t("cashback_referral.full_name")}
                placeholderTextColor="#999"
                value={referralData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
              <TextInput
                style={[styles.input, { borderColor: colors.border || "#ccc", color: colors.text, backgroundColor: colors.background }]}
                placeholder={t("cashback_referral.email")}
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={referralData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
              <TextInput
                style={[styles.input, { borderColor: colors.border || "#ccc", color: colors.text, backgroundColor: colors.background }]}
                placeholder={t("cashback_referral.contact_number")}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={referralData.contact}
                onChangeText={(text) => handleInputChange("contact", text)}
              />

              <View style={[styles.pickerContainer, { borderColor: colors.border || "#ccc", backgroundColor: colors.background }]}>
                <Picker
                  selectedValue={referralData.category}
                  onValueChange={(itemValue) => handleInputChange("category", itemValue)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label={t("cashback_referral.select_service")} value="" />
                  <Picker.Item label={t("cashback_referral.loan")} value="Loans" />
                  <Picker.Item label={t("cashback_referral.taxation")} value="Taxation" />
                  <Picker.Item label={t("cashback_referral.real_estate")} value="Real Estate" />
                  <Picker.Item label={t("cashback_referral.home_services")} value="Home Services" />
                  <Picker.Item label={t("cashback_referral.tour_travel")} value="Tour and Travel" />
                  <Picker.Item label={t("cashback_referral.education")} value="Educational Services" />
                  <Picker.Item label={t("cashback_referral.donation")} value="Donation and Charity" />
                  <Picker.Item label={t("cashback_referral.others")} value="Other Services" />
                </Picker>
              </View>

              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.border || "#ccc", color: colors.text, backgroundColor: colors.background }]}
                placeholder={t("cashback_referral.message")}
                placeholderTextColor="#999"
                value={referralData.message}
                onChangeText={(text) => handleInputChange("message", text)}
                multiline={true}
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>{t("cashback_referral.submit_referral")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CashbackAndReferral;

const styles = StyleSheet.create({
  safeContainer: {
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFA500",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFA500",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: "48%",
    minHeight: 200,
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  boldText: {
    fontWeight: "700",
    color: "#FFA500",
    fontSize: 16,
  },
  cardFooter: {
    marginTop: 12,
  },
  claimButton: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  claimButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});