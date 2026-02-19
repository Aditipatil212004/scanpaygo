import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../context/StoreContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";
import API_BASE from "../services/api";
import * as Location from "expo-location";

export default function HomeScreen({ navigation, route }) {
  const { setStore } = useStore();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const [stores, setStores] = React.useState([]);
  const [filteredStores, setFilteredStores] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [search, setSearch] = React.useState("");

  /* ================= LOCATION ================= */

  const getUserLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Enable location access");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        setSelectedAddress(
          `${address[0].district || ""}, ${address[0].city || ""}`
        );
      }

      fetchNearbyStores(latitude, longitude);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  /* ================= FETCH STORES ================= */

  const fetchNearbyStores = async (lat, lng) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/stores/nearby?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();
      if (res.ok) {
        setStores(data.stores || []);
        setFilteredStores(data.stores || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllStores = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/stores`);
    const data = await res.json();

    if (res.ok) {
      setStores(data.stores || []);
      setFilteredStores(data.stores || []);
    }
  } catch (err) {
    console.log("Fetch all stores error:", err);
  } finally {
    setLoading(false);
  }
};


  /* ================= SEARCH ================= */

  React.useEffect(() => {
    if (!search.trim()) {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter((item) =>
      item.brandName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredStores(filtered);
  }, [search, stores]);

  /* ================= STORE CLICK ================= */

  const handleShopPress = (item) => {
    setStore(item);
    navigation.navigate("StoreOffers", { storeId: item._id });
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
      />

      {/* ===== SHOPPING HEADER ===== */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appName}>ScanPay Go</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.locationText}>
              {selectedAddress || "Select location"}
            </Text>
          </View>
        </View>
      </View>

      {/* ===== SEARCH BAR ===== */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search stores"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* ===== LOCATION BUTTON ===== */}
      <TouchableOpacity style={styles.locationBtn} onPress={getUserLocation}>
        <Ionicons name="navigate" size={18} color="#fff" />
        <Text style={styles.locationBtnText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* ===== LOADING ===== */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* ===== STORES ===== */}
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No stores available</Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleShopPress(item)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.banner }} style={styles.banner} />

            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Image
                  source={
                    item.storeLogo
                      ? { uri: item.storeLogo }
                      : require("../../assets/images/logo.jpeg")
                  }
                  style={styles.logo}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.storeName}>{item.brandName}</Text>
                  <Text style={styles.distance}>
                    {item.distance?.toFixed(2)} KM away
                  </Text>
                </View>

                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        item.storeStatus === "open" ? "#16A34A" : "#DC2626",
                    },
                  ]}
                >
                 <Text style={styles.statusText}>
  {(item.storeStatus || "closed").toUpperCase()}
</Text>

                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: "900",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    margin: 20,
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 46,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontWeight: "600",
  },

  locationBtn: {
    marginHorizontal: 20,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  locationBtnText: {
    color: "#fff",
    fontWeight: "800",
  },

  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
  },
  banner: {
    height: 140,
    width: "100%",
  },
  cardContent: {
    padding: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "900",
  },
  distance: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontWeight: "700",
    color: "#6B7280",
  },
});
