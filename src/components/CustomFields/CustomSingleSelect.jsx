"use client";

import {
    Typography,
    alpha,
} from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import { customSingleSelectStyles } from "./CustomStyles";

export default function CustomSingleSelectPage({
    field,
    mapOptions,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const [portalTarget, setPortalTarget] = useState(null);

    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    const handleSearchSelect = (name, row) => {
        if (row && row.value) {
            setSearchInput((prev) => ({
                ...prev,
                [name]: row.value
            }));
        } else {
            setSearchInput((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };
    const options = useMemo(() => mapOptions(field.value), [field.value]);

    return (
        <>
            <Typography fontSize={12}>
                {field.label}
            </Typography>
            <Select
                instanceId={field.name}
                options={options || []}
                menuPosition="fixed"
                value={options.find(opt => opt.value === searchInput[field.name]) || null}
                onChange={(selected) => handleSearchSelect(field.name, selected)}
                isClearable
                isSearchable
                menuPortalTarget={portalTarget || undefined} // 🔥 fix overflow
                menuPlacement="auto"
                // 🔥 THEME STYLES
                styles={{
                    ...customSingleSelectStyles(theme, isDark),
                    ...field.customStyles
                }}

            />
        </>
    );
}