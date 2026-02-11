import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

/* ✅ STORE DATA */
const STORE_DATA = {
  "1": {
    name: "Zudio",
    tagline: "Fashion for Everyone",
    location: "Pune",
    rating: 4.4,
    logo: require("../../assets/stores/zudio_logo.png"),
    banner: require("../../assets/offers/zudio_offer.jpg"), // LOCAL IMAGE
  },
};

/* ✅ PRODUCTS */
const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Milk",
    price: 50,
    oldPrice: 65,
    off: "20% OFF",
    image: "https://via.placeholder.com/150", // URL IMAGE
  },
];

export default function StoreOffersScreen({ route, navigation }) {
  const { storeId = "1" } = route?.params || {};
  const { items, addToCart, increaseQty, decreaseQty, totals } = useCart();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const store = useMemo(() => STORE_DATA[storeId], [storeId]);

  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastText, setToastText] = useState("");

  const showToast = (text) => {
    setToastText(text);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(850),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const getQty = (id) => items?.find((i) => i.id === id)?.qty || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 🔹 HEADER */}
        <View style={styles.header}>
          <Image source={store.logo} style={styles.logo} />
          <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
        </View>

        {/* 🔹 FIXED BANNER (LOCAL IMAGE) */}
        <View style={styles.bannerWrap}>
         <Image source={store.banner} style={styles.bannerImage} />



        </View>

        {/* 🔹 PRODUCTS */}
        {PRODUCTS.map((p) => {
          const qty = getQty(p.id);

          return (
            <View key={p.id} style={[styles.card, { borderColor: colors.border }]}>
              {/* FIXED IMAGE (URL) */}
             
<Image source={{ uri: p.image }} style={styles.productImg} />

              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: colors.text }]}>{p.name}</Text>
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>₹{p.price}</Text>
              </View>

              {qty === 0 ? (
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    addToCart(p);
                    showToast("Added to cart");
                  }}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              ) : (
                <View style={styles.stepper}>
                  <TouchableOpacity onPress={() => decreaseQty(p.id)}>
                    <Ionicons name="remove" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 8 }}>{qty}</Text>
                  <TouchableOpacity onPress={() => increaseQty(p.id)}>
                    <Ionicons name="add" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", padding: 20 },
  logo: { width: 50, height: 50, resizeMode: "contain" },
  storeName: { fontSize: 20, fontWeight: "bold", marginTop: 10 },

  bannerWrap: { borderRadius: 20, overflow: "hidden", marginHorizontal: 20 },
  bannerImage: { width: "100%", height: 160 },

  card: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
  },

  productImg: { width: 60, height: 60, marginRight: 12 },
  productName: { fontSize: 16, fontWeight: "bold" },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  stepper: { flexDirection: "row", alignItems: "center" },
});
