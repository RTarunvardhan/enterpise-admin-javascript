"use client";

import {
    Popover, Box, Typography, Divider, Checkbox,
    MenuItem, Select, TextField, Stack, Button
} from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import TableFilterDialogBoxPage from "./TableFilterDialogBoxNoPage";
import { validateValue, getInputType, toDateInputFormat, getOperators } from "./EditColumnValidateValue";

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENT ─ TableHeaderFiltersPage
// A small popover with a text input for per-column filtering.
// ═══════════════════════════════════════════════════════════════
export default function TableHeaderFiltersPage({
    anchorEl,
    onClose,
    column,
    filterValue,
    onFilterChange,
    onSort,
    onHideColumn,
    onClearFilter,
    operators,
    columns,
    headerHideColumns,
    setHeaderHideColumns,
    tableData,
    setTableData,
    EditableColumns,
    TableDropDowns,
    currentPageRows,
    allPageSelected,
    sortedData,
    setOpenAlert,
    theme,
    isDark
}) {
    const [operator, setOperator] = useState("contains");
    const [value, setValue] = useState("");
    const isAppliedRef = useRef(false);

    const [showColumnManager, setShowColumnManager] = useState(false);
    const [tempColumns, setTempColumns] = useState([]);

    const [showCopyManager, setShowCopyManager] = useState(false);
    const [copyValue, setCopyValue] = useState("");

    const [exportType, setExportType] = useState(null);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [fileName, setFileName] = useState("");

    const columnKey = column?.key;

    useEffect(() => {
        if (showCopyManager) setCopyValue("");
    }, [showCopyManager]);

    const showInput = !["is empty", "is not empty"].includes(operator);

    const editableMap = useMemo(() => {
        const map = {};
        EditableColumns.forEach(col => {
            map[col.columnName] = col;
        });
        return map;
    }, [EditableColumns]);

    useEffect(() => {
        if (!columnKey) return;
        const ops = getOperators(isBooleanColumn, isDateColumn);

        const defaultOperator = ops.includes(filterValue?.operator)
            ? filterValue?.operator
            : ops[0];

        setOperator(defaultOperator);
        setValue(filterValue?.value || "");
    }, [column]);

    const colConfig = EditableColumns.find(c => c.columnName === columnKey);

    const sampleValue = tableData?.[0]?.[columnKey];

    const isBooleanColumn = typeof sampleValue === "boolean";

    const isDateColumn =
        columnKey?.toLowerCase()?.includes("date") ||
        (!isBooleanColumn &&
            sampleValue &&
            typeof sampleValue === 'string' &&
            // Only try to parse if it contains a dash, slash, or colon
            /[/\-:]/.test(sampleValue) &&
            !isNaN(new Date(sampleValue).getTime()));


    const selectedSet = new Set(allPageSelected);

    const selectedCountOnPage = currentPageRows.filter((row) =>
        selectedSet.has(row.SR_NO)
    ).length;

    const apply = () => {
        isAppliedRef.current = true;

        let finalValue = value;

        if (isBooleanColumn) {
            finalValue = value === "true";
        }

        onFilterChange(column.key, operator, finalValue);
        onClose();
    };

    const clear = () => {
        isAppliedRef.current = true;
        onClearFilter(column.key);
        onClose();
    };

    const handleClose = () => {
        if (!isAppliedRef.current) {
            setOperator(filterValue?.operator || "contains");
            setValue(filterValue?.value || "");
        }
        isAppliedRef.current = false;
        onClose();
    };

    const openColumnManager = () => {
        const initial = columns
            .filter((c) => c.key !== "SR_NO")
            .map((c) => ({
                key: c.key,
                label: c.label,
                checked: !headerHideColumns.includes(c.key),
            }));

        setTempColumns(initial);
        setShowColumnManager(true);
    };

    const openExport = (type) => {
        setExportType(type);
        setFileName(`data_${type}`);
        setOpenExportDialog(true);
        onClose();
    };

    return (
        <>
            <Popover
                open={Boolean(anchorEl) && Boolean(column)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableAutoFocus
                disableEnforceFocus
                PaperProps={{
                    sx: {
                        mt: 0.5,
                        width: 180,                // 🔥 reduced
                        p: 1,                      // 🔥 compact padding
                        borderRadius: 1.5,

                        // 🎨 THEME AWARE
                        background: isDark
                            ? "rgba(30, 41, 59, 0.9)"
                            : "rgba(255,255,255,0.85)",

                        backdropFilter: "blur(10px)",
                        border: `1px solid ${theme.palette.divider}`,

                        boxShadow: isDark
                            ? "0 6px 20px rgba(0,0,0,0.6)"
                            : "0 6px 20px rgba(0,0,0,0.5)",

                        animation: "fadeSlide 0.15s ease",

                        "@keyframes fadeSlide": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-6px) scale(0.96)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0) scale(1)",
                            },
                        },
                    },
                }}
            >
                <Box sx={{ p: 1.2 }}>
                    {/* Guard: column must be non-null before rendering any column-dependent content */}
                    {!column ? null : (!showColumnManager && !showCopyManager) && (
                        <Stack spacing={0.8}>

                            {/* TITLE */}
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    opacity: 0.6,
                                    letterSpacing: 0.4,
                                }}
                            >
                                {column.label}
                            </Typography>

                            <Box sx={{
                                maxHeight: 255,
                                overflowY: "auto",

                                // ✨ custom scrollbar
                                "&::-webkit-scrollbar": {
                                    width: 6,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: theme.palette.primary.main,
                                    borderRadius: 10,
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                },
                            }}>
                                {/* SORT */}
                                <MenuItem
                                    dense
                                    onClick={() => onSort(column.key, "asc")}
                                    sx={{ fontSize: 12, py: 0.5 }}
                                >
                                    ↑ Sort Asc
                                </MenuItem>

                                <MenuItem
                                    dense
                                    onClick={() => onSort(column.key, "desc")}
                                    sx={{ fontSize: 12, py: 0.5 }}
                                >
                                    ↓ Sort Desc
                                </MenuItem>

                                <Divider sx={{ my: 0.5 }} />

                                {/* FILTER */}
                                <Typography sx={{ fontSize: 9, opacity: 0.5 }}>
                                    Filter
                                </Typography>

                                <Select
                                    size="small"
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    sx={{
                                        fontSize: 11,
                                        height: 28,
                                        "& .MuiSelect-select": {
                                            py: 0.5,
                                        },
                                        width: 130, marginBottom: 1
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                maxHeight: 250, // Set your desired pixel height
                                                backgroundColor: isDark ? "#1e1e1e" : "#fff",

                                                // 🔥 Custom Scrollbar Logic
                                                "&::-webkit-scrollbar": {
                                                    width: "8px",
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    backgroundColor: isDark ? "#444" : "#ccc",
                                                    borderRadius: "10px",
                                                    border: `2px solid ${isDark ? "#1e1e1e" : "#fff"}`, // Creates padding effect
                                                },
                                                "&::-webkit-scrollbar-thumb:hover": {
                                                    backgroundColor: isDark ? "#666" : "#999",
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {getOperators(isBooleanColumn, isDateColumn).map((op) => (
                                        <MenuItem key={op} value={op} sx={{ fontSize: 11 }}>
                                            {op}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {showInput && (
                                    isBooleanColumn ? (
                                        <Select
                                            size="small"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            sx={{
                                                fontSize: 11,
                                                height: 28,
                                                width: 130,
                                                mb: 1
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        maxHeight: 250, // Set your desired pixel height
                                                        backgroundColor: isDark ? "#1e1e1e" : "#fff",

                                                        // 🔥 Custom Scrollbar Logic
                                                        "&::-webkit-scrollbar": {
                                                            width: "8px",
                                                        },
                                                        "&::-webkit-scrollbar-track": {
                                                            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                        },
                                                        "&::-webkit-scrollbar-thumb": {
                                                            backgroundColor: isDark ? "#444" : "#ccc",
                                                            borderRadius: "10px",
                                                            border: `2px solid ${isDark ? "#1e1e1e" : "#fff"}`, // Creates padding effect
                                                        },
                                                        "&::-webkit-scrollbar-thumb:hover": {
                                                            backgroundColor: isDark ? "#666" : "#999",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="true" sx={{ fontSize: 11 }}>Yes</MenuItem>
                                            <MenuItem value="false" sx={{ fontSize: 11 }}>No</MenuItem>
                                        </Select>
                                    ) : (
                                        <TextField
                                            size="small"
                                            type={isDateColumn ? "date" : "text"}
                                            value={value}
                                            autoComplete="off"
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="value..."
                                            InputProps={{
                                                sx: {
                                                    fontSize: 11,
                                                    height: 28,
                                                    px: 1,
                                                    width: 130
                                                },
                                            }}
                                        />
                                    )
                                )}

                                <Divider sx={{ my: 0.5 }} />

                                {/* ACTIONS */}
                                {(EditableColumns.length > 0 &&
                                    !!editableMap[column.key] &&
                                    selectedCountOnPage > 0) &&
                                    (
                                        <MenuItem
                                            dense
                                            onClick={() => setShowCopyManager(true)}
                                            sx={{ fontSize: 12, py: 0.5 }}
                                        >
                                            Copy Down
                                        </MenuItem>
                                    )}

                                <MenuItem
                                    dense
                                    onClick={openColumnManager}
                                    sx={{ fontSize: 12, py: 0.5 }}
                                >
                                    Hide Column
                                </MenuItem>

                                <MenuItem
                                    dense
                                    onClick={clear}
                                    sx={{ fontSize: 12, py: 0.5, color: theme.palette.error.main }}
                                >
                                    Clear Filter
                                </MenuItem>

                                <Divider sx={{ my: 0.5 }} />

                                <MenuItem dense
                                    sx={{ fontSize: 12, py: 0.5 }}
                                    onClick={() => openExport("json")}
                                >
                                    📦 JSON</MenuItem>

                                <MenuItem dense
                                    sx={{ fontSize: 12, py: 0.5 }}
                                    onClick={() => openExport("csv")}
                                >
                                    📄 CSV</MenuItem>

                                <MenuItem dense
                                    sx={{ fontSize: 12, py: 0.5 }}
                                    onClick={() => openExport("sql")}
                                >
                                    🧾 SQL</MenuItem>

                                <MenuItem dense
                                    sx={{ fontSize: 12, py: 0.5 }}
                                    onClick={() => openExport("excel")}
                                >
                                    📊 Excel</MenuItem>
                            </Box>

                            {/* FOOTER */}
                            <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                                <Button
                                    size="small"
                                    onClick={handleClose}
                                    variant="contained"
                                    sx={{
                                        minWidth: 50,
                                        height: 26,
                                        fontSize: 12,
                                        p: 0,
                                        // color: theme.palette.error.main,
                                        backgroundColor: "#ef4444"
                                    }}
                                >
                                    ✕
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={apply}
                                    sx={{
                                        minWidth: 50,
                                        height: 26,
                                        fontSize: 12,
                                        p: 0,
                                    }}
                                >
                                    ✓
                                </Button>
                            </Stack>

                        </Stack>
                    )}
                    {showColumnManager && (
                        <Stack spacing={1} >
                            <Typography fontSize={10}>
                                Show / Hide Columns
                            </Typography>

                            <Divider />

                            <Box sx={{
                                maxHeight: 250,
                                overflowY: "auto",

                                // ✨ custom scrollbar
                                "&::-webkit-scrollbar": {
                                    width: 6,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: theme.palette.primary.main,
                                    borderRadius: 10,
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                },
                            }}>
                                {tempColumns.map((c) => (
                                    <Box
                                        key={c.key}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            px: 0,
                                            py: 0.3,
                                            padding: "0px",
                                            borderRadius: 1,

                                            "&:hover": {
                                                background: isDark
                                                    ? "rgba(255,255,255,0.05)"
                                                    : "rgba(0,0,0,0.05)",
                                            },
                                        }}
                                    >
                                        {/* ✅ CHECKBOX FIRST */}
                                        <Checkbox
                                            size="small"
                                            checked={c.checked}
                                            sx={{
                                                p: 0.3,
                                            }}
                                            onChange={(e) => {
                                                const updated = tempColumns.map((col) =>
                                                    col.key === c.key
                                                        ? { ...col, checked: e.target.checked }
                                                        : col
                                                );

                                                if (updated.filter((c) => c.checked).length >= 3) {
                                                    setTempColumns(updated);
                                                }
                                            }}
                                        />

                                        {/* LABEL */}
                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                flex: 1,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {c.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 0.5 }} />

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Button
                                    size="small"
                                    sx={{ fontSize: 11, minWidth: 70, p: 0.5 }}
                                    onClick={() =>
                                        setTempColumns((prev) =>
                                            prev.map((c) => ({ ...c, checked: true }))
                                        )
                                    }
                                >
                                    Show All
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        fontSize: 11,
                                        minWidth: 50,
                                        height: 26,
                                        p: 0,
                                    }}
                                    onClick={() => {
                                        const hidden = tempColumns
                                            .filter((c) => !c.checked)
                                            .map((c) => c.key);

                                        setHeaderHideColumns(hidden);
                                        setShowColumnManager(false);
                                        onClose();
                                    }}
                                >
                                    ✓
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                    {showCopyManager &&
                        (
                            <Stack spacing={1}>
                                <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                                    Copy → {column.label}
                                </Typography>

                                <Divider />

                                {/* 🔥 INPUT TYPE */}
                                {TableDropDowns?.[column.key] ? (
                                    <Select
                                        size="small"
                                        value={copyValue}
                                        onChange={(e) => setCopyValue(e.target.value)}
                                        sx={{
                                            fontSize: 11,
                                            height: 28,
                                            "& .MuiSelect-select": {
                                                py: 0.5,
                                            },
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 250, // Set your desired pixel height
                                                    backgroundColor: isDark ? "#1e1e1e" : "#fff",

                                                    // 🔥 Custom Scrollbar Logic
                                                    "&::-webkit-scrollbar": {
                                                        width: "8px",
                                                    },
                                                    "&::-webkit-scrollbar-track": {
                                                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                    },
                                                    "&::-webkit-scrollbar-thumb": {
                                                        backgroundColor: isDark ? "#444" : "#ccc",
                                                        borderRadius: "10px",
                                                        border: `2px solid ${isDark ? "#1e1e1e" : "#fff"}`, // Creates padding effect
                                                    },
                                                    "&::-webkit-scrollbar-thumb:hover": {
                                                        backgroundColor: isDark ? "#666" : "#999",
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {TableDropDowns[column.key].map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 11 }}>
                                                {opt.label || opt.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : isBooleanColumn ? (
                                    <Select
                                        size="small"
                                        value={copyValue}
                                        onChange={(e) => setCopyValue(e.target.value)}
                                        sx={{ fontSize: 11, height: 28 }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 250, // Set your desired pixel height
                                                    backgroundColor: isDark ? "#1e1e1e" : "#fff",

                                                    // 🔥 Custom Scrollbar Logic
                                                    "&::-webkit-scrollbar": {
                                                        width: "8px",
                                                    },
                                                    "&::-webkit-scrollbar-track": {
                                                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                    },
                                                    "&::-webkit-scrollbar-thumb": {
                                                        backgroundColor: isDark ? "#444" : "#ccc",
                                                        borderRadius: "10px",
                                                        border: `2px solid ${isDark ? "#1e1e1e" : "#fff"}`, // Creates padding effect
                                                    },
                                                    "&::-webkit-scrollbar-thumb:hover": {
                                                        backgroundColor: isDark ? "#666" : "#999",
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="true">Yes</MenuItem>
                                        <MenuItem value="false">No</MenuItem>
                                    </Select>
                                ) : (
                                    <TextField
                                        type={getInputType(colConfig)}
                                        size="small"
                                        value={copyValue}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            // 🔥 VALIDATION LIVE BLOCK
                                            if (!validateValue(colConfig, val)) return;

                                            setCopyValue(val);
                                        }}
                                        placeholder="Enter value..."
                                        inputProps={{
                                            min:
                                                colConfig?.type === "date"
                                                    ? toDateInputFormat(colConfig?.minValue)
                                                    : colConfig?.minValue ?? undefined,

                                            max:
                                                colConfig?.type === "date"
                                                    ? toDateInputFormat(colConfig?.maxValue)
                                                    : colConfig?.maxValue ?? undefined,
                                            step: colConfig?.type === "float" ? "0.1" : undefined,
                                            maxLength:
                                                colConfig?.type === "string"
                                                    ? colConfig.maxValue || 200
                                                    : undefined,
                                        }}
                                        // InputLabelProps={{ shrink: true }}
                                        sx={{
                                            width: "100%",
                                            // 🔥 ROOT
                                            "& .MuiInputBase-root": {
                                                fontSize: 13,
                                                px: 1,
                                                py: 0.9,
                                                height: '32px',
                                                borderRadius: 1,
                                                transition: "all 0.2s ease",

                                                // 🎨 THEME BACKGROUND
                                                background: isDark
                                                    ? "rgba(255,255,255,0.03)"
                                                    : "rgba(0,0,0,0.03)",

                                                border: `1px solid ${isDark
                                                    ? "rgba(255,255,255,0.08)"
                                                    : "rgba(0,0,0,0.08)"
                                                    }`,

                                                // ✨ HOVER
                                                "&:hover": {
                                                    background: isDark
                                                        ? "rgba(255,255,255,0.06)"
                                                        : "rgba(0,0,0,0.05)",
                                                },

                                                // 🔥 FOCUS
                                                "&.Mui-focused": {
                                                    background: isDark
                                                        ? "rgba(99,102,241,0.12)"
                                                        : "rgba(99,102,241,0.08)",

                                                    border: `1px solid ${theme.palette.primary.main}`,

                                                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                                                },
                                            },

                                            // 🔤 INPUT TEXT
                                            "& .MuiInputBase-input": {
                                                p: 0,
                                                fontSize: 12,
                                                color: theme.palette.text.primary,
                                            },
                                            "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                                // Use invert to turn the black arrows white for dark mode
                                                filter: isDark ? "invert(0.91) brightness(2)" : "none",

                                                // Force the background to be transparent so the theme shows through
                                                backgroundColor: "transparent",

                                                // Adjust opacity so they aren't too distracting until hover
                                                opacity: 0.5,
                                                cursor: "pointer",

                                                // Ensure they don't add extra height to your small rows
                                                height: "18px",
                                            },

                                            // Optional: Make arrows fully visible on hover
                                            "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": {
                                                opacity: 1,
                                            },

                                            // Firefox fix (Firefox handles this differently)
                                            "& input[type=number]": {
                                                MozAppearance: "textfield", // Use this if you want to hide them entirely in Firefox
                                            },
                                        }}
                                    />
                                )}

                                <Divider />

                                {/* 🔥 ACTION BUTTONS */}
                                <Typography sx={{ fontSize: 10, opacity: 0.6 }}>
                                    {
                                        currentPageRows.filter((r) =>
                                            allPageSelected.includes(r.SR_NO)
                                        ).length
                                    }{" "}
                                    rows selected
                                </Typography>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => setShowCopyManager(false)}
                                            sx={{ minWidth: 50, backgroundColor: "#ef4444" }}
                                        >
                                            ✕
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ minWidth: 50 }}
                                            disabled={!copyValue}
                                            onClick={() => {
                                                if (!validateValue(colConfig, copyValue)) {
                                                    alert("Invalid value");
                                                    return;
                                                }

                                                // ✅ DEFINE FINAL VALUE
                                                let finalValue = copyValue;

                                                // 🔥 BOOLEAN FIX
                                                if (colConfig?.type === "boolean") {
                                                    finalValue = copyValue === "true";
                                                }

                                                // 🔥 NUMBER / FLOAT FIX (IMPORTANT)
                                                if (
                                                    ["number", "float", "percentage", "currency"].includes(colConfig?.type)
                                                ) {
                                                    finalValue = Number(copyValue);
                                                }

                                                // 🔥 DATE FIX (optional)
                                                if (colConfig?.type === "date") {
                                                    finalValue = copyValue; // already ISO (yyyy-mm-dd)
                                                }

                                                const selectedSet = new Set(allPageSelected);

                                                const eligibleIds = currentPageRows
                                                    .filter((row) => selectedSet.has(row.SR_NO))
                                                    .map((row) => row.SR_NO);

                                                // ✅ USE finalValue HERE
                                                setTableData((prev) =>
                                                    prev.map((row) =>
                                                        eligibleIds.includes(row.SR_NO)
                                                            ? { ...row, [column.key]: finalValue }
                                                            : row
                                                    )
                                                );

                                                setShowCopyManager(false);
                                                onClearFilter(column.key);
                                                onClose();
                                            }}
                                        >
                                            ✓
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )}
                </Box>
            </Popover>

            <TableFilterDialogBoxPage
                exportType={exportType}
                openExportDialog={openExportDialog}
                setOpenExportDialog={setOpenExportDialog}
                fileName={fileName}
                setFileName={setFileName}
                sortedData={sortedData}
                setOpenAlert={setOpenAlert}
                theme={theme}
                isDark={isDark}
            />
        </>
    );
}