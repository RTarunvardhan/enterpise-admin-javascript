"use client";

import {
    Button,
    Box
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function DynamicCustomButtons({
    customButton,
    theme,
    isDark
}) {

    return (
        <Box display="flex" flexWrap="wrap" gap={1.5} sx={{ mt: 1.5 }}>
            {Array.isArray(customButton) &&
                customButton.map((btn) => (
                    <Button
                        key={btn.key}
                        variant={btn.variant || "contained"}
                        type={btn.type || "button"}
                        sx={{
                            width: "100px", borderRadius: 2,
                            // height: "30px",  
                            fontSize: '12px',   // ✅ default styles
                            ...(btn.sx || {}) // ✅ override if provided
                        }}
                        startIcon={btn.startIcon}
                        disabled={btn.disabled || false}
                        onClick={btn.onClick}
                    >
                        {btn.text}
                    </Button>
                ))}
        </Box>
    );
};