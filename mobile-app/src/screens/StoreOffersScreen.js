import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import API_BASE from "../services/api";

export default function StoreOffersScreen({ route }) {
  const { storeId } = route.params;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/stores/${storeId}/offers`
      );
      const data = await res.json();

      if (res.ok) {
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.log("Fetch offers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No offers available</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : null}

          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>

            {item.discountPercent > 0 && (
              <Text style={styles.discount}>
                {item.discountPercent}% OFF
              </Text>
            )}

            <Text style={styles.price}>₹{item.price}</Text>
          </View>
        </View>
      )}
    />
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  discount: {
    color: "#16A34A",
    fontWeight: "800",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontWeight: "700",
    color: "#6B7280",
  },
});
