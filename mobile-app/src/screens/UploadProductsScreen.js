import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../services/api";

export default function UploadProductsScreen() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const pickCSV = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
    });

    if (res.canceled) return;

    uploadCSV(res.assets[0]);
  };

  const uploadCSV = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: "text/csv",
      });

      const res = await fetch(`${API_BASE}/api/staff/upload-products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      Alert.alert("Success", `Uploaded ${data.count} products`);
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "900" }}>
        Upload Products CSV
      </Text>

      <TouchableOpacity
        onPress={pickCSV}
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#16A34A",
          borderRadius: 14,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>
          Select CSV File
        </Text>
      </TouchableOpacity>
    </View>
  );
}
