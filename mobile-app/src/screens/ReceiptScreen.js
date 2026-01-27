import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function ReceiptScreen({ route, navigation }) {
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const data = route?.params || {};
  const {
    receiptId = "RCPT-000000",
    amount = 0,
    subtotal = 0,
    tax = 0,
    itemsCount = 0,
    items = [],
    paidAt = new Date().toISOString(),
    method = "UPI",
  } = data;

  const paidTime = useMemo(() => {
    try {
      return new Date(paidAt).toLocaleString();
    } catch {
      return paidAt;
    }
  }, [paidAt]);

  const qrValue = useMemo(
    () =>
      JSON.stringify({
        receiptId,
        amount,
        method,
        itemsCount,
        paidAt,
      }),
    [receiptId, amount, method, itemsCount, paidAt]
  );

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={T.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== Success Header ===== */}
        <View style={styles.successHeader}>
          <View
            style={[
              styles.checkCircle,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="checkmark" size={28} color="#fff" />
          </View>

          <Text style={[styles.successTitle, { color: colors.text }]}>
            Payment Successful
          </Text>

          <Text style={[styles.successSub, { color: colors.muted }]}>
            Show this QR code at store exit for verification
          </Text>
        </View>

        {/* ===== Receipt Card ===== */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.topRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Digital Receipt
            </Text>

            <View
              style={[
                styles.methodPill,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={14}
                color={colors.primary}
              />
              <Text
                style={[styles.methodText, { color: colors.primary }]}
              >
                {method}
              </Text>
            </View>
          </View>

          <InfoRow label="Receipt ID" value={receiptId} colors={colors} />
          <InfoRow label="Paid At" value={paidTime} colors={colors} />

          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total Paid
            </Text>
            <Text
              style={[styles.totalValue, { color: colors.primary }]}
            >
              ₹{amount}
            </Text>
          </View>

          <View style={styles.summaryMini}>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              Subtotal ₹{subtotal}
            </Text>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              Tax ₹{tax}
            </Text>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              {itemsCount} Items
            </Text>
          </View>
        </View>

        {/* ===== QR Card ===== */}
        <View
          style={[
            styles.card,
            styles.center,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Scan to Verify
          </Text>

          <View
            style={[
              styles.qrBox,
              { backgroundColor: "#fff", borderColor: colors.border },
            ]}
          >
            <QRCode value={qrValue} size={185} />
          </View>

          <Text style={[styles.qrHint, { color: colors.muted }]}>
            Staff will scan this code to verify your payment.
          </Text>
        </View>

        {/* ===== Items ===== */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Purchased Items
          </Text>

          {items.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No items found
            </Text>
          ) : (
            items.map((it) => (
              <View
                key={it.id}
                style={[
                  styles.itemRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.itemName, { color: colors.text }]}
                  >
                    {it.name}
                  </Text>
                  <Text
                    style={[styles.itemQty, { color: colors.muted }]}
                  >
                    Qty: {it.qty}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.itemPrice,
                    { color: colors.primary },
                  ]}
                >
                  ₹{it.price * it.qty}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* ===== Buttons ===== */}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.92}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.primaryText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            { borderColor: colors.primary },
          ]}
          onPress={() => navigation.navigate("Stores")}
          activeOpacity={0.92}
        >
          <Ionicons
            name="storefront-outline"
            size={20}
            color={colors.primary}
          />
          <Text
            style={[
              styles.secondaryText,
              { color: colors.primary },
            ]}
          >
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Small Components ===== */
function InfoRow({ label, value, colors }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  successHeader: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  checkCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  successTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "900",
  },

  successSub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 14,
  },

  card: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginTop: 16,
    elevation: 6,
  },

  center: { alignItems: "center" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  methodPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  methodText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "900",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "800",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "900",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "900",
  },

  summaryMini: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  summaryText: {
    fontSize: 12,
    fontWeight: "800",
  },

  qrBox: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 12,
  },

  qrHint: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "900",
  },

  itemQty: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },

  itemPrice: {
    fontSize: 13,
    fontWeight: "900",
  },

  primaryBtn: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },

  primaryText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryBtn: {
    marginTop: 12,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  secondaryText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "900",
  },
});
