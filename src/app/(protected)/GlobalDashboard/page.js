// "use client";

// import {
//   PieChart, Pie, Tooltip, ResponsiveContainer, Cell,
//   BarChart, Bar, XAxis, YAxis, AreaChart, Area, Legend, LineChart
// } from "recharts";

// import { Box, Paper, Typography } from "@mui/material";
// import { motion } from "framer-motion";

// const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// const weightedRoles = [
//   ...Array(40).fill("Developer"),
//   ...Array(20).fill("Tester"),
//   ...Array(10).fill("Manager"),
//   ...Array(20).fill("Senior Developer"),
//   ...Array(10).fill("Junior Tester"),
// ];

// const weightedDepartments = [
//   ...Array(50).fill("IT"),
//   ...Array(30).fill("HR"),
//   ...Array(20).fill("Finance"),
// ];

// const rows = Array.from({ length: 100 }, (_, i) => ({
//   id: i + 1,
//   name: `User ${i + 1}`,
//   position: getRandom(weightedRoles),
//   department: getRandom(weightedDepartments),
//   salary: Math.floor(Math.random() * 50000) + 30000, // 💰
//   experience: Math.floor(Math.random() * 10) + 1, // 📈 years
//   gender: getRandom(["Male", "Female"]),
//   joinMonth: `M${Math.floor(Math.random() * 12) + 1}`, // 📅
// }));

// const salaryRange = [
//   { range: "30k-50k", value: rows.filter(r => r.salary <= 50000).length },
//   { range: "50k-70k", value: rows.filter(r => r.salary > 50000 && r.salary <= 70000).length },
//   { range: "70k+", value: rows.filter(r => r.salary > 70000).length },
// ];

// const hiringTrend = Object.values(
//   rows.reduce((acc, curr) => {
//     if (!acc[curr.joinMonth]) {
//       acc[curr.joinMonth] = { name: curr.joinMonth, hires: 0 };
//     }
//     acc[curr.joinMonth].hires++;
//     return acc;
//   }, {})
// );

// const avgSalaryDept = Object.values(
//   rows.reduce((acc, curr) => {
//     if (!acc[curr.department]) {
//       acc[curr.department] = { name: curr.department, total: 0, count: 0 };
//     }
//     acc[curr.department].total += curr.salary;
//     acc[curr.department].count++;
//     return acc;
//   }, {})
// ).map(d => ({
//   name: d.name,
//   avg: Math.round(d.total / d.count),
// }));

// const dept = Object.values(
//   rows.reduce((a, c) => {
//     if (!a[c.department]) a[c.department] = { name: c.department, value: 0 };
//     a[c.department].value++;
//     return a;
//   }, {})
// );

// const roles = Object.values(
//   rows.reduce((a, c) => {
//     if (!a[c.position]) a[c.position] = { name: c.position, count: 0 };
//     a[c.position].count++;
//     return a;
//   }, {})
// );
// const totalEmployees = rows.length;

// const totalDepartments = new Set(rows.map(r => r.department)).size;

// const totalRoles = new Set(rows.map(r => r.position)).size;
// const kpiData = [
//   { label: "Employees", value: totalEmployees },
//   { label: "Departments", value: totalDepartments },
//   { label: "Roles", value: totalRoles },
// ];

// const glassStyle = {
//   p: 3,
//   flex: 1,
//   minWidth: 300,
//   background: "rgba(255,255,255,0.08)",
//   backdropFilter: "blur(16px)",
//   border: "1px solid rgba(255,255,255,0.1)",
//   borderRadius: 4,
// };

// const COLORS = ["#6366f1", "#06b6d4", "#f97316"];

// export default function Dashboard() {
//   return (
//     <Box>

//       <Typography color="#fff" variant="h5" mb={3}>
//         Dashboard
//       </Typography>

//       {/* KPI */}
//       <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
//         {kpiData.map((item, i) => (
//           <motion.div key={i} whileHover={{ scale: 1.05 }}>
//             <Paper
//               sx={{
//                 p: 3,
//                 borderRadius: 4,
//                 minWidth: 220,

//                 // 🔥 GLASS CARD
//                 background: "rgba(255,255,255,0.1)",
//                 backdropFilter: "blur(16px)",
//                 border: "1px solid rgba(255,255,255,0.1)",

//                 color: "#fff",
//               }}
//             >
//               <Typography sx={{ color: "#9ca3af" }}>
//                 {item.label}
//               </Typography>

//               <Typography variant="h5" >
//                 {item.value}
//               </Typography>
//             </Paper>
//           </motion.div>
//         ))}
//       </Box>

//       {/* CHARTS */}
//       <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>

