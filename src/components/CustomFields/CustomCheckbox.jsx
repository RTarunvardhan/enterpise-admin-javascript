"use client";

import {
    Checkbox,
    alpha,
    FormControlLabel,
    Box
} from "@mui/material";
import { customTextfieldStyles } from "./CustomStyles"

export default function CustomCheckboxPage({
    field,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const handleInputCheckbox = (name, val) => {
        setSearchInput((prev) => ({
            ...prev,
            [name]: val
        }));
    };
    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: 53, ml: 0, width: 200 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name={field.name}
                            checked={searchInput[field.name]}
                            onChange={(e) => handleInputCheckbox(e.target.name, e.target.checked)}
                            size="small"
                            sx={{
                                p: 0.5,
                                color: alpha(theme.palette.text.primary, 0.3),
                                '&.Mui-checked': { color: theme.palette.primary.main },
                            }}
                        />
                    }
                    sx={{
                        '& .MuiFormControlLabel-label': { fontSize: '12px' },
                      }}
                    label={field.label}
                />
            </Box>
        </>
    );
}