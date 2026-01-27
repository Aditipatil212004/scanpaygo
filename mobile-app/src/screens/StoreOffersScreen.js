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
    banner: require("../../assets/offers/zudio_offer.jpg"),
  },
  "2": {
    name: "Westside",
    tagline: "Style & Comfort",
    location: "Mumbai",
    rating: 4.5,
    logo: require("../../assets/stores/westside_logo.png"),
    banner: require("../../assets/offers/westside_offer.jpg"),
  },
  "3": {
    name: "Zara",
    tagline: "Premium Fashion",
    location: "Delhi",
    rating: 4.6,
    logo: require("../../assets/stores/zara_logo.png"),
    banner: require("../../assets/offers/zara_offer.png"),
  },
  "4": {
    name: "H&M",
    tagline: "Fashion & Quality",
    location: "Bangalore",
    rating: 4.3,
    logo: require("../../assets/stores/hm.png"),
    banner: require("../../assets/offers/hm_offer.png"),
  },
  "5": {
    name: "Reliance Trends",
    tagline: "Everyday Fashion",
    location: "Nashik",
    rating: 4.2,
    logo: require("../../assets/stores/trends_logo.png"),
    banner: require("../../assets/offers/trends_offer.png"),
  },
  "6": {
    name: "Reliance Smart",
    tagline: "Groceries & More",
    location: "Pune",
    rating: 4.1,
    logo: require("../../assets/stores/relaince_logo.png"),
    banner: require("../../assets/offers/relaince_offer.jpg"),
  },
  "7": {
    name: "DMart",
    tagline: "Value for Money",
    location: "Pune",
    rating: 4.7,
    logo: require("../../assets/stores/dmart_logo.png"),
    banner: require("../../assets/offers/dmart_offer.jpeg"),
},
};

/* ✅ OFFERS */
const OFFERS = [
  { id: "o1", title: "Flat 50% Off", subtitle: "Selected Items" },
  { id: "o2", title: "Buy 2 Get 1", subtitle: "On Top Brands" },
  { id: "o3", title: "Winter Clearance", subtitle: "Upto 70% Off" },
];

/* ✅ CATEGORIES */
const CATEGORIES = [
  { id: "c1", title: "Men", icon: "man-outline" },
  { id: "c2", title: "Women", icon: "woman-outline" },
  { id: "c3", title: "Kids", icon: "happy-outline" },
  { id: "c4", title: "Footwear", icon: "walk-outline" },
  { id: "c5", title: "Accessories", icon: "watch-outline" },
];

/* ✅ PRODUCTS */
const PRODUCTS = [
  {
    id: "p1",
    name: "Fresh Milk",
    price: 50,
    oldPrice: 65,
    off: "20% OFF",
   image: "https://via.placeholder.com/150"

  },
  {
    id: "p2",
    name: "Potato Chips",
    price: 30,
    oldPrice: 45,
    off: "33% OFF",
   image: "https://via.placeholder.com/150"

  },
  {
    id: "p3",
    name: "Whole Wheat Bread",
    price: 40,
    oldPrice: 55,
    off: "27% OFF",
image: "https://via.placeholder.com/150"
  },
];

