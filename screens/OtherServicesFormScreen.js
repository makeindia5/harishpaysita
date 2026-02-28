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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function OtherServicesFormScreen() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    serviceType: "",
    gender: "",
    message: "",
  });

  // animated orange background
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH * 0.3, SCREEN_WIDTH * 0.3],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // quick validity check (no alerts)
  const isFormValid = () => {
    return (
      form.name.trim().length > 0 &&
      /^\d{10}$/.test(form.contact) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.serviceType.trim().length > 0 &&
      form.message.trim().length > 0
    );
  };

  // validation + submit
  const validateAndSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("⚠️", "Name is required.");
      return;
    }
    if (!form.contact.trim()) {
      Alert.alert("⚠️", "Contact number is required.");
      return;
    }
    if (!/^\d{10}$/.test(form.contact)) {
      Alert.alert("⚠️", "Enter a valid 10-digit contact number.");
      return;
    }
    if (!form.email.trim()) {
      Alert.alert("⚠️", "Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert("⚠️", "Enter a valid email address.");
      return;
    }
    if (!form.serviceType.trim()) {
      Alert.alert("⚠️", "Please select a service type.");
      return;
    }
    if (!form.message.trim()) {
      Alert.alert("⚠️", "Please add a message.");
      return;
    }

    try {
      const res = await axios.post(
        "https://freepe.in/submit-other-services",
        form,
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );
      if (res?.data?.success || res.status === 200) {
        Alert.alert("✅", "Form submitted successfully");
        handleReset();
      } else {
        Alert.alert("❌", "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err?.message || err);
      Alert.alert("❌", "Submission failed. Please try again.");
    }
  };

  const handleReset = () =>
    setForm({
      name: "",
      contact: "",
      email: "",
      serviceType: "",
      gender: "",
      message: "",
    });

  const genderOptions = ["Male", "Female", "Other"];

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[styles.bgBlob, { transform: [{ translateX }, { translateY }] }]}
      >
        <LinearGradient
          colors={["#FFB57A", "#FF8A3C", "#FF6A00"]}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#6D28D9", "#7C3AED", "#A78BFA"]}
            style={styles.header}
          >
            <View style={styles.headerInner}>
              <View style={styles.headerIconWrap}>
                <FontAwesome5 name="briefcase" size={28} color="#fff" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.headerTitle}>Other Services</Text>
                <Text style={styles.headerSub}>
                  Tell us what you need — we'll help
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.card}>
            {/* NAME */}
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#FF6A00"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
                returnKeyType="next"
              />
            </View>

            {/* CONTACT + EMAIL */}
            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Contact</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="call-outline" size={20} color="#FF6A00" />
                  <TextInput
                    style={styles.input}
                    placeholder="10-digit number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={form.contact}
                    onChangeText={(text) =>
                      handleChange("contact", text.replace(/[^0-9]/g, ""))
                    }
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#FF6A00"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(text) => handleChange("email", text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            {/* GENDER */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioRow}>
              {genderOptions.map((g) => {
                const active = form.gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.radioBtn, active && styles.radioBtnActive]}
                    onPress={() => handleChange("gender", g)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        active && styles.radioOuterActive,
                      ]}
                    >
                      {active && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.radioText,
                        active && styles.radioTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* SERVICE TYPE (REQUIRED) - Legal Consulting menu */}
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={form.serviceType}
                onValueChange={(itemValue) =>
                  handleChange("serviceType", itemValue)
                }
                style={styles.picker}
                dropdownIconColor="#FF6A00"
              >
                <Picker.Item label="Select legal consulting type..." value="" />
                <Picker.Item label="Property Law" value="legal_property" />
                <Picker.Item
                  label="Corporate / Company Law"
                  value="legal_corporate"
                />
                <Picker.Item label="Family Law" value="legal_family" />
                <Picker.Item label="Contract Law" value="legal_contract" />
                <Picker.Item label="Tax Law" value="legal_tax" />
                <Picker.Item label="Intellectual Property" value="legal_ip" />
                <Picker.Item label="Employment Law" value="legal_employment" />
                <Picker.Item
                  label="Litigation / Civil"
                  value="legal_litigation"
                />
              </Picker>
            </View>

            {/* MESSAGE label with icon outside */}
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
              <Text style={[styles.label, { marginLeft: 8, marginTop: 0 }]}>
                Message
              </Text>
            </View>

            {/* MESSAGE TEXTAREA */}
            <View style={[styles.inputRow, styles.textAreaWrap]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write details / requirements..."
                multiline
                numberOfLines={4}
                value={form.message}
                onChangeText={(text) => handleChange("message", text)}
              />
            </View>

            {/* ACTIONS */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.primaryBtn, !isFormValid() && { opacity: 0.6 }]}
                onPress={validateAndSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() =>
                  Alert.alert("Reset", "Clear all fields?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", style: "destructive", onPress: handleReset },
                  ])
                }
                activeOpacity={0.85}
              >
                <Text style={styles.outlineBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  bgBlob: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.8,
    height: SCREEN_HEIGHT * 0.45,
    top: -120,
    left: -SCREEN_WIDTH * 0.35,
    borderRadius: 300,
    overflow: "hidden",
    opacity: 0.95,
  },

  container: {
    padding: 16,
    paddingTop: 28,
    alignItems: "center",
  },

  header: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 10,
  },

  headerInner: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  headerSub: { color: "#F3E8FF", marginTop: 4, fontSize: 13 },

  card: {
    width: "94%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(29,21,74,0.06)",
    marginTop: 6,
  },

  label: {
    color: "#1D154A",
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
    fontSize: 14,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    height: 42,
    fontSize: 15,
    color: "#111",
  },

  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  radioRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },

  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },

  radioBtnActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1D154A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    backgroundColor: "#fff",
  },

  radioOuterActive: {
    borderColor: "#155724",
    backgroundColor: "#ECFDF5",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#155724",
  },

  radioText: {
    fontSize: 14,
    color: "#1D154A",
  },

  radioTextActive: {
    color: "#155724",
    fontWeight: "700",
  },

  pickerWrap: {
    borderRadius: 10,
    backgroundColor: "#FFF5EB",
    borderWidth: 1,
    borderColor: "rgba(29,21,74,0.04)",
    marginBottom: 10,
  },
  

  picker: {
    height: 44,
    width: "100%",
    color: "#111",
  },

  textAreaWrap: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  textArea: {
    marginLeft: 0,
    flex: 1,
    textAlignVertical: "top",
    height: 110,
    color: "#111",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  primaryBtn: {
    flex: 0.68,
    backgroundColor: "#FF6A00",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  outlineBtn: {
    flex: 0.3,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF6A00",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  outlineBtnText: {
    color: "#FF6A00",
    fontWeight: "800",
  },
});
