import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocationCtx } from "../context/LocationContext";
import API_BASE from "../services/api";

export default function StoreSelectScreen({ navigation }) {
  const { location, setSelectedStore } = useLocationCtx();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetch(
      `${API_BASE}/api/stores/nearby?lat=${location.lat}&lng=${location.lng}`
    )
      .then((res) => res.json())
      .then((data) => setStores(data.stores || []));
  }, []);

  return (
    <FlatList
      data={stores}
      keyExtractor={(i) => i._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setSelectedStore(item);
            navigation.replace("Main");
          }}
          style={{
            padding: 16,
            margin: 16,
            backgroundColor: "#fff",
            borderRadius: 14,
          }}
        >
          <Text style={{ fontWeight: "900" }}>{item.brandName}</Text>
          <Text>{item.distance} km • {item.storeStatus}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
