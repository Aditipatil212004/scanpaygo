import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { makeThemeStyles } from "../styles/themeStyles";

export default function CartScreen({ navigation }) {
  const { items, totals, increaseQty, decreaseQty } = useCart();
  const { colors, mode } = useTheme();
  const T = makeThemeStyles(colors);

  // ✅ FIX: don't recreate animation every render
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={T.screen}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}
      >
        {/* ✅ Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Your Cart</Text>

          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{totals.count} Items</Text>
          </View>
        </View>

        {/* Empty cart */}
        {items.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="cart-outline" size={54} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySub, { color: colors.muted }]}>
              Add products from store to checkout faster.
            </Text>

            <TouchableOpacity
              style={[styles.shopNowBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("Stores")}
              activeOpacity={0.92}
            >
              <Text style={styles.shopNowText}>Go to Stores</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Items */}
            {items.map((item) => (
              <CartItem
                key={item.id}
                colors={colors}
                image={item.image}
                name={item.name}
                price={`₹${item.price}`}
                qty={item.qty}
                onPlus={() => increaseQty(item.id)}
                onMinus={() => decreaseQty(item.id)}
              />
            ))}

            {/* Bill Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Bill Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹{totals.subtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Tax</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹{totals.tax}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>₹{totals.total}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom bar */}
      {items.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: mode === "dark" ? colors.card : "rgba(255,255,255,0.97)",
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={styles.totalBox}>
            <Text style={[styles.bottomLabel, { color: colors.muted }]}>Total</Text>
            <Text style={[styles.bottomAmount, { color: colors.text }]}>₹{totals.total}</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
           <TouchableOpacity
  style={[styles.payButton, { backgroundColor: colors.primary }]}
  onPress={() => navigation.navigate("Payment", { amount: totals.total })}
  onPressIn={onPressIn}
  onPressOut={onPressOut}
  activeOpacity={0.95}
>
  <Text style={styles.payText}>Proceed to Pay</Text>
</TouchableOpacity>

          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

function CartItem({ image, name, price, qty, onPlus, onMinus, colors }) {
  return (
    <View style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.imageBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        {image ? <Image source={image} style={styles.productImage} /> : <View style={{ width: 46, height: 46 }} />}
      </View>

      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>{price}</Text>
      </View>

      <View style={[styles.qtyBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <TouchableOpacity onPress={onMinus} activeOpacity={0.8}>
          <Ionicons name="remove" size={18} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>

        <TouchableOpacity onPress={onPlus} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  /* Empty */
  emptyBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
  },

  emptySub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  shopNowBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },

  shopNowText: { color: "#fff", fontWeight: "900" },

  /* Item */
  itemCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  productImage: {
    width: 46,
    height: 46,
    resizeMode: "contain",
  },

  itemDetails: { flex: 1 },

  itemName: {
    fontSize: 16,
    fontWeight: "900",
  },

  itemPrice: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "900",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  qtyText: {
    fontSize: 15,
    fontWeight: "900",
    marginHorizontal: 10,
  },

  /* Summary */
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryLabel: { fontWeight: "800" },

  summaryValue: { fontWeight: "900" },

  divider: { height: 1, marginVertical: 12 },

  totalLabel: { fontSize: 16, fontWeight: "900" },

  totalValue: { fontSize: 18, fontWeight: "900" },

  /* Bottom */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
  },

  totalBox: { flex: 1 },

  bottomLabel: { fontSize: 13, fontWeight: "800" },

  bottomAmount: { fontSize: 18, fontWeight: "900" },

  payButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 26,

    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 9,
  },

  payText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});