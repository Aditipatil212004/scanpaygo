import React from "react";
import { View, Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { createOrder, verifyPayment } from "../services/paymentService";

export default function PaymentScreen({ route, navigation }) {
 const amount = route?.params?.amount || 0;

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order
      const { orderId, key } = await createOrder(amount);

      // 2️⃣ Open Razorpay Checkout page
      const paymentUrl = `https://api.razorpay.com/v1/checkout/embedded?key_id=${key}&order_id=${orderId}`;

      const result = await WebBrowser.openBrowserAsync(paymentUrl);

      // 3️⃣ After user returns to app, ask backend to verify
      // ⚠️ In production, Razorpay returns IDs via redirect.
      // For demo we simulate success.
      if (result.type === "dismiss") {
        Alert.alert("Payment window closed");
        return;
      }

      // Example verify call (replace with real IDs if using webhook/redirect)
      await verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: "demo_payment_id",
        razorpay_signature: "demo_signature",
      });

      Alert.alert("Payment Successful 🎉");
      navigation.navigate("ReceiptScreen");
    } catch (err) {
      Alert.alert("Payment Failed", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title={`Pay ₹${amount}`} onPress={handlePayment} />
    </View>
  );
}
