"use client";

import {
    Drawer,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Switch,
    FormControlLabel,
    alpha,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    CardContent,
    Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import GlobalLoader from "../../../../components/Loaders/GlobalLoader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryData from "../../../../data/InventoryData.json";

export default function InventoryPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    /**
     * HIGH PERFORMANCE next value generator
     * Handles 100k+ rows efficiently
     *
     * param {Array} data
     * param {Array} fields
     * returns {Object}
     */
    function getNextValuesOptimized(data, fields) {
        const maxMap = {};     // store max numeric values
        const prefixMap = {};  // store prefix for strings

        // Initialize
        for (let f of fields) {
            maxMap[f] = -Infinity;
            prefixMap[f] = "";
        }

        // SINGLE PASS (O(n))
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            for (let j = 0; j < fields.length; j++) {
                const field = fields[j];
                const value = item[field];

                if (value == null) continue;

                // NUMBER
                if (typeof value === "number") {
                    if (value > maxMap[field]) {
                        maxMap[field] = value;
                    }
                }

                // STRING (extract number at end)
                else if (typeof value === "string") {
                    let num = 0;
                    let k = value.length - 1;

                    // Extract trailing number manually (FASTER than regex)
                    while (k >= 0 && value.charCodeAt(k) >= 48 && value.charCodeAt(k) <= 57) {
                        k--;
                    }

                    if (k < value.length - 1) {
                        num = parseInt(value.slice(k + 1), 10);

                        if (num > maxMap[field]) {
                            maxMap[field] = num;
                            prefixMap[field] = value.slice(0, k + 1);
                        }
                    }
                }
            }
        }

        // BUILD RESULT
        const result = {};

        for (let f of fields) {
            if (maxMap[f] === -Infinity) {
                result[f] = null;
            } else if (prefixMap[f]) {
                result[f] = prefixMap[f] + (maxMap[f] + 1);
            } else {
                result[f] = maxMap[f] + 1;
            }
        }

        return result;
    }

    const nextSequence = getNextValuesOptimized(InventoryData, ["id", "sku", "model", "variant", "barcode", "qrCode", "batchNo", "serialNumber", "tarun"]);

    const [nextValue, setNextValue] = useState(nextSequence);

    const chipColors = {
        sku: "linear-gradient(135deg, #16a34a, #22c55e, #4ade80, #86efac, #22c55e)",

        id: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6, #60a5fa, #93c5fd)",

        model: "linear-gradient(135deg, #a16207, #ca8a04, #eab308, #facc15, #fde047)",

        barcode: "linear-gradient(135deg, #991b1b, #dc2626, #ef4444, #e48154, #f17726)",

        serialNumber:
            "linear-gradient(135deg, #6b21a8, #9333ea, #a855f7, #ac44af, #d417b4)",

        batchNo:
            "linear-gradient(135deg, #0f766e, #14b8a6, #2dd4bf, #51d8c4, #2ba38b)",

        qrCode:
            "linear-gradient(135deg, #9d174d, #db2777, #ec4899, #bb4683, #d32b50)",

        variant:
            "linear-gradient(135deg, #3730a3, #4338ca, #6366f1, #5763ce, #23099b)",
    };
    const jiggle = {
        "@keyframes jiggle": {
            "0%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(1deg)" },
            "50%": { transform: "rotate(-1deg)" },
            "75%": { transform: "rotate(1deg)" },
            "100%": { transform: "rotate(0deg)" },
        },
    };

    const animations = {
        "@keyframes fadeSlide": {
            "0%": { opacity: 0, transform: "translateY(10px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes pulseGlow": {
            "0%": { boxShadow: "0 0 0 0 rgba(255,255,255,0.4)" },
            "70%": { boxShadow: "0 0 0 10px rgba(255,255,255,0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(255,255,255,0)" },
        },
        "@keyframes wiggle": {
            "0%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(2deg)" },
            "50%": { transform: "rotate(-2deg)" },
            "75%": { transform: "rotate(2deg)" },
            "100%": { transform: "rotate(0deg)" },
        },
        "@keyframes shimmer": {
            "0%": { backgroundPosition: "-200px 0" },
            "100%": { backgroundPosition: "200px 0" },
        },
    };

    const fadeSlide = {
        "@keyframes fadeSlide": {
            "0%": { opacity: 0, transform: "translateY(10px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
        },
    };
    const glow = {
        "@keyframes glow": {
            "0%": { boxShadow: "0 0 0px rgba(255,255,255,0.2)" },
            "50%": { boxShadow: "0 0 12px rgba(255,255,255,0.5)" },
            "100%": { boxShadow: "0 0 0px rgba(255,255,255,0.2)" },
        },
    };
    const shine = {
        position: "relative",
        overflow: "hidden",
        "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
                "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
            transition: "0.6s",
        },
        "&:hover::after": {
            left: "100%",
        },
    };
    const bounce = {
        "&:hover": {
            transform: "translateY(-3px) scale(1.05)",
            transition: "0.1s ease",
        },
    };
    const gradientAnim = {
        backgroundSize: "200% 200%",
        animation: "gradientMove 3s ease infinite",
        "@keyframes gradientMove": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
        },
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
                // height:'calc(100vh-20px)'
            }}
        >
            <Box
                sx={{
                    height: 'calc(100vh - 130px)',
                    overflow: 'auto',
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
                }}>
                {/* HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6">{"Add inventory record: "}
                        {typeof nextValue?.id !== "undefined" ? nextValue?.id : null}
                    </Typography>

                    <Button variant="contained">Save changes</Button>
                </Box>

                {/* ACCORDION WRAPPER */}
                <Box
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    {/* SECTION 1 */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>📦 Identity & classification</Typography>
                            <Chip label="7 fields" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>

                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                {/* <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, }}>
                                    {Object.entries(nextValue)
                                        .filter(([_, value]) => value != null)
                                        .map(([key, value], index) => (
                                            <Tooltip
                                                key={key}
                                                title={`${key}: ${value}`}
                                                arrow
                                                placement="bottom"
                                            >
                                                <Chip
                                                    size="small"
                                                    label={value}
                                                    sx={{
                                                        mr: 1.5,
                                                        mb: 1,
                                                        width: 120,
                                                        color: "#fff",
                                                        fontWeight: 500,

                                                        background: chipColors[key] || "#64748b",

                                                        // 🔥 Jiggle animation
                                                        ...jiggle,
                                                        animation: "jiggle 0.6s ease-in-out",

                                                        // Hover effect
                                                        "&:hover": {
                                                            transform: "scale(1.08)",
                                                            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                                                        },
                                                        "@keyframes pulse": {
                                                            "0%": { boxShadow: "0 0 0 0 rgba(255,255,255,0.4)" },
                                                            "70%": { boxShadow: "0 0 0 8px rgba(255,255,255,0)" },
                                                            "100%": { boxShadow: "0 0 0 0 rgba(255,255,255,0)" },
                                                        },
                                                        animation: "pulse 3.5s infinite",
                                                        ...animations,
                                                    }}
                                                />
                                            </Tooltip>
                                        ))}
                                </Box> */}

                                <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                                    {Object.entries(nextValue)
                                        .filter(([col, value]) => value !== null && col !== "id")
                                        .map(([key, value], index) => (
                                            <Tooltip key={key} title={`${key}: ${value}`} arrow>
                                                <Chip
                                                    label={value}
                                                    size="small"
                                                    sx={{
                                                        mr: 1,
                                                        mb: 1,
                                                        width: 120,
                                                        color: "#fff",
                                                        fontWeight: 500,

                                                        // 🎨 Gradient color
                                                        background: chipColors[key] || "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                                                        // background:
                                                        //     "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",

                                                        // 🔥 Entry animation (staggered)
                                                        ...fadeSlide,
                                                        animation: `fadeSlide 0.4s ease forwards`,
                                                        animationDelay: `${index * 0.08}s`,
                                                        // opacity: 0,

                                                        // 💎 Glow effect
                                                        ...glow,

                                                        // ⚡ Shine
                                                        ...shine,

                                                        // 💃 Hover bounce
                                                        ...bounce,

                                                        // 🌈 Gradient motion
                                                        ...gradientAnim,
                                                    }}
                                                />
                                            </Tooltip>
                                        ))}
                                </Box>
                                <TextField label="Product Name" fullWidth />
                                <TextField label="Category" fullWidth />
                                <TextField label="Brand" fullWidth />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* SECTION 2 */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>💰 Pricing & margins</Typography>
                            <Chip label="6 fields - expanded" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                <TextField label="Purchase ₹" defaultValue={100} />
                                <TextField label="Selling ₹" defaultValue={150} />
                                <TextField label="Margin %" defaultValue={20} />
                                <TextField label="Tax %" defaultValue={18} />
                                <TextField label="Discount %" defaultValue={0} />
                                <TextField label="Profit ₹" defaultValue={50} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* SECTION 3 */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>📦 Stock levels</Typography>
                            <Chip label="6 fields" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <TextField label="Available Stock" />
                                <TextField label="Reserved Stock" />
                                <TextField label="Min Level" />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* SECTION 4 */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>📍 Warehouse & location</Typography>
                            <Chip label="5 fields" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <TextField label="Warehouse" />
                                <TextField label="Location" />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* SECTION 5 */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>🚚 Logistics & transport</Typography>
                            <Chip label="5 fields" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <TextField label="Transport Mode" />
                                <TextField label="Delivery Time" />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* SECTION 6 */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>📅 Dates & tracking</Typography>
                            <Chip label="6 fields" size="small" sx={{ ml: "auto" }} />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <TextField label="Created Date" />
                                <TextField label="Updated Date" />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
    );
}