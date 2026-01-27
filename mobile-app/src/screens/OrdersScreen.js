import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

const ORDERS = [
  {
    id: "1",
    store: "Zudio",
    items: "3 Items",
    amount: "₹1320",
    date: "12 Jan 2026",
    status: "Delivered",
  },
  {
    id: "2",
    store: "DMart",
    items: "7 Items",
    amount: "₹880",
    date: "08 Jan 2026",
    status: "Delivered",
  },
  {
    id: "3",
    store: "Reliance Smart",
    items: "5 Items",
    amount: "₹460",
    date: "03 Jan 2026",
    status: "Delivered",
  },
];

export default function OrdersScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const openOrder = (item) => {
    navigation.navigate("OrderDetails", {
      order: {
        ...item,
        subtotal: 1200,
        tax: 120,
        total: 1320,
        itemsList: [
          { id: "i1", name: "T-Shirt", qty: 2, price: 499 },
          { id: "i2", name: "Jeans", qty: 1, price: 799 },
        ],
      },
    });
  };

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.92}
            onPress={() => openOrder(item)}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: mode === "dark" ? colors.soft : "#F0FDF4",
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="bag-handle-outline" size={22} color={colors.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.store, { color: colors.text }]}>{item.store}</Text>
                <Text style={[styles.sub, { color: colors.muted }]}>
                  {item.items} • {item.date}
                </Text>
              </View>

              <Text style={[styles.amount, { color: colors.primary }]}>{item.amount}</Text>
            </View>

            <View style={styles.footerRow}>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      mode === "dark" ? "rgba(22,163,74,0.18)" : "#DCFCE7",
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                <Text style={[styles.statusText, { color: colors.primary }]}>{item.status}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },

  row: { flexDirection: "row", alignItems: "center" },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  store: { fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 4, fontSize: 12, fontWeight: "700" },

  amount: { fontSize: 14, fontWeight: "900" },

  footerRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: { fontSize: 12, fontWeight: "900" },
});
