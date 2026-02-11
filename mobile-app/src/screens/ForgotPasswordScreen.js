import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordScreen({ navigation, route }) {
  const role = route?.params?.role || "customer";
  const isStaff = role === "staff";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) return Alert.alert("Missing Email", "Enter your registered email.");

    setLoading(true);
    try {
      const res = await forgotPassword({ email: email.trim() });

      if (!res.ok) {
        Alert.alert("Failed", res.message || "Try again");
        return;
      }

      Alert.alert("Success", "Reset link sent to your email.");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, isStaff && styles.staffContainer]}>
      <Text style={[styles.title, isStaff && styles.staffTitle]}>Reset Password</Text>
      <Text style={[styles.subtitle, isStaff && styles.staffSubtitle]}>
        {isStaff ? "Staff account recovery" : "We will send a reset link to your email"}
      </Text>

      <View style={[styles.inputBox, isStaff && styles.staffInputBox]}>
        <Ionicons name="mail-outline" size={18} color={isStaff ? "#16A34A" : "#16A34A"} />
        <TextInput
          style={[styles.input, isStaff && styles.staffInput]}
          placeholder="Email"
          placeholderTextColor={isStaff ? "#A7F3D0" : "#166534"}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, isStaff && styles.staffBtn]}
        onPress={handleSend}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.link, isStaff && styles.staffLink]}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 22, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "900", color: "#052E16" },
  subtitle: { marginTop: 6, color: "#166534", fontWeight: "700", marginBottom: 20 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: "#F0FDF4",
  },

  input: { flex: 1, marginLeft: 10, fontWeight: "800", color: "#052E16" },

  btn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  link: { color: "#166534", textAlign: "center", marginTop: 14, fontWeight: "800" },

  /* STAFF THEME */
  staffContainer: { backgroundColor: "#022C22" },
  staffTitle: { color: "#ECFDF5" },
  staffSubtitle: { color: "#A7F3D0" },
  staffInputBox: { backgroundColor: "#064E3B", borderColor: "#065F46" },
  staffInput: { color: "#ECFDF5" },
  staffBtn: { backgroundColor: "#16A34A" },
  staffLink: { color: "#A7F3D0" },
});
