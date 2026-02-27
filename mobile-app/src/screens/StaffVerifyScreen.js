import React from "react";
import { Alert, View, Text } from "react-native";
import { CameraView } from "expo-camera";
import API_BASE from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StaffVerifyScreen() {
  const { token } = useAuth();

  const handleScan = async ({ data }) => {
    try {
      const parsed = JSON.parse(data);

      const res = await fetch(`${API_BASE}/api/staff/verify-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiptId: parsed.receiptId }),
      });

      const result = await res.json();

      Alert.alert("Result", result.message);
    } catch {
      Alert.alert("Error", "Invalid QR code");
    }
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={handleScan}
    />
  );
}