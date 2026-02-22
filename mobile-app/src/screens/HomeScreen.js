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

export default function HomeScreen({ navigation }) {
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

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  /* ================= FETCH STORES ================= */

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

  React.useEffect(() => {
    fetchAllStores();
  }, []);

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

      {/* HEADER */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>ScanPay Go</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText}>
            {selectedAddress || "All stores available"}
          </Text>
        </View>
      </View>

      {/* SEARCH */}
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

      {/* LOCATION BUTTON */}
      <TouchableOpacity style={styles.locationBtn} onPress={getUserLocation}>
        <Ionicons name="navigate" size={18} color="#fff" />
        <Text style={styles.locationBtnText}>Use Current Location</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* STORE LIST */}
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
            activeOpacity={0.92}
          >
            {/* BANNER IMAGE */}
          
{/* BANNER OR PLACEHOLDER */}
{item.storeBanner ? (
  <Image
    source={{ uri: item.storeBanner }}
    style={styles.banner}
  />
) : (
  <View style={styles.bannerPlaceholder}>
    <Text style={styles.placeholderText}>
      {item.brandName}
    </Text>
  </View>
)}


            {/* CARD CONTENT */}
            <View style={styles.cardContent}>
              {/* LOGO */}
              <Image
                source={
                  item.storeLogo
                    ? { uri: item.storeLogo }
                    : require("../../assets/images/logo.jpeg")
                }
                style={styles.logo}
              />

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.storeName}>{item.brandName}</Text>

                {item.distance && (
                  <Text style={styles.distance}>
                    {item.distance.toFixed(2)} KM away
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      (item.storeStatus || "closed") === "open"
                        ? "#16A34A"
                        : "#DC2626",
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {(item.storeStatus || "closed").toUpperCase()}
                </Text>
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
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginLeft: 4,
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
  },
  locationBtnText: {
    color: "#fff",
    fontWeight: "800",
    marginLeft: 8,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  banner: {
    width: "100%",
    height: 150,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginTop: -40,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },

  storeName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },

  distance: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontWeight: "700",
    color: "#6B7280",
  },
  bannerPlaceholder: {
  height: 150,
  backgroundColor: "#F0FDF4",
  justifyContent: "center",
  alignItems: "center",
},

placeholderText: {
  fontSize: 28,
  fontWeight: "900",
  color: "#16A34A",
},

});
