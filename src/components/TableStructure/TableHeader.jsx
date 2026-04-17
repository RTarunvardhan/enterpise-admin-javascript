"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  alpha,
  Box,
  Tooltip,
  IconButton,
  Checkbox
} from "@mui/material";

import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import TableHeaderFiltersPage from "./TableHeaderFilters";

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENT ─ TableHeader
// Sticky header row.  Each cell has:
//   • a filter icon that opens FilterPopover
//   • a 5 px drag handle on its right edge for resizing
//
// Props
//   columns        Array of enriched column objects (from deriveColumns)
//   columnWidths   { [key]: px }  — live override from drag-resize
//   onResizeStart  (e, key, startWidth, maxWidth) => void
//   filters        { [key]: string }
//   onFilterChange (key, value) => void
//   theme / isDark MUI theme refs
// ═══════════════════════════════════════════════════════════════
export default function TableHeader({
  columns,
  columnWidths,
  onResizeStart,
  filters,
  onFilterChange,
  operators,
  handleClearFilter,
  handleSort,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  currentPageRows,
  selected,
  setSelected,
  allPageSelected,
  setAllPageSelected,
  tableData,
  setTableData,
  headerHideColumns,
  setHeaderHideColumns,
  EditableColumns,
  TableDropDowns,
  sortedData,
  EnableCheckboxFlag,
  setOpenAlert,
  theme,
  isDark
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const openFilter = (e, col) => {
    e.stopPropagation();

    const cell = e.currentTarget.closest("th"); // 🔥 get TableCell

    setAnchorEl(cell); // ✅ anchor to full column
    setActiveColumn(col);
  };
  // const closeFilter = () => setAnchor({ el: null, key: null, label: null });
  const closeFilter = () => {
    setAnchorEl(null);
    setActiveColumn(null);
    setOrder('asc');
    setOrderBy(null);
  };

  const selectedSet = new Set(allPageSelected);

  const selectedCountOnPage = currentPageRows.filter((row) =>
    selectedSet.has(row.SR_NO)
  ).length;

  const isIndeterminate =
    selectedCountOnPage > 0 &&
    selectedCountOnPage < currentPageRows.length;

  const isChecked =
    currentPageRows.length > 0 &&
    selectedCountOnPage === currentPageRows.length;
  /**
 * HANDLER: handleSelectAll
 * INPUT: rows (The current visible filtered rows - currentPageRows)
 * PURPOSE: Toggles selection for only the visible filtered items
 */
  const handleSelectAll = (rows) => {
    const visibleIds = rows.map(r => r.SR_NO);
    setAllPageSelected(prev => {
      // Check if ALL currently visible rows are already in the selection
      const isAllVisibleSelected = visibleIds.every(id => prev.includes(id));

      if (isAllVisibleSelected) {
        // DESELECT: Remove only the visibleIds from the global selection
        return prev.filter(id => !visibleIds.includes(id));
      } else {
        // SELECT: Add visibleIds to global selection (avoiding duplicates)
        return [...new Set([...prev, ...visibleIds])];
      }
    });
  };
  /**
   * EFFECT: Sync 'selected' object based on 'allPageSelected'
   * PURPOSE: Categorizes selected IDs into their original page buckets (1-30, 31-60, etc.)
   */
  useEffect(() => {
    const rowsPerPage = 30; // Your defined page size
    const updatedSelected = {};

    allPageSelected.forEach(id => {
      // Find where this ID lives in the ORIGINAL master list
      const originalIndex = tableData.findIndex(row => row.SR_NO === id);

      if (originalIndex !== -1) {
        const originalPage = Math.floor(originalIndex / rowsPerPage);

        if (!updatedSelected[originalPage]) {
          updatedSelected[originalPage] = [];
        }
        updatedSelected[originalPage].push(id);
      }
    });

    setSelected(updatedSelected);
  }, [allPageSelected, tableData]);

  return (
    <>
      <TableHead>
        <TableRow>
          {EnableCheckboxFlag &&
            <TableCell
              padding="none"
              sx={{
                position: "sticky",
                left: 0, // Freeze horizontally
                top: 0,  // Freeze vertically
                zIndex: 10, // Higher than other headers
                bgcolor: isDark ? "#1e293b" : "#e2e8f0", // Match header color
                borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`, // Visual separator
                // padding: "2px 0px", // Reduced height
                // width: "25px !important",
                // maxWidth: "25px !important",
                p: 0, m: 0,

                overflow: "hidden",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                overflow: "hidden",
              }} >
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isChecked}
                  onChange={() => handleSelectAll(currentPageRows)}
                  size="small"
                  sx={{
                    p: 0.5, m: 0,
                    // border: '1px solid red', 
                    color: alpha(theme.palette.primary.main, 0.5),
                    '&.Mui-checked': { color: theme.palette.primary.main },
                    '&.MuiCheckbox-indeterminate': { color: theme.palette.primary.main },
                  }}
                />
              </Box>
            </TableCell>
          }
          {columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
            .map((col) => {
              const w = columnWidths[col.key] ?? col.defaultWidth;
              const isFiltered = Boolean(filters[col.key]?.operator);
              return (
                <TableCell
                  key={col.key}
                  sx={{
                    // sticky positioning
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    // column sizing — all three must match so layout is fixed
                    width: w,
                    minWidth: w,
                    // maxWidth: w,
                    // appearance
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: 0.4,
                    bgcolor: isDark ? "#1e293b" : "#e2e8f0",
                    color: theme.palette.text.primary,
                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    userSelect: "none",
                    padding: "1px 8px 1px 12px",
                  }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: "8px" }}>
                    <Box sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : "asc"}
                        onClick={() =>
                          handleSort(
                            col.key,
                            orderBy === col.key && order === "asc" ? "desc" : "asc"
                          )
                        }
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: theme.palette.text.primary,

                          "&.Mui-active": {
                            color: theme.palette.primary.main,
                          },
                          "& .MuiTableSortLabel-icon": {
                            color: `${theme.palette.primary.main} !important`,
                            fontSize: 16,
                          },
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    </Box>
                    <Tooltip title={isFiltered ? `Filtering: "${filters[col.key]}"` : "Add filter"} arrow>
                      <IconButton
                        size="small"
                        // onClick={(e) => openFilter(e, col.key, col.label)}
                        onClick={(e) => openFilter(e, col)}
                        sx={{
                          p: "2px",
                          color: isFiltered ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.35),
                          "&:hover": { color: theme.palette.primary.main },
                          flexShrink: 0,
                        }}
                      >
                        <FilterListAltIcon sx={{ fontSize: 14, padding: 0 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    onMouseDown={(e) => onResizeStart(e, col.key, w, col.maxWidth)}
                    sx={{
                      position: "absolute",
                      right: 0, top: 0, bottom: 0,
                      width: "5px",
                      cursor: "col-resize",
                      zIndex: 3,
                      transition: "background 0.15s",
                      "&:hover": { background: theme.palette.primary.main, opacity: 0.7 },
                    }}
                  />
                </TableCell>
              );
            })}
        </TableRow>
      </TableHead>

      <TableHeaderFiltersPage
        anchorEl={anchorEl}
        onClose={closeFilter}
        column={activeColumn}
        filterValue={filters[activeColumn?.key]}
        onFilterChange={onFilterChange}
        onSort={handleSort}
        // onHideColumn={handleHideColumn}
        onClearFilter={handleClearFilter}
        operators={operators}
        columns={columns}
        headerHideColumns={headerHideColumns}
        setHeaderHideColumns={setHeaderHideColumns}
        tableData={tableData}
        setTableData={setTableData}
        EditableColumns={EditableColumns}
        TableDropDowns={TableDropDowns}
        currentPageRows={currentPageRows}
        allPageSelected={allPageSelected}
        sortedData={sortedData}
        setOpenAlert={setOpenAlert}
        theme={theme}
        isDark={isDark}
      />
    </>
  );
};