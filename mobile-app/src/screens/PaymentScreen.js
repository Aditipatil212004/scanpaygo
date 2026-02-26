import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import API_BASE from "../services/api";

export default function PaymentScreen({ route, navigation }) {
  const { amount } = route.params; // ₹ amount

  const startPayment = async () => {
    try {
      // 1️⃣ Create order from backend
      const res = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount, // in rupees
        }),
      });

      const data = await res.json();

      if (!data.orderId) {
        Alert.alert("Error", "Failed to create order");
        return;
      }

      // 2️⃣ Open Razorpay
      const options = {
        description: "ScanPay Go Payment",
        image: "https://your-logo-url.png",
        currency: "INR",
        key: "rzp_test_S7PkSqueyoXb8C", // 👈 TEST KEY
        amount: data.amount, // paise
        order_id: data.orderId,
        name: "ScanPay Go",
        prefill: {
          email: "customer@test.com",
          contact: "9999999999",
          name: "Customer",
        },
        theme: { color: "#16A34A" },
      };
console.log("ORDER DATA:", data);
      RazorpayCheckout.open(options)
        .then(async (result) => {
  console.log("Payment Success:", result);

  await fetch(`${API_URL}/payments/success`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderId: result.razorpay_order_id,
      paymentId: result.razorpay_payment_id,
      signature: result.razorpay_signature,

      storeId: selectedStore._id,

      items: cartItems.map((i) => ({
        barcode: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),

      subtotal: totals.subtotal,
      tax: totals.tax,
      totalAmount: totals.total,
    }),
  });

  clearCart();

  navigation.replace("ReceiptScreen", {
    orderId: result.razorpay_order_id,
  });
})
        .catch((error) => {
          Alert.alert("Payment Failed", error.description);
        });

    } catch (err) {
      console.log("Payment Error:", err);
      Alert.alert("Error", "Payment failed");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "900", marginBottom: 20 }}>
        Pay ₹{amount}
      </Text>

      <TouchableOpacity
        onPress={startPayment}
        style={{
          backgroundColor: "#16A34A",
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>
          Pay Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}