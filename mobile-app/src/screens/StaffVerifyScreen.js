import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../services/api";

export default function StaffVerifyScreen() {
  const { token, logout } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const handleScan = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/staff/verify-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiptId: data }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert("✅ Verified", result.message);
      } else {
        Alert.alert("❌ Error", result.message);
      }
    } catch (err) {
      Alert.alert("Network Error");
    }

    setLoading(false);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "blue" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#065F46", "#022C22"]} style={styles.container}>
      
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan Receipt QR</Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 📷 CAMERA */}
      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>

      {/* ⏳ LOADING */}
      {loading && <ActivityIndicator size="large" color="#fff" />}

      {/* 🔁 SCAN AGAIN */}
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },

  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },

  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 12,
  },

  cameraWrapper: {
    width: "90%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
