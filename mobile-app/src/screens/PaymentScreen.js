import React from "react";
import { View, Button, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { createOrder, verifyPayment } from "../services/paymentService";
import * as Linking from "expo-linking";
import { useEffect } from "react";

const redirectUrl = "https://scanpaygo-6.onrender.com/payment-success";


export default function PaymentScreen({ route, navigation }) {
  const amount = route?.params?.amount || 0;
useEffect(() => {
  const sub = Linking.addEventListener("url", ({ url }) => {
    if (url.includes("payment-success")) {
      navigation.replace("Receipt");
    }
  });

  return () => sub.remove();
}, []);
  const handlePayment = async () => {
    try {
      const { orderId, key } = await createOrder(amount);

      const options = {
        key: key,
        amount: amount * 100,
        currency: "INR",
        name: "ScanPay Store",
        description: "Shopping Payment",
        order_id: orderId,
        theme: { color: "#16A34A" },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          await verifyPayment(data);
          Alert.alert("Payment Success 🎉");
          navigation.navigate("Receipt");
        })
        
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title={`Pay ₹${amount}`} onPress={handlePayment} />
    </View>
  );
}
