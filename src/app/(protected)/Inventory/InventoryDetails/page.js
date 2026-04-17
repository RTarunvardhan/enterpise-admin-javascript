"use client";

import CustomTable from "../../../../components/TableStructure/CustomTable";
import { INVENTORY } from "../../../../data/Inventory";
import InventoryData from "../../../../data/InventoryData.json";
import { Box, Typography, IconButton, useTheme, Divider, alpha } from "@mui/material";
import { useState, useMemo, useEffect, useRef } from "react";
import GlobalLoader from "../../../../components/Loaders/GlobalLoader";
import SearchIcon from '@mui/icons-material/Search';
import CustomFieldDialogBoxPage from "../../../../components/CustomFields/InputSearchDialogBox";
import DefaultCustomTable from "../../../../components/DefaultCustomTable/defaultCustomTable";

// ─────────────────────────────────────────────────────────────
// CustomTable derives all columns automatically from the JSON
// shape of EMPLOYEES. No `columns` prop is needed or accepted.
// ─────────────────────────────────────────────────────────────
export default function InventoryDetailsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    let DialogBoxName = 'Inventory Details:';

    const [openSearchFieldsDialog, setOpenSearchFieldsDialog] = useState(false);

    const [searchInput, setSearchInput] = useState({});
    const [hasSearched, setHasSearched] = useState(false);

    const [screenLoading, setScreenLoading] = useState(true);
    const [data, setData] = useState([]);
    // Screen Loading
    useEffect(() => {
        if (!screenLoading) return;
        const isReady =
            InventoryData.length > 0;

        if (isReady) {
            setScreenLoading(false);
        }
    }, [screenLoading]);

    const TableRowHighlight = [
        {
            columnName: "messageType",
            columnValue: "error",
            rowHighlightFlag: true,
            columnHighLightFlag: false,
            specialCase: {}
        },
        {
            columnName: "messageType",
            columnValue: "warning",
            rowHighlightFlag: true,
            columnHighLightFlag: false,
            specialCase: {}
        },
        {
            columnName: "newProduct",
            columnValue: "true",
            rowHighlightFlag: true,
            columnHighLightFlag: false,
            specialCase: {}
        },
        {
            columnName: "discounted",
            columnValue: "true",
            rowHighlightFlag: false,
            columnHighLightFlag: true,
            specialCase: {}
        },
        {
            columnName: "brand",
            columnValue: "Apple",
            rowHighlightFlag: false,
            columnHighLightFlag: true,
            specialCase: {
                // sx: {
                //     color: "#fff",
                //     fontWeight: 700,
                //     textShadow: "0 0 6px #ff0000, 0 0 12px #ff0000",
                //     animation: "pulse 1.5s infinite",
                //     "@keyframes pulse": {
                //         "0%": { textShadow: "0 0 4px #ff0000" },
                //         "50%": { textShadow: "0 0 12px #ff0000" },
                //         "100%": { textShadow: "0 0 4px #ff0000" },
                //     },
                // }
                // sx: {
                //     color: "#fff",
                //     fontWeight: 700,
                //     textShadow: "0 0 8px rgba(255,0,0,0.9)",
                //     animation: "pulseGlow 1.5s infinite",
                // },
                // sx: {
                //     color: "#fff",
                //     fontWeight: 700,
                //     textShadow: "0 0 5px yellow",
                //     animation: "pulse 1s infinite",
                //     "@keyframes pulse": {
                //       "0%": { opacity: 1 }, "25%": { opacity: 0.7 },
                //       "50%": { opacity: 0.3 }, "75%": { opacity: 0.7 },
                //       "100%": { opacity: 1 },
                //     },
                //   }
                // sx: {
                //     color: "#fff",
                //     fontWeight: 700,
                //     background: "linear-gradient(90deg, rgba(239,68,68,0.25), rgba(239,68,68,0.05))",
                //     textShadow: "0 0 10px rgba(239,68,68,0.9)",
                //     boxShadow: "0 0 14px rgba(239,68,68,0.6)",
                //     animation: "dangerPulse 1.2s infinite",
                //     "@keyframes dangerPulse": {
                //       "0%": { boxShadow: "0 0 6px rgba(239,68,68,0.4)" },
                //       "50%": { boxShadow: "0 0 18px rgba(239,68,68,0.9)" },
                //       "100%": { boxShadow: "0 0 6px rgba(239,68,68,0.4)" },
                //     },
                //   }
                // sx: {
                //     color: "#dcfce7",
                //     fontWeight: 600,
                //     background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
                //     backdropFilter: "blur(6px)",
                //     border: "1px solid rgba(34,197,94,0.4)",
                //     boxShadow: "0 0 10px rgba(34,197,94,0.5)",
                //   }
                // sx: {
                //     color: "#fef3c7",
                //     fontWeight: 600,
                //     background: "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))",
                //     border: "1px solid rgba(251,191,36,0.4)",
                //     boxShadow: "0 0 10px rgba(251,191,36,0.4)",
                //   }
                // sx: {
                //     color: "#f5d0fe",
                //     fontWeight: 600,
                //     background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))",
                //     border: "1px solid rgba(168,85,247,0.4)",
                //     boxShadow: "0 0 16px rgba(168,85,247,0.6)",
                //     textShadow: "0 0 6px rgba(168,85,247,0.8)",
                //   }
                // sx: {
                //     background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))",
                //     color: "#dbeafe",
                //     fontWeight: 500,
                //     borderLeft: "3px solid #3b82f6",
                //   }
                // sx: {
                //     position: "relative",
                //     overflow: "hidden",
                //     background: "rgba(255,255,255,0.05)",
                //     "&::after": {
                //       content: '""',
                //       position: "absolute",
                //       top: 0,
                //       left: "-100%",
                //       width: "100%",
                //       height: "100%",
                //       background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
                //       animation: "shine 2s infinite",
                //     },
                //     "@keyframes shine": {
                //       "0%": { left: "-100%" },
                //       "100%": { left: "100%" },
                //     },
                //   }
                sx: {
                    color: "#e0f2fe",
                    fontWeight: 600,
                    background: "linear-gradient(120deg, rgba(56,189,248,0.2), rgba(14,165,233,0.05))",
                    boxShadow: "0 0 12px rgba(56,189,248,0.5)",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "200%",
                        height: "200%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)",
                        animation: "waterFlow 6s linear infinite",
                    },
                    "@keyframes waterFlow": {
                        "0%": { transform: "translate(-30%, -30%) rotate(0deg)" },
                        "100%": { transform: "translate(30%, 30%) rotate(360deg)" },
                    },
                }
                // sx:{
                //     color: "#fff",
                //     fontWeight: 700,
                //     background: "linear-gradient(90deg, rgba(250,204,21,0.25), rgba(250,204,21,0.05))",
                //     textShadow: "0 0 8px #facc15, 0 0 16px #fde047",
                //     boxShadow: "0 0 20px rgba(250,204,21,0.8)",
                //     animation: "lightningFlash 0.6s infinite",
                //     "@keyframes lightningFlash": {
                //       "0%, 100%": { opacity: 1 },
                //       "50%": { opacity: 0.4 },
                //     },
                //   }
                // sx:{
                //     color: "#e5e7eb",
                //     fontWeight: 600,
                //     background: "rgba(156,163,175,0.15)",
                //     position: "relative",
                //     overflow: "hidden",
                //     "&::before": {
                //       content: '""',
                //       position: "absolute",
                //       width: "200%",
                //       height: "200%",
                //       background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.2), transparent)",
                //       animation: "tornadoSpin 2s linear infinite",
                //     },
                //     "@keyframes tornadoSpin": {
                //       "0%": { transform: "rotate(0deg)" },
                //       "100%": { transform: "rotate(360deg)" },
                //     },
                //   }
                // sx:{
                //     color: "#fdf4ff",
                //     fontWeight: 600,
                //     background: "linear-gradient(135deg, rgba(192,132,252,0.2), rgba(236,72,153,0.05))",
                //     textShadow: "0 0 8px rgba(192,132,252,0.8)",
                //     boxShadow: "0 0 16px rgba(192,132,252,0.6)",
                //     animation: "auraPulse 2s infinite",
                //     "@keyframes auraPulse": {
                //       "0%": { boxShadow: "0 0 8px rgba(192,132,252,0.4)" },
                //       "50%": { boxShadow: "0 0 20px rgba(236,72,153,0.9)" },
                //       "100%": { boxShadow: "0 0 8px rgba(192,132,252,0.4)" },
                //     },
                //   }
                // sx: {
                //     position: "relative",
                //     overflow: "hidden",
                //     color: "#fff",
                //     fontWeight: 700,

                //     "&::before": {
                //       content: '""',
                //       position: "absolute",
                //       inset: 0,
                //       zIndex: 0,
                //       background: `
                //         radial-gradient(circle at 50% 100%, rgba(255,69,0,0.7), transparent 60%),
                //         radial-gradient(circle at 30% 100%, rgba(255,140,0,0.6), transparent 60%)
                //       `,
                //       animation: "fireMove 1s infinite linear",
                //     },

                //     "& *": {
                //       position: "relative",
                //       zIndex: 1,
                //     },

                //     "@keyframes fireMove": {
                //       "0%": { transform: "translateY(0)" },
                //       "50%": { transform: "translateY(-6px)" },
                //       "100%": { transform: "translateY(0)" },
                //     },
                //   }
                // sx: {
                //     position: "relative",
                //     overflow: "hidden",
                //     color: "#fff",

                //     "&::before": {
                //       content: '""',
                //       position: "absolute",
                //       inset: 0,
                //       zIndex: 0,
                //       background: "rgba(59,130,246,0.2)",
                //       animation: "lightningFlash 1s infinite",
                //     },

                //     "&::after": {
                //       content: '""',
                //       position: "absolute",
                //       inset: 0,
                //       background: "white",
                //       opacity: 0,
                //       animation: "lightningStrike 1s infinite",
                //     },

                //     "& *": { position: "relative", zIndex: 1 },

                //     "@keyframes lightningFlash": {
                //       "0%, 100%": { opacity: 0.2 },
                //       "50%": { opacity: 0.5 },
                //     },

                //     "@keyframes lightningStrike": {
                //       "0%, 90%, 100%": { opacity: 0 },
                //       "92%": { opacity: 0.9 },
                //       "94%": { opacity: 0 },
                //     },
                //   }
                // sx: {
                //     position: "relative",
                //     overflow: "hidden",
                //     color: "#e5e7eb",

                //     "&::before": {
                //       content: '""',
                //       position: "absolute",
                //       inset: "-50%",
                //       zIndex: 0,
                //       background: "conic-gradient(from 0deg, transparent, #9ca3af, transparent)",
                //       animation: "spin 2s linear infinite",
                //       opacity: 0.3,
                //     },

                //     "& *": { position: "relative", zIndex: 1 },

                //     "@keyframes spin": {
                //       "0%": { transform: "rotate(0deg)" },
                //       "100%": { transform: "rotate(360deg)" },
                //     },
                //   }
            }
        }
    ];

    const selectStyles = {
        control: (base, state) => ({
            ...base, // 'base' provides the standard React-Select layout
            // height: '60px',
            // minHeight: '60px',
            borderRadius: 5,
            padding: "0px 4px",

            background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.01)",

            border: `1px solid ${state.isFocused
                ? theme.palette.primary.main
                : isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.4)"
                }`,

            boxShadow: state.isFocused
                ? `0 0 0 1px ${theme.palette.primary.main}`
                : "none",

            "&:hover": {
                borderColor: theme.palette.primary.main,
                background: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
            },
            fontSize: '12px',
            width: 200,
            minWidth: 0,
        }),
        valueContainer: (base) => ({
            ...base,
            // height: '60px',
            padding: '0 6px',
        }),
        indicatorsContainer: (base) => ({
            ...base,
            // height: '60px',
        }),
        container: (base) => ({
            ...base,
            // minWidth: '200px', // Set your custom width here
            width: 200,
            flex: 1
        })
    }

    const SearchInputFields = [
        {
            name: "brand",
            label: 'Brand',
            type: "MULTISELECT",
            value: [
                { ID: "India Gate" }, { ID: "Daawat" }, { ID: "Fortune" }, { ID: "Aashirvaad" }, { ID: "Pillsbury" }, { ID: "Amul" }, { ID: "Mother Dairy" }, { ID: "Samsung" }, { ID: "LG" }, { ID: "Sony" }, { ID: "Dell" }, { ID: "HP" }, { ID: "Lenovo" }, { ID: "Apple" }, { ID: "OnePlus" }, { ID: "Zara" }, { ID: "H&M" }, { ID: "Levi's" }, { ID: "Nike" }, { ID: "Adidas" }, { ID: "Puma" }, { ID: "Whirlpool" }, { ID: "Saffola" }
            ],
            defaultValue: "",
            min: "",
            max: 5,
            customStyles: selectStyles
        },
        {
            name: "category",
            label: 'Category',
            type: "SELECT",
            value: [{ ID: "Food" }, { ID: "Dairy" }, { ID: "Electronics" }, { ID: "Clothing" }, { ID: "Footwear" }],
            defaultValue: "",
            min: "",
            max: "",
            customStyles: selectStyles
        },
        {
            name: "warehouse",
            label: 'Warehouse',
            type: "SELECT",
            value: [{ ID: "Warehouse 0" }, { ID: "Warehouse 1" }, { ID: "Warehouse 2" }, { ID: "Warehouse 3" }, { ID: "Warehouse 4" }],
            defaultValue: "",
            min: "",
            max: "",
            customStyles: selectStyles
        },
        {
            name: "availableStock",
            label: 'Available Stock',
            type: "NUMBER",
            value: '',
            defaultValue: "",
            min: 0,
            max: "",
            customStyles: {}
        },
        {
            name: "supplierRating",
            label: 'Supplier Rating',
            type: "FLOAT",
            value: '',
            defaultValue: "",
            min: 0,
            max: 100,
            customStyles: {}
        },
        {
            name: "unit",
            label: 'Unit',
            type: "TEXT",
            value: '',
            defaultValue: "",
            min: "",
            max: "",
            customStyles: {}
        },
        {
            name: "expiryDate",
            label: 'Expiry Date',
            type: "DATE",
            value: '',
            defaultValue: "",
            min: "",
            max: "",
            customStyles: {}
        },
        {
            name: "newProduct",
            label: 'New product',
            type: "CHECKBOX",
            value: [true, false],
            defaultValue: false,
            min: "",
            max: "",
            customStyles: {}
        },
        {
            name: "discounted",
            label: 'Discount',
            type: "SWITCH",
            value: [true, false],
            defaultValue: false,
            min: "",
            max: "",
            customStyles: {}
        },
        {
            name: "status",
            label: 'Status',
            type: "RADIO",
            value: [true, false],
            defaultValue: false,
            min: "",
            max: "",
            customStyles: {}
        }
    ]

    const getInitialSearchInput = (fields) => {
        const obj = {};

        fields.forEach((field) => {
            if (field.defaultValue !== undefined && field.defaultValue !== "") {
                obj[field.name] = field.defaultValue;
            }
        });

        return obj;
    };

    useEffect(() => {
        setSearchInput((prev) => ({
            ...getInitialSearchInput(SearchInputFields),
            ...prev, // preserve user input
        }));
    }, [SearchInputFields]);

    const filterInventory = (totaldata, filters) => {
        return totaldata.filter((item) => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === undefined || value === null || value === "") return true;

                const itemValue = item[key];

                // ARRAY
                if (Array.isArray(value)) {
                    if (!value.length) return true;
                    return value.some(v =>
                        String(v).trim().toLowerCase() ===
                        String(itemValue).trim().toLowerCase()
                    );
                }

                // BOOLEAN
                if (typeof value === "boolean") {
                    if (key === "status") {
                        return value
                            ? itemValue === "active"
                            : itemValue === "inactive";
                    }
                    return itemValue === value;
                }

                // NUMBER
                if (typeof value === "string" && value !== "" && !isNaN(Number(value))) {
                    return Number(itemValue) >= Number(value);
                }

                // DATE
                if (key.toLowerCase().includes("date")) {
                    return new Date(itemValue) >= new Date(value);
                }

                // STRING
                return String(itemValue || "")
                    .toLowerCase()
                    .includes(String(value).toLowerCase());
            });
        });
    };

    const handleSearchButton = () => {
        const filteredData = filterInventory(InventoryData, searchInput);

        setData(filteredData);   // 👈 your table data state
        setHasSearched(!hasSearched);         // 👈 to switch from dummy table
        setOpenSearchFieldsDialog(false);
    };

    return (
        <>
            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,       // ← required for flex children to shrink
                    borderRadius: 4,
                    background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
                    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                }}
            >
                <GlobalLoader open={screenLoading} />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center", // 🔥 This aligns them vertically in the center
                        gap: 1,
                        mb: 2 // Move the margin here to push the whole row down from whatever is below it
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            lineHeight: 1, // 🔥 Ensures no extra space above/below the text
                            m: 0           // Remove default margins
                        }}
                    >
                        Inventory Details
                    </Typography>

                    <IconButton
                        size="small" // Small is usually better for alignment with text
                        sx={{
                            ml: "auto",
                            // color: theme.palette.primary.main,
                            p: 0,         // Remove padding to match text height

                        }}
                        onClick={() => { setOpenSearchFieldsDialog(true);}}
                    >
                        <SearchIcon sx={{ fontSize: 24, color: isDark ? "#fff" : "#000", margin: '0px 10px 0px 5px' }} />
                    </IconButton>

                </Box>
                <Divider sx={{ my: 0.5 }} />
                {data.length > 0 ?
                    <CustomTable
                        data={data}
                        TableRowHighlight={TableRowHighlight}
                        EnableCheckboxFlag={false}
                        hasSearched={hasSearched}
                    />
                    :
                    <DefaultCustomTable
                        columnCount={7}
                    />
                }
            </Box>
            < CustomFieldDialogBoxPage
                openSearchFieldsDialog={openSearchFieldsDialog}
                setOpenSearchFieldsDialog={setOpenSearchFieldsDialog}
                SearchInputFields={SearchInputFields}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                DialogBoxName={DialogBoxName}
                searchButton={true}
                handleSearchButton={handleSearchButton}
                theme={theme}
                isDark={isDark}
            />
        </>
    );
}