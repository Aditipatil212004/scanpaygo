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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../context/StoreContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

/* ===== STORE + OFFER DATA ===== */
const STORES = [
  {
    id: "1",
    name: "Zudio",
    tagline: "Flat 50% Off",
    logo: require("../../assets/stores/zudio_logo.png"),
   banner: "https://via.placeholder.com/600x300"

  },
  {
    id: "2",
    name: "Westside",
    tagline: "Buy 1 Get 1",
    logo: require("../../assets/stores/westside_logo.png"),
   banner: "https://via.placeholder.com/600x300"

  },
  {
    id: "3",
    name: "Zara",
    tagline: "Up to 60% Off",
    logo: require("../../assets/stores/zara_logo.png"),
    banner: "https://via.placeholder.com/600x300",
  },
  {
    id: "4",
    name: "H&M",
    tagline: "Winter Sale 40–70%",
    logo: require("../../assets/stores/hm.png"),
    banner: "https://via.placeholder.com/600x300",
  },
  {
    id: "5",
    name: "Reliance Trends",
    tagline: "Everyday Fashion",
    logo: require("../../assets/stores/trends_logo.png"),
    banner: "https://via.placeholder.com/600x300",
  },
  {
    id: "6",
    name: "Reliance Smart",
    tagline: "Groceries & More",
     logo: require("../../assets/stores/relaince_logo.png"),
    banner: "https://via.placeholder.com/600x300",
  },
  {
    id: "7",
    name: "DMart",
    tagline: "Value for Money",
    logo: require("../../assets/stores/dmart_logo.png"),
    banner: "https://via.placeholder.com/600x300",
  },
];

export default function HomeScreen({ navigation }) {
  const { selectedStore } = useStore();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const handleShopPress = (item) => {
    navigation.navigate("StoreOffers", {
      storeId: item.id,
      storeName: item.name,
    });
  };

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <View style={[styles.bg, { backgroundColor: colors.bg }]}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>Welcome 👋</Text>
          <Text style={[styles.subHeading, { color: colors.muted }]}>
            Choose a store and start shopping smart
          </Text>
        </View>

        {/* ✅ Selected Store Card */}
        <View
          style={[
            styles.storeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="storefront-outline" size={20} color={colors.primary} />

          <View style={{ flex: 1 }}>
            <Text style={[styles.storeTitle, { color: colors.text }]}>
              {selectedStore?.storeName ||
                selectedStore?.label ||
                "No store selected"}
            </Text>

            <Text
              style={[styles.storeSub, { color: colors.muted }]}
              numberOfLines={1}
            >
              {selectedStore?.addressLine ||
                selectedStore?.address ||
                "Select store from Address Book"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Addresses")}>
            <Text style={[styles.changeStore, { color: colors.primary }]}>
              {selectedStore ? "Change" : "Select"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Staff Verify Button */}
        

        {/* ===== Offer Cards ===== */}
        <FlatList
          data={STORES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.92}
              onPress={() => handleShopPress(item)}
            >
              {/* Offer Image Top */}
              <Image source={{ uri: item.banner }} style={styles.banner} />

              {/* Bottom Info */}
              <View style={styles.infoSection}>
                <View style={styles.row}>
                  <View style={styles.logoBox}>
                    <Image source={item.logo} style={styles.logo} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.storeName}>{item.name}</Text>
                    <Text style={styles.tagline}>{item.tagline}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.shopPill}
                    activeOpacity={0.85}
                    onPress={() => handleShopPress(item)}
                  >
                    <Text style={styles.shopText}>Shop</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="rgba(255,255,255,0.95)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  bg: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  heading: { fontSize: 26, fontWeight: "900" },
  subHeading: { fontSize: 13, marginTop: 6, fontWeight: "700" },

  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  storeTitle: { fontWeight: "900", fontSize: 14 },
  storeSub: { marginTop: 2, fontWeight: "700", fontSize: 12 },
  changeStore: { fontWeight: "900" },

  
  card: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  banner: { width: "100%", height: 150 },
  infoSection: { padding: 14, backgroundColor: "rgba(0,0,0,0.55)" },
  row: { flexDirection: "row", alignItems: "center" },

  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  logo: { width: 34, height: 34, resizeMode: "contain" },

  storeName: { fontSize: 16, fontWeight: "900", color: "#FFFFFF" },

  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontWeight: "600",
  },

  shopPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 10,
  },

  shopText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", marginRight: 4 },
});
