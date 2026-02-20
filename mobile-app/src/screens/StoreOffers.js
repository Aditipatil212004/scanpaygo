import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import API_BASE from "../services/api";

export default function StoreOffers({ route }) {
  const { storeId } = route.params;
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/stores/${storeId}/offers`
      );
      const data = await res.json();
      if (res.ok) setOffers(data.offers);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 15 }}>
          <Text>{item.title}</Text>
          <Text>₹{item.price}</Text>
          {item.discountPercent > 0 && (
            <Text>{item.discountPercent}% OFF</Text>
          )}
        </View>
      )}
      ListEmptyComponent={<Text>No offers available</Text>}
    />
  );
}
