import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import API_BASE from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MyOrdersScreen({ navigation }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setOrders(data.orders || []);
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      data={orders}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("ReceiptScreen", {
              receipt: item.receipt,
              order: item,
            })
          }
        >
          <Text style={styles.title}>₹{item.totalAmount}</Text>
          <Text style={styles.sub}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.status}>Status: {item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 5,
  },
  title: { fontSize: 16, fontWeight: "900" },
  sub: { fontSize: 12, color: "#6B7280" },
  status: { marginTop: 6, fontWeight: "800", color: "#16A34A" },
});