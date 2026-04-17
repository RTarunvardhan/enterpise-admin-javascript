// 'use client';

// import { Box, Typography, alpha } from "@mui/material";

// export default function TableStats({
//     sortedData,
//     allPageSelected,
//     EnableCheckboxFlag,
//     theme,
//     isDark
// }) {
//     const selectedCount = sortedData.filter((row) =>
//         allPageSelected.includes(Number(row.SR_NO))
//     ).length;

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 px: 2,
//                 py: 1,
//                 // Optional styling to make it look connected to the table
//                 bgcolor: alpha(theme.palette.background.paper, 0.4),
//                 borderTop: `1px solid ${theme.palette.divider}`,
//                 borderBottomLeftRadius: 8,
//                 borderBottomRightRadius: 8,
//             }}
//         >
//             {/* LEFT SIDE: Selected Count */}
//             <Box>
//                 {EnableCheckboxFlag && selectedCount > 0 ? (
//                     <Typography
//                         variant="caption"
//                         sx={{ fontWeight: 600, color: theme.palette.primary.main }}
//                     >
//                         Total Selected: {selectedCount}
//                     </Typography>
//                 ) : (
//                     <Box /> // Keeps the flex layout balanced
//                 )}
//             </Box>

//             {/* RIGHT SIDE: Row Count */}
//             <Typography
//                 variant="caption"
//                 sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
//             >
//                 Row count: {sortedData.length}
//             </Typography>
//         </Box>
//     );
// }

"use client";

import { Box, Typography, alpha } from "@mui/material";

// ─────────────────────────────────────────────────────────────────────────────
// TableStats — row count + selected count bar below the table
// ─────────────────────────────────────────────────────────────────────────────
export default function TableStats({
    sortedData,
    allPageSelected,
    EnableCheckboxFlag,
    theme,
    isDark,
}) {
    const selectedSet = new Set(allPageSelected);
    const selectedCount = sortedData.filter((row) => selectedSet.has(Number(row.SR_NO))).length;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: "6px",
                flexShrink: 0,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
            }}
        >
            {/* Left: selection count */}
            <Box>
                {EnableCheckboxFlag && selectedCount > 0 ? (
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, fontSize: 11, color: theme.palette.primary.main }}
                    >
                        {selectedCount} selected
                    </Typography>
                ) : (
                    <Box />
                )}
            </Box>

            {/* Right: total row count */}
            <Typography
                variant="caption"
                sx={{ fontSize: 11, fontWeight: 500, color: theme.palette.text.secondary }}
            >
                {sortedData.length} row{sortedData.length !== 1 ? "s" : ""}
            </Typography>
        </Box>
    );
}