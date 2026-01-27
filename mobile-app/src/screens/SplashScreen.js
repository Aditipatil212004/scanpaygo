import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function SplashScreen({ navigation }) {
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (isLoggedIn) navigation.replace("Main");
      else navigation.replace("Login");
    }, 1200);

    return () => clearTimeout(timer);
  }, [loading, isLoggedIn]);

  return (
    <View style={styles.container}>
      {/* App Icon */}
      <View style={styles.logoCircle}>
        <Ionicons name="scan-outline" size={42} color="#16A34A" />
      </View>

      {/* Title */}
      <Text style={styles.title}>ScanPayGo</Text>
      <Text style={styles.subtitle}>Scan • Pay • Go</Text>

      {/* ✅ Logo Image */}
      <Image
        source={require("../../assets/images/logo.jpeg")}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#052E16",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "800",
    color: "#166534",
  },

  logoImage: {
    width: 240,
    height: 240,
    marginTop: 20,
  },
});

