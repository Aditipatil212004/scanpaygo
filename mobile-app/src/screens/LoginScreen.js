import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
   const res = await loginUser({
  email,
  password: pass,
  role: "customer",
});


    if (res.ok) await login(res.token, res.user);
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.gradient}>
      <Animated.View style={[styles.card, { opacity: fade }]}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotWrap}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Don't have account? Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
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
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 16,
    color: "#fff",
    marginBottom: 14,
  },

  forgotWrap: { alignSelf: "flex-end", marginBottom: 6 },
  forgotText: { color: "#A7F3D0", fontWeight: "700" },

  button: {
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  link: {
    color: "#fff",
    textAlign: "center",
    marginTop: 14,
    fontWeight: "800",
  },
});
