'use clients';

import React, { useMemo, useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    Box,
    useTheme,
    alpha
} from "@mui/material";

export default function DefaultCustomTable({
    tableHeight = "calc(100vh - 250px)",
    columnCount = 10
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const headerBg = isDark ? "#1e293b" : "#e2e8f0";

    // Create an array for columns: ["Column 1", "Column 2", ...]
    const dummyColumns = Array.from({ length: columnCount }, (_, i) => `Column ${i + 1}`);

    const [rowCount, setRowCount] = React.useState(15);

    useEffect(() => {
        const updateRows = () => {
            const approxRowHeight = 36;
            const vh = window.innerHeight;
            const rows = Math.max(8, Math.floor((vh - 200) / approxRowHeight));
            setRowCount(rows);
        };       

        updateRows();
        window.addEventListener("resize", updateRows);

        return () => window.removeEventListener("resize", updateRows);
    }, []);

    // Create an array for rows
    // const dummyRows = Array.from({ length: rowCount }, (_, i) => i);

    // const rowCount = useMemo(() => {
    //     const approxRowHeight = 36;
    //     const vh = window.innerHeight;
    //     return Math.max(8, Math.floor((vh - 300) / approxRowHeight));
    // }, []);

    return (
        <TableContainer
            component={Paper}
            sx={{
                flex: 1,
                minHeight: 0,
                height: "100%", // Takes available height from parent
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
                overflow: "auto",
            }}
        >
            <Table stickyHeader size="small" sx={{ tableLayout: "fixed" }}>
                <TableHead>
                    <TableRow>
                        {/* Checkbox Placeholder */}
                        <TableCell
                            sx={{
                                width: "32px",
                                bgcolor: headerBg,
                                borderRight: `2px solid ${alpha(theme.palette.divider, 0.25)}`,
                            }}
                        >
                            <Skeleton variant="rectangular" width={18} height={18} />
                        </TableCell>

                        {/* Column Placeholders */}
                        {dummyColumns.map((col, index) => (
                            <TableCell
                                key={index}
                                sx={{
                                    bgcolor: headerBg,
                                    fontWeight: 700,
                                    fontSize: 12,
                                    color: theme.palette.text.secondary,
                                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                }}
                            >
                                {col}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i}>
                            {/* Checkbox Cell */}
                            <TableCell sx={{ width: "32px", borderRight: `2px solid ${alpha(theme.palette.divider, 0.1)}`, alignContent:'center' }}>
                                <Skeleton variant="rectangular" width={16} height={16} sx={{ margin: "auto", alignItems:"center" }} />
                            </TableCell>

                            {/* Data Cells */}
                            {dummyColumns.map((_, colIdx) => (
                                <TableCell key={colIdx}>
                                    <Skeleton variant="text" width="80%" height={20} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};