import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { saveAddress } from "../services/addressService";

export default function AddAddressScreen({ navigation, route }) {
  const edit = route?.params?.edit || null;

  const [loadingLoc, setLoadingLoc] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState(edit?.storeName || "");
  const [label, setLabel] = useState(edit?.label || "Store");

  const [addressLine, setAddressLine] = useState(edit?.addressLine || "");
  const [region, setRegion] = useState({
    latitude: edit?.latitude || 20.5937,
    longitude: edit?.longitude || 78.9629,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

  const [marker, setMarker] = useState({
    latitude: edit?.latitude || 20.5937,
    longitude: edit?.longitude || 78.9629,
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingLoc(true);
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission required", "Please allow location access.");
          setLoadingLoc(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        setMarker({ latitude, longitude });

        // reverse geocode
        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geo?.length) {
          const g = geo[0];
          const formatted = `${g.name || ""} ${g.street || ""}, ${g.city || ""}, ${g.region || ""} ${g.postalCode || ""}`;
          setAddressLine(formatted.trim());
        }
      } catch (e) {
        console.log("Location error:", e);
      } finally {
        setLoadingLoc(false);
      }
    };

    init();
  }, []);

  const onMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    try {
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo?.length) {
        const g = geo[0];
        const formatted = `${g.name || ""} ${g.street || ""}, ${g.city || ""}, ${g.region || ""} ${g.postalCode || ""}`;
        setAddressLine(formatted.trim());
      }
    } catch (err) {
      console.log("Reverse geocode error:", err);
    }
  };

  const handleSave = async () => {
    if (!addressLine) {
      Alert.alert("Missing", "Please pick a location on map.");
      return;
    }

    setSaving(true);

    const res = await saveAddress({
      label,
      storeName: storeName || "Store",
      addressLine,
      latitude: marker.latitude,
      longitude: marker.longitude,
      isDefault: true, // ✅ Selected store
    });

    setSaving(false);

    if (!res.ok) {
      Alert.alert("Error", res.message);
      return;
    }

    Alert.alert("✅ Saved", "Store address selected successfully");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#052E16" />
        </TouchableOpacity>

        <Text style={styles.title}>{edit ? "Edit Address" : "Add Address"}</Text>
      </View>

      {/* Store name input */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Store / Mall Name</Text>
        <View style={styles.inputBox}>
          <Ionicons name="storefront-outline" size={18} color="#16A34A" />
          <TextInput
            style={styles.input}
            placeholder="Ex: Zudio, Dmart, Reliance"
            value={storeName}
            onChangeText={setStoreName}
          />
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>Selected Address</Text>
        <View style={styles.addressBox}>
          <Ionicons name="location-outline" size={18} color="#16A34A" />
          <Text style={styles.addressText}>{addressLine || "Select location on map"}</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapWrap}>
        {loadingLoc ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading Map...</Text>
          </View>
        ) : (
          <MapView style={styles.map} region={region} onPress={onMapPress}>
            <Marker coordinate={marker} />
          </MapView>
        )}
      </View>

      {/* Save */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save & Select Store</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
  },

  title: { fontSize: 18, fontWeight: "900", color: "#052E16" },

  formCard: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },

  label: { fontWeight: "900", color: "#0F172A", marginBottom: 6 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F0FDF4",
  },

  input: { flex: 1, marginLeft: 10, fontWeight: "800", color: "#052E16" },

  addressBox: {
    marginTop: 4,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  addressText: { flex: 1, fontWeight: "800", color: "#334155", fontSize: 12 },

  mapWrap: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  map: { flex: 1 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  loadingText: { marginTop: 10, fontWeight: "800", color: "#64748B" },

  bottomBar: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "rgba(255,255,255,0.97)",
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
