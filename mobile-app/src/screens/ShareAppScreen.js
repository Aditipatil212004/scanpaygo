import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function ShareAppScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const referralCode = "SCANPAY50";
  const appLink = "https://scanpay.in/app"; // ✅ replace later with Playstore link

  const shareMessage = `Hey! I’m using ScanPay 🚀
Scan products and pay instantly inside malls/stores.

Download here: ${appLink}
Use my referral code: ${referralCode}`;

  const onShare = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch (error) {
      Alert.alert("Error", "Could not open share menu");
    }
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Copied ✅", "Referral code copied to clipboard!");
  };

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Share the App</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Top card */}
        <View
          style={[
            styles.topCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: mode === "dark" ? colors.soft : "#F0FDF4",
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="bag-handle" size={30} color={colors.primary} />
          </View>

          <Text style={[styles.heading, { color: colors.text }]}>Invite your friends 🎉</Text>
          <Text style={[styles.subHeading, { color: colors.muted }]}>
            Share ScanPay and make shopping faster & smarter!
          </Text>
        </View>

        {/* Referral Box */}
        <View
          style={[
            styles.refBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.refTitle, { color: colors.text }]}>Your referral code</Text>

          <View style={styles.refRow}>
            <Text style={[styles.refCode, { color: colors.primary }]}>{referralCode}</Text>

            <TouchableOpacity
              style={[styles.copyBtn, { backgroundColor: colors.primary }]}
              onPress={copyCode}
              activeOpacity={0.9}
            >
              <Ionicons name="copy-outline" size={16} color="#fff" />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share button */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: colors.primary }]}
          onPress={onShare}
          activeOpacity={0.92}
        >
          <Ionicons name="share-social" size={20} color="#fff" />
          <Text style={styles.shareText}>Share ScanPay App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  topCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  heading: {
    fontSize: 20,
    fontWeight: "900",
  },

  subHeading: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },

  refBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },

  refTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },

  refRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  refCode: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },

  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  copyText: { color: "#fff", fontWeight: "900" },

  shareBtn: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  shareText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
