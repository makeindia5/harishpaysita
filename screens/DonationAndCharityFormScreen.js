import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import kindnessImg from "../assets/kindness.png";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PAYMENT_METHODS = [
  {
    key: "upi",
    label: "UPI",
    icon: { lib: Ionicons, name: "qr-code-outline" },
  },
  {
    key: "credit_card",
    label: "Credit",
    icon: { lib: MaterialCommunityIcons, name: "credit-card-outline" },
  },
  {
    key: "debit_card",
    label: "Debit",
    icon: { lib: MaterialCommunityIcons, name: "credit-card-scan-outline" },
  },
  {
    key: "paypal",
    label: "Paypal",
    icon: { lib: FontAwesome5, name: "paypal" },
  },
  {
    key: "net_banking",
    label: "NetBank",
    icon: { lib: MaterialCommunityIcons, name: "bank-outline" },
  },
];

const DONATION_TYPES = [
  {
    key: "religious",
    label: "Religious",
    icon: { lib: MaterialCommunityIcons, name: "temple" },
  },
  {
    key: "child_welfare",
    label: "Child Welfare",
    icon: { lib: MaterialCommunityIcons, name: "baby-face-outline" },
  },
  {
    key: "education",
    label: "Education",
    icon: { lib: MaterialCommunityIcons, name: "school-outline" },
  },
  {
    key: "healthcare",
    label: "Healthcare",
    icon: { lib: MaterialCommunityIcons, name: "hospital-box-outline" },
  },
  {
    key: "animal_welfare",
    label: "Animal",
    icon: { lib: MaterialCommunityIcons, name: "dog" },
  },
  {
    key: "disaster_relief",
    label: "Disaster",
    icon: { lib: MaterialCommunityIcons, name: "weather-windy" },
  },
  {
    key: "environment",
    label: "Environment",
    icon: { lib: MaterialCommunityIcons, name: "leaf" },
  },
  {
    key: "other",
    label: "Other",
    icon: { lib: Ionicons, name: "ellipsis-horizontal" },
  },
];

