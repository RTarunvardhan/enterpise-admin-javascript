"use client";

import CustomTable from "../../../../components/TableStructure/CustomTable";
import CustomTableNoPage from "../../../../components/TableStructureNoPage/CustomTableNoPage";
import { INVENTORY } from "../../../../data/Inventory";
import InventoryData from "../../../../data/InventoryData.json";
import {
    Box, Typography, useTheme, alpha, IconButton,
    Tabs, Tab
} from "@mui/material";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import GlobalLoader from "../../../../components/Loaders/GlobalLoader";
import CustomPageTabs from "./customTabs";
import CustomHeaderPage from "./customHeader";
import { Menu, ChevronLeft, Height } from "@mui/icons-material";
import { motion } from "framer-motion";

import HomeIcon from "@mui/icons-material/Home";
import RuleIcon from "@mui/icons-material/Rule";
import MapIcon from "@mui/icons-material/Map";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
// import {SearchIcon} from "@mui/icons-material/Search";
import SearchIcon from '@mui/icons-material/Search';

const menu = [
    { label: "Home", icon: <HomeIcon fontSize="small" /> },
    { label: "Rules", icon: <RuleIcon fontSize="small" /> },
    { label: "Item Map", icon: <MapIcon fontSize="small" /> },
    { label: "Limits", icon: <FormatListNumberedIcon fontSize="small" /> },
];

