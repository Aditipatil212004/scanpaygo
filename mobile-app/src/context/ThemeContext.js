import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

const LIGHT = {
  mode: "light",
  colors: {
    bg: "#FFFFFF",
    card: "#FFFFFF",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E5E7EB",
    primary: "#16A34A",
    header: "#FEF9C3", // profile yellow
  },
};

const DARK = {
  mode: "dark",
  colors: {
    bg: "#0B1220",
    card: "#111A2E",
    text: "#FFFFFF",
    muted: "#A5B4FC",
    border: "rgba(255,255,255,0.10)",
    primary: "#22C55E",
    header: "#0F172A",
  },
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("theme_mode");
      if (saved === "dark" || saved === "light") setMode(saved);
      setLoadingTheme(false);
    })();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    await AsyncStorage.setItem("theme_mode", newMode);
  };

  const setTheme = async (newMode) => {
    setMode(newMode);
    await AsyncStorage.setItem("theme_mode", newMode);
  };

  const value = useMemo(() => {
    const theme = mode === "dark" ? DARK : LIGHT;
    return {
      ...theme,
      mode,
      colors: theme.colors,
      toggleTheme,
      setTheme,
      loadingTheme,
    };
  }, [mode, loadingTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
