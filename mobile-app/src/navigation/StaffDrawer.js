import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDashboardScreen from "../screens/StaffDashboardScreen";
import StaffVerifyScreen from "../screens/StaffVerifyScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

export default function StaffDrawer() {
  const { logout } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#022C22" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#065F46" },
        drawerActiveTintColor: "#16A34A",
        drawerInactiveTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={StaffDashboardScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Verify Receipt"
        component={StaffVerifyScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="qr-code-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Logout"
        component={StaffDashboardScreen}
        listeners={{
          focus: () => logout(),
        }}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
