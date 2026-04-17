// import { TRANSACTIONS_1 } from "../../../../data/transactions";
// import { Box, Typography, TextField, Chip } from "@mui/material";

// const statusColor = {
//     Success: "success",
//     Pending: "warning",
//     Failed: "error",
// };

// export default function TransactionManagement() {
//     return (
//         <Box sx={{ p: 3 }}>
//             {/* HEADER */}
//             <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 Transaction Management
//             </Typography>

//             {/* SEARCH BAR */}
//             <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <TextField fullWidth label="Search transaction, customer..." size="small" />
//                 <TextField label="Status" size="small" />
//             </Box>

//             {/* MAIN LAYOUT */}
//             <Box sx={{ display: "flex", gap: 3, mt: 3 }}>

//                 {/* LEFT - INSIGHTS PANEL */}
//                 <Box
//                     sx={{
//                         width: 280,
//                         p: 2,
//                         borderRadius: 3,
//                         backdropFilter: "blur(12px)",
//                         background: "rgba(255,255,255,0.08)",
//                         border: "1px solid rgba(255,255,255,0.1)",
//                     }}
//                 >
//                     <Typography variant="subtitle1">Overview</Typography>

//                     <Box sx={{ mt: 2 }}>
//                         <Typography variant="body2">Total Transactions</Typography>
//                         <Typography variant="h6">2000+</Typography>
//                     </Box>

//                     <Box sx={{ mt: 2 }}>
//                         <Typography variant="body2">Revenue</Typography>
//                         <Typography variant="h6">₹ 12.4L</Typography>
//                     </Box>

//                     <Box sx={{ mt: 2 }}>
//                         <Typography variant="body2">Failed Payments</Typography>
//                         <Typography variant="h6" color="error">134</Typography>
//                     </Box>
//                 </Box>

//                 {/* RIGHT - TRANSACTION FEED */}
//                 <Box sx={{ flex: 1, maxHeight: "70vh", overflow: "auto" }}>
//                     {TRANSACTIONS_1.slice(0, 100).map((tx) => (
//                         <Box
//                             key={tx.id}
//                             sx={{
//                                 mb: 2,
//                                 p: 2,
//                                 borderRadius: 3,
//                                 backdropFilter: "blur(10px)",
//                                 background: "rgba(255,255,255,0.05)",
//                                 border: "1px solid rgba(255,255,255,0.08)",
//                                 transition: "0.3s",
//                                 "&:hover": {
//                                     transform: "scale(1.01)",
//                                     background: "rgba(255,255,255,0.08)",
//                                 },
//                             }}
//                         >
//                             {/* TOP ROW */}
//                             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                                 <Typography sx={{ fontWeight: 600 }}>
//                                     {tx.transactionId}
//                                 </Typography>

//                                 <Chip
//                                     label={tx.paymentStatus}
//                                     color={statusColor[tx.paymentStatus]}
//                                     size="small"
//                                 />
//                             </Box>

//                             {/* MIDDLE */}
//                             <Box
//                                 sx={{
//                                     mt: 1,
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     flexWrap: "wrap",
//                                 }}
//                             >
//                                 <Typography variant="body2">
//                                     👤 {tx.customerName}
//                                 </Typography>

//                                 <Typography variant="body2">
//                                     💳 {tx.paymentMethod}
//                                 </Typography>

//                                 <Typography variant="body2">
//                                     📍 {tx.storeLocation}
//                                 </Typography>
//                             </Box>

//                             {/* BOTTOM */}
//                             <Box
//                                 sx={{
//                                     mt: 1.5,
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                     ₹ {tx.finalAmount}
//                                 </Typography>

//                                 <Typography variant="caption" color="text.secondary">
//                                     {tx.transactionDate}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                     ))}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

'use client';

