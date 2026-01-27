import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SelectStoreFirstScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Ionicons name="storefront-outline" size={70} color="#16A34A" />

      <Text style={styles.title}>Select Store First</Text>
      <Text style={styles.sub}>
        Choose your mall/store address to start scanning & paying.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Addresses")}
        activeOpacity={0.9}
      >
        <Text style={styles.btnText}>Select Store Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 22 },
  title: { marginTop: 16, fontSize: 22, fontWeight: "900", color: "#052E16" },
  sub: { marginTop: 8, color: "#64748B", fontWeight: "700", textAlign: "center", lineHeight: 20 },
  btn: { marginTop: 22, backgroundColor: "#16A34A", paddingHorizontal: 22, paddingVertical: 14, borderRadius: 18 },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