// ─────────────────────────────────────────────────────────────
// CustomTable derives all columns automatically from the JSON
// shape of INVENTORY. No `columns` prop is needed or accepted.
// ─────────────────────────────────────────────────────────────
export default function InventoryScreensPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [openNav, setOpenNav] = useState(false);

    const [screenLoading, setScreenLoading] = useState(true);
    // Screen Loading
    useEffect(() => {
        if (!screenLoading) return;

        const isReady =
            INVENTORY.length > 0;

        if (isReady) {
            setScreenLoading(false);
        }
    }, [screenLoading]);

    const columns = [
        "productName",
        "brand",
        "unit",
        "status",
        "demandScore",
        "weight",
        "color",
        "size",
        "expiryDate",
        "margin",
        "model",
        "supplierRating"
    ];

    const filteredData = useMemo(() => {
        const uniqueMap = new Map();

        INVENTORY.forEach((row) => {
            const newRow = {};

            columns.forEach((key) => {
                newRow[key] = row[key];
            });

            // 🔥 create unique key
            const uniqueKey = columns.map((col) => row[col]).join("|");

            if (!uniqueMap.has(uniqueKey)) {
                uniqueMap.set(uniqueKey, newRow);
            }
        });

        return Array.from(uniqueMap.values());
    }, [INVENTORY, columns]);

    const [screenChangeTab, setScreenChangeTab] = useState(0);

    const tabs = [
        {
            id: 0,
            label: "Create Allocation",
            value: "create",
        },
        {
            id: 1,
            label: "Rules and Location",
            value: "rules",
        },
        {
            id: 2,
            label: "Like Item Map",
            value: "itemMap",
        },
        {
            id: 3,
            label: "Quantity Limits",
            value: "limits",
        },
        {
            id: 4,
            label: "Allocation Details",
            value: "details",
        },
        {
            id: 5,
            label: "Size Details",
            value: "size",
        },
        {
            id: 6,
            label: "Shirt Details",
            value: "shirt",
        },
        {
            id: 7,
            label: "Pant Details",
            value: "pant",
        },
        {
            id: 8,
            label: "Shoe Details",
            value: "shoe",
        },
        {
            id: 9,
            label: "Car Details",
            value: "car",
        },
        {
            id: 10,
            label: "Bike Details",
            value: "bike",
        },
        {
            id: 11,
            label: "Food Details",
            value: "food",
        },
        {
            id: 12,
            label: "Phone Details",
            value: "phone",
        }
    ];
    // console.log('filteredData: ',filteredData);

    // const SearchInputFields = [
    //     {
    //         name: "brand",
    //         label: 'Brand',
    //         type: "MULTISELECT",
    //         value: [
    //             { ID: "India Gate" }, { ID: "Daawat" }, { ID: "Fortune" }, { ID: "Aashirvaad" }, { ID: "Pillsbury" }, { ID: "Amul" }, { ID: "Mother Dairy" }, { ID: "Samsung" }, { ID: "LG" }, { ID: "Sony" }, { ID: "Dell" }, { ID: "HP" }, { ID: "Lenovo" }, { ID: "Apple" }, { ID: "OnePlus" }, { ID: "Zara" }, { ID: "H&M" }, { ID: "Levi's" }, { ID: "Nike" }, { ID: "Adidas" }, { ID: "Puma" }, { ID: "Whirlpool" }, { ID: "Saffola" }
    //         ],
    //         defaultValue: "",
    //         min: "",
    //         max: 5,
    //         customStyles: {}
    //     },
    //     {
    //         name: "caterory",
    //         label: 'Caterory',
    //         type: "SELECT",
    //         value: [{ ID: "Food" }, { ID: "Dairy" }, { ID: "Electronics" }, { ID: "Clothing" }, { ID: "Footwear" }],
    //         defaultValue: "",
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "warehouse",
    //         label: 'Warehouse',
    //         type: "SELECT",
    //         value: [{ ID: "Warehouse 0" }, { ID: "Warehouse 1" }, { ID: "Warehouse 2" }, { ID: "Warehouse 3" }, { ID: "Warehouse 4" }],
    //         defaultValue: "",
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "availableStock",
    //         label: 'Available Stock',
    //         type: "NUMBER",
    //         value: '',
    //         defaultValue: "5",
    //         min: 0,
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "supplierRating",
    //         label: 'Supplier Rating',
    //         type: "FLOAT",
    //         value: '',
    //         defaultValue: "",
    //         min: 0,
    //         max: 100,
    //         customStyles: {}
    //     },
    //     {
    //         name: "unit",
    //         label: 'Unit',
    //         type: "TEXT",
    //         value: '',
    //         defaultValue: "",
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "expiryDate",
    //         label: 'Expiry Date',
    //         type: "DATE",
    //         value: '',
    //         defaultValue: "",
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "newProduct",
    //         label: 'New product',
    //         type: "CHECKBOX",
    //         value: [true, false],
    //         defaultValue: true,
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "discounted",
    //         label: 'Discount',
    //         type: "SWITCH",
    //         value: [true, false],
    //         defaultValue: false,
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     },
    //     {
    //         name: "status",
    //         label: 'Status',
    //         type: "RADIO",
    //         value: [true, false],
    //         defaultValue: false,
    //         min: "",
    //         max: "",
    //         customStyles: {}
    //     }
    // ]

    return (
        <>
            <Box sx={{
                // height: "calc(100vh - 10px)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden" // 🔥 Prevents any child from leaking out
            }}>
                <GlobalLoader open={screenLoading} />
                <CustomPageTabs
                    tabs={tabs}
                    screenChangeTab={screenChangeTab}
                    setScreenChangeTab={setScreenChangeTab}
                    theme={theme}
                    isDark={isDark}
                />
                <CustomHeaderPage
                    theme={theme}
                    isDark={isDark}
                />
                <Box //sx={{border:'10px solid maroon'}}
                    sx={{
                        flex: 1,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,       // ← required for flex children to shrink
                        borderRadius: 1,
                        background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
                        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                        // height: "calc(100vh - 130px)",
                        overflow: "hidden",
                        mt: 1
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                            mb: 0.5,
                            flexShrink: 0,          // ← never shrink
                        }}
                    >
                        <Typography variant="h6" sx={{ lineHeight: 1, m: 0 }}>
                            Inventory Screen
                        </Typography>
                        <IconButton size="small" sx={{ ml: "auto", p: 0 }}>
                            <SearchIcon sx={{ fontSize: 24, color: isDark ? "#fff" : "#000", margin: "0px 10px 0px 5px" }} />
                        </IconButton>
                    </Box>
                    <Suspense fallback={<GlobalLoader open={true} />}>
                        <CustomTableNoPage
                            data={filteredData}
                            // data={InventoryData}
                            tableHeight="calc(100vh - 310px)"
                        />
                    </Suspense>
                </Box>
            </Box>
        </>
    );
}


