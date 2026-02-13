import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useStore } from "../context/StoreContext";
import API_BASE from "../services/api";

export default function LocationSelectScreen({ navigation }) {
  const {
    selectedCity,
    selectedLocation,
    setCity,
    setLocation,
  } = useStore();

  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("city"); 
  // "city" → show cities
  // "location" → show areas

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cities`);
      const data = await res.json();
      if (res.ok) {
        setCities(data.cities);
      }
    } catch (err) {
      console.log("City fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async (city) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/locations/${city}`);
      const data = await res.json();
      if (res.ok) {
        setLocations(data.locations);
        setStep("location");
      }
    } catch (err) {
      console.log("Location fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city) => {
    await setCity(city);
    await setLocation(null);
    fetchLocations(city);
  };

  const handleLocationSelect = async (location) => {
    await setLocation(location);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {step === "city" ? "Select City" : `Select Area in ${selectedCity}`}
      </Text>

      {loading && <ActivityIndicator size="large" />}

      {!loading && step === "city" && (
        <FlatList
          data={cities}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleCitySelect(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {!loading && step === "location" && (
        <FlatList
          data={locations}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleLocationSelect(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
  },
  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
