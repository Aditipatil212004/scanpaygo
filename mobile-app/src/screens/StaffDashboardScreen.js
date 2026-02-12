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
    if (data?.totalSales) {
      revenueAnim.setValue(0);
      Animated.timing(revenueAnim, {
        toValue: data.totalSales,
        duration: 1200,
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

const pickLogo = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
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
        body: JSON.stringify({
          storeLogo: base64Image,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      updateUser(data.user); // 🔥 THIS refreshes UI
    } else {
      console.log("Upload failed:", data);
    }
  } catch (err) {
    console.log("Image error:", err);
  }
};

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
      if (res.ok) updateUser(result.user);
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

  /* ================= CALCULATED STATS ================= */

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
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade }}>

          {/* HEADER */}
          <View style={styles.glassHeader}>
            <View style={styles.leftSection}>
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
                    trackColor={{ false: "#EF4444", true: "#10B981" }}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={logout}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* REVENUE */}
          <View style={styles.bigCard}>
            <Text style={styles.bigLabel}>Today's Revenue</Text>
            <Text style={styles.bigValue}>₹ {displayRevenue}</Text>
          </View>

          {/* EXTRA STATS */}
          <View style={styles.row}>
            <StatCard
              icon="receipt-outline"
              value={data.verifiedCount}
              label="Verified"
            />
            <StatCard
              icon="cash-outline"
              value={`₹ ${avgOrder}`}
              label="Avg Order"
            />
          </View>

          {/* LINE CHART */}
          <Text style={styles.section}>Weekly Sales</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                { data:
      data.totalReceipts > 0
        ? data.weekly || [0, 0, 0, 0, 0, 0, 0]
        : [0, 0, 0, 0, 0, 0, 0],},
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          {/* PIE CHART */}
          
         {data.totalReceipts > 0 && (
  <PieChart
    data={pieData}
    width={screenWidth - 40}
    height={220}
    chartConfig={chartConfig}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
  />
)}


          {/* PERFORMANCE BADGE */}
          <View style={styles.performanceCard}>
            <Ionicons name="trophy-outline" size={22} color="#FACC15" />
            <Text style={styles.performanceText}>
              Store Performance: Excellent 🚀
            </Text>
          </View>

        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, value, label }) {
  return (
    <View style={styles.smallCard}>
      <Ionicons name={icon} size={22} color="#10B981" />
      <Text style={styles.smallValue}>{value}</Text>
      <Text style={styles.smallLabel}>{label}</Text>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#064E3B",
  backgroundGradientTo: "#022C22",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(16,185,129,${opacity})`,
  labelColor: () => "#D1FAE5",
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  glassHeader: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 26,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: { flexDirection: "row", alignItems: "center" },

  logo: { width: 70, height: 70, borderRadius: 20 },

  logoFallback: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: { color: "#fff", fontSize: 24, fontWeight: "900" },

  storeName: { fontSize: 20, fontWeight: "900", color: "#fff" },

  dateText: { color: "#A7F3D0", fontSize: 12, marginTop: 3 },

  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },

  statusText: { color: "#fff", marginRight: 10 },

  bigCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 25,
    borderRadius: 24,
    marginBottom: 20,
  },

  bigLabel: { color: "#D1FAE5" },

  bigValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  smallValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginVertical: 6,
  },

  smallLabel: { color: "#D1FAE5", fontSize: 12 },

  section: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },

  chart: {
    borderRadius: 20,
    marginBottom: 20,
  },

  performanceCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  performanceText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "700",
  },
});
