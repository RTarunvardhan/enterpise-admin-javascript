"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";

import {
    Tabs,
    Tab,
    alpha,
    Box
} from "@mui/material";

export default function CustomPageTabs({
    tabs,
    screenChangeTab,
    setScreenChangeTab,
    theme,
    isDark
}) {
    return (
        <>
            {/* <Tabs
                value={screenChangeTab}
                onChange={(e, val) => setScreenChangeTab(val)}
                TabIndicatorProps={{ style: { display: "none" } }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    width: "100%", // ✅ FULL WIDTH
                    minHeight: "36px",

                    background: isDark
                        ? alpha(theme.palette.background.paper, 0.8)
                        : "#e3e4e6", //f3f4f6

                    borderRadius: "40px",
                    p: "1px",
                    display: "inline-flex",
                    // color: isDark ? "#ddd":"#000000",

                    backdropFilter: isDark ? "blur(12px)" : "none",
                    border: isDark
                        ? `1px solid ${alpha("#fff", 0.5)}`
                        : "1px solid #3b3b3b",
                    // 🔥 Make tabs container scroll nicely
                    "& .MuiTabs-flexContainer": {
                        gap: "6px",
                    },

                    // 🔥 Scroll buttons styling
                    "& .MuiTabs-scrollButtons": (tabs && tabs.length > 10) ? {

                        borderRadius: "100%",
                        mx: 0.2,

                        color: isDark ? "#fff" : "#0284c7",

                        "&.Mui-disabled": {
                            opacity: 0.3,
                        },
                    } : null,
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={tab.label}
                        sx={{
                            flexShrink: 0, // ✅ IMPORTANT (prevents shrinking)
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 500,
                            minHeight: "30px",
                            px: 4,

                            color: isDark
                                ? alpha("#fff", 0.6)
                                : "#9ca3af",

                            transition: "all 0.25s ease",
                            "&:hover": {
                                background: isDark
                                    ? alpha("#fff", 0.05)
                                    : "#e5e7eb",
                            },

                            "&.Mui-selected": {
                                background: isDark
                                    ? alpha("#fff", 0.12)
                                    : "#ffffff",

                                color: isDark
                                    ? "#fff"
                                    : "#0284c7",

                                boxShadow: isDark
                                    ? "0 4px 20px rgba(0,0,0,0.6)"
                                    : "0 2px 8px rgba(0,0,0,0.2)",

                                backdropFilter: isDark ? "blur(6px)" : "none",
                                position: "relative",

                                "&::before, &::after": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    width: "40px",
                                    zIndex: 1,
                                    pointerEvents: "none",
                                },

                                "&::before": {
                                    left: 0,
                                    background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent)",
                                },

                                "&::after": {
                                    right: 0,
                                    background: "linear-gradient(to left, rgba(0,0,0,0.1), transparent)",
                                },
                            },
                            "& .MuiTab-root:hover": {
                                background: isDark
                                    ? alpha("#fff", 0.05)
                                    : "#e5e7eb",
                            }
                        }}
                    />
                ))}
            </Tabs> */}
            {/* <Tabs
                value={screenChangeTab}
                onChange={(e, val) => setScreenChangeTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile

                sx={{
                    minHeight: 48,
                    borderBottom: `1px solid ${isDark
                        ? alpha("#fff", 0.08)
                        : "#e5e7eb"
                        }`,

                    "& .MuiTabs-indicator": {
                        height: "3px",
                        borderRadius: "3px",
                        background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                    },
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={tab.label}

                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: 14,
                            minHeight: 48,
                            px: 3,

                            color: isDark
                                ? alpha("#fff", 0.6)
                                : "#6b7280",

                            transition: "all 0.2s ease",

                            "&:hover": {
                                color: isDark ? "#fff" : "#111827",
                            },

                            "&.Mui-selected": {
                                color: isDark ? "#fff" : "#111827",
                            },
                        }}
                    />
                ))}
            </Tabs> */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    borderRadius: 15,

                    backdropFilter: "blur(10px)",
                    background: isDark
                        ? "rgba(15,23,42,0.7)"
                        : "rgba(255,255,255,0.7)",

                    px: 2,
                    p: 0,
                    border: isDark ? "1px solid #aaa" : "1px solid #333",
                    // border: "1px solid red"
                }}
            >
                <Tabs
                    value={screenChangeTab}
                    onChange={(e, val) => setScreenChangeTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile

                    sx={{
                        minHeight: 30,

                        "& .MuiTabs-indicator": {
                            height: "3px",
                            borderRadius: "3px",
                            background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                            boxShadow: "0 0 10px rgba(59,130,246,0.6)", // 🔥 glow
                        },

                        "& .MuiTabs-scrollButtons": {
                            width: 40,
                            transition: "opacity 0.3s",
                            color: theme.palette.primary.main, // Arrow color
                            "&.Mui-disabled": {
                                opacity: 0.3, // Dimmed when no more content to scroll
                            },
                            borderRadius: 12
                        },

                        // 2. Styling the SVG arrow icons specifically
                        "& .MuiTabs-scrollButtons svg": {
                            fontSize: "1.5rem",
                            filter: isDark ? "drop-shadow(0 0 2px rgba(255,255,255,0.2))" : "none",
                        },
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            label={tab.label}

                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 14,
                                minHeight: 30,
                                px: 3,

                                color: isDark
                                    ? alpha("#fff", 0.6)
                                    : "#6b7280",

                                transition: "all 0.2s ease",

                                "&:hover": {
                                    color: isDark ? "#fff" : "#111827",
                                },

                                "&.Mui-selected": {
                                    color: isDark ? "#fff" : "#111827",
                                },
                            }}
                        />
                    ))}
                </Tabs>
            </Box>
        </>
    );
}