//         <Paper sx={{
//           p: 3, flex: 1, minWidth: 300, //bgcolor: "#111827" ,
//           background: "rgba(255,255,255,0.1)",
//           backdropFilter: "blur(16px)",
//           border: "1px solid rgba(255,255,255,0.1)",
//         }}>
//           <Typography color="#fff">Departments</Typography>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie data={dept} dataKey="value" innerRadius={60}>
//                 {dept.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Paper>

//         <Paper sx={{
//           p: 3,
//           flex: 1,
//           minWidth: 300,
//           background: "rgba(255,255,255,0.1)",
//           backdropFilter: "blur(16px)",
//           border: "1px solid rgba(255,255,255,0.1)",
//         }}>
//           <Typography sx={{ color: "#fff", mb: 2 }}>
//             Employees by Role
//           </Typography>

//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={roles}>
//               <XAxis
//                 dataKey="name"
//                 stroke="#aaa"
//                 tick={{ fontSize: 12 }}
//               />
//               <YAxis stroke="#aaa" />
//               <Tooltip />
//               <Bar
//                 dataKey="count"
//                 fill="#6366f1"
//                 radius={[8, 8, 0, 0]} // 🔥 rounded bars
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </Paper>

//         <Paper sx={{
//           p: 3,
//           flex: 1,
//           minWidth: 300,
//           background: "rgba(255,255,255,0.1)",
//           backdropFilter: "blur(16px)",
//           border: "1px solid rgba(255,255,255,0.1)",
//         }}>
//           <Typography sx={{ color: "#fff", mb: 2 }}>
//             Employees by Department
//           </Typography>

//           <ResponsiveContainer width="100%" height={250}>
//             <AreaChart data={dept}>

//               {/* 🔥 Gradient */}
//               <defs>
//                 <linearGradient id="deptGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               <XAxis
//                 dataKey="name"
//                 stroke="#aaa"
//                 tick={{ fontSize: 12 }}
//               />
//               <YAxis stroke="#aaa" />
//               <Tooltip />

//               <Area
//                 type="monotone"
//                 dataKey="value"   // 🔥 IMPORTANT (dept uses value, not count)
//                 stroke="#06b6d4"
//                 fill="url(#deptGradient)"
//                 strokeWidth={2}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </Paper>

//       </Box>

//       <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
//         {[
//           { title: "Active Users", value: 78 },
//           { title: "New Joinees", value: 12 },
//           { title: "Attrition", value: 5 },
//         ].map((item, i) => (
//           <Paper
//             key={i}
//             sx={{
//               p: 2,
//               minWidth: 180,
//               background: "rgba(255,255,255,0.08)",
//               backdropFilter: "blur(12px)",
//               borderRadius: 3,
//               color: "#fff",
//             }}
//           >
//             <Typography sx={{ color: "#9ca3af", fontSize: 12 }}>
//               {item.title}
//             </Typography>
//             <Typography variant="h6">{item.value}</Typography>
//           </Paper>
//         ))}
//       </Box>



//     </Box>
//   );
// }

"use client";

import {
    PieChart, Pie, Tooltip, ResponsiveContainer, Cell,
    BarChart, Bar, XAxis, YAxis, AreaChart, Area
} from "recharts";

