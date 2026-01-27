import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function WalletHistoryScreen({ navigation }) {
  const { transactions } = useWallet();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const list = transactions || [];

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

        <Text style={[styles.title, { color: colors.text }]}>Wallet History</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Empty */}
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={52} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No transactions yet
          </Text>
          <Text style={[styles.emptySub, { color: colors.muted }]}>
            Your wallet activity will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          renderItem={({ item }) => {
            const isCredit = item.type === "credit";

            return (
              <View
                style={[
                  styles.txnCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.txnLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: isCredit
                          ? "rgba(22,163,74,0.15)"
                          : "rgba(220,38,38,0.12)",
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isCredit ? "add" : "remove"}
                      size={20}
                      color={isCredit ? colors.primary : "#DC2626"}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txnTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>

                    {!!item.note && (
                      <Text style={[styles.txnSub, { color: colors.muted }]}>
                        {item.note}
                      </Text>
                    )}

                    <Text style={[styles.txnDate, { color: colors.muted }]}>
                      {new Date(item.date).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.txnAmt,
                    { color: isCredit ? colors.primary : "#DC2626" },
                  ]}
                >
                  {isCredit ? "+" : "-"} ₹{item.amount}
                </Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 12,
    paddingBottom: 16,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
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

  empty: {
    marginTop: 90,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
  },

  emptySub: {
    marginTop: 6,
    fontWeight: "700",
    textAlign: "center",
  },

  txnCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },

  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  txnTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  txnSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
  },

  txnDate: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.9,
  },

  txnAmt: {
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 10,
  },
});
