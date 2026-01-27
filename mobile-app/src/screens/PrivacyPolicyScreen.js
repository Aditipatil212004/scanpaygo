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

export default function PrivacyPolicyScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* ✅ HEADER */}
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
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

        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}  // ✅ FIXED
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 18 }}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            Your Privacy Matters
          </Text>

          <Text style={[styles.sub, { color: colors.muted }]}>
            ScanPayGo respects your privacy. This policy explains what data we
            collect and how we use it.
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>
            1. Data We Collect
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            • Name, email, phone number{"\n"}
            • Store/address selection{"\n"}
            • Cart items and orders{"\n"}
            • Wallet transaction history (if wallet is enabled)
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>
            2. How We Use Data
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            We use your data to:{"\n"}
            • Provide Scan-Pay-Go shopping features{"\n"}
            • Generate receipts and order history{"\n"}
            • Improve app experience{"\n"}
            • Support & issue resolution
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>
            3. Data Security
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            We apply best security practices. Your password is encrypted and
            sensitive data is protected.
          </Text>

          <Text style={[styles.section, { color: colors.text }]}>4. Contact</Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            If you have any privacy questions, reach us at:{"\n"}
            support@scanpay.com
          </Text>

          <Text style={[styles.footer, { color: colors.muted }]}>
            Last updated: Jan 2026
          </Text>
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
