import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import API_BASE from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AddOfferScreen({ navigation }) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE PICKER ================= */

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  /* ================= SUBMIT OFFER ================= */

  const submitOffer = async () => {
    if (!title || !price) {
      Alert.alert("Missing fields", "Title and price are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/staff/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          discountPercent: Number(discount) || 0,
          image: image ? `data:image/jpeg;base64,${image.base64}` : "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success 🎉", "Offer added successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Create New Offer</Text>
      <Text style={styles.subHeading}>
        Attract customers with exciting deals ✨
      </Text>

      {/* IMAGE PICKER */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ) : (
          <>
            <Ionicons name="image-outline" size={38} color="#6B7280" />
            <Text style={styles.imageText}>Upload Offer Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* FORM CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Offer Title</Text>
       <TextInput
  style={styles.input}
  placeholder="Flat 30% OFF on Shirts"
  placeholderTextColor="#9CA3AF"
  value={title}
  onChangeText={setTitle}
/>


        <Text style={styles.label}>Description</Text>
       <TextInput
  style={[styles.input, { height: 90 }]}
  placeholder="Limited time festive offer"
  placeholderTextColor="#9CA3AF"
  multiline
  value={description}
  onChangeText={setDescription}
/>


        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Price (₹)</Text>
           <TextInput
  style={styles.input}
  placeholder="999"
  placeholderTextColor="#9CA3AF"
  keyboardType="numeric"
  value={price}
  onChangeText={setPrice}
/>

          </View>

          <View style={{ width: 14 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Discount %</Text>
           <TextInput
  style={styles.input}
  placeholder="20"
  placeholderTextColor="#9CA3AF"
  keyboardType="numeric"
  value={discount}
  onChangeText={setDiscount}
/>

          </View>
        </View>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={submitOffer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.submitText}>Publish Offer</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#022C22",
  },
  subHeading: {
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 18,
    fontWeight: "600",
  },

  imageBox: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imageText: {
    marginTop: 8,
    color: "#065F46",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    marginTop: 6,
  },

  submitBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
