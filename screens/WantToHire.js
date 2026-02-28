import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
  import axios from 'axios'; // at the top

const WantToHire = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    category: "",
    jobTitle: "",
    companyName: "",
    location: "",
    salary: "",
    contactEmail: "",
    description: "",
    fileName: null,
    fileUri: null,
    fileType: null,
  });

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        multiple: false,
      });

      if (res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        handleInputChange("fileName", file.name);
        handleInputChange("fileUri", file.uri);
        handleInputChange("fileType", file.mimeType);
      } else {
        Alert.alert(t("want_to_hire.alerts.no_file"), t("want_to_hire.alerts.choose_file"));
      }
    } catch (err) {
      Alert.alert(t("want_to_hire.alerts.error"), t("want_to_hire.alerts.error_generic"));
    }
  };


const handleSubmit = async () => {
  if (
    !formData.jobTitle ||
    !formData.companyName ||
    !formData.location ||
    !formData.salary ||
    !formData.contactEmail ||
    !formData.description ||
    !formData.fileUri
  ) {
    Alert.alert(
      t("want_to_hire.alerts.missing_fields_title"),
      t("want_to_hire.alerts.missing_fields_msg")
    );
    return;
  }

  const form = new FormData();
  form.append('category', formData.category);
  form.append('jobTitle', formData.jobTitle);
  form.append('companyName', formData.companyName);
  form.append('location', formData.location);
  form.append('salary', formData.salary);
  form.append('contactEmail', formData.contactEmail);
  form.append('description', formData.description);
  form.append('file', {
    uri: formData.fileUri,
    name: formData.fileName,
    type: formData.fileType || 'application/pdf',
  });

  try {
    const response = await axios.post('https://indiaapay.com/want-to-hire', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    Alert.alert(t("want_to_hire.alerts.success"), response.data.message);
  } catch (error) {
    console.error("Submission error:", error);
    Alert.alert(t("want_to_hire.alerts.error"), "Something went wrong!");
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Arrow */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.header}>{t("want_to_hire.title")}</Text>
        </View>

        {/* Form Inputs */}
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.category")}
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("category", text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.job_title")}
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("jobTitle", text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.company_name")}
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("companyName", text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.location")}
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("location", text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.salary")}
          keyboardType="numeric"
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("salary", text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t("want_to_hire.contact_email")}
          keyboardType="email-address"
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("contactEmail", text)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={t("want_to_hire.description")}
          multiline
          placeholderTextColor="#6b7280"
          onChangeText={(text) => handleInputChange("description", text)}
        />

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Text style={styles.uploadButtonText}>{t("want_to_hire.upload_button")}</Text>
        </TouchableOpacity>

        {/* File Name Display */}
        {formData.fileName && (
          <View style={styles.fileContainer}>
            <Text style={styles.fileName}>
              {t("want_to_hire.selected_file")}: {formData.fileName}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>{t("want_to_hire.submit")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WantToHire;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fefefe",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 28,
    marginRight: 12,
    color: "#1d154a",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d154a",
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    marginBottom: 14,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#1d154a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#ffa500",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  fileContainer: {
    marginTop: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    color: "#1d154a",
  },
});
