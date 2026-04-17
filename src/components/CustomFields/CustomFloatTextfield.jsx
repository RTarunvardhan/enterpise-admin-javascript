"use client";

import {
    Typography,
    alpha,
    TextField
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { customTextfieldStyles } from "./CustomStyles"

export default function CustomFloatFieldPage({
    field,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const handleInputFloat = (name, val) => {
        if (val !== "" && val !== null && val !== undefined) {
            setSearchInput((prev) => ({
                ...prev,
                [name]: val
            }));
        } else {
            setSearchInput((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };
    return (
        <>
            <Typography fontSize={12}>
                {field.label}
            </Typography>
            <TextField
                type='number'
                size="small"
                name={field.name}
                value={searchInput[field.name] ?? ""}
                autoComplete="off"
                onChange={(e) => {
                    const { name, value } = e.target;
                    if (value === "") {
                        handleInputFloat(name, value);
                        return;
                    }

                    const num = Number(value);

                    // 🔥 BLOCK if exceeds max
                    if (field.max && num > field.max) return;

                    // 🔥 BLOCK if below min
                    if (field.min !== undefined && num < field.min) return;
                    handleInputFloat(name, value);
                }}
                placeholder="Enter value..."
                inputProps={{
                    min: field.min,
                    max: field.max,
                    step: "0.01",
                }}
                // InputLabelProps={{ shrink: true }}
                onKeyDown={(e) => {
                    const value = e.target.value;

                    if (value.length >= 15 && e.key !== "Backspace") {
                        e.preventDefault();
                    }
                }}
                // InputLabelProps={{ shrink: true }}
                sx={{ ...customTextfieldStyles(theme, isDark, alpha), ...field.customStyles }}
            />
        </>
    );
}