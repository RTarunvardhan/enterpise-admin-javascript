"use client";

import { TablePagination } from "@mui/material";

export default function TablePaginationPage({
    sortedData,
    currentPageRows,
    setcurrentPageRows,
    allPageSelected,
    page,
    setPage,
    rowsPerPage,
    EnableCheckboxFlag,
    theme,
    isDark,
}) {
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // GLASS CHANGE ✦ – frosted footer separator
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                padding: "0 8px",
            }}
        >
            {/* 🔹 LEFT SIDE */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {(() => {
                    const selectedCount = currentPageRows.filter((row) =>
                        allPageSelected.includes(Number(row.SR_NO))
                    ).length;

                    return selectedCount > 0 ? (
                        <span
                            style={{
                                margin: "0px 0px 0px 15px", fontSize: "14px",
                                color: theme.palette.text.primary
                            }}
                        >
                            Selected : {selectedCount}
                        </span>
                    ) : null;
                })()}
            </div>

            {/* RIGHT SIDE */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px", //  spacing between items
                }}
            >
                {/* Total Selected */}
                {EnableCheckboxFlag &&
                    (() => {
                        const selectedCount = sortedData.filter((row) =>
                            allPageSelected.includes(Number(row.SR_NO))
                        ).length;

                        return selectedCount > 0 ? (
                            <span
                                style={{
                                    margin: "0px 0px 0px 15px", fontSize: "14px",
                                    color: theme.palette.text.primary
                                }}
                            >
                                Total Selected: {selectedCount}
                            </span>
                        ) : null;
                    })()}

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[30]}
                    component="div"
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    sx={{
                        "& .MuiToolbar-root": {
                            minHeight: "36px !important",
                            height: "36px !important",
                            padding: "0 !important",
                            overflow: "hidden",
                            alignItems: "center",
                        },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                            fontSize: "14px",
                            lineHeight: "1",
                            margin: 0,
                        },
                        "& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions": {
                            color: theme.palette.text.primary,  // muted slate text for page count
                        },
                    }}
                />
            </div>
        </div>
    );
}