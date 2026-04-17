"use client";

import {
    Typography,
    alpha,
    TextField
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { customTextfieldStyles } from "./CustomStyles"

export default function CustomDateFieldPage({
    field,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const handleInputDate = (name, val) => {
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
                type='date'
                size="small"
                name={field.name}
                value={searchInput[field.name] ?? ""}
                autoComplete="off"
                onChange={(e) => {
                    const { name, value } = e.target;
                    if (value === "") {
                        handleInputDate(name, value);
                        return;
                    }

                    const num = Number(value);

                    // 🔥 BLOCK if exceeds max
                    if (field.max && num > field.max) return;

                    // 🔥 BLOCK if below min
                    if (field.min !== undefined && num < field.min) return;
                    handleInputDate(name, value);
                }}
                // placeholder="Enter value..."
                inputProps={{
                    min: field.min,
                    max: field.max,
                }}
                // InputLabelProps={{ shrink: true }}
                sx={{ ...customTextfieldStyles(theme, isDark, alpha), ...field.customStyles }}
            />
        </>
    );
}