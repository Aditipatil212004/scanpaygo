import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE from "../services/api";

const FILTERS = ["All", "20%", "30%", "50%"];

export default function StoreOffersScreen({ route, navigation }) {
  const { storeId } = route.params;

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  /* ================= FETCH OFFERS ================= */

  const fetchOffers = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/stores/${storeId}/offers`
      );
      const data = await res.json();
      setOffers(data.offers || []);
      setFilteredOffers(data.offers || []);
    } catch (err) {
      console.log("Fetch offers error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ================= SEARCH + FILTER ================= */

  useEffect(() => {
    let temp = offers;

    if (search.trim()) {
      temp = temp.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeFilter !== "All") {
      const percent = parseInt(activeFilter);
      temp = temp.filter(
        (o) => o.discountPercent === percent
      );
    }

    setFilteredOffers(temp);
  }, [search, activeFilter, offers]);

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* FLOATING SCANNER BUTTON */}
     <TouchableOpacity
  style={styles.scannerFab}
  activeOpacity={0.9}
  onPress={() => navigation.getParent()?.navigate("ScannerScreen")}
>
  <Ionicons name="scan-outline" size={26} color="#fff" />
</TouchableOpacity>


      {/* HEADER */}
      <Text style={styles.heading}>Special Offers</Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search offers"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.activeChip,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.activeText,
              ]}
            >
              {f === "All" ? "All" : `${f} OFF`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* OFFERS */}
      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const finalPrice =
            item.discountPercent > 0
              ? Math.round(
                  item.price -
                    (item.price * item.discountPercent) / 100
                )
              : item.price;

          return (
            <View style={styles.card}>
              {/* IMAGE */}
              <Image
                source={{
                  uri:
                    item.image ||
                    "https://via.placeholder.com/120",
                }}
                style={styles.image}
              />

              {/* CONTENT */}
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description || "Limited time offer"}
                </Text>

                <View style={styles.priceRow}>
                  {item.discountPercent > 0 && (
                    <Text style={styles.oldPrice}>
                      ₹{item.price}
                    </Text>
                  )}
                  <Text style={styles.newPrice}>
                    ₹{finalPrice}
                  </Text>
                </View>

                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.btnText}>Add to Cart</Text>
                  <Ionicons
                    name="cart-outline"
                    size={16}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* BADGE */}
              {item.discountPercent > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.discountPercent}% OFF
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No offers found
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 12,
    color: "#111827",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontWeight: "600",
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#16A34A",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },

  activeText: {
    color: "#fff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 14,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  desc: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  oldPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },

  newPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: "#16A34A",
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#16A34A",
    borderRadius: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    width: 120,
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
    fontWeight: "700",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scannerFab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#16A34A",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    zIndex: 100,
  },
});
 