const Chip = ({
  label,
  selected,
  onPress,
  onRemove,
  icon: IconComp,
  showClose = true,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      {IconComp}
      <Text
        style={[styles.chipText, selected && styles.chipTextSelected]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {selected && showClose && (
        <TouchableOpacity onPress={onRemove} style={styles.chipClose}>
          <Ionicons name="close-circle" size={18} color="#FF6A00" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const DonationAndCharityFormScreen = () => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    DonationAmount: "",
    paymentMethod: "",
    DonationTypes: [],
    DonationTypeOther: "",
    Message: "",
  });

  const [quickAmount, setQuickAmount] = useState(null);

  const gradAnim = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(gradAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const loopParticle = (anim, duration, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    loopParticle(particle1, 9000, 0);
    loopParticle(particle2, 12000, 2000);
    loopParticle(particle3, 10000, 1200);
  }, []);

  const isFormValid = () => {
    const typesValid =
      form.DonationTypes.length > 0 || form.DonationTypeOther.trim();
    return (
      form.name.trim() &&
      /^[0-9]{10}$/.test(form.contact) &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.DonationAmount.trim() &&
      typesValid
    );
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleAmountInput = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    handleChange("DonationAmount", cleaned);
    if (cleaned === "" || Number(cleaned) !== quickAmount) setQuickAmount(null);
  };

  const selectQuickAmount = (amt) => {
    if (quickAmount === amt) {
      setQuickAmount(null);
      handleChange("DonationAmount", "");
    } else {
      setQuickAmount(amt);
      handleChange("DonationAmount", String(amt));
    }
  };

  const toggleDonationType = (key) => {
    const exists = form.DonationTypes.includes(key);
    if (exists) {
      if (key === "other") handleChange("DonationTypeOther", "");
      handleChange(
        "DonationTypes",
        form.DonationTypes.filter((k) => k !== key)
      );
    } else {
      handleChange("DonationTypes", [...form.DonationTypes, key]);
    }
  };

  const renderChipIcon = (iconSpec, isSelected) => {
    const IconLib = iconSpec.lib;
    return (
      <IconLib
        name={iconSpec.name}
        size={16}
        color={isSelected ? "#155724" : "#FF6A00"}
        style={{ marginRight: 10 }}
      />
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill all fields correctly.");
      return;
    }

    const finalTypes = form.DonationTypes.includes("other")
      ? form.DonationTypes.map((t) =>
          t === "other" ? form.DonationTypeOther : t
        )
      : form.DonationTypes;

    const payload = { ...form, DonationType: finalTypes.join(", ") };

    try {
      const res = await fetch("https://indiaapay.com/api/submit-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Thank you for your donation!");
        handleReset();
      } else {
        Alert.alert("Error", data.message || "Error occurred.");
      }
    } catch {
      Alert.alert("Error", "Network error.");
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      contact: "",
      email: "",
      DonationAmount: "",
      paymentMethod: "",
      DonationTypes: [],
      DonationTypeOther: "",
      Message: "",
    });
    setQuickAmount(null);
  };

  const translateX = gradAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH * 0.9, SCREEN_WIDTH * 0.9],
  });

  const particleStyle = (anim, startX, startY, scale) => ({
    transform: [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [startX, startX + 40],
        }),
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [startY, startY - 30],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [scale, scale * 1.05, scale],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.18, 0.85, 0.18],
    }),
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.animatedGradientContainer,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={["#FFB57A", "#FF8A3C", "#FF6A00"]}
          style={styles.animatedGradient}
        />
      </Animated.View>

      <LinearGradient
        colors={["transparent", "rgba(255,110,10,0.08)"]}
        style={styles.overlayGradient}
      />

      <Animated.View
        style={[styles.particle, particleStyle(particle1, -40, 60, 1.1)]}
      />
      <Animated.View
        style={[
          styles.particle,
          particleStyle(particle2, SCREEN_WIDTH * 0.25, 80, 0.95),
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          particleStyle(particle3, SCREEN_WIDTH * 0.6, 20, 1.2),
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.wrapper}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: image moved inside the gradient card, left of the text */}
          <View style={styles.headerRow}>
            <LinearGradient
              colors={["#6D28D9", "#7C3AED", "#A78BFA"]}
              style={styles.headerCard}
            >
              <Image
                source={kindnessImg}
                style={styles.headerCardImage}
                resizeMode="contain"
              />
              <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle}>
                  <Text style={{ fontWeight: "900", fontSize: 24 }}>
                    Donate
                  </Text>{" "}
                  & Make a Difference
                </Text>
                <Text style={styles.headerSub}>
                  Your kindness creates real change ✨
                </Text>
              </View>
            </LinearGradient>
          </View>

          <Svg
            width="100%"
            height={48}
            viewBox="0 0 1440 80"
            style={styles.wave}
          >
            <Path
              fill="#fff"
              d="M0,32 C220,80 440,0 720,32 C1000,64 1220,8 1440,48 L1440,80 L0,80 Z"
            />
          </Svg>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#FF6A00"
              />
              <TextInput
                placeholder="Enter your name"
                style={styles.textInput}
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Contact</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={20} color="#FF6A00" />
                  <TextInput
                    placeholder="10 digits"
                    keyboardType="numeric"
                    maxLength={10}
                    style={styles.textInput}
                    value={form.contact}
                    onChangeText={(v) =>
                      /^[0-9]*$/.test(v) && handleChange("contact", v)
                    }
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#FF6A00"
                  />
                  <TextInput
                    placeholder="you@example.com"
                    style={styles.textInput}
                    value={form.email}
                    onChangeText={(v) => handleChange("email", v)}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Donation Amount</Text>
            <View style={styles.inputBox}>
              <FontAwesome5 name="rupee-sign" size={18} color="#FF6A00" />
              <TextInput
                placeholder="Enter amount"
                keyboardType="numeric"
                style={styles.textInput}
                value={form.DonationAmount}
                onChangeText={handleAmountInput}
              />
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>Quick Amount</Text>
            <View style={styles.quickRow}>
              {[10, 20, 50, 100].map((amt) => {
                const selected = quickAmount === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    activeOpacity={0.85}
                    onPress={() => selectQuickAmount(amt)}
                    style={[
                      styles.quickBtn,
                      selected && styles.quickBtnSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickText,
                        selected && styles.quickTextSelected,
                      ]}
                    >
                      ₹{amt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Payment Method</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {PAYMENT_METHODS.map((m) => {
                const selected = form.paymentMethod === m.key;
                return (
                  <Chip
                    key={m.key}
                    label={m.label}
                    selected={selected}
                    onPress={() =>
                      handleChange("paymentMethod", selected ? "" : m.key)
                    }
                    icon={renderChipIcon(m.icon, selected)}
                    showClose={false}
                    style={{ marginRight: 10 }}
                  />
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Donation Type</Text>
            <View style={styles.typeWrap}>
              {DONATION_TYPES.map((t) => {
                const selected = form.DonationTypes.includes(t.key);
                return (
                  <Chip
                    key={t.key}
                    label={t.label}
                    selected={selected}
                    onPress={() => toggleDonationType(t.key)}
                    onRemove={() => toggleDonationType(t.key)}
                    icon={renderChipIcon(t.icon, selected)}
                    style={{ flexBasis: "48%", marginBottom: 12 }}
                  />
                );
              })}
            </View>

            {form.DonationTypes.includes("other") && (
              <View>
                <Text style={[styles.label, { marginTop: 10 }]}>
                  Specify Donation Type
                </Text>
                <View style={styles.inputBox}>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={20}
                    color="#FF6A00"
                  />
                  <TextInput
                    placeholder="Describe your donation"
                    style={styles.textInput}
                    value={form.DonationTypeOther}
                    onChangeText={(v) => handleChange("DonationTypeOther", v)}
                  />
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <MaterialCommunityIcons
                name="message-text-outline"
                size={22}
                color="#FF6A00"
              />
              <Text style={[styles.label, { marginLeft: 6, marginTop: 0 }]}>
                Message
              </Text>
            </View>

            <View
              style={[
                styles.inputBox,
                { height: 110, alignItems: "flex-start" },
              ]}
            >
              <TextInput
                placeholder="Optional message..."
                multiline
                style={[styles.textInput, { height: "100%" }]}
                value={form.Message}
                onChangeText={(v) => handleChange("Message", v)}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                disabled={!isFormValid()}
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  !isFormValid() && { opacity: 0.5 },
                ]}
              >
                <Text style={styles.submitText}>Donate Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReset}
                style={styles.resetButton}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedGradientContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 2.2,
    height: 520,
    top: -120,
    left: -SCREEN_WIDTH * 0.6,
    borderRadius: 260,
    overflow: "hidden",
    opacity: 0.98,
  },
  animatedGradient: { flex: 1 },
  overlayGradient: { position: "absolute", width: "100%", height: "100%" },
  particle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: "rgba(255,170,90,0.18)",
  },
  wrapper: { padding: 16, paddingTop: 30 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // centers the header box horizontally
    marginBottom: -10,
    marginTop: 10,
    paddingHorizontal: 0, // aligns width with the form box
  },
  headerCard: {
    width: "100%", // ensures same width as form box
    padding: 12,
    borderRadius: 18,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerCardImage: {
    width: 64,
    height: 64,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFF7FF",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  headerSub: { color: "#F3E8FF", marginTop: 6, fontSize: 13 },
  wave: { marginBottom: -12 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    marginTop: -20,
  },
  label: {
    fontWeight: "700",
    marginLeft: 4,
    marginBottom: 6,
    marginTop: 10,
    color: "#FF6A00",
  },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3E6",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  textInput: { flex: 1, marginLeft: 10, height: 45 },
  row: { flexDirection: "row" },
  quickRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  quickBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#FFF3E6",
    borderWidth: 1,
    borderColor: "#FFDEBF",
    marginRight: 10,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  quickBtnSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  quickText: { color: "#FF6A00", fontWeight: "800" },
  quickTextSelected: { color: "#155724" },
  chipRow: { paddingVertical: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFE4D6",
    paddingRight: 36,
  },
  chipSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  chipText: { color: "#333", fontWeight: "700", fontSize: 13, flexShrink: 1 },
  chipTextSelected: { color: "#155724" },
  chipClose: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 28,
  },
  typeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  submitButton: {
    flex: 0.68,
    backgroundColor: "#FF6A00",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  resetButton: {
    flex: 0.28,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF6A00",
    alignItems: "center",
  },
  resetText: { color: "#FF6A00", fontWeight: "800" },
});

export default DonationAndCharityFormScreen;
