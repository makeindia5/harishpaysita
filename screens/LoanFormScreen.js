import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

const LoanFinanceForm = () => {
  const { t } = useTranslation();

  const loanOptions = [
    t("loan_types.personal"),
    t("loan_types.business"),
    t("loan_types.home_transfer"),
    t("loan_types.topup_home"),
    t("loan_types.education"),
    t("loan_types.vehicle"),
    t("loan_types.gold"),
    t("loan_types.property"),
    t("loan_types.shares"),
    t("loan_types.sme"),
    t("loan_types.school_hotel"),
    t("loan_types.lrd")
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    selectedLoans: [],
    income: '',
    loanAmount: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const toggleLoanSelection = (loan) => {
    setForm((prevForm) => ({
      ...prevForm,
      selectedLoans: prevForm.selectedLoans.includes(loan)
        ? prevForm.selectedLoans.filter((item) => item !== loan)
        : [...prevForm.selectedLoans, loan],
    }));
  };
const handleSubmit = async () => {
  if (!form.name || form.contact.length !== 10) {
    Alert.alert(t("alerts.error"), t("alerts.invalid_name_contact"));
    return;
  }

  try {
    const response = await fetch('https://indiaapay.com/loan-finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    Alert.alert(t("alerts.success"), data.message);
  } catch (error) {
    console.error('Submission error:', error);
    Alert.alert(t("alerts.error"), "Something went wrong.");
  }
};


  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      contact: '',
      selectedLoans: [],
      income: '',
      loanAmount: '',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formWrapper}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t("loan_form.title")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("loan_form.name")}
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t("loan_form.email")}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder={t("loan_form.contact")}
              keyboardType="phone-pad"
              value={form.contact}
              onChangeText={(text) => {
                if (/^\d*$/.test(text) && text.length <= 10) {
                  handleChange("contact", text);
                }
              }}
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>{t("loan_form.select_loan")}</Text>
          <View style={styles.loanContainer}>
            {loanOptions.map((loan, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.loanOption,
                  form.selectedLoans.includes(loan) && styles.selectedLoanOption
                ]}
                onPress={() => toggleLoanSelection(loan)}
              >
                <Text style={[
                  styles.loanText,
                  form.selectedLoans.includes(loan) && styles.selectedLoanText
                ]}>
                  {loan}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t("loan_form.income")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("loan_form.income")}
            keyboardType="numeric"
            value={form.income}
            onChangeText={(text) => handleChange("income", text)}
          />

          <Text style={styles.label}>{t("loan_form.loan_amount")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("loan_form.loan_amount")}
            keyboardType="numeric"
            value={form.loanAmount}
            onChangeText={(text) => handleChange("loanAmount", text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{t("loan_form.submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.buttonText}>{t("loan_form.reset")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoanFinanceForm;

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
    color: "#1D154A"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  loanContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  loanOption: {
    borderWidth: 1,
    borderColor: "#1D154A",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    backgroundColor: "#f9f9f9",
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedLoanOption: {
    backgroundColor: "#FFA500",
  },
  loanText: {
    color: "#000",
  },
  selectedLoanText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#04AA6D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  resetButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
