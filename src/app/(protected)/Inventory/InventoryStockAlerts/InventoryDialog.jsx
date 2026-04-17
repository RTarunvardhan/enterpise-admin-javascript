'use clients';

import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    Chip,
    TextField,
    Button,
    IconButton,
    Paper,
    Zoom, Grow, Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";
import Draggable from "react-draggable";
import { useState, useEffect, useRef, useMemo } from "react";
import DynamicSearchForm from "../../../../components/CustomFields/CustomFieldsMainFunction";
import { customTextfieldStyles, customSingleSelectStyles } from "./customStyles";

import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InventoryDialog({
    open,
    onClose,
    setData,
    setScreenLoading,
    setSaveChangesFlag,
    item,
    theme,
    isDark
}) {
    if (!item) return null;

    const textPrimary = isDark ? "#fff" : theme.palette.text.primary;
    const textSecondary = isDark
        ? alpha("#fff", 0.7)
        : theme.palette.text.secondary;

    // console.log("item: ", item);

    const SearchInputFields = useMemo(() => [
        {
            name: "status",
            label: 'Status',
            type: "SELECT",
            value: [{ ID: "active" }, { ID: "inactive" }],
            defaultValue: item.status,
            min: "",
            max: "",
            width: '150',
            height: '',
            customStyles: customSingleSelectStyles(theme, isDark)
        },
        {
            name: "sellingPrice",
            label: 'Selling Price',
            type: "NUMBER",
            value: item.sellingPrice,
            defaultValue: item.sellingPrice,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "margin",
            label: 'Margin',
            type: "NUMBER",
            value: item.margin,
            defaultValue: item.margin,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "reorderLevel",
            label: 'Reorder Level',
            type: "NUMBER",
            value: item.reorderLevel,
            defaultValue: item.reorderLevel,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "minStockLevel",
            label: 'Min Stock Level',
            type: "NUMBER",
            value: item.minStockLevel,
            defaultValue: item.minStockLevel,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "maxStockLevel",
            label: 'Max Stock Level',
            type: "NUMBER",
            value: item.maxStockLevel,
            defaultValue: item.maxStockLevel,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "stockQty",
            label: 'Stock Qty',
            type: "NUMBER",
            value: item.stockQty,
            defaultValue: item.stockQty,
            min: 0,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "expiryDate",
            label: 'Expiry Date',
            type: "DATE",
            value: item.expiryDate,
            defaultValue: item.expiryDate,
            min: item.expiryDate,
            max: "",
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "discountPercent",
            label: 'Discount %',
            type: "NUMBER",
            value: item.discountPercent,
            defaultValue: item.discountPercent,
            min: 0,
            max: 100,
            width: '150',
            height: '',
            customStyles: customTextfieldStyles(theme, isDark, alpha)
        },
        {
            name: "transportStatus",
            label: 'Transport Status',
            type: "SELECT",
            value: [{ ID: "In Transit" }, { ID: "Delivered" }, { ID: "Pending" }],
            defaultValue: item.transportStatus,
            min: "",
            max: "",
            width: '150',
            height: '',
            customStyles: customSingleSelectStyles(theme, isDark)
        },
    ], [item.id, theme, isDark]);

    const getInitialSearchInput = (fields) => {
        const obj = {};

        fields.forEach((field) => {
            if (field.defaultValue !== undefined && field.defaultValue !== "") {
                obj[field.name] = field.defaultValue;
            }
        });

        return obj;
    };
    const [editedValue, setEditedValue] = useState(() => getInitialSearchInput(SearchInputFields));

    const numberFields = [
        "margin",
        "discountPercent",
        "sellingPrice",
        "stockQty",
        "minStockLevel",
        "maxStockLevel",
        "reorderLevel"
    ];

    const handleSaveChanges = () => {
        const cleanedEditedValue = Object.keys(editedValue).reduce((acc, key) => {
            let value = editedValue[key];

            if (numberFields.includes(key)) {
                value = value === "" ? "" : Number(value);
            }

            acc[key] = value;
            return acc;
        }, {});

        if ("discountPercent" in cleanedEditedValue) {
            cleanedEditedValue.discounted =
                cleanedEditedValue.discountPercent > 0;
        }

        const updatedItem = {
            ...item,
            ...cleanedEditedValue
        };
        setSaveChangesFlag(true);
        setData((prev) => {
            const index = prev.findIndex((r) => r.id === updatedItem.id);
            if (index === -1) return prev;

            const newData = [...prev];
            newData[index] = { ...newData[index], ...updatedItem };

            return newData;
        });
        setScreenLoading(true);
        onClose();
        console.log("updatedItem: ", updatedItem);
    };


    return (
        <Dialog
            open={open}
            // onClose={onClose}
            maxWidth="md"
            fullWidth
            TransitionComponent={Grow}
            transitionDuration={800}
            BackdropProps={{
                sx: {
                    backdropFilter: "blur(8px)",          // 🔥 BLUR EFFECT
                    backgroundColor: "rgba(0,0,0,0.3)"    // optional dark overlay
                }
            }}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    background: alpha(
                        isDark ? "#1e1e1e" : theme.palette.background.paper,
                        0.7
                    ),
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${alpha("#fff", 0.1)}`,
                    color: textPrimary,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        height: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent", // Clean look
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: isDark
                            ? "rgba(255, 255, 255, 0.3)"
                            : "rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: isDark
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(0, 0, 0, 0.4)",
                    },
                    // 🔥 Firefox Support
                    scrollbarWidth: "thin",
                    scrollbarColor: isDark
                        ? "rgba(255, 255, 255, 0.3) transparent"
                        : "rgba(0, 0, 0, 0.2) transparent",
                    overflowY: 'auto'
                }
            }}
            PaperComponent={PaperComponent}
        >
            <DialogContent sx={{ p: 3 }}>

                {/* HEADER */}
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography fontWeight={600} fontSize={18}>
                            {item.productName}
                        </Typography>
                        <Typography fontSize={12} sx={{ color: textSecondary }}>
                            {item.sku} • {item.category} • {item.brand}
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ color: textPrimary }} />
                    </IconButton>
                </Box>

                {/* WARNING */}
                {item.messageType && (
                    <Box
                        mt={1}
                        px={2}
                        py={1.5}
                        sx={{
                            background: alpha("#ff9800", 0.2),
                            border: `1px solid ${alpha("#ff9800", 0.4)}`,
                            borderRadius: 2,
                            color: isDark ? "#ffb74d" : "#000000"
                        }}
                    >
                        <b>{item.messageType?.toUpperCase()}:</b> {item.error_message}
                    </Box>
                )}

                {/* PRODUCT INFO */}
                <Section title="PRODUCT INFO">
                    <FlexRow>
                        <Info label="SKU" value={item.sku} />
                        <Info label="Barcode" value={item.barcode} />
                        <Info label="Batch" value={item.batchNo} />
                        {/* </FlexRow>

                    <FlexRow> */}
                        <Info label="Model" value={item.model} />
                        <Info label="Variant" value={item.variant} />
                        <Info label="Supplier" value={item.supplier} />
                    </FlexRow>

                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                        {item.newProduct && <Chip label="new product" size="small" />}
                        {item.trending && <Chip label="trending" size="small" />}
                        {item.discounted && <Chip label="discounted" size="small" />}
                        {item.returnable && <Chip label="returnable" size="small" />}
                        {item.fragile && <Chip label="fragile" size="small" />}
                        {item.temperatureSensitive && (
                            <Chip label="temperature sensitive" size="small" color="primary" />
                        )}
                    </Box>
                </Section>

                {/* EDITABLE */}
                <Section title="EDITABLE FIELDS">
                    <FlexRow>
                        <DynamicSearchForm
                            SearchInputFields={SearchInputFields}
                            searchInput={editedValue}
                            setSearchInput={setEditedValue}
                            theme={theme}
                            isDark={isDark}
                        />
                    </FlexRow>
                </Section>

                {/* STOCK */}
                <Section title="STOCK & LOCATION">
                    <FlexRow>
                        <Info label="Stock Qty" value={item.stockQty} />
                        <Info label="Reserved" value={item.reservedStock} />
                        <Info label="Available" value={item.availableStock} />
                        {/* </FlexRow>

                    <FlexRow> */}
                        <Info label="Warehouse" value={item.warehouse} />
                        <Info label="Zone - Rack" value={`${item.zone} - ${item.rack}`} />
                        <Info label="Bin" value={item.bin} />
                    </FlexRow>
                </Section>

                {/* SALES */}
                <Section title="SALES PERFORMANCE">
                    <FlexRow>
                        <Info label="Demand Score" value={`${item.demandScore}/100`} />
                        <Info label="Last 7 days" value={item.salesLast7Days} />
                        <Info label="Last 30 days" value={item.salesLast30Days} />
                        {/* </FlexRow>

                    <FlexRow> */}
                        <Info label="Purchase Price" value={`₹${item.purchasePrice}`} />
                        <Info label="Profit" value={`₹${item.profit}`} />
                        <Info label="Tax %" value={`${item.taxPercent}%`} />
                    </FlexRow>
                </Section>

                {/* ACTIONS */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveChanges}>Save changes</Button>
                </Box>

            </DialogContent>
        </Dialog>
    );
}

/* 🔥 REUSABLE COMPONENTS */

const Section = ({ title, children, isDark }) => (
    <Box mt={3}>
        <Typography fontSize={12} fontWeight={600} mb={1}>
            {title}
        </Typography>
        <Box sx={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #3b3b3b" }} mb={2} />
        {children}
    </Box>
);

const FlexRow = ({ children }) => (
    <Box display="flex" gap={2} mb={1} flexWrap="wrap">
        {children}
    </Box>
);

const Info = ({ label, value }) => (
    <Box flex={1} minWidth={120}>
        <Typography fontSize={11} color="text.secondary">
            {label}
        </Typography>
        <Typography fontWeight={600}>{value}</Typography>
    </Box>
);

const Field = ({ label, value }) => (
    <Box sx={{
        flex: "0 0 auto",   // 🔥 STOP flex grow
        width: 150,         // default width
        gap: 1.5, mt: 0.5
    }}>
        <TextField
            label={label}
            defaultValue={value}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
        />
    </Box>
);

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