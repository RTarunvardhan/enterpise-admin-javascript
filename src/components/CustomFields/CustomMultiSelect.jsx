"use client";

import {
    Typography,
    alpha,
} from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import Select, { components } from "react-select";
import { customMultiSelectStyles } from "./CustomStyles";

export default function CustomMultiSelectPage({
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

    const handleSearchMultiSelect = (name, row) => {
        const values = row ? row.map(s => s.value) : [];

        setSearchInput((prev) => {
            const updated = { ...prev };
            if (!values.length) {
                delete updated[name];
            } else {
                updated[name] = values;
            }
            return updated;
        });
    };

    const options = useMemo(() => mapOptions(field.value), [field.value]);

    const selectedValues = options.filter((opt) =>
        (searchInput[field.name] || []).includes(opt.value)
    );

    const sortedOptions = useMemo(() => {
        const selectedSet = new Set(
            (searchInput[field.name] || [])
        );

        const selected = [];
        const unselected = [];

        options.forEach(opt => {
            if (selectedSet.has(opt.value)) {
                selected.push(opt);
            } else {
                unselected.push(opt);
            }
        });

        return [...selected, ...unselected];
    }, [options, selectedValues]);

    return (
        <>
            <Typography fontSize={12}>
                {field.label}
            </Typography>
            <Select
                instanceId={field.name}
                options={sortedOptions || []}
                menuPosition="fixed"
                menuPlacement="auto"
                value={selectedValues}
                onChange={(selected) => handleSearchMultiSelect(field.name, selected)}
                isClearable
                isSearchable
                isMulti
                closeMenuOnSelect
                isOptionDisabled={(option) => {
                    const selected = searchInput[field.name] || [];
                    // ❌ block only new selections
                    if (selected.length >= field.max && !selected.includes(option.value)) {
                        return true;
                    }
                    return false;
                }}
                hideSelectedOptions={false}
                menuPortalTarget={portalTarget || undefined} // 🔥 fix overflow
                components={{
                    ValueContainer: CustomValueContainer
                }}
                menuShouldCloseOnBlur={true}
                blurInputOnSelect={false}
                // 🔥 THEME STYLES
                styles={{...customMultiSelectStyles(theme, isDark),...field.customStyles}}
            />
        </>
    );
}

// const CustomValueContainer = ({ children, ...props }) => {
//     const selected = props.getValue();

//     if (!selected.length) {
//         return (
//             <components.ValueContainer {...props}>
//                 {children} {/* ✅ keeps placeholder */}
//             </components.ValueContainer>
//         );
//     }

//     const maxVisible = 1;

//     const labels = selected.slice(0, maxVisible).map(s => s.label);

//     return (
//         <components.ValueContainer {...props}>
//             <div style={{ fontSize: 12 }}>
//                 {labels.join(", ")}
//                 {selected.length > maxVisible && ` +${selected.length - maxVisible}`}
//             </div>
//         </components.ValueContainer>
//     );
// };

const CustomValueContainer = ({ children, ...props }) => {
    const selected = props.getValue();

    const maxVisible = 1;

    // 🔥 Extract input from children
    const childArray = Array.isArray(children) ? children : [children];
    const input = childArray[childArray.length - 1];

    if (!selected.length) {
        return (
            <components.ValueContainer {...props}>
                {children}
            </components.ValueContainer>
        );
    }

    const labels = selected.slice(0, maxVisible).map(s => s.label);

    return (
        <components.ValueContainer {...props}>
            <div style={{ fontSize: 12, marginRight: 6 }}>
                {labels.join(", ")}
                {selected.length > maxVisible && ` +${selected.length - maxVisible}`}
            </div>

            {/* 🔥 KEEP INPUT ALIVE */}
            {input}
        </components.ValueContainer>
    );
};