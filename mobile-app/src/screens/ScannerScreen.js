import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { Audio } from "expo-av";
import { useStore } from "../context/StoreContext";




/* ✅ Your Backend URL */
const API_URL = "https://scanpay-backend.vercel.app/api";

export default function ScannerScreen({ navigation }) {
  const { addToCart } = useCart();
  const { selectedStore, storeLoading } = useStore();

if (storeLoading) return null;

if (!selectedStore) {
  navigation.replace("SelectStoreFirst");
  return null;
}


  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState("Align barcode inside the frame");

  // ✅ LOCK SCANNING using ref
  const scanLockedRef = useRef(false);
  const lastBarcodeRef = useRef("");
  const cooldownRef = useRef(null);

  // ✅ SOUND REF
  const beepSoundRef = useRef(null);

  // ✅ success card UI state
  const [successProduct, setSuccessProduct] = useState(null); // {name, price, image}
  const cardAnim = useRef(new Animated.Value(160)).current;

  useEffect(() => {
    if (!permission?.granted) requestPermission();

    // ✅ load beep sound
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sounds/beep-329314.mp3")
        );
        beepSoundRef.current = sound;
      } catch (err) {
        console.log("Beep sound load error:", err);
      }
    };

    loadSound();

    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);

      // ✅ unload sound
      if (beepSoundRef.current) {
        beepSoundRef.current.unloadAsync();
      }
    };
  }, []);

  // ✅ play beep sound
  const playBeep = async () => {
    try {
      if (beepSoundRef.current) {
        await beepSoundRef.current.replayAsync();
      }
    } catch (err) {
      console.log("Beep play error:", err);
    }
  };

  // ✅ show professional success card
  const showSuccessCard = (product) => {
    setSuccessProduct(product);

    Animated.spring(cardAnim, {
      toValue: 0,
      speed: 16,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

    // auto hide after 3.5 seconds
    setTimeout(() => {
      hideSuccessCard();
    }, 3500);
  };

  const hideSuccessCard = () => {
    Animated.timing(cardAnim, {
      toValue: 160,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setSuccessProduct(null);
    });
  };

  const resetScanner = () => {
    scanLockedRef.current = false;
    lastBarcodeRef.current = "";
    setLoading(false);
    setShowHint("Align barcode inside the frame");
    hideSuccessCard();
  };

  const fetchProductAndAdd = async (barcode) => {
    try {
      setLoading(true);
      setShowHint("Fetching product...");

      const url = `${API_URL}/products/${barcode}`;
      console.log("📌 Fetching:", url);

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data?.name) {
        Alert.alert("❌ Not Found", `No product found for barcode:\n${barcode}`);
        setLoading(false);

        cooldownRef.current = setTimeout(() => resetScanner(), 2000);
        return;
      }

      addToCart({
        id: data.id || barcode,
        name: data.name,
        price: data.price,
        image: data.image
          ? { uri: data.image }
          : { uri: "https://via.placeholder.com/150" },
      });

      setLoading(false);
      setShowHint("✅ Product added to cart!");

      // ✅ Professional UI instead of Alert
      showSuccessCard({
        name: data.name,
        price: data.price,
        image: data.image
          ? { uri: data.image }
         : { uri: "https://via.placeholder.com/150" },

      });
    } catch (err) {
      console.log("Fetch error:", err);
      setLoading(false);
      setShowHint("⚠ Error fetching product");
      Alert.alert("⚠ Error", "Failed to fetch product from server.");

      cooldownRef.current = setTimeout(() => resetScanner(), 3000);
    }
  };

  /* ✅ Permission UI */
  if (!permission) return <View style={{ flex: 1 }} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "qr",
            "pdf417",
          ],
        }}
        onBarcodeScanned={({ data }) => {
          const barcode = String(data).trim();

          if (scanLockedRef.current) return;
          if (barcode === lastBarcodeRef.current) return;

          scanLockedRef.current = true;
          lastBarcodeRef.current = barcode;

          playBeep();
          fetchProductAndAdd(barcode);

          // ✅ unlock after cooldown
          cooldownRef.current = setTimeout(() => {
            scanLockedRef.current = false;
            lastBarcodeRef.current = "";
          }, 6000);
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Scan Frame */}
      <View style={styles.frameWrap}>
        <View style={styles.frame} />
        <Text style={styles.scanHint}>{showHint}</Text>

        {loading && (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        )}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Main", { screen: "Cart" })}
        >
          <Ionicons name="cart" size={22} color="#fff" />
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scanAgainBtn}
          activeOpacity={0.9}
          onPress={resetScanner}
        >
          <Ionicons name="refresh" size={20} color="#052E16" />
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ PROFESSIONAL SUCCESS UI CARD */}
      {successProduct && (
        <Animated.View
          style={[
            styles.successCard,
            { transform: [{ translateY: cardAnim }] },
          ]}
        >
          <View style={styles.successTop}>
            <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
            <Text style={styles.successTitle}>Added to Cart</Text>
            <TouchableOpacity onPress={hideSuccessCard} activeOpacity={0.8}>
              <Ionicons name="close" size={20} color="#052E16" />
            </TouchableOpacity>
          </View>

          <View style={styles.productRow}>
            <Image source={successProduct.image} style={styles.successImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.successName} numberOfLines={1}>
                {successProduct.name}
              </Text>
              <Text style={styles.successPrice}>₹{successProduct.price}</Text>
            </View>
          </View>

          <View style={styles.successBtns}>
            <TouchableOpacity
              style={styles.goCartBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Main", { screen: "Cart" })}
            >
              <Text style={styles.goCartText}>Go to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanMoreBtn}
              activeOpacity={0.9}
              onPress={resetScanner}
            >
              <Text style={styles.scanMoreText}>Scan More</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

/* ✅ STYLES */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },

  header: {
    position: "absolute",
    top: 55,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },

  frameWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    width: 280,
    height: 170,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  scanHint: {
    color: "#fff",
    fontWeight: "900",
    marginTop: 14,
    fontSize: 13,
    textAlign: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },

  cartBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  cartText: { color: "#fff", fontWeight: "900" },

  scanAgainBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  scanAgainText: { fontWeight: "900", color: "#052E16" },

  /* ✅ Professional Card */
  successCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    shadowColor: "#16A34A",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  successTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  successTitle: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: "900", color: "#052E16" },

  productRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  successImg: { width: 46, height: 46, resizeMode: "contain", borderRadius: 12 },
  successName: { fontSize: 14, fontWeight: "900", color: "#052E16" },
  successPrice: { marginTop: 4, fontSize: 13, fontWeight: "900", color: "#16A34A" },

  successBtns: { flexDirection: "row", gap: 12, marginTop: 14 },
  goCartBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  goCartText: { color: "#fff", fontWeight: "900" },

  scanMoreBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  scanMoreText: { color: "#052E16", fontWeight: "900" },

  permissionBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  permissionText: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 14,
    color: "#052E16",
  },
  permissionBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
});
