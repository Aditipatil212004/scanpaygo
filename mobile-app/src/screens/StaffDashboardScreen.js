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
  backgroundGradientFrom: "#0F3D33",
  backgroundGradientTo: "#062B23",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(209, 250, 229, ${opacity})`,
  fillShadowGradient: "#10B981",
  fillShadowGradientOpacity: 0.2,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#34D399",
  },
};


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
    console.log("Pressed logo");

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
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
      Alert.alert("Logo Updated");
    } else {
      console.log("Upload failed:", responseData);
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

  {/* HEADER (UNCHANGED) */}
  <View style={styles.glassHeader}>
    <View style={styles.leftSection}>
      <TouchableOpacity activeOpacity={0.8} onPress={pickLogo}>
  {user?.storeLogo ? (
    <Image source={{ uri: user.storeLogo }} style={styles.logo} />
  ) : (
    <View style={styles.logoFallback}>
      <Text style={styles.logoText}>
        {user?.storeName?.charAt(0)?.toUpperCase() || "S"}
      </Text>
    </View>
  )}
</TouchableOpacity>

      

      <View style={{ marginLeft: 12 }}>
        <Text style={styles.storeName}>{user?.storeName}</Text>
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

  {/* MAIN STATS */}
  <View style={styles.row}>
    <StatCard
      icon="receipt-outline"
      value={data.verifiedCount}
      label="Verified Today"
    />
    <StatCard
      icon="albums-outline"
      value={data.totalReceipts}
      label="Total Receipts"
    />
  </View>

  {/* EXTRA STATS */}
  <View style={styles.row}>
    <StatCard
      icon="cash-outline"
      value={`₹ ${
        data.totalReceipts > 0
          ? Math.floor(data.totalSales / data.totalReceipts)
          : 0
      }`}
      label="Avg Order"
    />
    <StatCard
      icon="trending-up-outline"
      value={
        data.totalReceipts > 0
          ? `${Math.floor(
              (data.verifiedCount / data.totalReceipts) * 100
            )}%`
          : "0%"
      }
      label="Verification Rate"
    />
  </View>

  {/* WEEKLY CHART */}
  <Text style={styles.section}>Weekly Sales</Text>
  <LineChart
    data={{
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data:
            data.weekly && data.weekly.length === 7
              ? data.weekly
              : [0, 0, 0, 0, 0, 0, 0],
        },
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
    <>
      <Text style={styles.section}>Verification Breakdown</Text>
      <PieChart
        data={[
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
        ]}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </>
  )}

  {/* RECENT RECEIPTS */}
  {data.recent?.length > 0 && (
    <>
      <Text style={styles.section}>Recent Receipts</Text>
      {data.recent.map((item, index) => (
        <View key={index} style={styles.receiptCard}>
          <View>
            <Text style={styles.receiptId}>
              #{item._id.slice(-5)}
            </Text>
          </View>
          <Text style={styles.receiptAmount}>
            ₹ {item.totalAmount}
          </Text>
        </View>
      ))}
    </>
  )}

  {/* PERFORMANCE */}
  <View style={styles.performanceCard}>
    <Ionicons name="trophy-outline" size={22} color="#FACC15" />
    <Text style={styles.performanceText}>
      Store Performance: {
        data.totalSales > 5000
          ? "Excellent 🚀"
          : data.totalSales > 2000
          ? "Good 🔥"
          : "Growing 📈"
      }
    </Text>
  </View>

</Animated.View>

      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== HEADER ===== */

  glassHeader: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 22,
    borderRadius: 28,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 75,
    height: 75,
    borderRadius: 24,
  },

  logoFallback: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },

  storeName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  dateText: {
    color: "#A7F3D0",
    fontSize: 13,
    marginTop: 4,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusText: {
    color: "#fff",
    marginRight: 10,
    fontWeight: "600",
  },

  /* ===== REVENUE CARD ===== */

  bigCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 30,
    borderRadius: 30,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  bigLabel: {
    color: "#D1FAE5",
    fontSize: 14,
    letterSpacing: 1,
  },

  bigValue: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 10,
  },

  /* ===== STAT CARDS ===== */

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 22,
    borderRadius: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  smallValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginVertical: 8,
  },

  smallLabel: {
    color: "#A7F3D0",
    fontSize: 13,
  },

  /* ===== SECTION TITLE ===== */

  section: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 15,
    marginTop: 5,
  },

  chart: {
    borderRadius: 26,
    marginBottom: 30,
  },

  /* ===== RECEIPT CARDS ===== */

  receiptCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 18,
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  receiptId: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  receiptAmount: {
    color: "#34D399",
    fontWeight: "900",
    fontSize: 15,
  },

  /* ===== PERFORMANCE CARD ===== */

  performanceCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 22,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  performanceText: {
    color: "#FFFFFF",
    marginLeft: 12,
    fontWeight: "700",
    fontSize: 15,
  },
});


