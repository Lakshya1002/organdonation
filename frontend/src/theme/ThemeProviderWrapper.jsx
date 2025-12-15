// src/theme/ThemeProviderWrapper.jsx
import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme";

// Global context for theme
export const ThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
  primaryColor: "#1976d2",
  setPrimaryColor: () => {},
});

export default function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#1976d2");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () => createAppTheme(mode, primaryColor),
    [mode, primaryColor]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