import { Box, Paper, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

// ... (Your data generation logic remains the same) ...

const COLORS = ["#6366f1", "#06b6d4", "#f97316"];

export default function Dashboard() {

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const weightedRoles = [
        ...Array(40).fill("Developer"),
        ...Array(20).fill("Tester"),
        ...Array(10).fill("Manager"),
        ...Array(20).fill("Senior Developer"),
        ...Array(10).fill("Junior Tester"),
    ];

    const weightedDepartments = [
        ...Array(50).fill("IT"),
        ...Array(30).fill("HR"),
        ...Array(20).fill("Finance"),
    ];

    const rows = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        position: getRandom(weightedRoles),
        department: getRandom(weightedDepartments),
        salary: Math.floor(Math.random() * 50000) + 30000, // 💰
        experience: Math.floor(Math.random() * 10) + 1, // 📈 years
        gender: getRandom(["Male", "Female"]),
        joinMonth: `M${Math.floor(Math.random() * 12) + 1}`, // 📅
    }));

    const salaryRange = [
        { range: "30k-50k", value: rows.filter(r => r.salary <= 50000).length },
        { range: "50k-70k", value: rows.filter(r => r.salary > 50000 && r.salary <= 70000).length },
        { range: "70k+", value: rows.filter(r => r.salary > 70000).length },
    ];

    const hiringTrend = Object.values(
        rows.reduce((acc, curr) => {
            if (!acc[curr.joinMonth]) {
                acc[curr.joinMonth] = { name: curr.joinMonth, hires: 0 };
            }
            acc[curr.joinMonth].hires++;
            return acc;
        }, {})
    );

    const avgSalaryDept = Object.values(
        rows.reduce((acc, curr) => {
            if (!acc[curr.department]) {
                acc[curr.department] = { name: curr.department, total: 0, count: 0 };
            }
            acc[curr.department].total += curr.salary;
            acc[curr.department].count++;
            return acc;
        }, {})
    ).map(d => ({
        name: d.name,
        avg: Math.round(d.total / d.count),
    }));

    const dept = Object.values(
        rows.reduce((a, c) => {
            if (!a[c.department]) a[c.department] = { name: c.department, value: 0 };
            a[c.department].value++;
            return a;
        }, {})
    );

    const roles = Object.values(
        rows.reduce((a, c) => {
            if (!a[c.position]) a[c.position] = { name: c.position, count: 0 };
            a[c.position].count++;
            return a;
        }, {})
    );
    const totalEmployees = rows.length;

    const totalDepartments = new Set(rows.map(r => r.department)).size;

    const totalRoles = new Set(rows.map(r => r.position)).size;
    const kpiData = [
        { label: "Employees", value: totalEmployees },
        { label: "Departments", value: totalDepartments },
        { label: "Roles", value: totalRoles },
    ];


    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Dynamic Styles based on Theme
    const glassEffect = {
        p: 3,
        borderRadius: 4,
        // Adjust opacity: darker in Light mode to stand out, lighter in Dark mode for glow
        background: alpha(isDark ? "#ffffff" : "#ffffff", isDark ? 0.08 : 0.4),
        backdropFilter: "blur(16px)",
        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
        boxShadow: isDark ? "none" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        transition: "all 0.3s ease",
    };

    const chartLabelColor = isDark ? "#9ca3af" : "#4b5563";

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
            <Typography
                variant="h5"
                mb={3}
                sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
            >
                Dashboard Overview
            </Typography>

            {/* KPI SECTION */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {kpiData.map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.05 }} style={{ flex: 1, minWidth: '200px' }}>
                        <Paper sx={{ ...glassEffect, p: 3, minWidth: 200 }}>
                            <Typography sx={{ color: chartLabelColor, fontSize: "0.875rem", fontWeight: 500 }}>
                                {item.label}
                            </Typography>
                            <Typography variant="h4" sx={{ color: theme.palette.text.primary, mt: 1, fontWeight: "bold" }}>
                                {item.value}
                            </Typography>
                        </Paper>
                    </motion.div>
                ))}
            </Box>

            {/* MAIN CHARTS SECTION */}
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>

                {/* PIE CHART */}
                <Paper sx={{ ...glassEffect, flex: 1, minWidth: 300, height: 290 }}>
                    <Typography sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 500 }}>
                        Department Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={dept} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                {dept.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: theme.palette.text.primary
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>

                {/* BAR CHART */}
                <Paper sx={{ ...glassEffect, flex: 1, minWidth: 300, height: 290 }}>
                    <Typography sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 500 }}>
                        Employees by Role
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={roles}>
                            <XAxis dataKey="name" stroke={chartLabelColor} tick={{ fontSize: 10 }} />
                            <YAxis stroke={chartLabelColor} tick={{ fontSize: 10 }} />
                            <Tooltip cursor={{ fill: alpha('#fff', 0.1) }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>

                {/* AREA CHART */}
                <Paper sx={{ ...glassEffect, flex: 1, minWidth: 300, height: 290 }}>
                    <Typography sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 500 }}>
                        Hiring Momentum
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={dept}>
                            <defs>
                                <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke={chartLabelColor} tick={{ fontSize: 10 }} />
                            <YAxis stroke={chartLabelColor} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#06b6d4"
                                fillOpacity={1}
                                fill="url(#colorDept)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>

            {/* BOTTOM MINI STATS */}
            <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
                {[
                    { title: "Active Users", value: 78, color: "#10b981" },
                    { title: "New Joinees", value: 12, color: "#3b82f6" },
                    { title: "Attrition", value: 5, color: "#ef4444" },
                ].map((item, i) => (
                    <Paper
                        key={i}
                        sx={{
                            ...glassEffect,
                            p: 2,
                            minWidth: 150,
                            flex: 1,
                        }}
                    >
                        <Typography sx={{ color: chartLabelColor, fontSize: 12, fontWeight: 600 }}>
                            {item.title}
                        </Typography>
                        <Typography variant="h5" sx={{ color: item.color, fontWeight: "bold" }}>
                            {item.value}%
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}