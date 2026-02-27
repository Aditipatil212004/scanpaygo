import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";



import PaymentScreen from "../screens/PaymentScreen";


import EditProfileScreen from "../screens/EditProfileScreen";

import StaffLoginScreen from "../screens/StaffLoginScreen";
import StaffVerifyScreen from "../screens/StaffVerifyScreen";
import ScannerScreen from "../screens/ScannerScreen";
import MapPickerScreen from "../screens/MapPickerScreen";


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
      <Stack.Screen name="MapPicker" component={MapPickerScreen} />
      

     
      {/* ✅ Orders Flow */}
     

      {/* ✅ Payment Flow */}
      <Stack.Screen name="Payment" component={PaymentScreen} />
      

      {/* ✅ Profile */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      {/* ✅ Staff */}
      <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
      <Stack.Screen name="StaffVerify" component={StaffVerifyScreen} />
    </Stack.Navigator>
  );
}
