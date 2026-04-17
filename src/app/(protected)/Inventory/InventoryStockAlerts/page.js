"use client";

import CustomTable from "../../../../components/TableStructure/CustomTable";
import InventoryData from "../../../../data/InventoryData.json";
import {
    Box, Typography, Grid, useTheme, Divider,
    alpha, Card, CardContent, CardActions, Button
} from "@mui/material";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import GlobalLoader from "../../../../components/Loaders/GlobalLoader";
import SearchIcon from '@mui/icons-material/Search';
import DynamicSearchForm from "../../../../components/CustomFields/CustomFieldsMainFunction";
import DynamicCustomButtons from "../../../../components/CustomButtons/CustomButtons";
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryCard from "./InventoryCard";
import { useRouter } from "next/navigation";
import { useSaveJsonData } from "../../../../components/JsonFileUpdater/UseSaveJsonData";

// ─────────────────────────────────────────────────────────────
// CustomTable derives all columns automatically from the JSON
// shape of EMPLOYEES. No `columns` prop is needed or accepted.
// ─────────────────────────────────────────────────────────────
export default function InventoryStockAlertsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const router = useRouter();

    const [openSearchFieldsDialog, setOpenSearchFieldsDialog] = useState(false);

    const [searchInput, setSearchInput] = useState({});
    const [hasSearched, setHasSearched] = useState(false);

    const [screenLoading, setScreenLoading] = useState(true);
    const [data, setData] = useState([]);

    const { save, saving, result, error: saveError } = useSaveJsonData();

    const [saveChangeFlag, setSaveChangesFlag] = useState(false);
    // Screen Loading
    useEffect(() => {
        if (!screenLoading) return;
        const isReady =
            InventoryData.length > 0;

        if (isReady) {
            setScreenLoading(false);
        }
    }, [screenLoading]);

    const SearchInputFields = [
        {
            name: "messageType",
            label: 'Stock Alerts',
            type: "SELECT",
            value: [{ ID: "error" }, { ID: "warning" }],
            defaultValue: "",
            min: "",
            max: "",
            width: '100%',
            height: '',
            customStyles: {}
        },
        {
            name: "brand",
            label: 'Brand',
            type: "MULTISELECT",
            value: [
                { ID: "India Gate" }, { ID: "Daawat" }, { ID: "Fortune" }, { ID: "Aashirvaad" }, { ID: "Pillsbury" }, { ID: "Amul" }, { ID: "Mother Dairy" }, { ID: "Samsung" }, { ID: "LG" }, { ID: "Sony" }, { ID: "Dell" }, { ID: "HP" }, { ID: "Lenovo" }, { ID: "Apple" }, { ID: "OnePlus" }, { ID: "Zara" }, { ID: "H&M" }, { ID: "Levi's" }, { ID: "Nike" }, { ID: "Adidas" }, { ID: "Puma" }, { ID: "Whirlpool" }, { ID: "Saffola" }
            ],
            defaultValue: "",
            min: "",
            max: 7,
            width: '100%',
            height: '',
            customStyles: {}
        },
        {
            name: "category",
            label: 'Category',
            type: "SELECT",
            value: [{ ID: "Food" }, { ID: "Dairy" }, { ID: "Electronics" }, { ID: "Clothing" }, { ID: "Footwear" }],
            defaultValue: "",
            min: "",
            max: "",
            width: '100%',
            height: '',
            customStyles: {}
        },
        {
            name: "supplier",
            label: 'Supplier',
            type: "SELECT",
            value: [{ ID: "Tarun Logistics" }, { ID: "Akhil Logistics" }, { ID: "Samantha Logistics" }, { ID: "Raghu Logistics" }, { ID: "Prasad Logistics" },
            { ID: "Adhi Logistics" }, { ID: "Manvith Logistics" }, { ID: "Kishore Logistics" }, { ID: "Satya Logistics" }, { ID: "Eswar Logistics" }],
            defaultValue: "",
            min: "",
            max: "",
            width: '100%',
            height: '',
            customStyles: {}
        },
        {
            name: "warehouse",
            label: 'Warehouse',
            type: "SELECT",
            value: [{ ID: "Warehouse 0" }, { ID: "Warehouse 1" }, { ID: "Warehouse 2" }, { ID: "Warehouse 3" }, { ID: "Warehouse 4" }],
            defaultValue: "",
            min: "",
            max: "",
            width: '100%',
            height: '',
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
            width: '',
            height: '',
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
        const filtered = InventoryData.filter((item) =>
            ["error", "warning"].includes(item.messageType)
        );

        const filteredData = filterInventory(filtered, searchInput);

        setData(filteredData);   // 👈 your table data state
        setHasSearched(!hasSearched);         // 👈 to switch from dummy table
        setOpenSearchFieldsDialog(false);
    };

    const customButton = [
        {
            key: "apply",
            variant: "contained",
            type: "submit",
            sx: {
                backgroundColor: "#287dce", color: "#fff",
                width: '100%'
            },
            disabled: false,
            onClick: handleSearchButton,
            text: "Apply Filter"
        },
    ];

    // ── SAVE BUTTON ────────────────────────────────────────────────────────────
    // Sends only the dirty rows (those whose values differ from InventoryData).
    // Uses the id field as the unique key for matching.
    const handleSave = useCallback(async () => {
        await save(
            "src/data/InventoryData.json",   // relative path from project root
            data,                            // current edited state
            InventoryData,                   // original data for diff comparison
            "id"                             // primary key field
        );
    }, [save, data]);

    useEffect(() => {
        if (!saveChangeFlag) return;

        (async () => {
            await handleSave();
            setSaveChangesFlag(false);
            setScreenLoading(false);
            // router.push("/Inventory/InventoryDashboard");
        })();
    }, [saveChangeFlag]);

    return (
        <>  <GlobalLoader open={screenLoading} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, gap: 1, minHeight: 0 }}>
                <Box
                    sx={{
                        flex: "0 0 20%",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,       // ← required for flex children to shrink
                        borderRadius: 4,
                        background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
                        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                        width: '20%', height: "calc(100vh - 100px)",
                    }}
                >
                    <Typography fontSize={16} fontWeight={700}>
                        Inventory Stock Alerts
                    </Typography>
                    <Divider />
                    <DynamicSearchForm
                        SearchInputFields={SearchInputFields}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        theme={theme}
                        isDark={isDark}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', flex: 1, width: '100%' }}>
                        <Divider sx={{ mb: 0, width: '100%' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <DynamicCustomButtons customButton={customButton} />
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,

                        display: "flex",
                        flexWrap: "wrap",        // ✅ makes cards side by side
                        gap: 2,                  // spacing between cards

                        overflow: "hidden",       // ✅ scroll inside box
                        minHeight: 0,            // important for flex scroll

                        borderRadius: 4,
                        background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
                        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",

                        width: "80%", height: "calc(100vh - 100px)", // 🔥 adjust based on header
                        overflowY: "auto",
                        // 🔥 Chrome / Edge / Safari
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
                    }}
                >
                    {data.map((item, index) => (
                        <InventoryCard key={item.id}
                            item={item}
                            setData={setData}
                            setScreenLoading={setScreenLoading}
                            setSaveChangesFlag={setSaveChangesFlag}
                            theme={theme}
                            isDark={isDark} />
                    ))}
                </Box>
            </Box>
        </>
    );
}