import {
    Box,
    Typography,
    TextField,
    Chip,
    useTheme,
    Grid,
    InputAdornment,
    Avatar,
    IconButton
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { TRANSACTIONS_1 } from "../../../../data/transactions";

const statusConfig = {
    Success: { color: "success", label: "Completed" },
    Pending: { color: "warning", label: "In Review" },
    Failed: { color: "error", label: "Declined" },
};

export default function ModernTransactionManagement() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Reusable Glass Style
    const glassStyle = {
        backdropFilter: "blur(20px) saturate(180%)",
        background: isDark
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha("#fff", 0.6),
        border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
    };

    return (
        <Box sx={{ p: 4, minHeight: "100vh", background: isDark ? "#0a0a0a" : "#f5f7fa" }}>

            {/* HEADER SECTION */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Transactions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage and monitor real-time financial flows across D-Mart stores.
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48, boxShadow: 3 }}>
                    AD
                </Avatar>
            </Box>

            {/* SEARCH & FILTERS */}
            <Box sx={{
                mb: 4,
                display: "flex",
                gap: 2,
                p: 2,
                borderRadius: 4,
                ...glassStyle
            }}>
                <TextField
                    fullWidth
                    placeholder="Search ID, customer or SKU..."
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                        sx: { borderRadius: 3, background: alpha(theme.palette.background.default, 0.5) }
                    }}
                />
                <IconButton sx={{ ...glassStyle, borderRadius: 2 }}>
                    <FilterListIcon />
                </IconButton>
            </Box>

            <Grid container spacing={4}>

                {/* LEFT - INSIGHTS (Sticky) */}
                <Grid item xs={12} md={3.5}>
                    <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        <StatCard
                            icon={<TrendingUpIcon color="primary" />}
                            label="Revenue"
                            value="₹ 12.44L"
                            trend="+12%"
                            glassStyle={glassStyle}
                        />
                        <StatCard
                            icon={<AccountBalanceWalletIcon color="secondary" />}
                            label="Total Volume"
                            value="2,840"
                            trend="+5.2%"
                            glassStyle={glassStyle}
                        />
                        <StatCard
                            icon={<ReportProblemIcon color="error" />}
                            label="Disputed"
                            value="14"
                            trend="-2%"
                            glassStyle={glassStyle}
                        />

                    </Box>
                </Grid>

                {/* RIGHT - TRANSACTION FEED */}
                <Grid item xs={12} md={8.5}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {TRANSACTIONS_1.slice(0, 15).map((tx) => (
                            <TransactionCard key={tx.id} tx={tx} glassStyle={glassStyle} isDark={isDark} />
                        ))}
                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
}

// Sub-component for Stats to keep main clean
function StatCard({ icon, label, value, trend, glassStyle }) {
    return (
        <Box sx={{
            ...glassStyle,
            p: 3,
            borderRadius: 5,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                {icon}
                <Typography variant="caption" sx={{ color: trend.startsWith('+') ? 'success.main' : 'error.main', fontWeight: 700 }}>
                    {trend}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="h5" fontWeight={800}>{value}</Typography>
        </Box>
    );
}

// Sub-component for Transaction Item with 3D effect
function TransactionCard({ tx, glassStyle, isDark }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                ...glassStyle,
                p: 2.5,
                borderRadius: 4,
                cursor: 'pointer',
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                perspective: "1000px",
                "&:hover": {
                    transform: "rotateX(2deg) rotateY(-1deg) translateY(-4px)",
                    background: isDark ? alpha("#fff", 0.1) : alpha("#fff", 0.9),
                    boxShadow: `0 20px 40px ${alpha("#000", 0.15)}`,
                },
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 700, fontSize: 12 }}>
                        {tx.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{tx.transactionId}</Typography>
                        <Typography variant="caption" color="text.secondary">{tx.transactionDate}</Typography>
                    </Box>
                </Box>
                <Chip
                    label={statusConfig[tx.paymentStatus].label}
                    color={statusConfig[tx.paymentStatus].color}
                    size="small"
                    variant="soft" // If using MUI Lab or custom theme, otherwise use 'filled'
                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                />
            </Box>

            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ opacity: 0.6 }}>Customer:</span> <b>{tx.customerName}</b>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {tx.paymentMethod} • {tx.storeLocation}
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                        ₹ {tx.finalAmount}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}