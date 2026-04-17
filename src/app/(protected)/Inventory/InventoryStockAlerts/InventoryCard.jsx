'use clients';

import { useState, useMemo, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid
} from "@mui/material";
import InventoryDialog from "./InventoryDialog";

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "primary";
        case "inactive":
            return "default";
        default:
            return "default";
    }
};

const getAlertColor = (alert) => {
    switch (alert) {
        case "warning":
            return "warning";
        case "error":
            return "error";
        default:
            return "default";
    }
};

const getBorderColor = (alert) => {
    switch (alert) {
        case "warning":
            return "#ff9800";
        case "error":
            return "#f44336";
        default:
            return "#4caf50";
    }
};

const getBackGroundColor = (status) => {
    switch (status) {
        case "active":
            return "#349e72";
    }
};

export default function InventoryCard({
    item,
    setData,
    setScreenLoading,
    setSaveChangesFlag,
    theme,
    isDark
}) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };
    return (
        <>
            <Card
                sx={{
                    width: 325,
                    flex: "0 0 325px",
                    height: 200,
                    borderLeft: `4px solid ${getBorderColor(item.messageType)}`,
                    borderBottom: `4px solid ${getBorderColor(item.messageType)}`,
                    borderRadius: 2,
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.03)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    transition: "0.3s",
                    // "&:hover": {
                    //     transform: "translateY(-4px)",
                    // }
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(228, 161, 98, 0.4)",

                        "& .icon": {
                            color: "#fff",
                        },

                        "& .shine": {
                            transform: "translateX(200%)",
                        },
                    },
                }}
                onDoubleClick={() => handleOpen(item)}
            >
                <Box
                    className="shine"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                            "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transition: "0.25s",
                    }}
                />
                <CardContent>

                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontSize={11} fontWeight={300}>
                            {item.sku}
                        </Typography>

                        <Box display="flex" gap={1}>
                            <Chip
                                label={item.status}
                                size="small"
                                color={getStatusColor(item.status)}
                                sx={{ backgroundColor: getBackGroundColor(item.status) }}
                            />
                            <Chip
                                label={item.messageType}
                                size="small"
                                color={getAlertColor(item.messageType)}
                            />
                        </Box>
                    </Box>

                    {/* Product */}
                    <Typography mt={1} fontWeight={600}>
                        {item.productName}
                    </Typography>

                    <Typography fontSize={11} color="text.secondary">
                        {item.brand} • {item.category} • {item.unit}
                    </Typography>

                    {/* Metrics (Flex instead of Grid) */}
                    <Box
                        mt={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography fontSize={11}>Stock Qty</Typography>
                            <Typography color="error">{item.stockQty}</Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={11}>Available</Typography>
                            <Typography>{item.availableStock}</Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={11}>Demand</Typography>
                            <Typography color="success.main">{item.demandScore}</Typography>
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box
                        mt={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        fontSize={11}
                    >
                        <Typography fontSize={12}>
                            {item.warehouse} • {item.region}
                        </Typography>

                        <Typography fontStyle="italic" fontSize={12}>
                            {item.error_message}
                        </Typography>
                    </Box>

                </CardContent>
            </Card>

            <InventoryDialog
                open={open}
                onClose={() => setOpen(false)}
                setData={setData}
                setScreenLoading={setScreenLoading}
                setSaveChangesFlag={setSaveChangesFlag}
                item={selectedItem}
                theme={theme}
                isDark={isDark}
            />
        </>
    );
}