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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../services/api";

const screenWidth = Dimensions.get("window").width;

export default function StaffDashboardScreen({ navigation }) {
  const { token, user, logout } = useAuth();

  const fade = useRef(new Animated.Value(0)).current;
  const revenueAnim = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [displayRevenue, setDisplayRevenue] = useState(0);

  useEffect(() => {
    fetchDashboard();
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (data?.totalSales) {
      Animated.timing(revenueAnim, {
        toValue: data.totalSales,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      revenueAnim.addListener(({ value }) => {
        setDisplayRevenue(Math.floor(value));
      });
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

  if (!data) {
    return (
      <LinearGradient colors={["#064E3B", "#022C22"]} style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

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
          <View style={styles.header}>
            <View>
              <Text style={styles.welcome}>Welcome back</Text>
              <Text style={styles.storeName}>GreenMart Store</Text>
            </View>

            <TouchableOpacity onPress={logout}>
              <Ionicons name="log-out-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* REVENUE CARD */}
          <View style={styles.bigCard}>
            <Text style={styles.bigLabel}>Today's Revenue</Text>
            <Text style={styles.bigValue}>₹ {displayRevenue}</Text>
          </View>

          {/* STATS */}
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

          {/* WEEKLY CHART */}
          <Text style={styles.section}>Weekly Sales</Text>

          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: data.weekly || [0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#064E3B",
              backgroundGradientTo: "#022C22",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: () => "#D1FAE5",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#10B981",
              },
            }}
            bezier
            style={styles.chart}
          />

          {/* RECENT PURCHASES */}
          <Text style={styles.section}>Recent Purchases</Text>

          {data.recent?.map((item, index) => (
            <View key={index} style={styles.receiptCard}>
              <View>
                <Text style={styles.receiptId}>
                  #{item._id.slice(-5)}
                </Text>
                <Text style={styles.receiptUser}>
                  {item.customerName || "Customer"}
                </Text>
              </View>
              <Text style={styles.receiptAmount}>
                ₹ {item.totalAmount}
              </Text>
            </View>
          ))}

          {/* VERIFY BUTTON */}
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => navigation.navigate("StaffVerify")}
          >
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
            <Text style={styles.scanText}>Verify Receipt</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <View style={styles.smallCard}>
      <Ionicons name={icon} size={22} color="#10B981" />
      <Text style={styles.smallValue}>{value}</Text>
      <Text style={styles.smallLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: { color: "#A7F3D0" },
  storeName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },

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

  receiptCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  receiptId: { color: "#fff", fontWeight: "800" },
  receiptUser: { color: "#A7F3D0", fontSize: 12 },

  receiptAmount: {
    color: "#34D399",
    fontWeight: "900",
  },

  scanBtn: {
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  scanText: {
    color: "#fff",
    fontWeight: "900",
    marginLeft: 10,
  },
});
