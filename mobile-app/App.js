import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";


import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { StoreProvider } from "./src/context/StoreContext";
import { CartProvider } from "./src/context/CartContext";
import { WalletProvider } from "./src/context/WalletContext";
import { ThemeProvider } from "./src/context/ThemeContext";

const linking = {
  prefixes: ["scanpay://"],
  config: {
    screens: {
      Receipt: "receipt",
    },
  },
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StoreProvider>
          <CartProvider>
            <WalletProvider>
              <NavigationContainer linking={linking}>
                <AppNavigator />
              </NavigationContainer>
            </WalletProvider>
          </CartProvider>
        </StoreProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
