import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

import StaffDashboardScreen from "../screens/StaffDashboardScreen";
import StaffVerifyScreen from "../screens/StaffVerifyScreen";
import AddOfferScreen from "../screens/AddOfferScreen";
import StoreSettingsScreen from "../screens/StoreSettingsScreen";

const Drawer = createDrawerNavigator();

export default function StaffDrawer() {
  const { logout } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#022C22" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#022C22" },
      }}
      drawerContent={(props) => (
        <CustomDrawer {...props} logout={logout} />
      )}
    >
      <Drawer.Screen name="Dashboard" component={StaffDashboardScreen} />
      <Drawer.Screen name="AddOffer" component={AddOfferScreen} />
      <Drawer.Screen name="StoreSettings" component={StoreSettingsScreen} />
      <Drawer.Screen name="VerifyReceipt" component={StaffVerifyScreen} />
    </Drawer.Navigator>
  );
}

/* ================= CUSTOM DRAWER ================= */

function CustomDrawer({ navigation, logout }) {
  return (
    <View style={styles.drawerContainer}>
      {/* HEADER */}
      <View style={styles.drawerHeader}>
        <Text style={styles.appName}>ScanPay Go</Text>
        <Text style={styles.subText}>Staff Panel</Text>
      </View>

      {/* DASHBOARD */}
      <DrawerItem
        icon="grid-outline"
        label="Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />

      {/* ADD OFFER */}
      <DrawerItem
        icon="pricetag-outline"
        label="Add Offer"
        onPress={() => navigation.navigate("AddOffer")}
      />

      {/* ⭐ PREMIUM STORE SETTINGS */}
     <TouchableOpacity
  style={styles.simpleItem}
  onPress={() => navigation.navigate("StoreSettings")}
  activeOpacity={0.7}
>
  <View style={styles.leftRow}>
    <Ionicons
      name="storefront-outline"
      size={20}
      color="#ECFDF5"
    />
    <Text style={styles.simpleText}>Store Settings</Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={18}
    color="#9CA3AF"
  />
</TouchableOpacity>


      {/* VERIFY RECEIPT */}
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

/* ================= SIMPLE DRAWER ITEM ================= */

function DrawerItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#ECFDF5" />
      <Text style={styles.drawerText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
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

  /* ⭐ PREMIUM STORE SETTINGS */
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
  simpleItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 14,
},

leftRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
},

simpleText: {
  color: "#ECFDF5",
  fontSize: 15,
  fontWeight: "700",
},

});
