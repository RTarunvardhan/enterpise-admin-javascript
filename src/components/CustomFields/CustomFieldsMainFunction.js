"use client";

import {
    Dialog, DialogActions, DialogContent, DialogTitle, Paper,
    alpha, Select, TextField, Stack, Button, Box
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import CustomSingleSelectPage from "./CustomSingleSelect";
import CustomMultiSelectPage from "./CustomMultiSelect";
import CustomNumberFieldPage from "./CustomNumberTextfield";
import CustomFloatFieldPage from "./CustomFloatTextfield";
import CustomStringFieldPage from "./CustomStringTextfield";
import CustomDateFieldPage from "./CustomDateTextfield";
import CustomCheckboxPage from "./CustomCheckbox";
import CustomSwitchButtonPage from "./CustomSwitchButton";
import CustomRadioButtonPage from "./CustomRadioButton";

export default function DynamicSearchForm({
    SearchInputFields,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const mapOptions = (values) => {
        return values.map((item) => {
            const key = Object.keys(item)[0];
            return {
                value: item[key],
                label: item.desc || item[key],
            };
        });
    };

    const renderField = (field) => {
        switch (field.type) {
            case "MULTISELECT":
                return (
                    <CustomMultiSelectPage
                        field={field}
                        mapOptions={mapOptions}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "SELECT":
                return (
                    <CustomSingleSelectPage
                        field={field}
                        mapOptions={mapOptions}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "NUMBER":
                return (
                    <CustomNumberFieldPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "FLOAT":
                return (
                    <CustomFloatFieldPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "TEXT":
                return (
                    <CustomStringFieldPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "DATE":
                return (
                    <CustomDateFieldPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "CHECKBOX":
                return (
                    <CustomCheckboxPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "SWITCH":
                return (
                    <CustomSwitchButtonPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            case "RADIO":
                return (
                    <CustomRadioButtonPage
                        field={field}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box display="flex" flexWrap="wrap"
            gap={1} sx={{ mt: 0.5 }}>
            {SearchInputFields.map((field, index) => (
                <Box
                    key={index}
                    sx={{
                        // 🔥 Responsive sizing logic:
                        // In the sidebar (20%), it will hit the min-width and stack.
                        // In the Dialog (md), it will show 2 or 3 per row.
                        // flex: "1 1 auto",
                        flex: field.width === '100%' ? "1 1 100%" : `0 0 ${field.width || '200px'}`,
                        // flex: 1,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5, mb: 0.5, ml: 1
                    }}
                >
                    {renderField(field)}
                </Box>
            ))}
        </Box>
    );
};