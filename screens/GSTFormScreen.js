import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from "react-native";
import { useTranslation } from "react-i18next";

const GSTFormScreen = () => {
  const { t } = useTranslation();

  const [selectedPeriod, setSelectedPeriod] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    turnover: "",
    businessName: "",
    gstNumber: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("gst_form.errors.name");
    if (!formData.contact) newErrors.contact = t("gst_form.errors.contact");
    if (!formData.email) newErrors.email = t("gst_form.errors.email");
    if (!formData.businessName) newErrors.businessName = t("gst_form.errors.businessName");
    if (!formData.gstNumber) newErrors.gstNumber = t("gst_form.errors.gstNumber");
    if (!selectedPeriod) newErrors.selectedPeriod = t("gst_form.errors.selectedPeriod");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formData.name &&
    formData.contact &&
    formData.email &&
    formData.businessName &&
    formData.gstNumber &&
    selectedPeriod;

  const handleSave = () => {
    fetch('https://indiaapay.com/api/gst', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...formData,
    period: selectedPeriod,
  }),
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Submission Error:", err));
    Alert.alert("✅ GST Form submitted successfully");
  };

  const handleReset = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      location: "",
      turnover: "",
      businessName: "",
      gstNumber: "",
    });
    setSelectedPeriod("");
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("gst_form.title")}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.subHeader}>{t("gst_form.sub_header")}</Text>
        <Text style={styles.description}>{t("gst_form.description")}</Text>

        <TextInput
          style={[styles.input, errors.name && styles.errorInput]}
          placeholder={t("gst_form.name")}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, styles.halfInput, errors.contact && styles.errorInput]}
            placeholder={t("gst_form.contact")}
            keyboardType="phone-pad"
            value={formData.contact}
            onChangeText={(text) => setFormData({ ...formData, contact: text })}
          />
          <TextInput
            style={[styles.input, styles.halfInput, errors.email && styles.errorInput]}
            placeholder={t("gst_form.email")}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>
        {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder={t("gst_form.location")}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <TextInput
          style={[styles.input, errors.businessName && styles.errorInput]}
          placeholder={t("gst_form.businessName")}
          value={formData.businessName}
          onChangeText={(text) => setFormData({ ...formData, businessName: text })}
        />
        {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}

        <TextInput
          style={[styles.input, errors.gstNumber && styles.errorInput]}
          placeholder={t("gst_form.gstNumber")}
          value={formData.gstNumber}
          onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
        />
        {errors.gstNumber && <Text style={styles.errorText}>{errors.gstNumber}</Text>}

        <TextInput
          style={styles.input}
          placeholder={t("gst_form.turnover")}
          keyboardType="numeric"
          value={formData.turnover}
          onChangeText={(text) => setFormData({ ...formData, turnover: text })}
        />

        <Text style={styles.label}>{t("gst_form.selectPeriod")}</Text>
        <View style={styles.categoryContainer}>
          {["Monthly", "Quarterly"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.categoryButton,
                selectedPeriod === period && styles.selectedCategory,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={styles.categoryText}>{t(`gst_form.period.${period}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.selectedPeriod && <Text style={styles.errorText}>{errors.selectedPeriod}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: isFormValid ? "#FFA500" : "#A9A9A9" },
            ]}
            onPress={handleSave}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>{t("gst_form.save")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.buttonText}>{t("gst_form.reset")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    borderWidth: 2,
    borderColor: "#0057D9",
    padding: 15,
    borderRadius: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: "#FFA500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#FFA500",
  },
  resetButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GSTFormScreen;