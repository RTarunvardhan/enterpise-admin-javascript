"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";

import {
    Tabs,
    Tab,
    alpha,
    Box,
    Divider
} from "@mui/material";

export default function CustomHeaderPage({
    theme,
    isDark
}) {
    return (
        <>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    borderRadius: 1,

                    backdropFilter: "blur(10px)",
                    background: isDark
                        ? "rgba(15,23,42,0.7)"
                        : "rgba(255,255,255,0.7)",

                    px: 2,
                    p: 0,
                    border: isDark ? "1px solid #aaa" : "1px solid #333",
                    mt: 1, padding: 0, 
                }}
            >
                <h4 style={{ padding: 2, margin:"5px 0px 0px 10px", }}>Header</h4>
                <Divider />
                <h6 style={{ padding: 2, margin: "5px 0px 0px 10px",}}>Body1</h6>
                <h6 style={{ padding: 2, margin: "5px 0px 0px 10px",}}>Body2</h6>
            </Box>
        </>
    );
}