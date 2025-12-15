import React, { useContext } from "react";
import { ThemeContext } from "../theme/ThemeProviderWrapper";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function ThemeToggle() {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
