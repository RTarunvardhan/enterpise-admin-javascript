"use client";

import {
    FormControl,
    alpha,
    FormControlLabel,
    Box,
    Radio,
    RadioGroup
} from "@mui/material";
import { customTextfieldStyles } from "./CustomStyles"

export default function CustomRadioButtonPage({
    field,
    searchInput,
    setSearchInput,
    theme,
    isDark
}) {
    const handleInputRadio = (name, val) => {
        setSearchInput((prev) => ({
            ...prev,
            [name]: val
        }));
    };
    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: 30, ml: 0, width: 200 }}
            >
                {/* <FormControl>
                    <RadioGroup
                        name={field.name}
                        checked={searchInput[field.name]}
                        onClick={(e) => handleInputRadio(e.target.name, e.target.checked)}
                    >
                        <FormControlLabel
                            control={<Radio />}
                            label={field.name}
                        />
                    </RadioGroup>
                </FormControl> */}

                <FormControlLabel
                    control={
                        <Radio
                            name={field.name}
                            checked={!!searchInput[field.name]}
                            // We use onClick because onChange won't trigger for an already-checked Radio
                            onClick={(e) => {
                                const isChecked = searchInput[field.name] === e.target.checked;
                                handleInputRadio(e.target.name, !isChecked)
                            }
                            }
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