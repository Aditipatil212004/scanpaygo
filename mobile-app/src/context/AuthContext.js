import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        const savedRole = await AsyncStorage.getItem("role");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log("Session load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (newToken, userData) => {
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("role", userData.role);

    setToken(newToken);
    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);
  };
// ADD THIS FUNCTION

const updateUser = async (newUser) => {
  try {
    const mergedUser = { ...user, ...newUser };

    setUser(mergedUser);
    await AsyncStorage.setItem("user", JSON.stringify(mergedUser));
  } catch (e) {
    console.log("Update user error:", e);
  }
};

  
  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user", "role"]);
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isLoggedIn,
        user,
        role,
        token,
        login,
        logout,
        updateUser, // ⭐ IMPORTANT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
