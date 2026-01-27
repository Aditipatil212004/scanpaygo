import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function AboutUsScreen({ navigation }) {
  const { colors, mode } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.soft, borderColor: colors.border },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>About Us</Text>

          <View style={{ width: 42 }} />
        </View>

        {/* ===== App Card ===== */}
        <View style={[styles.appCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.logoBox, { backgroundColor: colors.soft, borderColor: colors.border }]}>
            <Ionicons name="qr-code-outline" size={34} color={colors.primary} />
          </View>

          <Text style={[styles.appName, { color: colors.text }]}>ScanPayGo</Text>
          <Text style={[styles.appTagline, { color: colors.muted }]}>
            Scan · Pay · Go Smart Shopping
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>4.8 Rated by users</Text>
          </View>
        </View>

        {/* ===== Mission / Vision ===== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.soft2, borderColor: colors.border }]}>
            <Ionicons name="rocket-outline" size={22} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              To reduce checkout time and make shopping faster, easier and fully digital.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 18, color: colors.text }]}>
            Our Vision
          </Text>

          <View style={[styles.infoCard, { backgroundColor: colors.soft2, borderColor: colors.border }]}>
            <Ionicons name="eye-outline" size={22} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              To become India’s best Scan-Pay-Go experience across malls and stores.
            </Text>
          </View>
        </View>

        {/* ===== Features ===== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Why ScanPayGo?</Text>

          <FeatureRow icon="barcode-outline" title="Fast Barcode Scanning" colors={colors} />
          <FeatureRow icon="cart-outline" title="Smart Cart System" colors={colors} />
          <FeatureRow icon="wallet-outline" title="Wallet & Payments" colors={colors} />
          <FeatureRow icon="shield-checkmark-outline" title="Staff Receipt Verification" colors={colors} />
          <FeatureRow icon="receipt-outline" title="Digital Receipts & History" colors={colors} />
        </View>

        {/* ===== Team ===== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Made With ❤️</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Our development team</Text>

          <View style={styles.teamGrid}>
            {/* ✅ You */}
            <View style={[styles.memberCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={require("../../assets/images/Aditi.jpeg")}
                style={[styles.memberImg, { borderColor: colors.primary }]}
              />
              <Text style={[styles.memberName, { color: colors.text }]}>Aditi Patil</Text>
              <Text style={[styles.memberRole, { color: colors.muted }]}>Developer</Text>
            </View>

            {/* ✅ Friend */}
            <View style={[styles.memberCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={require("../../assets/images/ketan.jpeg")}
                style={[styles.memberImg, { borderColor: colors.primary }]}
              />
              <Text style={[styles.memberName, { color: colors.text }]}>Ketan Patil</Text>
              <Text style={[styles.memberRole, { color: colors.muted }]}>Developer</Text>
            </View>
          </View>
        </View>

        {/* ===== Support ===== */}
        <TouchableOpacity
          style={[styles.supportBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("ContactSupport")}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>

        {/* ===== Footer ===== */}
        <Text style={[styles.footerText, { color: colors.muted }]}>Version 1.0.0</Text>
        <Text style={[styles.footerText2, { color: colors.muted }]}>© 2026 ScanPayGo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ Feature Row Component */
function FeatureRow({ icon, title, colors }) {
  return (
    <View style={[styles.featureRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.featureIcon, { backgroundColor: colors.soft, borderColor: colors.border }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.featureText, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  appCard: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },

  logoBox: {
    width: 74,
    height: 74,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  appName: { fontSize: 22, fontWeight: "900" },
  appTagline: { fontSize: 13, fontWeight: "800", marginTop: 4 },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  ratingText: { fontWeight: "900", fontSize: 13 },

  section: { marginTop: 26 },

  sectionTitle: { fontSize: 16, fontWeight: "900", marginBottom: 12 },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  infoText: { flex: 1, fontWeight: "800", fontSize: 13, lineHeight: 18 },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  featureText: { fontSize: 14, fontWeight: "900" },

  sectionHint: {
    marginTop: -4,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
  },

  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  memberCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  memberImg: {
    width: 74,
    height: 74,
    borderRadius: 28,
    borderWidth: 2,
    marginBottom: 10,
  },

  memberName: { fontSize: 14, fontWeight: "900" },

  memberRole: { fontSize: 12, fontWeight: "800", marginTop: 4 },

  supportBtn: {
    marginTop: 26,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#16A34A",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 9,
  },

  supportText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  footerText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 12,
    fontWeight: "800",
  },

  footerText2: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.9,
  },
});
