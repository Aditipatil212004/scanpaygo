import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RoleSelectionScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={styles.title}>Welcome to ScanPay</Text>
        <Text style={styles.subtitle}>Choose your access</Text>

        <TouchableOpacity style={styles.customerBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.btnText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.staffBtn} onPress={() => navigation.navigate("StaffLogin")}>
          <Text style={styles.btnText}>Staff</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "rgba(255,255,255,0.08)", padding: 25, borderRadius: 28 },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: { color: "#ddd", marginBottom: 25 },
  customerBtn: { backgroundColor: "#16A34A", padding: 18, borderRadius: 20, marginBottom: 15 },
  staffBtn: { backgroundColor: "#000", padding: 18, borderRadius: 20 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "900", fontSize: 16 },
});
