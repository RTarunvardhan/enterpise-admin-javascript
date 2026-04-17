// "use client";

// import { Box, InputBase, IconButton, Button } from "@mui/material";
// import { Menu } from "@mui/icons-material";
// import { useRouter } from "next/navigation";

// export default function Topbar({ toggle }) {
//   const router = useRouter();

//   return (
//     <Box
//       sx={{
//         height: 64,
//         px: 3,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",

//         // 🔥 GLASS EFFECT
//         background: "rgba(255,255,255,0.05)",
//         backdropFilter: "blur(12px)",
//         borderBottom: "1px solid rgba(255,255,255,0.1)",
//       }}
//     >
//       {/* Left */}
//       <IconButton onClick={toggle} sx={{ color: "#fff" }}>
//         <Menu />
//       </IconButton>

//       {/* Right */}
//       <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//         <InputBase
//           placeholder="Search..."
//           sx={{
//             px: 2,
//             py: 0.5,
//             borderRadius: 2,
//             bgcolor: "#1f2937",
//             color: "#fff",
//             width: 220,
//           }}
//         />

//         <Button
//           onClick={() => router.push("/SignIn")}
//           sx={{
//             bgcolor: "#ef4444",
//             color: "#fff",
//             borderRadius: 2,
//             textTransform: "none",
//             "&:hover": { bgcolor: "#dc2626" },
//           }}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Box>
//   );
// }

"use client";

import { Box, InputBase, IconButton, Button, useTheme, alpha } from "@mui/material";
import { Menu, LightMode, DarkMode } from "@mui/icons-material"; // Added icons
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ColorModeContext } from "../Providers"; // Import your toggle context
import { logoutUser } from "../../utils/auth";

export default function Topbar({ toggle }) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        zIndex: 1000,
        height: 60,
        px: 3,
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        // Glass effect that adapts to theme
        background: alpha(isDark ? "#0f172a" : "#ffffff", 0.1),
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
      }}
    >
      {/* Left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={toggle}
          sx={{ color: theme.palette.text.primary }}
        >
          <Menu />
        </IconButton>

        {/* THEME TOGGLE BUTTON */}
        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{ color: isDark ? "#fbbf24" : "#5d5d5d" }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>

      {/* Right */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <InputBase
          placeholder="Search..."
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            // Search bar turns dark in light mode for contrast
            bgcolor: isDark ? "#1f2937" : alpha("#000", 0.05),
            color: theme.palette.text.primary,
            width: 220,
            border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.1)}`,
          }}
        />

        <Button
          onClick={() => {
            logoutUser();        // 🔥 clear session
            router.push("/SignIn"); // redirect
          }}
          sx={{
            bgcolor: "#ef4444",
            color: "#fff",
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}