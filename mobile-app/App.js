import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { StoreProvider } from "./src/context/StoreContext";
import { CartProvider } from "./src/context/CartContext";
import { WalletProvider } from "./src/context/WalletContext"; // ✅ add
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
function RootNav() {
  const { colors, mode } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: mode === "dark",
        colors: {
          background: colors.bg,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
          notification: colors.primary,
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
export default function App() {
  return (
    
    <AuthProvider>
        <ThemeProvider>
      <StoreProvider>
        <CartProvider>
          <WalletProvider> 
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </WalletProvider>
        </CartProvider>
      </StoreProvider>
      </ThemeProvider>
    </AuthProvider>
       
  );
}
