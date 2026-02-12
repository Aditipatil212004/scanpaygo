import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../services/api";

const screenWidth = Dimensions.get("window").width;

export default function StaffDashboardScreen({ navigation }) {
  const { token, user, logout, updateUser } = useAuth();

  const fade = useRef(new Animated.Value(0)).current;
  const revenueAnim = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [storeOpen, setStoreOpen] = useState(
    user?.storeStatus === "open"
  );

  useEffect(() => {
    fetchDashboard();
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (data?.totalSales >= 0) {
      revenueAnim.setValue(0);
      Animated.timing(revenueAnim, {
        toValue: data.totalSales,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      const listener = revenueAnim.addListener(({ value }) => {
        setDisplayRevenue(Math.floor(value));
      });

      return () => revenueAnim.removeListener(listener);
    }
  }, [data]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/staff/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  /* ================= IMAGE PICKER FIXED ================= */

  const pickLogo = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });

      if (result.canceled) return;

      const base64Image =
        `data:image/jpeg;base64,${result.assets[0].base64}`;

      const response = await fetch(
        `${API_BASE}/api/staff/store-settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ storeLogo: base64Image }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        updateUser(responseData.user);
      }

    } catch (err) {
      console.log("Image error:", err);
    }
  };

  /* ================= TOGGLE FIXED ================= */

  const toggleStore = async () => {
    const newStatus = storeOpen ? "closed" : "open";
    setStoreOpen(!storeOpen);

    try {
      const res = await fetch(`${API_BASE}/api/staff/store-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeStatus: newStatus }),
      });

      const result = await res.json();

      if (res.ok) {
        updateUser(result.user);
      }
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  if (!data) {
    return (
      <LinearGradient colors={["#064E3B", "#022C22"]} style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  const avgOrder =
    data.totalReceipts > 0
      ? Math.floor(data.totalSales / data.totalReceipts)
      : 0;

  const pieData =
    data.totalReceipts > 0
      ? [
          {
            name: "Verified",
            population: data.verifiedCount,
            color: "#10B981",
            legendFontColor: "#fff",
            legendFontSize: 12,
          },
          {
            name: "Remaining",
            population:
              data.totalReceipts - data.verifiedCount,
            color: "#EF4444",
            legendFontColor: "#fff",
            legendFontSize: 12,
          },
        ]
      : [];

  return (
    <LinearGradient colors={["#064E3B", "#022C22"]} style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={{ opacity: fade }}>

          {/* HEADER */}
          <View style={styles.glassHeader}>
            <View style={styles.leftSection}>

              {/* CLICKABLE LOGO FIXED */}
              <TouchableOpacity onPress={pickLogo}>
                {user?.storeLogo ? (
                  <Image
                    source={{ uri: user.storeLogo }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={styles.logoFallback}>
                    <Text style={styles.logoText}>
                      {user?.storeName?.charAt(0)?.toUpperCase() || "S"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.storeName}>
                  {user?.storeName}
                </Text>

                <Text style={styles.dateText}>
                  {new Date().toDateString()}
                </Text>

                <View style={styles.statusRow}>
                  <Text style={styles.statusText}>
                    {storeOpen ? "🟢 Open" : "🔴 Closed"}
                  </Text>
                  <Switch
                    value={storeOpen}
                    onValueChange={toggleStore}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={logout}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
