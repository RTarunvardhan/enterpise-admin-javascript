"use client";

import {
    Dialog, DialogActions, DialogContent, DialogTitle, Paper,
    alpha, Zoom, Grow, Slide, Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import DynamicSearchForm from "./CustomFieldsMainFunction";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomFieldDialogBoxPage({
    openSearchFieldsDialog,
    setOpenSearchFieldsDialog,
    SearchInputFields,
    searchInput,
    setSearchInput,
    DialogBoxName,
    searchButton = false,
    handleSearchButton,
    theme,
    isDark
}) {
    return (
        <>
            <Dialog
                open={openSearchFieldsDialog}
                // onClose={() => setOpenSearchFieldsDialog(false)}
                PaperComponent={PaperComponent}
                maxWidth="md"
                TransitionComponent={Zoom}
                transitionDuration={400}
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backdropFilter: "blur(16px)",
                        background: isDark
                            ? "rgba(10, 23, 42, 0.55)"
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
                > {DialogBoxName}
                </DialogTitle>

                {/* CONTENT */}
                <DialogContent
                    sx={{
                        px: 2,
                        py: 2,
                        mt: 1.5
                    }}
                >
                    <DynamicSearchForm
                        SearchInputFields={SearchInputFields}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    {searchButton &&
                        <Button
                            onClick={handleSearchButton}
                            size="small"
                            variant="contained"
                            sx={{
                                fontSize: 12,
                                // color: theme.palette.text.secondary,
                                px: 2,
                                borderRadius: 2,
                                boxShadow: "none",
                                textTransform: "none",
                                backgroundColor: '#04da76',
                                width: 80
                            }}
                        >
                            Search
                        </Button>}

                    <Button
                        onClick={() => setOpenSearchFieldsDialog(false)}
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
                            width: 80
                        }}
                    >
                        Cancel
                    </Button>

                    {/*<Button
                        variant="contained"
                        size="small"
                        onClick={handleDownload}
                        sx={{
                            fontSize: 12,
                            px: 2,
                            borderRadius: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            width:80
                        }}
                    >
                        Download
                    </Button> */}
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