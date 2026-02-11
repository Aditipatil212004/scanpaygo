import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AppearanceScreen() {
  const { mode, setMode, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: mode === "light" ? colors.primary : colors.card }]}
        onPress={() => setMode("light")}
      >
        <Text style={{ color: mode === "light" ? "#fff" : colors.text }}>Light Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: mode === "dark" ? colors.primary : colors.card }]}
        onPress={() => setMode("dark")}
      >
        <Text style={{ color: mode === "dark" ? "#fff" : colors.text }}>Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  btn: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
});
