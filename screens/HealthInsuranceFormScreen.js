import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

const HealthInsuranceFormScreen = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    age: "",
    coverAmount: "",
    diseases: "",
    medicalHistory: "",
    badHabits: "",
    familyCount: "",
  });

  const [hasDisease, setHasDisease] = useState(false);
  const [isSmoker, setIsSmoker] = useState(false);
  const [isAlcoholic, setIsAlcoholic] = useState(false);
  const [usesTobacco, setUsesTobacco] = useState(false);
  const [familyCount, setFamilyCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [medicalHistoryInput, setMedicalHistoryInput] = useState("");

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      diseases: hasDisease ? "Yes" : "No",
      badHabits: `${isSmoker ? "Smoker, " : ""}${isAlcoholic ? "Alcoholic, " : ""}${usesTobacco ? "Tobacco User" : ""}`.trim().replace(/,$/, ""),
      familyCount: familyCount.toString(),
      medicalHistory: tags.join(", "),
    }));
  }, [hasDisease, isSmoker, isAlcoholic, usesTobacco, familyCount, tags]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
const handleSubmit = async () => {
  if (!form.name.trim()) {
    Alert.alert(t("formt.error"), t("formt.enter_name"));
    return;
  }
  if (!form.contact.trim() || form.contact.length !== 10 || !/^\d+$/.test(form.contact)) {
    Alert.alert(t("formt.error"), t("formt.enter_valid_contact"));
    return;
  }

  try {
    const response = await fetch('https://indiaapay.com/submit-health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert(t("formt.success"), data.message || "Submitted successfully");
      setForm({
        name: "",
        contact: "",
        email: "",
        age: "",
        coverAmount: "",
        diseases: "",
        medicalHistory: "",
        badHabits: "",
        familyCount: "",
      });
      setTags([]);
      setHasDisease(false);
      setIsSmoker(false);
      setIsAlcoholic(false);
      setUsesTobacco(false);
      setFamilyCount(0);
    } else {
      Alert.alert(t("formt.error"), data.message || "Submission failed");
    }
  } catch (error) {
    console.error("Submission error:", error);
    Alert.alert(t("formt.error"), "Something went wrong!");
  }
};


  const renderOption = (label, state, setState) => (
    <View style={styles.optionRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.optionButton, state === true && styles.selectedOption]}
          onPress={() => setState(true)}
        >
          <Text style={[styles.optionText, state === true && styles.selectedOptionText]}>{t("formt.yes")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, state === false && styles.selectedOption]}
          onPress={() => setState(false)}
        >
          <Text style={[styles.optionText, state === false && styles.selectedOptionText]}>{t("formt.no")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const addTag = () => {
    if (medicalHistoryInput.trim() && !tags.includes(medicalHistoryInput.trim())) {
      setTags([...tags, medicalHistoryInput.trim()]);
      setMedicalHistoryInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.formWrapper}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t("formt.health_insurance")}</Text>

        <TextInput
          placeholder={t("formt.name_placeholder")}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          style={styles.input}
        />
        <TextInput
          placeholder={t("formt.contact_placeholder")}
          value={form.contact}
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={(text) => handleChange("contact", text)}
          style={styles.input}
        />
        <TextInput
          placeholder={t("formt.email_placeholder")}
          value={form.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
        />

        <TextInput
          placeholder={t("Enter you age")}
          keyboardType="numeric"
          value={form.age}
          onChangeText={(text) => handleChange("age", text)}
          style={styles.input}
        />

        <TextInput
          placeholder={t("formt.cover_amount")}
          keyboardType="numeric"
          value={form.coverAmount}
          onChangeText={(text) => handleChange("coverAmount", text)}
          style={styles.input}
        />

        <Text style={styles.label}>{t("formt.pre_existing")}</Text>
        <Pressable onPress={() => setHasDisease(!hasDisease)} style={[styles.checkbox, hasDisease && styles.checkedBox]}>
          {hasDisease && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        {hasDisease && (
          <TextInput
            placeholder={t("formt.disease_placeholder")}
            value={form.diseases}
            onChangeText={(text) => handleChange("diseases", text)}
            style={styles.input}
          />
        )}
        

        {renderOption(t("formt.smoker"), isSmoker, setIsSmoker)}
        {renderOption(t("formt.alcoholic"), isAlcoholic, setIsAlcoholic)}
        {renderOption(t("formt.tobacco_use"), usesTobacco, setUsesTobacco)}

        <Text style={styles.label}>{t("formt.medical_history")}</Text>
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TextInput
          placeholder={t("formt.medical_history_placeholder")}
          value={medicalHistoryInput}
          onChangeText={setMedicalHistoryInput}
          onSubmitEditing={addTag}
          style={styles.input}
        />

        <Text style={styles.label}>{t("formt.include_family")}</Text>
        <View style={styles.counterControls}>
          <TouchableOpacity onPress={() => setFamilyCount(Math.max(0, familyCount - 1))}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text>{familyCount}</Text>
          <TouchableOpacity onPress={() => setFamilyCount(familyCount + 1)}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>{t("formt.submit_button")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebf7ff",
  },
  formWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#1D154A",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#1D154A",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1D154A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1D154A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#1D154A",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  checkedBox: {
    backgroundColor: "#1D154A",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  removeTag: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 15,
  },
  counterText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1D154A",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#04AA6D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionRow: {
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#1D154A",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: "#FFA500",
  },
  optionText: {
    color: "#1D154A",
  },
  selectedOptionText: {
    color: "#fff",
  },
});

export default HealthInsuranceFormScreen;
