// "use client";

// import { Box, Typography } from "@mui/material";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// export default function Sidebar({ close }) {
//   const router = useRouter();

//   const menu = [
//     { name: "Dashboard", path: "/GlobalDashboard" },
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       <Box
//         onClick={close}
//         sx={{
//           position: "fixed",
//           inset: 0,
//           bgcolor: "rgba(0,0,0,0.6)",
//           zIndex: 999,
//         }}
//       />

//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: -250 }}
//         animate={{ x: 0 }}
//         style={{
//           position: "fixed",
//           width: 240,
//           height: "100vh",

//           // 🔥 GLASS SIDEBAR
//           background: "rgba(17,24,39,0.7)",
//           backdropFilter: "blur(20px)",
//           borderRight: "1px solid rgba(255,255,255,0.1)",

//           zIndex: 1000,
//           padding: "20px",
//         }}
//       >
//         <Typography color="white" mb={3}>
//           Admin Panel
//         </Typography>

//         {menu.map((item) => (
//           <Box
//             key={item.name}
//             onClick={() => {
//               router.push(item.path);
//               close();
//             }}
//             sx={{
//               py: 1,
//               px: 2,
//               borderRadius: 2,
//               color: "#e5e7eb",
//               cursor: "pointer",
//               "&:hover": {
//                 bgcolor: "#1f2937",
//               },
//             }}
//           >
//             {item.name}
//           </Box>
//         ))}
//       </motion.div>
//     </>
//   );
// }

// "use client";

// import { Box, Typography, useTheme, alpha } from "@mui/material";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// export default function Sidebar({ close }) {
//   const router = useRouter();
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   const menu = [
//     { name: "Dashboard", path: "/GlobalDashboard" },
//     {
//       name: "Employees",
//       submenu: [
//         { name: "Employee Dashboard", path: "/EmployeeDashboard" },
//         { name: "Employee List", path: "/EmployeeList" },
//         { name: "Employee Roles", path: "/EmployeeRoles" },
//         { name: "Employee Management", path: "/EmployeeManagement" },
//         { name: "Employee Performance", path: "/EmployeePerformance" }
//       ]
//     }
//   ];

//   return (
//     <>
//       {/* Overlay: Slightly lighter in light mode to keep the "airy" feel */}
//       <Box
//         onClick={close}
//         sx={{
//           position: "fixed",
//           inset: 0,
//           bgcolor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
//           zIndex: 999,
//         }}
//       />

//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: -250 }}
//         animate={{ x: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         style={{
//           position: "fixed",
//           width: 240,
//           height: "100vh",

//           // 🔥 DYNAMIC GLASS SIDEBAR
//           // Deep slate for dark mode, frosted white for light mode
//           background: isDark
//             ? "rgba(17, 24, 39, 0.8)"
//             : "rgba(255, 255, 255, 0.8)",
//           backdropFilter: "blur(20px)",
//           borderRight: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.1)}`,

//           zIndex: 1000,
//           padding: "20px",
//         }}
//       >
//         <Typography
//           variant="h6"
//           fontWeight="bold"
//           sx={{
//             color: theme.palette.text.primary,
//             mb: 4,
//             letterSpacing: '0.5px'
//           }}
//         >
//           Admin Panel
//         </Typography>

//         {menu.map((item) => (
//           <Box
//             key={item.name}
//             onClick={() => {
//               router.push(item.path);
//               close();
//             }}
//             sx={{
//               py: 1.5,
//               px: 2,
//               mb: 1,
//               borderRadius: 2,
//               // Text color adapts to theme
//               color: theme.palette.text.primary,
//               fontWeight: 500,
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//               "&:hover": {
//                 // Darker gray in dark mode, light gray in light mode
//                 bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
//                 transform: "translateX(5px)", // Subtle 3D movement
//               },
//             }}
//           >
//             {item.name}
//           </Box>
//         ))}
//       </motion.div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { Box, Typography, useTheme, alpha, Collapse, Divider } from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { menuItems } from "../../data/menuItems"; // Import the data
import { startTransition } from "react";

const MotionBox = motion(Box);

export default function Sidebar({ close }) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Track open state for submenus
  const [openMenus, setOpenMenus] = useState(null);

  const toggleSubmenu = (name) => {
    setOpenMenus((prev) => (prev === name ? null : name));
  };

  const handleNavigation = (path) => {
    startTransition(() => {
      router.push(path);
    });
    close(); // Close sidebar on mobile/overlay
  };

  return (
    <>
      {/* Overlay */}
      <Box
        onClick={close}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
      />

      {/* Sidebar */}
      <MotionBox
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        sx={{
          position: "fixed",
          width: 260,
          height: 'calc(100vh - 60px)',
          background: isDark ? "rgba(10, 10, 10, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(25px)",
          borderRight: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.1)}`,
          zIndex: 1000,
          padding: "24px 16px",
          overflowY: "auto",
          mt: '60px',
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent", // Clean look
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(0, 0, 0, 0.4)",
          },
          // 🔥 Firefox Support
          scrollbarWidth: "thin",
          scrollbarColor: isDark
            ? "rgba(255, 255, 255, 0.3) transparent"
            : "rgba(0, 0, 0, 0.2) transparent",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: theme.palette.text.primary, mb: 1, px: 2 }}
        >
          Admin Panel
        </Typography>
        <Divider />

        {menuItems.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openMenus === item.name;

          return (
            <Box key={item.name} sx={{ mb: 1, }}>
              {/* Main Menu Item */}
              <Box
                onClick={() => hasSubmenu ? toggleSubmenu(item.name) : handleNavigation(item.path)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  bgcolor: isOpen ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Typography fontWeight={isOpen ? 600 : 500}>{item.name}</Typography>
                {hasSubmenu && (isOpen ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />)}
              </Box>

              {/* Submenu with Animation */}
              {hasSubmenu && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 0.5, ml: 2, borderLeft: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.1)}` }}>
                    {item.submenu.map((sub) => (
                      <Box
                        key={sub.name}
                        onClick={() => handleNavigation(sub.path)}
                        sx={{
                          py: 1,
                          px: 3,
                          my: 0.2,
                          borderRadius: '0 8px 8px 0',
                          fontSize: '0.875rem',
                          color: alpha(theme.palette.text.primary, 0.7),
                          cursor: "pointer",
                          "&:hover": {
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        {sub.name}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
      </MotionBox>
    </>
  );
}