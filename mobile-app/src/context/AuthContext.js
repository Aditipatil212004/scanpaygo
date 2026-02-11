import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // 🔄 Load saved session on app start
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        const savedRole = await AsyncStorage.getItem("role");

        if (token && savedUser) {
          setIsLoggedIn(true);
          setUser(JSON.parse(savedUser));
          setRole(savedRole || "customer");
        }
      } catch (e) {
        console.log("Session load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // ✅ Login
  const login = async (token, userData) => {
    try {
      const userRole = userData?.role || "customer";

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("role", userRole);

      setUser(userData);
      setRole(userRole);
      setIsLoggedIn(true);
    } catch (e) {
      console.log("Login save error:", e);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user", "role"]);
      setIsLoggedIn(false);
      setUser(null);
      setRole(null);
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isLoggedIn,
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
