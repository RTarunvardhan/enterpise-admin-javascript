// import CustomTable from "../../../../components/TableStructure/CustomTable";
// import { EMPLOYEES } from "../../../../data/employees";
// import { Box, Typography } from "@mui/material";

// export default function EmployeePerformancePage() {
//   const columns = [
//     { label: "Full Name", key: "fullName" },
//     { label: "Performance Score", key: "performanceScore" },
//     { label: "Rating", key: "rating" },
//     { label: "Projects Completed", key: "projectsCompleted" },
//     { label: "Attendance %", key: "attendance" },
//     { label: "Last Promotion", key: "lastPromotion" },
//   ];

//   return (
//     <Box>
//       <Typography variant="h5" mb={3}>Performance Analytics</Typography>
//       <CustomTable data={EMPLOYEES} columns={columns} />
//     </Box>
//   );
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
export default function EmployeePerformancePage() {
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
    "performanceScore",
    "rating",
    "projectsCompleted",
    "attendance",
    "lastPromotionDate",
    "salary",
    "annualBonus"
  ];

  // const EditableColumns = [
  //   "performanceScore",
  //   "rating",
  //   "projectsCompleted",
  //   "attendance",
  //   "lastPromotionDate",
  //   "salary",
  //   "annualBonus"
  // ]

  const EditableColumns = [
    {
      columnName: "performanceScore",
      type: "number",
      minValue: 0,
      maxValue: 100,
    },
    {
      columnName: "rating",
      type: "float",
      minValue: 0,
      maxValue: 10,
    },
    {
      columnName: "projectsCompleted",
      type: "number",
      minValue: 0,
      maxValue: 100,
    },
    {
      columnName: "attendance",
      type: "percentage",
      minValue: 0,
      maxValue: 100,
    },
    {
      columnName: "lastPromotionDate",
      type: "date",
      minValue: null,
      maxValue: Date.now(),
    },
    {
      columnName: "salary",
      type: "currency",
      minValue: 0,
      maxValue: 10000000,
    },
    {
      columnName: "annualBonus",
      type: "currency",
      minValue: 0,
      maxValue: 5000000,
    },
  ];

  const TotalTableColumnValueCount = ["salary", "annualBonus"];

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
      <Typography variant="h5" mb={2}>Performance Analytics</Typography>
      <CustomTable
        data={filteredData}
        EditableColumns={EditableColumns}
        TotalTableColumnValueCount={TotalTableColumnValueCount}
      />
    </Box>
  );
}