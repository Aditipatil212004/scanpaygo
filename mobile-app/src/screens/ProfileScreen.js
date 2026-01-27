import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const name = user?.name || "User";
  const phone = user?.phone || "Add phone";
  const dob = user?.dob || "Add DOB";

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={T.container}
        contentContainerStyle={{ paddingBottom: 26 }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            HEADER
        ========================== */}
        <View style={[styles.headerWrap, { backgroundColor: colors.header }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* ✅ USER IMAGE */}
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Image
              source={
                user?.photo
                  ? { uri: user.photo }
                  : require("../../assets/images/ketan.jpeg")
              }
              style={styles.avatarImage}
            />
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>

          {/* phone + dob row */}
          <View style={styles.subRow}>
            <Ionicons name="call-outline" size={14} color={colors.primary} />
            <Text style={[styles.subText, { color: colors.muted }]}>{phone}</Text>

            <View style={[styles.dot, { backgroundColor: colors.primary }]} />

            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            <Text style={[styles.subText, { color: colors.muted }]}>{dob}</Text>
          </View>

          {/* ✅ Quick 3 cards row */}
          <View style={styles.quickRow}>
            <QuickCard
              title="Wallet"
              icon="wallet-outline"
              onPress={() => navigation.navigate("Wallet")}
              colors={colors}
            />
            <QuickCard
              title="Orders"
              icon="basket-outline"
              onPress={() => navigation.navigate("Orders")}
              colors={colors}
            />
            <QuickCard
              title="Help"
              icon="chatbubbles-outline"
              onPress={() => navigation.navigate("Help")}
              colors={colors}
            />
          </View>
        </View>

        {/* =========================
            APPEARANCE
        ========================== */}
        <SectionCard colors={colors}>
          <RowItem
            icon={mode === "dark" ? "moon-outline" : "sunny-outline"}
            label="Appearance"
            rightText={mode.toUpperCase()}
            onPress={() => navigation.navigate("Appearance")}
            colors={colors}
          />
        </SectionCard>

        {/* =========================
            YOUR INFORMATION
        ========================== */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your information
        </Text>
        <SectionCard colors={colors}>
          <RowItem
            icon="person-outline"
            label="Edit profile"
            onPress={() => navigation.navigate("EditProfile")}
            colors={colors}
          />
          <Divider colors={colors} />
          <RowItem
            icon="map-outline"
            label="Address book"
            onPress={() => navigation.navigate("Addresses")}
            colors={colors}
          />
        </SectionCard>

        {/* =========================
            PAYMENT AND COUPONS ✅ BACK
        ========================== */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Payment and coupons
        </Text>
        <SectionCard colors={colors}>
          <RowItem
            icon="wallet-outline"
            label="Wallet"
            onPress={() => navigation.navigate("Wallet")}
            colors={colors}
          />
        </SectionCard>

        {/* =========================
            OTHER INFORMATION ✅ BACK
        ========================== */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Other information
        </Text>
        <SectionCard colors={colors}>
          <RowItem
            icon="share-social-outline"
            label="Share the app"
            onPress={() => navigation.navigate("ShareApp")}
            colors={colors}
          />
          <Divider colors={colors} />

          <RowItem
            icon="information-circle-outline"
            label="About us"
            onPress={() => navigation.navigate("AboutUs")}
            colors={colors}
          />
          <Divider colors={colors} />

          <RowItem
            icon="shield-checkmark-outline"
            label="Account privacy"
            onPress={() => navigation.navigate("Privacy")}
            colors={colors}
          />
          <Divider colors={colors} />

          {/* ✅ Privacy Policy */}
          <RowItem
            icon="document-text-outline"
            label="Privacy policy"
            onPress={() => navigation.navigate("PrivacyPolicy")}
            colors={colors}
          />
          <Divider colors={colors} />

          {/* ✅ Terms */}
          <RowItem
            icon="reader-outline"
            label="Terms & Conditions"
            onPress={() => navigation.navigate("Terms")}
            colors={colors}
          />
          <Divider colors={colors} />

          {/* ✅ Notifications */}
          <RowItem
            icon="notifications-outline"
            label="Notification preferences"
            onPress={() => navigation.navigate("Notifications")}
            colors={colors}
          />
        </SectionCard>

        {/* =========================
            LOG OUT
        ========================== */}
        <SectionCard colors={colors} style={{ marginTop: 12 }}>
          <RowItem
            icon="log-out-outline"
            label="Log out"
            danger
            onPress={() => logout()}
            colors={colors}
          />
        </SectionCard>

        <Text style={[styles.bottomBrand, { color: colors.muted }]}>scanpay</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================
    COMPONENTS
========================= */

function SectionCard({ children, style, colors }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function Divider({ colors }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function QuickCard({ title, icon, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.quickCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.quickIconBox, { borderColor: colors.border }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.quickTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

function RowItem({ icon, label, onPress, rightText, danger, colors }) {
  return (
    <TouchableOpacity style={styles.rowItem} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View
          style={[
            styles.rowIconBox,
            {
              backgroundColor: danger ? "#FEE2E2" : colors.bg,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name={icon} size={20} color={danger ? "#DC2626" : colors.primary} />
        </View>
        <Text style={[styles.rowLabel, { color: danger ? "#DC2626" : colors.text }]}>
          {label}
        </Text>
      </View>

      {rightText ? (
        <View style={styles.rowRight}>
          <Text style={[styles.rightText, { color: colors.muted }]}>{rightText}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      )}
    </TouchableOpacity>
  );
}

/* =========================
    STYLES
========================= */
const styles = StyleSheet.create({
  headerWrap: {
    marginTop: 6,
    borderRadius: 26,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  headerTopRow: { flexDirection: "row", alignItems: "center" },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },

  avatarImage: { width: 96, height: 96, resizeMode: "cover" },

  userName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  subRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  subText: {
    marginLeft: 5,
    marginRight: 8,
    fontWeight: "800",
    fontSize: 13,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 8,
    opacity: 0.6,
  },

  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  quickCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  quickIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  quickTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "900",
  },

  rowItem: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },

  rowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowLabel: { fontSize: 15, fontWeight: "900" },

  divider: { height: 1, marginLeft: 66 },

  rowRight: { flexDirection: "row", alignItems: "center" },

  rightText: { fontSize: 12, fontWeight: "900", marginRight: 8 },

  bottomBrand: {
    marginTop: 22,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "lowercase",
  },
});
