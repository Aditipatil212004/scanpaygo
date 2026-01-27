import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function AppearanceScreen({ navigation }) {
  const { mode, colors, setTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Options */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemeOption
          title="Light"
          subtitle="Bright white theme"
          icon="sunny-outline"
          active={mode === "light"}
          onPress={() => setTheme("light")}
          colors={colors}
        />

        <Divider colors={colors} />

        <ThemeOption
          title="Dark"
          subtitle="Comfortable night theme"
          icon="moon-outline"
          active={mode === "dark"}
          onPress={() => setTheme("dark")}
          colors={colors}
        />
      </View>

      {/* Hint */}
      <Text style={[styles.hint, { color: colors.muted }]}>
        Your theme will apply across the whole app.
      </Text>
    </SafeAreaView>
  );
}

function ThemeOption({ title, subtitle, icon, active, onPress, colors }) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconBox, { backgroundColor: active ? colors.primary : "transparent", borderColor: colors.border }]}>
        <Ionicons name={icon} size={20} color={active ? "#fff" : colors.text} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.optionSub, { color: colors.muted }]}>{subtitle}</Text>
      </View>

      {active ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      )}
    </TouchableOpacity>
  );
}

function Divider({ colors }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    marginTop: 18,
    overflow: "hidden",
  },

  option: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  optionSub: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
  },

  divider: { height: 1, marginLeft: 70 },

  hint: {
    marginTop: 16,
    fontWeight: "800",
    fontSize: 12,
    textAlign: "center",
  },
});