{/* <Box sx={{
            height: "calc(100vh - 10px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden" // 🔥 Prevents any child from leaking out
         }}>
            <GlobalLoader open={screenLoading} />
            <CustomPageTabs
                tabs={tabs}
                screenChangeTab={screenChangeTab}
                setScreenChangeTab={setScreenChangeTab}
                theme={theme}
                isDark={isDark}
            />
            <CustomHeaderPage
                theme={theme}
                isDark={isDark}
            />
            <Box
                sx={{
                    // flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,       // ← required for flex children to shrink
                    borderRadius: 4,
                    background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
                    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                    // height: "calc(100vh - 130px)",
                    overflow: "hidden",
                    mt: 1
                }}
            >
                <Typography variant="h5" mt={0} mb={1}>Testing MUI tabs</Typography>
                <Suspense fallback={<GlobalLoader open={true} />}>
                    <CustomTableNoPage data={filteredData} />
                </Suspense>
            </Box>
          </Box> */}

        //   <motion.div
        //             animate={{
        //                 width: openNav ? "10%" : "3%", // 🔥 adjust here                        
        //             }}
        //             transition={{ duration: 1.3 }}
        //             style={{ display: "flex", minWidth: openNav ? "10%" : "3%", }}
        //             onClick={() => setOpenNav(!openNav)}
        //         >
        //             <Box
        //                 sx={{
        //                     p: 1,
        //                     display: "flex",
        //                     flexDirection: "column",
        //                     alignItems: openNav ? "flex-start" : "center",
        //                     justifyContent: "flex-start",
        //                     // minHeight: "90vh",
        //                     borderRadius: 1,
        //                     mt: 0.5,
        //                     ml: 0,
        //                     width: "100%",

        //                     background: alpha(
        //                         isDark ? "#3d3d3d" : "#ffffff",
        //                         isDark ? 0.4 : 0.7
        //                     ),
        //                     backdropFilter: "blur(12px)",
        //                     border: `1px solid ${alpha(
        //                         isDark ? "#ffffff" : "#000000",
        //                         0.6
        //                     )}`,
        //                     boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        //                 }}
        //             >
        //                 <IconButton onClick={() => setOpenNav(!openNav)} sx={{ p: 1, m: 0, }}>
        //                     {!openNav ? <Menu /> : <ChevronLeft sx={{ ml: 1 }} />}
        //                 </IconButton>

        //                 <Box sx={{ mt: 0, width: "100%" }}>
        //                     {menu.map((item) => (
        //                         <Box
        //                             key={item.label}
        //                             sx={{
        //                                 py: 1,
        //                                 px: openNav ? 2 : 0,
        //                                 display: "flex",
        //                                 alignItems: "center",
        //                                 justifyContent: openNav ? "flex-start" : "center",
        //                                 gap: openNav ? 1.2 : 0,
        //                                 borderRadius: 1,
        //                                 cursor: "pointer",
        //                                 transition: "all 0.2s ease",
        //                                 "&:hover": {
        //                                     bgcolor: alpha(theme.palette.primary.main, 0.1),
        //                                     transform: openNav ? "translateX(4px)" : "scale(1.1)",
        //                                 },
        //                             }}
        //                         >
        //                             {/* 🔹 ICON */}
        //                             <Box
        //                                 sx={{
        //                                     display: "flex",
        //                                     alignItems: "center",
        //                                     justifyContent: "center",
        //                                     color: theme.palette.text.primary,
        //                                 }}
        //                             >
        //                                 {item.icon}
        //                             </Box>

        //                             {/* 🔹 TEXT */}
        //                             {openNav && (
        //                                 <Typography fontSize={14} fontWeight={500}>
        //                                     {item.label}
        //                                 </Typography>
        //                             )}
        //                         </Box>
        //                     ))}
        //                 </Box>
        //             </Box>
        //         </motion.div>

        //         <motion.div
        //             animate={{
        //                 width: openNav ? "90%" : "97%", // 🔥 adjust here                        
        //             }}
        //             transition={{ duration: 0.01 }}
        //             style={{ display: "flex", flexGrow: 1, minHeight: 0 }}
        //             onClick={() => setOpenNav(false)}
        //         >
        //             <Box
        //                 sx={{
        //                     p: 1,
        //                     display: "flex",
        //                     flexDirection: "column",
        //                     flex: 1,
        //                     minHeight: 0,
        //                     overflow: "hidden",       // ← key: contain everything inside
        //                     borderRadius: 1,
        //                     mt: 0.5,
        //                     background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
        //                     backdropFilter: "blur(12px)",
        //                     border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.6)}`,
        //                     boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        //                 }}
        //             >
        //                 <Box
        //                     sx={{
        //                         display: "flex",
        //                         alignItems: "center",
        //                         gap: 0,
        //                         mb: 0.5,
        //                         flexShrink: 0,          // ← never shrink
        //                     }}
        //                 >
        //                     <Typography variant="h6" sx={{ lineHeight: 1, m: 0 }}>
        //                         Inventory Screen
        //                     </Typography>
        //                     <IconButton size="small" sx={{ ml: "auto", p: 0 }}>
        //                         <SearchIcon sx={{ fontSize: 24, color: isDark ? "#fff" : "#000", margin: "0px 10px 0px 5px" }} />
        //                     </IconButton>
        //                 </Box>

        //                 <Box sx={{ flexShrink: 0 }}>
        //                     <CustomHeaderPage theme={theme} isDark={isDark} />
        //                 </Box>

        //                 <Box
        //                     sx={{
        //                         flex: 1,
        //                         // minHeight: 0,           // ← critical for flex child to shrink
        //                         display: "flex",
        //                         flexDirection: "column",
        //                         mt: 1,
        //                         borderRadius: 1,
        //                         border: isDark?"1px solid rgba(255, 255, 255, 0.6)":"1px solid rgba(10, 10, 10, 0.6)"
        //                     }}
        //                 >
        //                     <CustomTableNoPage
        //                         data={filteredData}
        //                         tableHeight="calc(100vh - 250px)"    
        //                     />
        //                 </Box>
        //             </Box>
        //         </motion.div>