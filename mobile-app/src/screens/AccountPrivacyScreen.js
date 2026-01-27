import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function AccountPrivacyScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const openLink = async (url) => {
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("Error", "Cannot open link");
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* ===== Header ===== */}
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

        <Text style={[styles.title, { color: colors.text }]}>Account Privacy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={T.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ✅ Top Info Card */}
        <View
          style={[
            styles.topCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.topIcon,
              { backgroundColor: colors.bg, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.topTitle, { color: colors.text }]}>
              Your Privacy Matters
            </Text>
            <Text style={[styles.topSub, { color: colors.muted }]}>
              Manage your account security, privacy settings and permissions.
            </Text>
          </View>
        </View>

        {/* ✅ Security Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
        <Card colors={colors}>
          <Row
            colors={colors}
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => Alert.alert("Coming Soon", "Password change feature soon ✅")}
          />
          <Divider colors={colors} />
          <Row
            colors={colors}
            icon="phone-portrait-outline"
            label="Logout from all devices"
            onPress={() =>
              Alert.alert(
                "Logout all devices",
                "This will logout your account from all phones.",
                [
                  { text: "Cancel" },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => Alert.alert("Done ✅", "Logged out from all devices"),
                  },
                ]
              )
            }
          />
        </Card>

        {/* ✅ Data & Permissions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Data & Permissions
        </Text>
        <Card colors={colors}>
          <ToggleRow
            colors={colors}
            icon="analytics-outline"
            label="Allow Analytics"
            value={analytics}
            setValue={setAnalytics}
            hint="Helps us improve app experience"
          />
          <Divider colors={colors} />
          <ToggleRow
            colors={colors}
            icon="megaphone-outline"
            label="Marketing Updates"
            value={marketing}
            setValue={setMarketing}
            hint="Get offers, coupons & updates"
          />
        </Card>

        {/* ✅ Legal */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
        <Card colors={colors}>
          <Row
            colors={colors}
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />
          <Divider colors={colors} />
          <Row
            colors={colors}
            icon="reader-outline"
            label="Terms & Conditions"
            onPress={() => navigation.navigate("Terms")}
          />
        </Card>

        {/* ✅ Danger Zone */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>
        <Card colors={colors}>
          <Row
            colors={colors}
            icon="trash-outline"
            label="Delete Account"
            danger
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "This will permanently delete your account and all data. Continue?",
                [
                  { text: "Cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                      Alert.alert("Deleted ✅", "Account deletion request sent."),
                  },
                ]
              )
            }
          />
        </Card>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.muted }]}>
          You can always contact support for any privacy-related issue.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ Card Wrapper */
function Card({ children, colors }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {children}
    </View>
  );
}

/* ✅ Row Component */
function Row({ icon, label, onPress, danger, colors }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: danger ? "#FEE2E2" : colors.bg,
              borderColor: danger ? "#FCA5A5" : colors.border,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={danger ? "#DC2626" : colors.primary}
          />
        </View>

        <Text style={[styles.rowText, { color: danger ? "#DC2626" : colors.text }]}>
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </TouchableOpacity>
  );
}

/* ✅ Divider */
function Divider({ colors }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

/* ✅ Toggle Row */
function ToggleRow({ icon, label, value, setValue, hint, colors }) {
  return (
    <TouchableOpacity
      style={styles.toggleRow}
      activeOpacity={0.85}
      onPress={() => setValue(!value)}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.hint, { color: colors.muted }]}>{hint}</Text>
        </View>
      </View>

      <View
        style={[
          styles.switch,
          { backgroundColor: value ? colors.primary : colors.border },
        ]}
      >
        <View
          style={[
            styles.knob,
            {
              backgroundColor: "#fff",
              transform: [{ translateX: value ? 20 : 0 }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

/* ===== Styles ===== */
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

  topCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 22,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 5,
  },

  topIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  topSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 8,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
    elevation: 4,
  },

  row: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  toggleRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  rowText: {
    fontSize: 14,
    fontWeight: "900",
  },

  hint: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    marginLeft: 68,
  },

  switch: {
    width: 46,
    height: 26,
    borderRadius: 99,
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  footer: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
});
