import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SplashScreen from "../screens/SplashScreen";
import AddressesScreen from "../screens/AddressesScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import WalletScreen from "../screens/WalletScreen";
import AddMoneyScreen from "../screens/AddMoneyScreen";

import PaymentScreen from "../screens/PaymentScreen";
import ReceiptScreen from "../screens/ReceiptScreen";
import WalletHistoryScreen from "../screens/WalletHistoryScreen";
import ShareAppScreen from "../screens/ShareAppScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import ContactSupportScreen from "../screens/ContactSupportScreen";
import AccountPrivacyScreen from "../screens/AccountPrivacyScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsScreen from "../screens/TermsScreen";
import NotificationPreferencesScreen from "../screens/NotificationPreferencesScreen";
import AppearanceScreen from "../screens/AppearanceScreen";












import BottomTabs from "./BottomTabs";
import EditProfileScreen from "../screens/EditProfileScreen";
import SelectStoreFirstScreen from "../screens/SelectStoreFirstScreen";


import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading, isLoggedIn } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          {/* ✅ Main Tabs */}
          <Stack.Screen name="Main" component={BottomTabs} />

          {/* ✅ Add screens which open from anywhere */}
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
          <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          <Stack.Screen name="SelectStoreFirst" component={SelectStoreFirstScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
<Stack.Screen name="AddMoney" component={AddMoneyScreen} />

<Stack.Screen name="Payment" component={PaymentScreen} />
<Stack.Screen name="Receipt" component={ReceiptScreen} />
<Stack.Screen name="WalletHistory" component={WalletHistoryScreen} />
<Stack.Screen name="ShareApp" component={ShareAppScreen} />
<Stack.Screen name="AboutUs" component={AboutUsScreen} />
<Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
<Stack.Screen name="Privacy" component={AccountPrivacyScreen} />
<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
<Stack.Screen name="Terms" component={TermsScreen} />
<Stack.Screen name="Notifications" component={NotificationPreferencesScreen} />
<Stack.Screen name="Appearance" component={AppearanceScreen} />












        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
