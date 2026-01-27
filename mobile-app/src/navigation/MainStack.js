import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";

import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

import PaymentScreen from "../screens/PaymentScreen";
import ReceiptScreen from "../screens/ReceiptScreen";

import EditProfileScreen from "../screens/EditProfileScreen";

import StaffLoginScreen from "../screens/StaffLoginScreen";
import StaffVerifyScreen from "../screens/StaffVerifyScreen";
import ScannerScreen from "../screens/ScannerScreen";


// ✅ If you have store offers screen add it too
import StoreOffersScreen from "../screens/StoreOffersScreen";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ Home */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* ✅ Store + Scanner */}
      <Stack.Screen name="StoreOffers" component={StoreOffersScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />

     
      {/* ✅ Orders Flow */}
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />

      {/* ✅ Payment Flow */}
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Receipt" component={ReceiptScreen} />

      {/* ✅ Profile */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      {/* ✅ Staff */}
      <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
      <Stack.Screen name="StaffVerify" component={StaffVerifyScreen} />
    </Stack.Navigator>
  );
}
