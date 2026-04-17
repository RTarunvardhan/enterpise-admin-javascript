// "use client";

// import { useState } from "react";
// import { Box } from "@mui/material";
// import Sidebar from "./SideBar";
// import Topbar from "./TopBar";

// export default function LayoutWrapper({ children }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         width: "100%",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >

//       {/* 🔥 BACKGROUND IMAGE */}
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backgroundImage: "url('/globaldashboard.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           filter: "blur(12px)",   // 🔥 blur effect
//           transform: "scale(1.1)", // avoid edges
//           zIndex: -2,
//         }}
//       />

//       {/* 🔥 DARK OVERLAY */}
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(15,23,42,0.75)",
//           backdropFilter: "blur(6px)",
//           zIndex: -1,
//         }}
//       />

//       {/* SIDEBAR */}
//       {open && <Sidebar close={() => setOpen(false)} />}

//       {/* MAIN */}
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Topbar toggle={() => setOpen(true)} />

//         <Box
//           sx={{
//             flex: 1,
//             px: { xs: 2, md: 4 },
//             py: 3,
//             overflow: "auto",
//           }}
//         >
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Box, useTheme, alpha } from "@mui/material"; // Added alpha for glass effect
// import Sidebar from "./SideBar";
// import Topbar from "./TopBar";

// export default function LayoutWrapper({ children }) {
//   const [open, setOpen] = useState(false);
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   // Selection of background image from public folder
//   const bgImage = isDark ? "/bg-3.jpg" : "/bg-1.jpg";

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         width: "100%",
//         maxWidth: "100vw",     // 🔥 prevents page expansion
//         position: "relative",
//         overflowX: "hidden", // ✅ KEY FIX
//         overflowY: "hidden",
//         // Text color automatically flips based on theme mode
//         color: theme.palette.text.primary,
//       }}
//     >
//       {/* 🔥 DYNAMIC BACKGROUND IMAGE */}
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           filter: "blur(12px)",
//           transform: "scale(1.1)",
//           zIndex: -2,
//           transition: "background-image 0.5s ease-in-out", // Smooth transition
//         }}
//       />

//       {/* 🔥 DYNAMIC GLASS OVERLAY */}
//       <Box
//         sx={{
//           // position: "fixed",
//           // inset: 0,
//           // // Dark mode gets deep navy glass, Light mode gets frosty white glass
//           // background: isDark 
//           //   ? "rgba(15, 23, 42, 0.75)" 
//           //   : "rgba(255, 255, 255, 0.6)",
//           // backdropFilter: "blur(6px)",
//           // zIndex: -1,

//           position: "fixed",
//           inset: 0,
//           // CHANGED: From 0.75 navy to 0.45 neutral black/grey
//           background: isDark
//             ? "rgba(0, 0, 0, 0.45)"  // Less opacity, neutral black
//             : "rgba(255, 255, 255, 0.6)",
//           backdropFilter: "blur(6px)", // Slightly increased blur for better text readability
//           zIndex: -1,
//         }}
//       />

//       {/* SIDEBAR */}
//       {open && <Sidebar close={() => setOpen(false)} />}

//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Topbar toggle={() => setOpen(true)} />

//         <Box
//           sx={{
//             flex: 1,
//             px: { xs: 2, md: 2 },
//             py: 3,
//             overflowX: "hidden",   // ✅ only hide horizontal
//             overflowY: "auto",     // ✅ allow vertical scroll
//           }}
//         >
//           {/* Main Content Area with 3D Glass Card effect */}
//           <Box sx={{
//             p: 3,
//             borderRadius: 4,
//             background: alpha(isDark ? "#1e293b" : "#ffffff", isDark ? 0.4 : 0.7),
//             backdropFilter: "blur(10px)",
//             border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
//             boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
//           }}>
//             {children}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

"use client";

import { useState } from "react";
import { Box, useTheme, alpha } from "@mui/material";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";

// ─────────────────────────────────────────────────────────────
// MainLayout
//
// Layout structure (outermost → innermost):
//
//   [viewport 100vh]
//     ├─ fixed blurred background image
//     ├─ fixed dark/light glass overlay
//     ├─ optional Sidebar (absolute drawer)
//     └─ flex column: Topbar (64px) + scrollable content area
//          └─ glass card
//               └─ {children}   ← page content goes here
//
// KEY DECISIONS:
//   • The outer wrapper is overflow:hidden (no body-level scroll).
//   • The content area below the Topbar is overflow:hidden too —
//     scroll is handled inside CustomTable itself, not here.
//     This prevents a double-scrollbar situation.
// ─────────────────────────────────────────────────────────────
export default function LayoutWrapper({ children }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bgImage = isDark ? "/bg-3.jpg" : "/bg-12.jpg";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",         // no body scroll — table scrolls internally
        color: theme.palette.text.primary,
      }}
    >
      {/* ── blurred background image ─────────────────────── */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
          transform: "scale(1.1)",
          zIndex: -2,
          transition: "background-image 0.5s ease-in-out",
        }}
      />

      {/* ── glass overlay ────────────────────────────────── */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background: isDark ? "rgba(0,0,0,0.35)" : "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(6px)",
          zIndex: -1,
        }}
      />

      {/* ── sidebar (conditional) ────────────────────────── */}
      {open && <Sidebar close={() => setOpen(false)} />}

      {/* ── main column ──────────────────────────────────── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar — fixed 64 px ─────────────────────────── */}
        <Topbar toggle={() => setOpen(!open)} />

        {/* Content area — fills remaining height ──────────
            overflow:hidden here is intentional:
            CustomTable manages its own internal scroll.
            Padding gives breathing room around the card.     */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 2 },
            py: 3,
            pt:'70px',
            overflow: "hidden",      // ← do NOT set overflowY:"auto" here
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* glass card that wraps page content */}
          {/* <Box
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,       // ← required for flex children to shrink
              borderRadius: 4,
              background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
              boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
            }}
          > */}
            {children}
          {/* </Box> */}
        </Box>
      </Box>
    </Box>
  );
}