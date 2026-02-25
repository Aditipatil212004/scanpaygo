import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../services/api";

export default function UploadProductsScreen() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  /* ================= PICK CSV ================= */
  const pickCSV = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*", // ✅ IMPORTANT: show CSV in file manager
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (res.canceled) return;

      const file = res.assets[0];
      setFileName(file.name);

      uploadCSV(file);
    } catch (err) {
      console.log("Pick CSV error:", err);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  /* ================= UPLOAD CSV ================= */
  const uploadCSV = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: "text/csv", // backend will parse using multer
      });

      const res = await fetch(`${API_BASE}/api/staff/upload-products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT set Content-Type manually for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      Alert.alert(
        "✅ Upload Successful",
        `Products added: ${data.count}`
      );

      setFileName(null);
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("❌ Error", err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Products (CSV)</Text>

      <Text style={styles.subtitle}>
        Upload product list for your store
      </Text>

      <TouchableOpacity
        onPress={pickCSV}
        activeOpacity={0.9}
        style={styles.uploadBtn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>
            {fileName ? "Change CSV File" : "Select CSV File"}
          </Text>
        )}
      </TouchableOpacity>

      {fileName && (
        <Text style={styles.fileName}>
          Selected: {fileName}
        </Text>
      )}

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>CSV Format</Text>
        <Text style={styles.noteText}>
          ProductID, ProductName, Brand, Gender, Price, Description, Color
        </Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECFDF5",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#022C22",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },

  uploadBtn: {
    marginTop: 30,
    paddingVertical: 16,
    backgroundColor: "#16A34A",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  uploadText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },

  fileName: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
  },

  noteBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#D1FAE5",
    borderRadius: 14,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#022C22",
  },

  noteText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#065F46",
  },
});