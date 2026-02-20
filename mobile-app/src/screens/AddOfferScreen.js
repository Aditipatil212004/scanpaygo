import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import API_BASE from "../services/api";

export default function AddOfferScreen({ token }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const submitOffer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/staff/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          discountPercent: Number(discount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Offer added");
        setTitle("");
        setPrice("");
        setDiscount("");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Add Offer</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        placeholder="Discount %"
        keyboardType="numeric"
        value={discount}
        onChangeText={setDiscount}
      />

      <TouchableOpacity onPress={submitOffer}>
        <Text>Add Offer</Text>
      </TouchableOpacity>
    </View>
  );
}
