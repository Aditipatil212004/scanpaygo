import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const colors = mode === "dark"
    ? {
        bg: "#0F172A",
        card: "#1E293B",
        text: "#FFFFFF",
        border: "#334155",
        primary: "#22C55E",
        muted: "#94A3B8",
      }
    : {
        bg: "#FFFFFF",
        card: "#F8FAFC",
        text: "#0F172A",
        border: "#E2E8F0",
        primary: "#16A34A",
        muted: "#64748B",
      };

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
