// import CustomTable from "../../../../components/TableStructure/CustomTable";
// import { EMPLOYEES } from "../../../../data/employees";
// import { Box, Typography } from "@mui/material";

// export default function EmployeeManagementPage() {
// const columns = [
//     { label: "Full Name", key: "fullName" },
//     { label: "PAN Card", key: "panCard" },
//     { label: "Bank Account", key: "accountNumber" },
//     { label: "Blood Group", key: "bloodGroup" },
//     { label: "DOB", key: "dateOfBirth" },
//     { label: "Emergency Contact", key: "emergencyContact" },
// ];

//     return (
//         <Box>
//             <Typography variant="h5" mb={3}>HR Administrative Portal</Typography>
//             <CustomTable data={EMPLOYEES} columns={columns} />
//         </Box>
//     );
// }
"use client";

import CustomTable from "../../../../components/TableStructure/CustomTable";
import { EMPLOYEES } from "../../../../data/employees";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import { useState, useMemo, useEffect, useRef } from "react";
import GlobalLoader from "../../../../components/Loaders/GlobalLoader"

// ─────────────────────────────────────────────────────────────
// CustomTable derives all columns automatically from the JSON
// shape of EMPLOYEES. No `columns` prop is needed or accepted.
// ─────────────────────────────────────────────────────────────
export default function EmployeeManagementPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [screenLoading, setScreenLoading] = useState(true);
    // Screen Loading
    useEffect(() => {
        if (!screenLoading) return;

        const isReady =
            EMPLOYEES.length > 0;

        if (isReady) {
            setScreenLoading(false);
        }
    }, [screenLoading]);

    const columns = [
        "fullName",
        "panCard",
        "accountNumber",
        "bloodGroup",
        "dateOfBirth",
        "emergencyContact",
    ];

    const filteredData = useMemo(() => {
        return EMPLOYEES.map((row) => {
            const newRow = {};

            columns.forEach((key) => {
                newRow[key] = row[key];
            });

            return newRow;
        });
    }, []);

    return (
        <Box
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
        >
            <GlobalLoader open={screenLoading} />
            <Typography variant="h5" mb={2}>HR Administrative Portal</Typography>
            <CustomTable data={filteredData} />
        </Box>
    );
}