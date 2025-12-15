import React from "react";
import { Box, Typography } from "@mui/material";

export default function Unauthorized() {
  return (
    <Box className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h3" color="error">
        403 - Unauthorized
      </Typography>
      <Typography variant="subtitle1">
        You do not have permission to access this page.
      </Typography>
    </Box>
  );
}
