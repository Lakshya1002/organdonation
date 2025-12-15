// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

/**
 * Generates a complete MUI theme based on mode + primary color
 */
export function createAppTheme(mode = "light", primaryColor = "#1976d2") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: mode === "light" ? "#f5f7fa" : "#0f0f0f",
        paper: mode === "light" ? "#ffffff" : "#1a1a1a",
      },
    },

    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
          },
        },
      },
    },
  });
}
