import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapPickerScreen({ navigation, route }) {
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getInitialLocation();
  }, []);

  const getInitialLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setSelectedLocation({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (!selectedLocation) {
      alert("Please select location");
      return;
    }

    console.log("Selected:", selectedLocation);

    const lat = selectedLocation.latitude;
    const lng = selectedLocation.longitude;

    // 🔵 STAFF FLOW
    if (route?.params?.from === "staff") {
      navigation.navigate("StaffSignup", {
        latitude: lat,
        longitude: lng,
      });
      return;
    }

    // 🟢 CUSTOMER FLOW
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate("Home", {
        manualLat: lat,
        manualLng: lng,
      });
    }, 100);
  };

  if (!region) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={(e) =>
          setSelectedLocation(e.nativeEvent.coordinate)
        }
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      <TouchableOpacity style={styles.button} onPress={confirmLocation}>
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  button: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
  },
});
