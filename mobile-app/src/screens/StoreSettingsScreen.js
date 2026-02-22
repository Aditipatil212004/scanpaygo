import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import API_BASE from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StoreSettingsScreen() {
  const { token } = useAuth();

  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= IMAGE PICKER ================= */

  const pickImage = async (setImage) => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
    }
  };

  /* ================= SAVE SETTINGS ================= */

  const saveSettings = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/staff/store-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeBanner: banner
            ? `data:image/jpeg;base64,${banner.base64}`
            : undefined,
          storeLogo: logo
            ? `data:image/jpeg;base64,${logo.base64}`
            : undefined,
        }),
      });

      if (res.ok) {
        Alert.alert("Success 🎉", "Store updated successfully");
      } else {
        Alert.alert("Error", "Failed to update store");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Store Settings</Text>
      <Text style={styles.subHeading}>
        Manage how your store appears to customers
      </Text>

      {/* ===== BANNER UPLOAD ===== */}
      <Text style={styles.label}>Store Banner</Text>
      <TouchableOpacity
        style={styles.bannerBox}
        onPress={() => pickImage(setBanner)}
        activeOpacity={0.85}
      >
        {banner ? (
          <Image
            source={{ uri: banner.uri }}
            style={styles.bannerImage}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="image-outline"
              size={36}
              color="#16A34A"
            />
            <Text style={styles.placeholderText}>
              Upload Store Banner
            </Text>
            <Text style={styles.helperText}>
              Recommended size: 16:9
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ===== LOGO UPLOAD ===== */}
      <Text style={styles.label}>Store Logo</Text>
      <TouchableOpacity
        style={styles.logoBox}
        onPress={() => pickImage(setLogo)}
        activeOpacity={0.85}
      >
        {logo ? (
          <Image source={{ uri: logo.uri }} style={styles.logo} />
        ) : (
          <>
            <Ionicons
              name="image-outline"
              size={28}
              color="#16A34A"
            />
            <Text style={styles.placeholderText}>
              Upload Store Logo
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* ===== SAVE BUTTON ===== */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveSettings}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#fff"
            />
            <Text style={styles.saveText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
function CustomDrawer({ navigation, logout }) {
  return (
    <View style={styles.drawerContainer}>
      {/* HEADER */}
      <View style={styles.drawerHeader}>
        <Text style={styles.appName}>ScanPay Go</Text>
        <Text style={styles.subText}>Staff Panel</Text>
      </View>

      {/* MENU ITEMS */}
      <DrawerItem
        icon="grid-outline"
        label="Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />

      {/* ⭐ PREMIUM STORE SETTINGS */}
      <TouchableOpacity
        style={styles.premiumItem}
        onPress={() => navigation.navigate("StoreSettings")}
        activeOpacity={0.9}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="storefront-outline" size={22} color="#16A34A" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.premiumTitle}>Store Settings</Text>
          <Text style={styles.premiumSubtitle}>
            Logo • Banner • Visibility
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <DrawerItem
        icon="qr-code-outline"
        label="Verify Receipt"
        onPress={() => navigation.navigate("VerifyReceipt")}
      />

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}


/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    padding: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#022C22",
  },

  subHeading: {
    fontSize: 13,
    color: "#065F46",
    marginTop: 6,
    marginBottom: 24,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 10,
  },

  bannerBox: {
    height: 180,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#16A34A",
    marginBottom: 26,
    overflow: "hidden",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    marginTop: 8,
    fontWeight: "800",
    color: "#065F46",
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
   drawerContainer: {
    flex: 1,
    backgroundColor: "#022C22",
    padding: 20,
  },

  drawerHeader: {
    marginBottom: 30,
  },

  appName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ECFDF5",
  },

  subText: {
    fontSize: 13,
    color: "#A7F3D0",
    marginTop: 4,
    fontWeight: "600",
  },

  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  drawerText: {
    color: "#ECFDF5",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 14,
  },

  /* ⭐ PREMIUM ITEM */
  premiumItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#064E3B",
    borderRadius: 18,
    padding: 16,
    marginVertical: 16,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  premiumTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#ECFDF5",
  },

  premiumSubtitle: {
    fontSize: 11,
    color: "#A7F3D0",
    marginTop: 2,
    fontWeight: "600",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 14,
  },

  logoutText: {
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 12,
  },
});
