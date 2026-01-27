import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ NEW: store user in state
  const [user, setUser] = useState(null);

  // ✅ Auto check token + user when app starts
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (token) {
          setIsLoggedIn(true);
          setUser(savedUser ? JSON.parse(savedUser) : null);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Login: save token + user
  const login = async (token, userData) => {
    try {
      if (token) await AsyncStorage.setItem("token", token);

      if (userData) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        setUser(null);
      }

      setIsLoggedIn(true);
    } catch (e) {
      console.log("Login save error:", e);
    }
  };

  // ✅ NEW: update user instantly (used in Edit Profile)
  const updateUser = async (newUser) => {
    try {
      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } catch (e) {
      console.log("Update user error:", e);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
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
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
