"use client";

import { Box, Typography, useTheme, alpha } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { EMPLOYEES } from "../../../../data/employees";

export default function EmployeeDashboard() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(EMPLOYEES);
    }, []);

    // ─────────────────────────────────────────────
    // 📊 KPI CALCULATIONS
    // ─────────────────────────────────────────────
    const stats = useMemo(() => {
        const totalEmployees = data.length;

        const totalSalary = data.reduce((sum, e) => sum + e.salary, 0);
        const avgSalary = totalSalary / totalEmployees;

        const avgPerformance =
            data.reduce((sum, e) => sum + e.performanceScore, 0) /
            totalEmployees;

        const activeEmployees = data.filter(e => e.status === "Active").length;

        const deptCount = {};
        data.forEach(e => {
            deptCount[e.department] = (deptCount[e.department] || 0) + 1;
        });

        return {
            totalEmployees,
            avgSalary,
            avgPerformance,
            activeEmployees,
            deptCount,
        };
    }, [data]);

    // ─────────────────────────────────────────────
    // 🎨 CARD STYLE
    // ─────────────────────────────────────────────
    const cardStyle = {
        flex: "1 1 220px",
        minWidth: 220,
        height: 110,
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: alpha(isDark ? "#1e293b" : "#ffffff", 0.5),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    };

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
                gap: 2
            }}
        >
            <Typography variant="h5" mb={1}>Employee Dashboard</Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box sx={cardStyle}>
                    <Typography fontSize={12} opacity={0.6}>Total data</Typography>
                    <Typography fontSize={20} fontWeight={700}>
                        {stats.totalEmployees}
                    </Typography>
                </Box>
                <Box sx={cardStyle}>
                    <Typography fontSize={12} opacity={0.6}>Active data</Typography>
                    <Typography fontSize={20} fontWeight={700}>
                        {stats.activeEmployees}
                    </Typography>
                </Box>
                <Box sx={cardStyle}>
                    <Typography fontSize={12} opacity={0.6}>Avg Salary</Typography>
                    <Typography fontSize={20} fontWeight={700}>
                        ₹ {stats.avgSalary.toLocaleString("en-IN")}
                    </Typography>
                </Box>
                <Box sx={cardStyle}>
                    <Typography fontSize={12} opacity={0.6}>Avg Performance</Typography>
                    <Typography fontSize={20} fontWeight={700}>
                        {stats.avgPerformance.toFixed(1)}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        flex: "2 1 400px",
                        minHeight: 250,
                        borderRadius: 3,
                        p: 2,
                        background: alpha(isDark ? "#1e293b" : "#ffffff", 0.5),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Typography fontSize={13} fontWeight={600} mb={2}>
                        Department Distribution
                    </Typography>
                    {Object.entries(stats.deptCount).map(([dept, count]) => (
                        <Box key={dept} sx={{ mb: 1 }}>
                            <Typography fontSize={12}>{dept}</Typography>
                            <Box
                                sx={{
                                    height: 6,
                                    borderRadius: 2,
                                    background: alpha(theme.palette.primary.main, 0.2),
                                    mt: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${(count / stats.totalEmployees) * 100}%`,
                                        height: "100%",
                                        borderRadius: 2,
                                        background: theme.palette.primary.main,
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        flex: "1 1 300px",
                        minHeight: 250,
                        borderRadius: 3,
                        p: 2,
                        background: alpha(isDark ? "#1e293b" : "#ffffff", 0.5),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Typography fontSize={13} fontWeight={600} mb={2}>
                        Salary Insights
                    </Typography>
                    {data.slice(0, 5).map((e) => (
                        <Box key={e.id} sx={{ mb: 1 }}>
                            <Typography fontSize={11}>
                                {e.fullName}
                            </Typography>
                            <Typography fontSize={12} fontWeight={600}>
                                ₹ {e.salary.toLocaleString("en-IN")}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    borderRadius: 3,
                    p: 2,
                    background: alpha(isDark ? "#1e293b" : "#ffffff", 0.5),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Typography fontSize={13} fontWeight={600} mb={2}>
                    Performance Overview
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {data.slice(0, 12).map((e) => (
                        <Box
                            key={e.id}
                            sx={{
                                flex: "1 1 180px",
                                p: 1.5,
                                borderRadius: 2,
                                background: alpha(theme.palette.primary.main, 0.05),
                            }}
                        >
                            <Typography fontSize={11}>{e.fullName}</Typography>
                            <Typography fontSize={13} fontWeight={700}>
                                Score: {e.performanceScore}
                            </Typography>
                            <Box
                                sx={{
                                    height: 5,
                                    borderRadius: 2,
                                    mt: 0.5,
                                    background: alpha(theme.palette.primary.main, 0.2),
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${e.performanceScore}%`,
                                        height: "100%",
                                        borderRadius: 2,
                                        background: theme.palette.primary.main,
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}