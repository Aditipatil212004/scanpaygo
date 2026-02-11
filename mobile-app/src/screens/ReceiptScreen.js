import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReceiptScreen({ navigation }) {

  useEffect(() => {
    // Auto go home after 5 sec
    const t = setTimeout(() => {
      navigation.navigate("Main");
    }, 5000);

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={90} color="#16A34A" />
      <Text style={styles.title}>Payment Successful 🎉</Text>
      <Text style={styles.subtitle}>Your order has been placed</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },
  btn: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
