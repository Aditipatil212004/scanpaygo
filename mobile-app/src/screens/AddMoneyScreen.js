import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function AddMoneyScreen({ navigation }) {
  const { addMoney } = useWallet();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const [amount, setAmount] = useState("");
  const quick = [100, 200, 500, 1000];

  const handleAdd = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return Alert.alert("Invalid amount", "Enter valid amount");

    const res = await addMoney(amt);
    if (!res.ok) return Alert.alert("Error", res.message);

    Alert.alert("✅ Success", `₹${amt} added to wallet`);
    navigation.goBack();
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

          <Text style={[styles.title, { color: colors.text }]}>Add Money</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Input */}
        <Text style={[styles.label, { color: colors.text }]}>Enter amount</Text>

        <View
          style={[
            styles.inputBox,
            {
              borderColor: colors.border,
              backgroundColor: mode === "dark" ? colors.card : colors.soft,
            },
          ]}
        >
          <Text style={[styles.rs, { color: colors.text }]}>₹</Text>

          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Quick Buttons */}
        <View style={styles.quickRow}>
          {quick.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.quickBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setAmount(String(q))}
              activeOpacity={0.9}
            >
              <Text style={[styles.quickText, { color: colors.text }]}>₹{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
          activeOpacity={0.9}
        >
          <Text style={styles.addText}>Add Money</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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

  label: {
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 10,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  rs: {
    fontSize: 18,
    fontWeight: "900",
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
  },

  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  quickBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  quickText: {
    fontWeight: "900",
  },

  addBtn: {
    marginTop: 22,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
