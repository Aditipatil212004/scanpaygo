// StaffLoginScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function StaffLoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
   const res = await loginUser({
  email,
  password: pass,
  role: "staff",
});


    if (res.ok) await login(res.token, res.user);
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#064E3B", "#022C22"]} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Staff Login</Text>

        <TextInput placeholder="Staff Email" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={pass} onChangeText={setPass} />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

       <TouchableOpacity
  onPress={() => navigation.navigate("ForgotPassword", { role: "staff" })}
>
  <Text style={{ textAlign: "center", marginTop: 14, fontWeight: "700", color: "#A7F3D0" }}>
    Forgot Password?
  </Text>
</TouchableOpacity>
<TouchableOpacity
  onPress={() => navigation.navigate("StaffSignup")}
>
  <Text style={styles.link}>Don't have account? Sign Up</Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => navigation.navigate("ForgotPassword", { role: "staff" })}
>
  <Text style={styles.link}>Forgot Password?</Text>
</TouchableOpacity>


        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: "center", padding: 24 },
  card: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 28, padding: 24 },
  title: { fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 18 },
  input: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 18, padding: 16, color: "#fff", marginBottom: 14 },
  button: { backgroundColor: "#16A34A", padding: 18, borderRadius: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  link: { color: "#fff", textAlign: "center", marginTop: 14, fontWeight: "800" },
});
