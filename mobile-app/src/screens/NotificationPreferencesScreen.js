import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

const STORAGE_KEY = "notificationPrefs";

export default function NotificationPreferencesScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const [prefs, setPrefs] = useState({
    all: true,
    offers: true,
    orders: true,
    payments: true,
    scanReminders: false,
    appUpdates: true,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Load saved prefs
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setPrefs(JSON.parse(saved));
      } catch (e) {
        console.log("Notification prefs load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadPrefs();
  }, []);

  // ✅ Save prefs
  const savePrefs = async (next) => {
    try {
      setPrefs(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log("Notification prefs save error:", e);
    }
  };

  // ✅ Toggle handler
  const toggle = (key) => {
    // If turning off "all" -> turn everything off
    if (key === "all") {
      const next = {
        all: !prefs.all,
        offers: !prefs.all ? true : false,
        orders: !prefs.all ? true : false,
        payments: !prefs.all ? true : false,
        scanReminders: false,
        appUpdates: !prefs.all ? true : false,
      };
      savePrefs(next);
      return;
    }

    const next = { ...prefs, [key]: !prefs[key] };

    const anyEnabled =
      next.offers ||
      next.orders ||
      next.payments ||
      next.scanReminders ||
      next.appUpdates;

    next.all = anyEnabled;

    savePrefs(next);
  };

  if (loading) {
    return (
      <SafeAreaView style={T.screen}>
        <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />
        <View style={styles.center}>
          <Text style={{ fontWeight: "900", color: colors.muted }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <Text style={[styles.title, { color: colors.text }]}>
          Notification Preferences
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={T.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== Info Card ===== */}
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
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.topTitle, { color: colors.text }]}>
              Manage Notifications
            </Text>
            <Text style={[styles.topSub, { color: colors.muted }]}>
              Choose what updates you want to receive from ScanPayGo.
            </Text>
          </View>
        </View>

        {/* ===== Toggle Cards ===== */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="notifications-outline"
          label="All Notifications"
          desc="Master switch for everything"
          value={prefs.all}
          onChange={() => toggle("all")}
          highlight
        />

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="pricetag-outline"
          label="Offers & Discounts"
          desc="New deals from stores"
          value={prefs.offers}
          onChange={() => toggle("offers")}
          disabled={!prefs.all}
        />

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="receipt-outline"
          label="Order Updates"
          desc="Payment and receipt status"
          value={prefs.orders}
          onChange={() => toggle("orders")}
          disabled={!prefs.all}
        />

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="card-outline"
          label="Payment Alerts"
          desc="Wallet and payment success messages"
          value={prefs.payments}
          onChange={() => toggle("payments")}
          disabled={!prefs.all}
        />

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="scan-outline"
          label="Scan Reminders"
          desc="Reminder to scan products"
          value={prefs.scanReminders}
          onChange={() => toggle("scanReminders")}
          disabled={!prefs.all}
        />

        <ToggleRow
          colors={colors}
          mode={mode}
          icon="cloud-download-outline"
          label="App Updates"
          desc="New features and updates"
          value={prefs.appUpdates}
          onChange={() => toggle("appUpdates")}
          disabled={!prefs.all}
        />

        {/* ===== Footer Note ===== */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={[styles.footerText, { color: colors.muted }]}>
            You can change these settings anytime. Notifications help you stay updated.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ Toggle Row Component */
function ToggleRow({
  colors,
  mode,
  icon,
  label,
  desc,
  value,
  onChange,
  disabled,
  highlight,
}) {
  return (
    <View
      style={[
        styles.toggleCard,
        {
          backgroundColor: colors.card,
          borderColor: highlight ? colors.primary : colors.border,
          borderWidth: highlight ? 2 : 1,
        },
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: highlight ? colors.primary : colors.bg,
              borderColor: highlight ? colors.primary : colors.border,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={highlight ? "#fff" : colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleTitle, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.toggleDesc, { color: colors.muted }]}>{desc}</Text>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        thumbColor={Platform.OS === "android" ? "#fff" : undefined}
        trackColor={{
          false: mode === "dark" ? "#334155" : "#E5E7EB",
          true: colors.primary,
        }}
        ios_backgroundColor={mode === "dark" ? "#334155" : "#E5E7EB"}
      />
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

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

  topTitle: { fontSize: 15, fontWeight: "900" },
  topSub: { marginTop: 4, fontSize: 12, fontWeight: "700" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  toggleCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },

  leftRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  toggleTitle: { fontSize: 14, fontWeight: "900" },
  toggleDesc: { marginTop: 4, fontSize: 12, fontWeight: "700" },

  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },

  footerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
});
