"use client";

import {
    Typography,
    alpha,
    TextField
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { customTextfieldStyles } from "./CustomStyles"

export default function CustomStringFieldPage({
    field,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const handleInputString = (name, val) => {
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
                type='text'
                size="small"
                name={field.name}
                value={searchInput[field.name] ?? ""}
                autoComplete="off"
                onChange={(e) => {
                    const { name, value } = e.target;
                    handleInputString(name, value);
                }}  
                placeholder="Enter value..."
                inputProps={{
                    min: field.min,
                    max: field.max,
                    // step: colConfig?.type === "float" ? "0.1" : undefined,
                    maxLength: 200,
                }}
                onKeyDown={(e) => {
                    const value = e.target.value;
                    if (value.length >= 200 && e.key !== "Backspace") {
                        e.preventDefault();
                    }
                }}
                // InputLabelProps={{ shrink: true }}
                sx={{...customTextfieldStyles(theme, isDark, alpha), ...field.customStyles}}
            />
        </>
    );
}