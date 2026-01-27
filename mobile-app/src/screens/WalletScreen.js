import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function WalletScreen({ navigation }) {
  const { balance, transactions } = useWallet();
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
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Balance Card */}
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.primary,
            borderColor: "rgba(255,255,255,0.20)",
          },
        ]}
      >
        <Text style={styles.balanceLabel}>ScanPay Balance</Text>
        <Text style={styles.balanceAmt}>₹{Number(balance || 0).toFixed(2)}</Text>

        {/* Buttons Row */}
        <View style={styles.smallBtnRow}>
          {/* Add Money */}
          <TouchableOpacity
            style={[
              styles.smallBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("AddMoney")}
          >
            <View
              style={[
                styles.smallIconBox,
                {
                  backgroundColor: colors.soft,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.smallBtnText, { color: colors.text }]}>
              Add Money
            </Text>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity
            style={[
              styles.smallBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("WalletHistory")}
          >
            <View
              style={[
                styles.smallIconBox,
                {
                  backgroundColor: colors.soft,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="time-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.smallBtnText, { color: colors.text }]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Transactions
        </Text>
      </View>

      <FlatList
        data={(transactions || []).slice(0, 6)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={46} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No transactions yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.muted }]}>
              Add money to start using ScanPay Wallet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.txnRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.txnIcon,
                {
                  backgroundColor:
                    item.type === "credit"
                      ? "rgba(22,163,74,0.14)"
                      : "rgba(220,38,38,0.12)",
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={item.type === "credit" ? "arrow-down" : "arrow-up"}
                size={18}
                color={item.type === "credit" ? colors.primary : "#DC2626"}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.txnTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.txnDate, { color: colors.muted }]}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>

            <Text
              style={[
                styles.txnAmt,
                { color: item.type === "credit" ? colors.primary : "#DC2626" },
              ]}
            >
              {item.type === "credit" ? "+" : "-"}₹{item.amount}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingHorizontal: 16, paddingTop: 14 },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "900" },

  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 7,
    marginBottom: 10,
  },

  balanceLabel: { color: "rgba(255,255,255,0.9)", fontWeight: "800" },

  balanceAmt: { marginTop: 10, fontSize: 32, fontWeight: "900", color: "#fff" },

  smallBtnRow: { flexDirection: "row", gap: 12, marginTop: 14 },

  smallBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  smallIconBox: {
    width: 34,
    height: 34,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  smallBtnText: { fontSize: 13, fontWeight: "900" },

  sectionHeader: { marginTop: 16, marginBottom: 6, paddingHorizontal: 16 },

  sectionTitle: { fontWeight: "900", fontSize: 16 },

  txnRow: {
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },

  txnIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  txnTitle: { fontWeight: "900" },

  txnDate: { marginTop: 3, fontWeight: "700", fontSize: 12 },

  txnAmt: { fontWeight: "900", fontSize: 14 },

  empty: { marginTop: 90, alignItems: "center" },

  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: "900" },

  emptySub: { marginTop: 6, fontWeight: "700", textAlign: "center" },
});
