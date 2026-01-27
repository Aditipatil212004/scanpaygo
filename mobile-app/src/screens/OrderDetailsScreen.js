import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function OrderDetailsScreen({ route, navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const order = route?.params?.order;

  if (!order) {
    return (
      <SafeAreaView style={T.screen}>
        <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />
        <Text style={{ padding: 20, fontWeight: "900", color: colors.text }}>
          Order details not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Order Details</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>

        <Text style={[styles.meta, { color: colors.muted }]}>
          {order.store} • {order.date}
        </Text>

        <View style={styles.row}>
          <View
            style={[
              styles.pill,
              {
                backgroundColor:
                  mode === "dark" ? "rgba(22,163,74,0.18)" : "#DCFCE7",
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={[styles.pillText, { color: colors.primary }]}>
              {order.status}
            </Text>
          </View>

          <Text style={[styles.amount, { color: colors.primary }]}>
            {order.amount}
          </Text>
        </View>
      </View>

      {/* Items */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>

      <FlatList
        data={order.itemsList || []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemRow,
              {
                backgroundColor: mode === "dark" ? colors.card : colors.soft,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.itemName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemQty, { color: colors.muted }]}>
              x{item.qty}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.primary }]}>
              ₹{item.price}
            </Text>
          </View>
        )}
      />

      {/* Total */}
      <View
        style={[
          styles.totalCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.muted }]}>
            Subtotal
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            ₹{order.subtotal}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.muted }]}>Tax</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            ₹{order.tax}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalBig, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalBig, { color: colors.text }]}>
            ₹{order.total}
          </Text>
        </View>
      </View>
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
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  orderId: { fontSize: 16, fontWeight: "900" },
  meta: { marginTop: 6, fontSize: 12, fontWeight: "700" },

  row: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pillText: { fontSize: 12, fontWeight: "900" },
  amount: { fontSize: 15, fontWeight: "900" },

  sectionTitle: {
    marginTop: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "900",
  },

  itemRow: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  itemName: { flex: 1, fontWeight: "900" },
  itemQty: { width: 40, textAlign: "center", fontWeight: "900" },
  itemPrice: { fontWeight: "900" },

  totalCard: {
    margin: 18,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalLabel: { fontWeight: "800" },
  totalValue: { fontWeight: "900" },

  divider: { height: 1, marginVertical: 12 },

  totalBig: { fontSize: 16, fontWeight: "900" },
});
