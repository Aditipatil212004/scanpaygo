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
import { signupUser } from "../services/authService";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !pass || !confirm) {
      Alert.alert("Missing Fields", "Please fill all details.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Enter a valid email address.");
      return;
    }
    if (pass.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (pass !== confirm) {
      Alert.alert("Password Mismatch", "Password and confirm password must match.");
      return;
    }

    setLoading(true);
    try {
      const res = await signupUser({ name: name.trim(), email: email.trim(), password: pass });

      if (res.message?.includes("successful")) {
        Alert.alert("✅ Account Created", "Now login to continue.", [
          { text: "Go to Login", onPress: () => navigation.replace("Login") },
        ]);
      } else {
        Alert.alert("Signup Failed", res.message || "Try again");
      }
    } catch (err) {
      console.log("SIGNUP ERROR =>", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start scanning & shopping</Text>

      <View style={styles.inputBox}>
        <Ionicons name="person-outline" size={18} color="#16A34A" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={18} color="#16A34A" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={18} color="#16A34A" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />
      </View>

      <View style={styles.inputBox}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#16A34A" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} activeOpacity={0.92} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")} style={{ marginTop: 16 }}>
        <Text style={styles.link}>
          Already have account? <Text style={styles.linkBold}>Login</Text>
        </Text>
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

  link: { color: "#166534", fontWeight: "800", textAlign: "center" },
  linkBold: { color: "#052E16", fontWeight: "900" },
});
