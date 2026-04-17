import { createTheme } from "@mui/material/styles";

import { useTheme } from "@mui/material";

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: "#3f51b5",
      },
      // MUI automatically sets text.primary to black in light and white in dark
    },
    // Custom property to access image paths in components
    customBackgrounds: {
      light: "/bg-1.jpg", // Ensure these are in your /public folder
      dark: "/bg-3.jpg",
    }
  });

