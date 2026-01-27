import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import MainStack from "./MainStack";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 62,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        },
        tabBarIcon: ({ focused }) => {
          let icon = "home-outline";

          if (route.name === "HomeTab") icon = focused ? "home" : "home-outline";
          if (route.name === "Cart") icon = focused ? "cart" : "cart-outline";
          if (route.name === "Orders") icon = focused ? "receipt" : "receipt-outline";
          if (route.name === "Profile") icon = focused ? "person" : "person-outline";

          return (
            <Ionicons
              name={icon}
              size={24}
              color={focused ? "#16A34A" : "#64748B"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={MainStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
