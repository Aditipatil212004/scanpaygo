import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function TermsScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Terms & Conditions</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={T.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.heading, { color: colors.text }]}>Terms of Use</Text>

          <Text style={[styles.sub, { color: colors.muted }]}>
            By using ScanPayGo, you agree to follow these terms.
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>1. App Usage</Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            ScanPayGo is a prototype Scan-Pay-Go app. Users must ensure scanning and payment is
            completed before exiting.
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>2. Payments</Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            Wallet/UPI/Card payments are simulated or handled via providers. ScanPayGo is not
            responsible for third-party payment errors.
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>3. User Responsibilities</Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            • Do not misuse scanning features{"\n"}
            • Do not attempt fraud{"\n"}
            • Follow store rules
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>4. Limitation</Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            ScanPayGo is not liable for product availability, pricing issues, or store disputes.
          </Text>

          <Text style={[styles.footer, { color: colors.muted }]}>Last updated: Jan 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 14,
    paddingBottom: 10,
  },

  backBtn: {
    width: 44,
    height: 44,
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
    marginTop: 10,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  heading: {
    fontSize: 18,
    fontWeight: "900",
  },

  sub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  section: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "900",
  },

  text: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.9,
  },
});
