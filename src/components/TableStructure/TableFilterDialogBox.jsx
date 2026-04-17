"use client";

import {
    Dialog, DialogActions, DialogContent, DialogTitle, Paper,
    alpha, Select, TextField, Stack, Button, Box, Alert, Snackbar
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { deserializeData } from "./TableDataSerialize";

export default function TableFilterDialogBoxPage({
    exportType,
    openExportDialog,
    setOpenExportDialog,
    fileName,
    setFileName,
    sortedData,
    setOpenAlert,
    theme,
    isDark
}) {
    const handleDownload = () => {
        let blob;
        let extension = exportType;

        const data = deserializeData(sortedData);
        if (!data.length) return;

        if (exportType === "json") {
            blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            });
        }

        if (exportType === "csv") {
            const headers = Object.keys(data[0]);
            const rows = data.map(r =>
                headers.map(h => `"${r[h] ?? ""}"`).join(",")
            );
            const csv = [headers.join(","), ...rows].join("\n");

            blob = new Blob([csv], { type: "text/csv" });
        }

        if (exportType === "sql") {
            const cols = Object.keys(data[0]);

            const values = data.map(row => {
                const vals = cols.map(c => {
                    const v = row[c];
                    if (v == null) return "NULL";
                    if (typeof v === "number") return v;
                    return `'${String(v).replace(/'/g, "''")}'`;
                });
                return `(${vals.join(",")})`;
            });

            const sql = `INSERT INTO employees (${cols.join(",")}) VALUES\n${values.join(",\n")};`;

            blob = new Blob([sql], { type: "text/plain" });
        }

        if (exportType === "excel") {
            import("xlsx").then((XLSX) => {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Data");

                XLSX.writeFile(wb, `${fileName}.xlsx`);
            });
            setOpenExportDialog(false);
            return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.${extension}`;
        a.click();

        setOpenExportDialog(false);
    };

    const handleCopyToClipboard = async () => {
        const data = deserializeData(sortedData);
        if (!data.length) return;

        let textToCopy = "";

        if (exportType === "json") {
            textToCopy = JSON.stringify(data, null, 2);
        }

        if (exportType === "csv") {
            const headers = Object.keys(data[0]);
            const rows = data.map(r =>
                headers.map(h => `"${r[h] ?? ""}"`).join(",")
            );
            textToCopy = [headers.join(","), ...rows].join("\n");
        }

        if (exportType === "sql") {
            const cols = Object.keys(data[0]);

            const values = data.map(row => {
                const vals = cols.map(c => {
                    const v = row[c];
                    if (v == null) return "NULL";
                    if (typeof v === "number") return v;
                    return `'${String(v).replace(/'/g, "''")}'`;
                });
                return `(${vals.join(",")})`;
            });

            textToCopy = `INSERT INTO employees (${cols.join(",")}) VALUES\n${values.join(",\n")};`;
        }

        // ❌ Excel not supported for clipboard
        if (exportType === "excel") {
            const headers = Object.keys(data[0]);
            const rows = data.map(r =>
                headers.map(h => r[h] ?? "").join("\t")
            );
            textToCopy = [headers.join("\t"), ...rows].join("\n");
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            // console.log("Copied to clipboard ✅");
        } catch (err) {
            console.error("Clipboard error:", err);
        }

        setOpenAlert(true);
        setOpenExportDialog(false);
    };
    return (
        <>
            <Dialog
                open={openExportDialog}
                onClose={() => setOpenExportDialog(false)}
                PaperComponent={PaperComponent}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backdropFilter: "blur(16px)",
                        background: isDark
                            ? "rgba(15, 23, 42, 0.85)"
                            : "rgba(255, 255, 255, 0.75)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        boxShadow: isDark
                            ? "0 20px 60px rgba(0,0,0,0.7)"
                            : "0 20px 60px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                    },
                }}
            >
                {/* HEADER */}
                <DialogTitle
                    id="draggable-dialog-title"
                    sx={{
                        cursor: "move",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        px: 2,
                        py: 1.5,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Export File Name
                </DialogTitle>

                {/* CONTENT */}
                <DialogContent
                    sx={{
                        px: 2,
                        py: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        // label="File Name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        autoFocus
                        sx={{
                            marginTop: 1,
                            "& .MuiInputBase-root": {
                                fontSize: 13,
                                borderRadius: 1.5,
                                px: 1,
                                py: 0.4,
                                background: isDark
                                    ? "rgba(255,255,255,0.03)"
                                    : "rgba(0,0,0,0.03)",
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

                                "&:hover": {
                                    background: isDark
                                        ? "rgba(255,255,255,0.05)"
                                        : "rgba(0,0,0,0.05)",
                                },

                                "&.Mui-focused": {
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                                },
                            },

                            "& .MuiInputBase-input": {
                                fontSize: 13,
                            },
                        }}
                    />
                </DialogContent>

                {/* FOOTER */}
                <DialogActions
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleCopyToClipboard}
                            sx={{
                                fontSize: 12,
                                px: 2,
                                borderRadius: 2,
                                boxShadow: "none",
                                textTransform: "none",
                                // width: 80
                            }}
                        >
                            Copy Clipboard
                        </Button>

                        <Box >
                            <Button
                                onClick={() => setOpenExportDialog(false)}
                                size="small"
                                variant="contained"
                                sx={{
                                    fontSize: 12,
                                    // color: theme.palette.text.secondary,
                                    px: 2,
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    textTransform: "none",
                                    backgroundColor: '#ef4444',
                                    width: 80, margin: '0px 10px 0px 0px'
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleDownload}
                                sx={{
                                    fontSize: 12,
                                    px: 2,
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    textTransform: "none",
                                    width: 80
                                }}
                            >
                                Download
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

const PaperComponent = (props) => {
    // useRef avoids the deprecated ReactDOM.findDOMNode call inside Draggable
    const nodeRef = useRef(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
            bounds="body"
        >
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
};