export default function StoreOffersScreen({ route, navigation }) {
  const { storeId = "1", storeName } = route?.params || {};
  const { items, addToCart, increaseQty, decreaseQty, totals } = useCart();

  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  const store = useMemo(() => STORE_DATA[storeId] || STORE_DATA["1"], [storeId]);

  /* ✅ Toast animation */
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

  const getQty = (id) => {
    const found = items?.find((i) => i.id === id);
    return found?.qty || 0;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* ===== Navbar ===== */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.navTitle, { color: colors.text }]}>
            {storeName || store.name}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* ===== Store Header ===== */}
        <View style={styles.storeHeader}>
          <View style={styles.storeRow}>
            <View
              style={[
                styles.logoBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Image source={store.logo} style={styles.logo} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
              <Text style={[styles.tagline, { color: colors.muted }]}>{store.tagline}</Text>

              <View style={styles.metaRow}>
                <View style={[styles.metaPill, { borderColor: colors.border }]}>
                  <Ionicons name="location-outline" size={14} color={colors.primary} />
                  <Text style={[styles.metaText, { color: colors.text }]}>
                    {store.location}
                  </Text>
                </View>

                <View style={[styles.metaPill, { borderColor: colors.border }]}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={[styles.metaText, { color: colors.text }]}>{store.rating}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Banner */}
          <View style={[styles.bannerWrap, { borderColor: colors.border }]}>
           <Image source={{ uri: store.banner }} />

            <View style={styles.bannerBottom}>
              <Text style={styles.bannerText}>Today’s Exclusive Deals</Text>
              <Text style={styles.bannerSub}>Shop offers before they end!</Text>
            </View>
          </View>
        </View>

        {/* ===== Offers ===== */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Offers</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Top deals for you</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 6 }}
        >
          {OFFERS.map((offer) => (
            <View key={offer.id} style={[styles.offerCard, { backgroundColor: colors.primary }]}>
              <View style={styles.offerTop}>
                <Ionicons name="pricetag-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSub}>{offer.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ===== Categories ===== */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Explore quickly</Text>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("CategoryProducts", {
                  categoryName: cat.title,
                  storeId: storeId,
                  storeName: store.name,
                })
              }
            >
              <View style={[styles.categoryIcon, { borderColor: colors.border }]}>
                <Ionicons name={cat.icon} size={22} color={colors.primary} />
              </View>

              <Text style={[styles.categoryText, { color: colors.text }]}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== Products ===== */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Products</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Best sellers</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {PRODUCTS.map((p) => {
            const qty = getQty(p.id);

            return (
              <View
                key={p.id}
                style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.productImgBox, { borderColor: colors.border }]}>
                  <Image source={p.image} style={styles.productImg} resizeMode="contain" />
                </View>

                <View style={{ flex: 1 }}>
                  <Image source={{ uri: p.image }} style={styles.productImg} />
                  <Text style={[styles.productName, { color: colors.text }]}>{p.name}</Text>

                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                    <Text style={[styles.oldPrice, { color: colors.muted }]}>₹{p.oldPrice}</Text>

                    <View style={[styles.offBadge, { borderColor: colors.primary }]}>
                      <Text style={[styles.offText, { color: colors.primary }]}>{p.off}</Text>
                    </View>
                  </View>
                </View>

                {/* ✅ + / Qty / - Stepper */}
                {qty === 0 ? (
                  <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: colors.primary }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      addToCart(p);
                      showToast(`${p.name} added to cart ✅`);
                    }}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.stepper, { borderColor: colors.border }]}>
                    <TouchableOpacity
                      style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.bg }]}
                      activeOpacity={0.85}
                      onPress={() => {
                        decreaseQty(p.id);
                        showToast("Removed 1 item ✅");
                      }}
                    >
                      <Ionicons name="remove" size={16} color={colors.primary} />
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>

                    <TouchableOpacity
                      style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.bg }]}
                      activeOpacity={0.85}
                      onPress={() => {
                        increaseQty(p.id);
                        showToast("Added 1 item ✅");
                      }}
                    >
                      <Ionicons name="add" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ✅ Floating Cart Shortcut */}
      <TouchableOpacity
        style={[styles.floatingCart, { backgroundColor: colors.primary }]}
        activeOpacity={0.92}
        onPress={() => navigation.navigate("Main", { screen: "Cart" })}
      >
        <Ionicons name="cart" size={22} color="#fff" />
        {totals.count > 0 && (
          <View style={[styles.cartBadge, { backgroundColor: colors.text }]}>
            <Text style={styles.cartBadgeText}>
              {totals.count > 99 ? "99+" : totals.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ✅ Toast */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
        <Text style={[styles.toastText, { color: colors.text }]}>{toastText}</Text>
      </Animated.View>

      {/* ===== Sticky Bottom ===== */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.scanBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.92}
          onPress={() => navigation.navigate("Scanner")}
        >
          <Ionicons name="scan-outline" size={22} color="#fff" />
          <Text style={styles.scanText}>Scan Products</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ✅ Styles */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },

  navbar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  storeHeader: { paddingHorizontal: 20, paddingBottom: 14 },
  storeRow: { flexDirection: "row", alignItems: "center" },

  logoBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logo: { width: 38, height: 38, resizeMode: "contain" },

  storeName: { fontSize: 20, fontWeight: "900" },
  tagline: { fontSize: 13, fontWeight: "700", marginTop: 4 },

  metaRow: { flexDirection: "row", marginTop: 10, gap: 10 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
  },

  metaText: { marginLeft: 6, fontSize: 12, fontWeight: "800" },

  bannerWrap: {
    marginTop: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
  },
  bannerImage: { width: "100%", height: 160 },
  bannerBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  bannerText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  bannerSub: {
    marginTop: 2,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    fontSize: 12,
  },

  sectionHeader: { paddingHorizontal: 20, marginTop: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "900" },
  sectionHint: { marginTop: 4, fontSize: 12, fontWeight: "700" },

  offerCard: {
    width: 170,
    marginRight: 14,
    padding: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  offerTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  offerTitle: { fontSize: 16, fontWeight: "900", color: "#fff" },
  offerSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },

  categoryGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  categoryCard: {
    width: "31%",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  categoryText: { fontSize: 12, fontWeight: "900" },

  productCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  productImgBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  productImg: { width: 44, height: 44 },
  productName: { fontSize: 15, fontWeight: "900" },

  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 8, flexWrap: "wrap" },
  price: { fontSize: 14, fontWeight: "900", marginRight: 8 },
  oldPrice: {
    fontSize: 12,
    fontWeight: "800",
    textDecorationLine: "line-through",
    marginRight: 10,
  },

  offBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(22,163,74,0.10)",
    borderWidth: 1,
  },

  offText: { fontSize: 11, fontWeight: "900" },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginLeft: 10,
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 10,
  },

  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    width: 22,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 13,
    marginHorizontal: 8,
  },

  floatingCart: {
    position: "absolute",
    right: 16,
    bottom: 102,
    width: 58,
    height: 58,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },

  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },

  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 9,
  },

  toastText: { flex: 1, fontSize: 13, fontWeight: "900" },

  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
  },

  scanBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  scanText: { marginLeft: 10, color: "#fff", fontSize: 16, fontWeight: "900" },
});
