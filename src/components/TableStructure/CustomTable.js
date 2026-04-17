"use client";

// Core React Imports
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Table,
  TableBody as MuiTableBody,
  TableContainer,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import GlobalLoader from "../Loaders/GlobalLoader";
import TablePaginationPage from "./TablePagination";
import TableHeader from "./TableHeader";
import TableBodyRows from "./TableBody";
import TableFooterTotals from "./TableFooter";
import { getComparator, stableSort } from "./TableSorting";
import { serializedata } from "./TableDataSerialize";


// ═══════════════════════════════════════════════════════════════
// CONSTANTS — tweak here to change global table sizing behaviour
// ═══════════════════════════════════════════════════════════════
const CHAR_PX = 8;    // estimated px per character at 13 px font
const WIDTH_DEFAULT = 1.5;  // default column width  = longest content × this
const WIDTH_MAX = 5;    // max resize width      = longest content × this
const MIN_COL_PX = 80;   // absolute floor after drag-resize

// ═══════════════════════════════════════════════════════════════
// UTIL ─ deriveColumns
// Reads the shape of data[0] and measures every value in each
// column to produce a sensible default + max pixel width.
//
// INPUT : data — Array of plain JSON objects
// OUTPUT: Array of { key, label, defaultWidth, maxWidth }
// ═══════════════════════════════════════════════════════════════
const deriveColumns = (data) => {
  if (!data?.length) return [];

  return Object.keys(data[0]).map((key) => {
    const label = key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .toUpperCase();

    let maxChars = label.length;
    for (const row of data) {
      const v = row[key];
      if (v != null) maxChars = Math.max(maxChars, String(v).length);
    }

    const contentPx = maxChars * CHAR_PX;
    const defaultWidth = Math.max(contentPx * WIDTH_DEFAULT, 100);
    const maxWidth = contentPx * WIDTH_MAX;
    return { key, label, defaultWidth, maxWidth };
  });
};


// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT ─ CustomTable
//
// ONLY REQUIRED PROP:
//   data  →  Array of plain JSON objects
//
// Columns are derived automatically from data[0] keys.
// Default width  = longest value length × 1.5 × CHAR_PX
// Max width      = longest value length × 5   × CHAR_PX
// Both breakpoint detection and external columns prop
// have been removed — the table handles everything itself.
//
// USAGE:
//   <CustomTable data={EMPLOYEES} />
// ═══════════════════════════════════════════════════════════════
export default function CustomTable({
  data = [], // JSON Array
  EditableColumns = [], // Editable Column in Table body
  TableDropDowns = {}, // Editable Column dropdowns in Table body
  hideColumns = [], // Table Header hide the columns
  TotalTableColumnValueCount = [], // Table sum of values of specific columns in Table footer
  TableRowHighlight = [],
  EnableCheckboxFlag = true,
  hasSearched = false,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [screenLoading, setScreenLoading] = useState(true);

  // Tablepagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [columnWidths, setColWidths] = useState({});

  // filters
  const [filters, setFilters] = useState({});

  // Data 
  const [tableData, setTableData] = useState(data);
  const [currentPageRows, setcurrentPageRows] = useState([]);
  const hasRendered = useRef(true);

  // Checkbox selection
  const [selected, setSelected] = useState({});
  const [allPageSelected, setAllPageSelected] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // Sorting
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);

  // Hide Columns
  const [headerHideColumns, setHeaderHideColumns] = useState(hideColumns);

  const [openAlert, setOpenAlert] = useState(false);

  // ── derive columns from data keys (memoised) ───────────────
  const columns = useMemo(() => deriveColumns(data), [data]);

  useEffect(() => {
    if (data.length > 0 && columns.length > 0) {
      const sorted = stableSort(data, getComparator('asc', columns[0].key));
      const serialdata = serializedata(sorted);
      setTableData(serialdata);
    }
    setScreenLoading(false);
    setPage(0);
    setFilters({});
    setHeaderHideColumns(hideColumns);
    setOrder('asc');
    setOrderBy(null);
    setAllPageSelected([]);
    hasRendered.current = false;
  }, [hasSearched]);

  const operators = (config, columnKey) => {
    const isBoolean =
      config?.type === "boolean" ||
      typeof tableData?.[0]?.[columnKey] === "boolean";

    const isDate =
      config?.type === "date" ||
      columnKey.toLowerCase().includes("date");

    if (isBoolean || isDate) {
      return [
        "equals",
        "does not equal",
        "is empty",
        "is not empty",
      ];
    }

    if (config?.type === "number" || config?.type === "float" || config?.type === "currency" || config?.type === "percentage") {
      return [
        "equals",
        "does not equal",
        "greater than",
        "less than",
        "greater or equal",
        "less or equal",
        "is empty",
        "is not empty",
      ];
    }

    // default → string
    return [
      "contains",
      "does not contain",
      "equals",
      "does not equal",
      "starts with",
      "ends with",
      "is empty",
      "is not empty",
    ];
  };

  // ── filter logic ───────────────────────────────────────────
  const handleFilterChange = useCallback((key, operator, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: { operator, value }
    }));
    setPage(0);
  }, []);

  const filteredDataFunc = useMemo(() => {
    return tableData.filter((row) =>
      Object.entries(filters).every(([key, filter]) => {
        if (!filter) return true;

        const { operator, value } = filter;

        const rawCell = row[key];
        const rawValue = value;

        // ✅ BOOLEAN HANDLING
        if (typeof rawCell === "boolean") {
          switch (operator) {
            case "equals":
              return rawCell === rawValue;

            case "does not equal":
              return rawCell !== rawValue;

            case "is empty":
              return rawCell === null || rawCell === undefined;

            case "is not empty":
              return rawCell !== null && rawCell !== undefined;

            default:
              return true;
          }
        }

        // ✅ NUMBER / FLOAT HANDLING
        if (typeof rawCell === "number") {
          const numCell = rawCell;
          const numVal = Number(rawValue);

          if (isNaN(numVal)) return true;

          switch (operator) {
            case "equals":
              return numCell === numVal;

            case "does not equal":
              return numCell !== numVal;

            case "contains":
              return String(numCell).includes(String(numVal));

            case "does not contain":
              return !String(numCell).includes(String(numVal));

            case "starts with":
              return numCell.startsWith(val);

            case "ends with":
              return numCell.endsWith(val);

            case "is empty":
              return !numCell || numVal.trim() === "";

            case "is not empty":
              return numCell && numVal.trim() !== "";

            default:
              return true;
          }
        }

        // ✅ DATE HANDLING
        if (rawCell instanceof Date || key.toLowerCase().includes("date")) {
          const cellTime = new Date(rawCell).getTime();
          const valTime = new Date(rawValue).getTime();

          if (isNaN(cellTime) || isNaN(valTime)) return true;

          switch (operator) {
            case "equals":
              return cellTime === valTime;

            case "does not equal":
              return cellTime !== valTime;

            case "is empty":
              return !rawCell;

            case "is not empty":
              return !!rawCell;

            default:
              return true;
          }
        }

        // ✅ STRING (DEFAULT)
        const cell = String(rawCell ?? "").toLowerCase();
        const val = String(rawValue ?? "").toLowerCase();

        switch (operator) {
          case "contains":
            return cell.includes(val);

          case "does not contain":
            return !cell.includes(val);

          case "equals":
            return cell === val;

          case "does not equal":
            return cell !== val;

          case "starts with":
            return cell.startsWith(val);

          case "ends with":
            return cell.endsWith(val);

          case "is empty":
            return !cell || cell.trim() === "";

          case "is not empty":
            return cell && cell.trim() !== "";

          default:
            return true;
        }
      })
    );
  }, [tableData, filters]);

  const handleClearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // --- Sorting ─────────────────────────────────────────>
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredDataFunc;

    return stableSort(
      filteredDataFunc,
      getComparator(order, orderBy)
    );
  }, [filteredDataFunc, order, orderBy]);

  /**
 * EFFECT: Sync currentPageRows
 * WATCHES: sortedData (changes on filter/sort), page, rowsPerPage
 * PURPOSE: Takes the calculated slice and commits it to state for the TableBody
 */
  useEffect(() => {
    // 1. Calculate the slice from the already filtered/sorted data
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    const slicedData = sortedData.slice(start, end);

    // 2. Store it in state
    setcurrentPageRows(slicedData);

    // Optional: Reset a ref if needed for your specific logic
    hasRendered.current = false;
  }, [sortedData, page, rowsPerPage]);
  // ^ IMPORTANT: Dependency array ensures this runs whenever user filters, sorts, or changes page

  const handleSort = useCallback((key, direction) => {
    setOrder(direction);
    setOrderBy(key);
  }, []);

  // ── drag-resize logic ──────────────────────────────────────
  // Fires live width updates during drag; clamps between
  // MIN_COL_PX and the column's own maxWidth.
  const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
    e.preventDefault();
    const startX = e.clientX;

    const onMove = (mv) => {
      const newW = Math.min(Math.max(MIN_COL_PX, startWidth + mv.clientX - startX), maxWidth);
      setColWidths((prev) => ({ ...prev, [key]: newW }));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  // ── active filters ─────────────────────────────────────────
  const activeCount = Object.values(filters).filter((f) => {
    if (!f || !f.operator) return false;

    // Operators without value
    if (["is empty", "is not empty"].includes(f.operator)) return true;

    const val = f.value;

    // ❌ null / undefined
    if (val === null || val === undefined) return false;

    // ✅ STRING
    if (typeof val === "string") {
      return val.trim() !== "";
    }

    // ✅ BOOLEAN
    if (typeof val === "boolean") {
      return true; // valid filter
    }

    // ✅ NUMBER
    if (typeof val === "number") {
      return !isNaN(val);
    }

    // ✅ DATE
    if (val instanceof Date) {
      return !isNaN(val.getTime());
    }

    // fallback
    return true;
  }).length;

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setPage(0);
    setOrder('asc');
    setOrderBy(null);
    setHeaderHideColumns(hideColumns);
  }, []);

  // ── shared scrollbar styles ────────────────────────────────
  const scrollbarSx = {
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

    overflowY: "auto",
  };

  return (
    <>
      <GlobalLoader open={screenLoading} />
      <Box
        sx={{
          // Fill all remaining height in the page content area.
          // 180px ≈ Topbar (64) + page title block (~80) + card padding (~36).
          // Increase this number if you see a gap at the bottom; decrease if
          // the table is cut off.
          height: "calc(100vh - 180px)",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          width: "100%",      // ← always fill the card width
          borderRadius: 1,
          background: alpha(isDark ? "#0f172a" : "#fff", isDark ? 0.5 : 0.6),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
        }}
      >
        {/* ── active-filter banner ─────────────────────────── */}
        {activeCount > 0 && (
          <Box
            sx={{
              px: 2, py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              flexShrink: 0,
            }}
          >
            <FilterListAltIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {activeCount} active filter{activeCount > 1 ? "s" : ""}
            </Typography>
            <Tooltip title="Clear all filters">
              <IconButton size="small" onClick={clearAllFilters} sx={{ ml: "auto", color: theme.palette.primary.main }}>
                <FilterAltOffIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* ── scrollable table area ────────────────────────── */}
        <TableContainer
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
            width: "100%",
            ...scrollbarSx,
          }}
        >
          {/*
          tableLayout:"fixed"  — our explicit widths are respected.
          minWidth:"max-content" — triggers horizontal scroll when
                                   total column width > viewport.
          width:"100%"          — fills the container when total
                                   width < viewport (no gaps on right).
        */}
          <Table stickyHeader sx={{ tableLayout: "fixed", minWidth: "max-content", width: "100%" }}>

            <colgroup>
              {EnableCheckboxFlag && (
                columns.length > 0 &&
                (columns.length < 10 ?
                  <col style={{ width: "25px", minWidth: "20px", maxWidth: "25px" }} />
                  : <col style={{ width: "35px", minWidth: "35px", maxWidth: "35px" }} />
                )
              )}

              {columns
                .filter(col => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
                .map((col) => {
                  const w = columnWidths[col.key] ?? col.defaultWidth;
                  return <col key={col.key} style={{ width: `${w}px` }} />;
                })}
            </colgroup>

            <TableHeader
              columns={columns}
              columnWidths={columnWidths}
              onResizeStart={handleResizeStart}
              filters={filters}
              onFilterChange={handleFilterChange}
              operators={operators}
              handleClearFilter={handleClearFilter}
              handleSort={handleSort}
              order={order}
              orderBy={orderBy}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
              currentPageRows={currentPageRows}
              selected={selected}
              setSelected={setSelected}
              allPageSelected={allPageSelected}
              setAllPageSelected={setAllPageSelected}
              tableData={tableData}
              setTableData={setTableData}
              headerHideColumns={headerHideColumns}
              setHeaderHideColumns={setHeaderHideColumns}
              EditableColumns={EditableColumns}
              TableDropDowns={TableDropDowns}
              sortedData={sortedData}
              EnableCheckboxFlag={EnableCheckboxFlag}
              setOpenAlert={setOpenAlert}
              theme={theme}
              isDark={isDark}
            />

            <TableBodyRows
              rows={currentPageRows}
              columns={columns}
              columnWidths={columnWidths}
              selected={selected}
              setSelected={setSelected}
              allPageSelected={allPageSelected}
              setAllPageSelected={setAllPageSelected}
              tableData={tableData}
              setTableData={setTableData}
              EditableColumns={EditableColumns}
              TableDropDowns={TableDropDowns}
              headerHideColumns={headerHideColumns}
              setHeaderHideColumns={setHeaderHideColumns}
              TableRowHighlight={TableRowHighlight}
              EnableCheckboxFlag={EnableCheckboxFlag}
              theme={theme}
              isDark={isDark}
            />
            {TotalTableColumnValueCount.length > 0 && currentPageRows.length > 0 ? (
              TotalTableColumnValueCount.some(col => !headerHideColumns.includes(col)) &&
              <TableFooterTotals
                columns={columns}
                columnWidths={columnWidths}
                currentPageRows={currentPageRows}
                TotalTableColumnValueCount={TotalTableColumnValueCount}
                headerHideColumns={headerHideColumns}
                EnableCheckboxFlag={EnableCheckboxFlag}
                theme={theme}
                isDark={isDark}
              />) : null}
          </Table>
        </TableContainer>

        {/* ── pagination ───────────────────────────────────── */}
        <TablePaginationPage
          sortedData={sortedData}
          currentPageRows={currentPageRows}
          setcurrentPageRows={setcurrentPageRows}
          allPageSelected={allPageSelected}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          EnableCheckboxFlag={EnableCheckboxFlag}
          theme={theme}
          isDark={isDark}
        />

        {openAlert &&
          <Snackbar
            open={openAlert}
            autoHideDuration={2000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity="success" variant="filled">
              copied.
            </Alert>
          </Snackbar>}
      </Box>
    </>
  );
}
