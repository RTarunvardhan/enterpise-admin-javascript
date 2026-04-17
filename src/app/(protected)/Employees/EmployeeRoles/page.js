// import CustomTable from "../../../../components/TableStructure/CustomTable";
// import { EMPLOYEES } from "../../../../data/employees";
// import { Box, Typography } from "@mui/material";

// export default function EmployeeRolesPage() {
//     const columns = [
//         { label: "Full Name", key: "fullName" },
//         { label: "Designation", key: "designation" },
//         { label: "Department", key: "department" },
//         { label: "Manager", key: "managerName" },
//         { label: "Contract", key: "contractType" },
//         { label: "Exp (Years)", key: "experienceYears" },
//     ];

//     return (
//         <Box>
//             <Typography variant="h5" mb={3}>Role & Hierarchy Management</Typography>
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
export default function EmployeeRolesPage() {
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
        "designation",
        "department",
        "managerName",
        "contractType",
        "experienceYears",
    ];

    // const EditableColumns = [
    //     "designation",
    //     "department",
    //     "managerName",
    //     "contractType",
    //     "experienceYears",
    // ]
    const EditableColumns = [
        {
            columnName: "designation",
            type: "string",
            minValue: null,
            maxValue: null,
        },
        {
            columnName: "department",
            type: "string",
            minValue: null,
            maxValue: null,
        },
        {
            columnName: "managerName",
            type: "string",
            minValue: 0,
            maxValue: 100,
        },
        {
            columnName: "contractType",
            type: "string",
            minValue: 0,
            maxValue: 100,
        },
        {
            columnName: "experienceYears",
            type: "number",
            minValue: 0,
            maxValue: 50,
        },
    ];


    const TableDropDowns = {
        department: [
            { value: "IT Services", label: "IT Services" },
            { value: "Human Resources", label: "Human Resources" },
            { value: "Digital Marketing", label: "Digital Marketing" },
            { value: "Financial Operations", label: "Financial Operations" },
            { value: "Product Management", label: "Product Management" }
        ],
        designation: [
            { value: "Senior Developer", label: "Senior Developer" },
            { value: "Junior Developer", label: "Junior Developer" },
            { value: "HR Specialist", label: "HR Specialist" },
            { value: "Business Analyst", label: "Business Analyst" },
            { value: "QA Engineer", label: "QA Engineer" },
            { value: "Project Lead", label: "Project Lead" },
            { value: "UX Designer", label: "UX Designer" }
        ]
    };

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
            <Typography variant="h5" mb={2}>Role & Hierarchy Management</Typography>
            <CustomTable
                data={filteredData}
                EditableColumns={EditableColumns}
                TableDropDowns={TableDropDowns}
            />
        </Box>
    );
}