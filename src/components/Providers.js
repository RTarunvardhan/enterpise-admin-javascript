// "use client";

// import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

/**
 * COMPONENT: Providers
 * -----------------------------------
 * INPUT:
 *  children (ReactNode)
 *
 * OUTPUT:
 *  Wrapped MUI theme
 *
 * PURPOSE:
 *  Prevent hydration issues + apply theme
 */

// const theme = createTheme({
//   palette: {
//     // mode: "dark", // 🔥 recommended for glass UI
//   },
// });

// export default function Providers({ children }) {
//   return (
//     <AppRouterCacheProvider>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </AppRouterCacheProvider>
//   );
// }

"use client";
import { useState, useMemo, createContext } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export default function Providers({ children }) {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}