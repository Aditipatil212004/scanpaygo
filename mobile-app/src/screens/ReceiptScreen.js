import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

export default function ReceiptScreen({ route, navigation }) {
  const { receipt, order } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* ✅ SUCCESS ICON */}
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={72} color="#16A34A" />
          <Text style={styles.successText}>Payment Successful</Text>
        </View>

        {/* 🧾 RECEIPT INFO */}
        <View style={styles.card}>
          <Text style={styles.title}>Receipt</Text>

          <Row label="Receipt ID" value={receipt.receiptId} />
          <Row label="Order ID" value={order.orderId} />
          <Row label="Store ID" value={receipt.storeId} />
          <Row label="Date" value={new Date(receipt.createdAt).toLocaleString()} />
        </View>
        {/* 📱 QR CODE */}
<View style={styles.card}>
  <Text style={styles.title}>Scan at Exit</Text>

  <View style={{ alignItems: "center", marginTop: 10 }}>
    <QRCode
      value={JSON.stringify({
        receiptId: receipt.receiptId,
        storeId: receipt.storeId,
      })}
      size={180}
    />
    <Text style={{ marginTop: 10, fontWeight: "700", color: "#374151" }}>
      Show this QR to staff
    </Text>
  </View>
</View>

        {/* 🛍 ITEMS */}
        <View style={styles.card}>
          <Text style={styles.title}>Items</Text>

          {order.items.map((item) => (
            <View key={item._id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>
                  ₹{item.price} × {item.qty}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                ₹{item.price * item.qty}
              </Text>
            </View>
          ))}
        </View>

        {/* 💰 BILL SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.title}>Bill Summary</Text>

          <Row label="Subtotal" value={`₹${order.subtotal}`} />
          <Row label="Tax (5%)" value={`₹${order.tax}`} />
          <Divider />
          <Row
            label="Total Paid"
            value={`₹${order.totalAmount}`}
            bold
          />
        </View>

        {/* 🔘 ACTION */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Main" }],
            })
          }
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  successBox: {
    alignItems: "center",
    marginBottom: 24,
  },

  successText: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
    color: "#052E16",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
    color: "#052E16",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  value: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  bold: {
    fontWeight: "900",
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },

  itemQty: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "700",
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: "900",
    color: "#16A34A",
  },

  doneBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});