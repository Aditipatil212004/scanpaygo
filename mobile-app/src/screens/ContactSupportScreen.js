import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ContactSupportScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const SUPPORT_EMAIL = "support@scanpay.com";
  const SUPPORT_PHONE = "+91 90000 00000"; // change this
  const WHATSAPP_NO = "919000000000"; // change this (no +)

  const openEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=ScanPay Support&body=Hello Support Team,`;
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("Error", "Email app not available");
    Linking.openURL(url);
  };

  const openWhatsApp = async () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NO}&text=Hello ScanPay Support, I need help.`;
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("WhatsApp not found", "Please install WhatsApp");
    Linking.openURL(url);
  };

  const openCall = async () => {
    const url = `tel:${SUPPORT_PHONE}`;
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("Error", "Calling not available");
    Linking.openURL(url);
  };

  const submitTicket = () => {
    if (!name || !email || !msg) {
      Alert.alert("Missing Details", "Please fill all fields.");
      return;
    }

    // ✅ later you can connect backend
    Alert.alert("✅ Ticket Submitted", "Our support team will contact you soon!");

    // Reset
    setName("");
    setEmail("");
    setMsg("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* ===== Header ===== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#052E16" />
        </TouchableOpacity>

        <Text style={styles.title}>Contact Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* ===== Info card ===== */}
        <View style={styles.topCard}>
          <View style={styles.topIcon}>
            <Ionicons name="headset-outline" size={22} color="#16A34A" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>We’re here to help you</Text>
            <Text style={styles.topSub}>
              Facing any issue? Contact ScanPay Support anytime.
            </Text>
          </View>
        </View>

        {/* ===== Quick Actions ===== */}
        <Text style={styles.sectionTitle}>Quick Support</Text>

        <View style={styles.quickGrid}>
          <QuickCard
            icon="logo-whatsapp"
            title="WhatsApp"
            subtitle="Chat instantly"
            onPress={openWhatsApp}
          />

          <QuickCard
            icon="mail-outline"
            title="Email"
            subtitle="Support mail"
            onPress={openEmail}
          />

          <QuickCard
            icon="call-outline"
            title="Call"
            subtitle="Talk with us"
            onPress={openCall}
          />

          <QuickCard
            icon="help-circle-outline"
            title="FAQ"
            subtitle="Quick answers"
            onPress={() =>
              Alert.alert(
                "FAQ",
                "1) Why scan not working?\n→ Select store first.\n\n2) Payment failed?\n→ Check wallet/balance.\n\n3) Cart not updating?\n→ Reload app."
              )
            }
          />
        </View>

        {/* ===== Ticket Form ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Raise a Ticket</Text>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Message</Text>
          <TextInput
            placeholder="Explain your issue..."
            placeholderTextColor="#94A3B8"
            style={[styles.input, { height: 110, textAlignVertical: "top" }]}
            value={msg}
            onChangeText={setMsg}
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.9} onPress={submitTicket}>
            <Ionicons name="send-outline" size={18} color="#fff" />
            <Text style={styles.submitText}>Submit Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* ===== Footer ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Support hours: <Text style={{ fontWeight: "900" }}>24/7</Text>
          </Text>
          <Text style={styles.footerText}>
            Email: <Text style={{ fontWeight: "900" }}>{SUPPORT_EMAIL}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ Quick Card Component */
function QuickCard({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.quickCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={20} color="#16A34A" />
      </View>

      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  topCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 22,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  topIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    justifyContent: "center",
    alignItems: "center",
  },

  topTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },

  topSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },

  quickSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  formCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: "800",
    color: "#0F172A",
  },

  submitBtn: {
    marginTop: 16,
    backgroundColor: "#16A34A",
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,

    shadowColor: "#16A34A",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },

  submitText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  footer: {
    marginTop: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  footerText: { fontWeight: "800", color: "#052E16", fontSize: 12, marginBottom: 4 },
});
