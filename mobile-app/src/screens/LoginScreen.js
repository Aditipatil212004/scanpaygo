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
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password: pass });

      if (!res.ok) {
        Alert.alert("Login Failed", res.message || "Invalid credentials");
        return;
      }

      // ✅ VERY IMPORTANT: Update AuthContext state
      // After this, AppNavigator will automatically switch to Main screens
      await login(res.token, res.user);

    } catch (err) {
      console.log("LOGIN ERROR =>", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue shopping</Text>

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

      {/* ✅ Forgot Password */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.forgotWrap}
        activeOpacity={0.8}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        activeOpacity={0.92}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.replace("Signup")}
        style={{ marginTop: 16 }}
        activeOpacity={0.85}
      >
        <Text style={styles.link}>
          Don’t have account? <Text style={styles.linkBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 22,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#052E16",
  },
  subtitle: {
    marginTop: 6,
    color: "#166534",
    fontWeight: "700",
    marginBottom: 20,
  },

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
  input: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "800",
    color: "#052E16",
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: 6,
  },
  forgotText: {
    color: "#166534",
    fontWeight: "900",
  },

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
