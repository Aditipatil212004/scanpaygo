import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import API_BASE from "../services/api";

export default function StaffSignupScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [brandName, setBrandName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ✅ Get Map Result */
  useEffect(() => {
    if (route?.params?.latitude) {
      setLatitude(route.params.latitude);
      setLongitude(route.params.longitude);
    }
  }, [route?.params]);

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !pass ||
      !brandName ||
      !location ||
      !city ||
      !latitude ||
      !longitude
    ) {
      Alert.alert("Error", "All fields required (including map location)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/create-staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: pass,
          brandName,
          location,
          city,
          latitude,
          longitude,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        Alert.alert("Success", "Staff account created");
        navigation.replace("StaffLogin");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      console.log("STAFF SIGNUP ERROR =>", err);
      setLoading(false);
      Alert.alert("Network Error", "Check backend URL");
    }
  };

  return (
    <LinearGradient colors={["#065F46", "#022C22"]} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Staff Account</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={pass}
          onChangeText={setPass}
        />

        <TextInput
          placeholder="Brand Name (Zudio)"
          style={styles.input}
          value={brandName}
          onChangeText={setBrandName}
        />

        <TextInput
          placeholder="Location (Viman Nagar)"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          placeholder="City (Pune)"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        {/* ✅ Map Select Button (UI same style) */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MapPicker")}
        >
          <Text style={styles.buttonText}>
            {latitude ? "Location Selected ✅" : "Select Store On Map"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: "center", padding: 24 },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 18,
    textAlign: "center",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 16,
    color: "#fff",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  link: {
    color: "#fff",
    textAlign: "center",
    marginTop: 14,
    fontWeight: "800",
  },
});
