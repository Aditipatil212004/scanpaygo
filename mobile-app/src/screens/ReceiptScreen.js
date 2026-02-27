import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ReceiptScreen({ route, navigation }) {
  const receipt = route?.params?.receipt;
  const order = route?.params?.order;

  // 🛑 SAFETY CHECK
  if (!receipt || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Receipt not found</Text>
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Successful 🎉</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Receipt ID</Text>
        <Text style={styles.value}>{receipt.receiptId}</Text>

        <Text style={styles.label}>Total Paid</Text>
        <Text style={styles.amount}>₹{receipt.totalAmount}</Text>
      </View>

      {/* ✅ QR CODE */}
      <View style={styles.card}>
        <Text style={styles.label}>Show this QR at Exit</Text>

        <QRCode
          size={200}
          value={JSON.stringify({
            receiptId: receipt.receiptId,
            storeId: receipt.storeId,
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  heading: { fontSize: 20, fontWeight: "900", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
  },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "800" },
  amount: { fontSize: 18, fontWeight: "900", color: "#16A34A" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: { fontSize: 16, fontWeight: "800", marginBottom: 20 },
  btn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  btnText: { color: "#fff", fontWeight: "900" },
});