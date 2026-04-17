// "use client";

// // Core React Imports
// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import {
//   Table,
//   TableBody as MuiTableBody,
//   TableContainer,
//   Box,
//   useTheme,
//   alpha,
//   IconButton,
//   Tooltip,
//   Typography,
//   Paper
// } from "@mui/material";
// import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
// import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

// import GlobalLoader from "../Loaders/GlobalLoader";
// import TableHeader from "./TableHeaderNoPage";
// import TableBodyRows from "./TableBodyNoPage";
// import TableFooterTotals from "./TableFooterNoPage";
// import TableStats from "./TableFooterRowsCountNoPage";
// import { getComparator, stableSort } from "./TableSortingNoPage";
// import { serializedata } from "./TableDataSerializeNoPage";


// // ═══════════════════════════════════════════════════════════════
// // CONSTANTS — tweak here to change global table sizing behaviour
// // ═══════════════════════════════════════════════════════════════
// const CHAR_PX = 8;    // estimated px per character at 13 px font
// const MIN_COL_PX = 80;   // absolute floor after drag-resize

// // ═══════════════════════════════════════════════════════════════
// // UTIL ─ deriveColumns
// // Reads the shape of data[0] and measures every value in each
// // column to produce a sensible default + max pixel width.
// //
// // INPUT : data — Array of plain JSON objects
// // OUTPUT: Array of { key, label, defaultWidth, maxWidth }
// // ═══════════════════════════════════════════════════════════════
// // ── NEW deriveColumns ─────────────────────────────────────────
// // defaultWidth = label character count × CHAR_PX + 20px
// // maxWidth     = label character count × CHAR_PX × 7
// const deriveColumns = (data) => {
//   if (!data?.length) return [];
//   return Object.keys(data[0]).map((key) => {
//     const label = key
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .trim()
//       .toUpperCase();

//     const labelPx = label.length * CHAR_PX;          // base on label only
//     const defaultWidth = Math.max(labelPx + 20, 80);    // label px + 20, floor 80
//     const maxWidth = Math.max(labelPx * 7, 120);   // label px × 7, floor 120

//     return { key, label, defaultWidth, maxWidth };
//   });
// };


// // ═══════════════════════════════════════════════════════════════
// // MAIN EXPORT ─ CustomTable
// //
// // ONLY REQUIRED PROP:
// //   data  →  Array of plain JSON objects
// //
// // Columns are derived automatically from data[0] keys.
// // Default width  = longest value length × 1.5 × CHAR_PX
// // Max width      = longest value length × 5   × CHAR_PX
// // Both breakpoint detection and external columns prop
// // have been removed — the table handles everything itself.
// //
// // USAGE:
// //   <CustomTable data={EMPLOYEES} />
// // ═══════════════════════════════════════════════════════════════
// export default function CustomTableNoPage({
//   data = [], // JSON Array
//   EditableColumns = [], // Editable Column in Table body
//   TableDropDowns = {}, // Editable Column dropdowns in Table body
//   hideColumns = [], // Table Header hide the columns
//   TotalTableColumnValueCount = [], // Table sum of values of specific columns in Table footer
//   TableRowHighlight = [],
//   EnableCheckboxFlag = true,
//   tableHeight = '',
// }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";
//   const [screenLoading, setScreenLoading] = useState(true);

//   const [columnWidths, setColWidths] = useState({});

//   // filters
//   const [filters, setFilters] = useState({});

//   // Data 
//   const [tableData, setTableData] = useState(data);
//   const hasRendered = useRef(true);

//   // Checkbox selection
//   const [selected, setSelected] = useState({});
//   const [allPageSelected, setAllPageSelected] = useState([]);

//   // Sorting
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState(null);

//   // Hide Columns
//   const [headerHideColumns, setHeaderHideColumns] = useState(hideColumns);

//   // ── derive columns from data keys (memoised) ───────────────
//   const columns = useMemo(() => deriveColumns(data), []);

//   useEffect(() => {
//     if (data.length > 0 && columns.length > 0) {
//       const sorted = stableSort(data, getComparator(order, columns[0].key));
//       const serialdata = serializedata(sorted);
//       setTableData(serialdata);
//     }
//     setScreenLoading(false);
//     hasRendered.current = false;
//   }, []);

//   const operators = (config, columnKey) => {
//     const isBoolean =
//       config?.type === "boolean" ||
//       typeof tableData?.[0]?.[columnKey] === "boolean";

//     const isDate =
//       config?.type === "date" ||
//       columnKey.toLowerCase().includes("date");

//     if (isBoolean || isDate) {
//       return [
//         "equals",
//         "does not equal",
//         "is empty",
//         "is not empty",
//       ];
//     }

//     if (config?.type === "number" || config?.type === "float" || config?.type === "currency" || config?.type === "percentage") {
//       return [
//         "equals",
//         "does not equal",
//         "greater than",
//         "less than",
//         "greater or equal",
//         "less or equal",
//         "is empty",
//         "is not empty",
//       ];
//     }

//     // default → string
//     return [
//       "contains",
//       "does not contain",
//       "equals",
//       "does not equal",
//       "starts with",
//       "ends with",
//       "is empty",
//       "is not empty",
//     ];
//   };

//   // ── filter logic ───────────────────────────────────────────
//   const handleFilterChange = useCallback((key, operator, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: { operator, value }
//     }));
//   }, []);

//   const filteredDataFunc = useMemo(() => {
//     return tableData.filter((row) =>
//       Object.entries(filters).every(([key, filter]) => {
//         if (!filter) return true;

//         const { operator, value } = filter;

//         const rawCell = row[key];
//         const rawValue = value;

//         // ✅ BOOLEAN HANDLING
//         if (typeof rawCell === "boolean") {
//           switch (operator) {
//             case "equals":
//               return rawCell === rawValue;

//             case "does not equal":
//               return rawCell !== rawValue;

//             case "is empty":
//               return rawCell === null || rawCell === undefined;

//             case "is not empty":
//               return rawCell !== null && rawCell !== undefined;

//             default:
//               return true;
//           }
//         }

//         // ✅ NUMBER / FLOAT HANDLING
//         if (typeof rawCell === "number") {
//           const numCell = rawCell;
//           const numVal = Number(rawValue);

//           if (isNaN(numVal)) return true;

//           switch (operator) {
//             case "equals":
//               return numCell === numVal;

//             case "does not equal":
//               return numCell !== numVal;

//             case "contains":
//               return String(numCell).includes(String(numVal));

//             case "does not contain":
//               return !String(numCell).includes(String(numVal));

//             case "starts with":
//               return numCell.startsWith(val);

//             case "ends with":
//               return numCell.endsWith(val);

//             case "is empty":
//               return !numCell || numVal.trim() === "";

//             case "is not empty":
//               return numCell && numVal.trim() !== "";

//             default:
//               return true;
//           }
//         }

//         // ✅ DATE HANDLING
//         if (rawCell instanceof Date || key.toLowerCase().includes("date")) {
//           const cellTime = new Date(rawCell).getTime();
//           const valTime = new Date(rawValue).getTime();

//           if (isNaN(cellTime) || isNaN(valTime)) return true;

//           switch (operator) {
//             case "equals":
//               return cellTime === valTime;

//             case "does not equal":
//               return cellTime !== valTime;

//             case "is empty":
//               return !rawCell;

//             case "is not empty":
//               return !!rawCell;

//             default:
//               return true;
//           }
//         }

//         // ✅ STRING (DEFAULT)
//         const cell = String(rawCell ?? "").toLowerCase();
//         const val = String(rawValue ?? "").toLowerCase();

//         switch (operator) {
//           case "contains":
//             return cell.includes(val);

//           case "does not contain":
//             return !cell.includes(val);

//           case "equals":
//             return cell === val;

//           case "does not equal":
//             return cell !== val;

//           case "starts with":
//             return cell.startsWith(val);

//           case "ends with":
//             return cell.endsWith(val);

//           case "is empty":
//             return !cell || cell.trim() === "";

//           case "is not empty":
//             return cell && cell.trim() !== "";

//           default:
//             return true;
//         }
//       })
//     );
//   }, [tableData, filters]);

//   const handleClearFilter = (key) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev };
//       delete newFilters[key];
//       return newFilters;
//     });
//   };

//   // --- Sorting ─────────────────────────────────────────>
//   const sortedData = useMemo(() => {
//     if (!orderBy) return filteredDataFunc;

//     return stableSort(
//       filteredDataFunc,
//       getComparator(order, orderBy)
//     );
//   }, [filteredDataFunc, order, orderBy]);

//   // ^ IMPORTANT: Dependency array ensures this runs whenever user filters, sorts, or changes page

//   const handleSort = useCallback((key, direction) => {
//     setOrder(direction);
//     setOrderBy(key);
//   }, []);

//   // ── drag-resize logic ──────────────────────────────────────
//   // Fires live width updates during drag; clamps between
//   // MIN_COL_PX and the column's own maxWidth.
//   const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
//     e.preventDefault();
//     const startX = e.clientX;

//     const onMove = (mv) => {
//       const newW = Math.min(Math.max(MIN_COL_PX, startWidth + mv.clientX - startX), maxWidth);
//       setColWidths((prev) => ({ ...prev, [key]: newW }));
//     };
//     const onUp = () => {
//       document.removeEventListener("mousemove", onMove);
//       document.removeEventListener("mouseup", onUp);
//     };

//     document.addEventListener("mousemove", onMove);
//     document.addEventListener("mouseup", onUp);
//   }, []);

//   // ── active filters ─────────────────────────────────────────
//   const activeCount = Object.values(filters).filter((f) => {
//     if (!f || !f.operator) return false;

//     // Operators without value
//     if (["is empty", "is not empty"].includes(f.operator)) return true;

//     const val = f.value;

//     // ❌ null / undefined
//     if (val === null || val === undefined) return false;

//     // ✅ STRING
//     if (typeof val === "string") {
//       return val.trim() !== "";
//     }

//     // ✅ BOOLEAN
//     if (typeof val === "boolean") {
//       return true; // valid filter
//     }

//     // ✅ NUMBER
//     if (typeof val === "number") {
//       return !isNaN(val);
//     }

//     // ✅ DATE
//     if (val instanceof Date) {
//       return !isNaN(val.getTime());
//     }

//     // fallback
//     return true;
//   }).length;

//   const clearAllFilters = useCallback(() => {
//     setFilters({});
//     setOrder('asc');
//     setOrderBy(null);
//     setHeaderHideColumns(hideColumns);
//   }, []);

//   // ── shared scrollbar styles ────────────────────────────────
//   const scrollbarSx = {
//     // 🔥 Chrome / Edge / Safari
//     "&::-webkit-scrollbar": {
//       width: "6px",
//       height: "6px",
//     },
//     "&::-webkit-scrollbar-track": {
//       background: "transparent", // Clean look
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: isDark
//         ? "rgba(255, 255, 255, 0.3)"
//         : "rgba(0, 0, 0, 0.2)",
//       borderRadius: "10px",
//     },
//     "&::-webkit-scrollbar-thumb:hover": {
//       backgroundColor: isDark
//         ? "rgba(255, 255, 255, 0.5)"
//         : "rgba(0, 0, 0, 0.4)",
//     },
//     // 🔥 Firefox Support
//     scrollbarWidth: "thin",
//     scrollbarColor: isDark
//       ? "rgba(255, 255, 255, 0.3) transparent"
//       : "rgba(0, 0, 0, 0.2) transparent",

//     overflowY: "auto",
//   };

//   return (
//     <>
//       <GlobalLoader open={screenLoading} />
//       <Box
//         sx={{
//           // Fill all remaining height in the page content area.
//           // 180px ≈ Topbar (64) + page title block (~80) + card padding (~36).
//           // Increase this number if you see a gap at the bottom; decrease if
//           // the table is cut off.
//           // ...(tableHeight === "100%"
//           //   ? { flex: 1, minHeight: 0, height: "calc(100%-180px)"   }           // ← flex mode: fills parent
//           //   : { height: tableHeight ?? "calc(100%-180px)" }  // ← fallback: standalone mode
//           // ),
//           height: tableHeight.length > 0 ? tableHeight : "calc(100vh - 180px)",
//           minHeight: 320,
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",      // ← always fill the card width
//           borderRadius: 1,
//           background: alpha(isDark ? "#0f172a" : "#fff", isDark ? 0.5 : 0.6),
//           backdropFilter: "blur(10px)",
//           border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
//         }}
//       >
//         {activeCount > 0 && (
//           <Box
//             sx={{
//               px: 2, py: 0.75,
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               bgcolor: alpha(theme.palette.primary.main, 0.1),
//               borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//               flexShrink: 0,
//             }}
//           >
//             <FilterListAltIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
//             <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
//               {activeCount} active filter{activeCount > 1 ? "s" : ""}
//             </Typography>
//             <Tooltip title="Clear all filters">
//               <IconButton size="small" onClick={clearAllFilters} sx={{ ml: "auto", color: theme.palette.primary.main }}>
//                 <FilterAltOffIcon sx={{ fontSize: 16 }} />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}
//         <Paper sx={{ width: 'calc(100vw-10px)' }}>
//           <TableContainer
//             sx={{
//               // flex: 1,
//               overflowX: "auto",
//               overflowY: "auto",
//               // minHeight:0,
//               // width: "100%",
//               ...scrollbarSx,
//             }}
//           >
//             <Table stickyHeader sx={{
//              // tableLayout: "fixed", width: "max-content", minWidth: "100%" //width: "100%"
//               // border: "1px solid red",// width: 'calc(100vw-10px)'
//             }}>
//               {/* <colgroup>
//               {EnableCheckboxFlag && columns.length > 0 && (
//                 <col style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }} />
//               )}

//               {columns
//                 .filter(col => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//                 .map((col) => {
//                   const w = columnWidths[col.key] ?? col.defaultWidth;
//                   return <col key={col.key} style={{ width: `${w}px`, minWidth: `${w}px` }} />;
//                 })}

//               <col style={{ width: "auto" }} />
//             </colgroup> */}

//               {/* <colgroup>
//               {EnableCheckboxFlag && (
//                 <col style={{ width: "30px" }} />
//               )}

//               {columns.map((col) => {
//                 const w = columnWidths[col.key];

//                 return (
//                   <col
//                     key={col.key}
//                     style={{
//                       width: w ? `${w}px` : "auto", // 👈 key logic
//                     }}
//                   />
//                 );
//               })}
//             </colgroup> */}

//               {/* <colgroup>
//                 {EnableCheckboxFlag && (
//                   <col style={{ width: "30px !important" }} />   // ✅ FINAL SINGLE VALUE
//                 )}

//                 {columns
//                   .filter(col => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//                   .map((col) => {
//                     const w = columnWidths[col.key] ?? col.defaultWidth;
//                     return <col key={col.key} style={{ width: `${w}px` }} />;
//                   })}
//               </colgroup> */}
//               <TableHeader
//                 columns={columns}
//                 columnWidths={columnWidths}
//                 onResizeStart={handleResizeStart}
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 operators={operators}
//                 handleClearFilter={handleClearFilter}
//                 handleSort={handleSort}
//                 order={order}
//                 orderBy={orderBy}
//                 setOrder={setOrder}
//                 setOrderBy={setOrderBy}
//                 currentPageRows={sortedData}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 headerHideColumns={headerHideColumns}
//                 setHeaderHideColumns={setHeaderHideColumns}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 sortedData={sortedData}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 theme={theme}
//                 isDark={isDark}
//               />
//               {/* <TableBodyRows
//                 rows={sortedData}
//                 columns={columns}
//                 columnWidths={columnWidths}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 headerHideColumns={headerHideColumns}
//                 setHeaderHideColumns={setHeaderHideColumns}
//                 TableRowHighlight={TableRowHighlight}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 theme={theme}
//                 isDark={isDark}
//               /> */}
//               {/* {TotalTableColumnValueCount.length > 0 && sortedData.length > 0 ? (
//                 TotalTableColumnValueCount.some(col => !headerHideColumns.includes(col)) &&
//                 <TableFooterTotals
//                   columns={columns}
//                   columnWidths={columnWidths}
//                   currentPageRows={sortedData}
//                   TotalTableColumnValueCount={TotalTableColumnValueCount}
//                   headerHideColumns={headerHideColumns}
//                   EnableCheckboxFlag={EnableCheckboxFlag}
//                   theme={theme}
//                   isDark={isDark}
//                 />) : null} */}


//             </Table>
//           </TableContainer>
//           <TableStats
//             sortedData={sortedData}
//             allPageSelected={allPageSelected}
//             EnableCheckboxFlag={EnableCheckboxFlag}
//             theme={theme}
//             isDark={isDark}
//           />
//         </Paper>
//       </Box >
//     </>
//   );
// }


// "use client";

// // Core React Imports
// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import {
//   Table,
//   TableContainer,
//   Box,
//   useTheme,
//   alpha,
//   IconButton,
//   Tooltip,
//   Typography,
//   Paper
// } from "@mui/material";
// import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
// import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

// import GlobalLoader from "../Loaders/GlobalLoader";
// import TableHeader from "./TableHeaderNoPage";
// import TableBodyRows from "./TableBodyNoPage";
// import TableFooterTotals from "./TableFooterNoPage";
// import TableStats from "./TableFooterRowsCountNoPage";
// import { getComparator, stableSort } from "./TableSortingNoPage";
// import { serializedata } from "./TableDataSerializeNoPage";

// // ═══════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════════
// const CHAR_PX = 8;   // estimated px per character at 13 px font
// const MIN_COL_PX = 80;  // absolute floor after drag-resize
// const CHECKBOX_W = 32;  // fixed pixel width for the selection checkbox column

// // ═══════════════════════════════════════════════════════════════
// // UTIL ─ deriveColumns
// // Reads the shape of data[0] and produces sensible pixel widths.
// // defaultWidth = label_chars × CHAR_PX + 20px  (floor 80)
// // maxWidth     = label_chars × CHAR_PX × 7     (floor 120)
// // ═══════════════════════════════════════════════════════════════
// const deriveColumns = (data) => {
//   if (!data?.length) return [];
//   return Object.keys(data[0]).map((key) => {
//     const label = key
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .trim()
//       .toUpperCase();

//     const labelPx = label.length * CHAR_PX;
//     const defaultWidth = Math.max(labelPx + 20, 80);
//     const maxWidth = Math.max(labelPx * 7, 120);

//     return { key, label, defaultWidth, maxWidth };
//   });
// };

// // ═══════════════════════════════════════════════════════════════
// // MAIN EXPORT ─ CustomTableNoPage
// //
// // Required prop:  data  →  Array of plain JSON objects
// // Columns are derived automatically from data[0] keys.
// // ═══════════════════════════════════════════════════════════════
// export default function CustomTableNoPage({
//   data = [],  // JSON array
//   EditableColumns = [],  // editable column configs  [{ columnName, type, minValue, maxValue }]
//   TableDropDowns = {},  // dropdown options per key { key: [{ label, value }] }
//   hideColumns = [],  // keys to hide on mount
//   TotalTableColumnValueCount = [], // keys whose values are summed in the footer
//   TableRowHighlight = [],  // row highlight rules
//   EnableCheckboxFlag = true,
//   tableHeight = "",
// }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   const [screenLoading, setScreenLoading] = useState(true);
//   const [columnWidths, setColWidths] = useState({});
//   const [filters, setFilters] = useState({});
//   const [tableData, setTableData] = useState(data);
//   const hasRendered = useRef(true);

//   // Checkbox selection
//   const [selected, setSelected] = useState({});
//   const [allPageSelected, setAllPageSelected] = useState([]);

//   // Sorting
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState(null);

//   // Column visibility
//   const [headerHideColumns, setHeaderHideColumns] = useState(hideColumns);

//   // Derive columns from data keys (memoised — only runs once on mount)
//   const columns = useMemo(() => deriveColumns(data), []);

//   // ── Initial load: sort by first column and serialise row numbers ──
//   useEffect(() => {
//     if (data.length > 0 && columns.length > 0) {
//       const sorted = stableSort(data, getComparator(order, columns[0].key));
//       const serialised = serializedata(sorted);
//       setTableData(serialised);
//     }
//     setScreenLoading(false);
//     hasRendered.current = false;
//   }, []);

//   // ── operators: returns the correct operator list per column type ──
//   const operators = useCallback((config, columnKey) => {
//     const isBoolean =
//       config?.type === "boolean" ||
//       typeof tableData?.[0]?.[columnKey] === "boolean";

//     const isDate =
//       config?.type === "date" ||
//       columnKey.toLowerCase().includes("date");

//     if (isBoolean || isDate) {
//       return ["equals", "does not equal", "is empty", "is not empty"];
//     }

//     if (["number", "float", "currency", "percentage"].includes(config?.type)) {
//       return [
//         "equals",
//         "does not equal",
//         "greater than",
//         "less than",
//         "greater or equal",
//         "less or equal",
//         "is empty",
//         "is not empty",
//       ];
//     }

//     // default → string
//     return [
//       "contains",
//       "does not contain",
//       "equals",
//       "does not equal",
//       "starts with",
//       "ends with",
//       "is empty",
//       "is not empty",
//     ];
//   }, [tableData]);

//   // ── filter change handler ──────────────────────────────────────
//   const handleFilterChange = useCallback((key, operator, value) => {
//     setFilters((prev) => ({ ...prev, [key]: { operator, value } }));
//   }, []);

//   // ── filtered rows ──────────────────────────────────────────────
//   const filteredDataFunc = useMemo(() => {
//     return tableData.filter((row) =>
//       Object.entries(filters).every(([key, filter]) => {
//         if (!filter) return true;
//         const { operator, value: rawValue } = filter;
//         const rawCell = row[key];

//         // ── operators that need no value ───────────────────────
//         if (operator === "is empty") {
//           return rawCell === null || rawCell === undefined || rawCell === "";
//         }
//         if (operator === "is not empty") {
//           return rawCell !== null && rawCell !== undefined && rawCell !== "";
//         }

//         // ── BOOLEAN ────────────────────────────────────────────
//         if (typeof rawCell === "boolean") {
//           switch (operator) {
//             case "equals": return rawCell === rawValue;
//             case "does not equal": return rawCell !== rawValue;
//             default: return true;
//           }
//         }

//         // ── NUMBER / FLOAT / CURRENCY / PERCENTAGE ─────────────
//         if (typeof rawCell === "number") {
//           const numVal = Number(rawValue);
//           if (isNaN(numVal)) return true;

//           switch (operator) {
//             case "equals": return rawCell === numVal;
//             case "does not equal": return rawCell !== numVal;
//             case "greater than": return rawCell > numVal;
//             case "less than": return rawCell < numVal;
//             case "greater or equal": return rawCell >= numVal;
//             case "less or equal": return rawCell <= numVal;
//             // numeric string operators (edge-case: number stored as string)
//             case "contains": return String(rawCell).includes(String(numVal));
//             case "does not contain": return !String(rawCell).includes(String(numVal));
//             default: return true;
//           }
//         }

//         // ── DATE ───────────────────────────────────────────────
//         if (rawCell instanceof Date || key.toLowerCase().includes("date")) {
//           const cellTime = new Date(rawCell).getTime();
//           const valTime = new Date(rawValue).getTime();
//           if (isNaN(cellTime) || isNaN(valTime)) return true;

//           switch (operator) {
//             case "equals": return cellTime === valTime;
//             case "does not equal": return cellTime !== valTime;
//             default: return true;
//           }
//         }

//         // ── STRING (default) ───────────────────────────────────
//         const cell = String(rawCell ?? "").toLowerCase();
//         const val = String(rawValue ?? "").toLowerCase();

//         switch (operator) {
//           case "contains": return cell.includes(val);
//           case "does not contain": return !cell.includes(val);
//           case "equals": return cell === val;
//           case "does not equal": return cell !== val;
//           case "starts with": return cell.startsWith(val);
//           case "ends with": return cell.endsWith(val);
//           default: return true;
//         }
//       })
//     );
//   }, [tableData, filters]);

//   const handleClearFilter = useCallback((key) => {
//     setFilters((prev) => {
//       const next = { ...prev };
//       delete next[key];
//       return next;
//     });
//   }, []);

//   // ── sorted rows ────────────────────────────────────────────────
//   const sortedData = useMemo(() => {
//     if (!orderBy) return filteredDataFunc;
//     return stableSort(filteredDataFunc, getComparator(order, orderBy));
//   }, [filteredDataFunc, order, orderBy]);

//   const handleSort = useCallback((key, direction) => {
//     setOrder(direction);
//     setOrderBy(key);
//   }, []);

//   // ── drag-resize logic ──────────────────────────────────────────
//   const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
//     e.preventDefault();
//     const startX = e.clientX;

//     const onMove = (mv) => {
//       const newW = Math.min(
//         Math.max(MIN_COL_PX, startWidth + mv.clientX - startX),
//         maxWidth
//       );
//       setColWidths((prev) => ({ ...prev, [key]: newW }));
//     };
//     const onUp = () => {
//       document.removeEventListener("mousemove", onMove);
//       document.removeEventListener("mouseup", onUp);
//     };

//     document.addEventListener("mousemove", onMove);
//     document.addEventListener("mouseup", onUp);
//   }, []);

//   // ── active filter count (for the filter banner) ────────────────
//   const activeCount = useMemo(() =>
//     Object.values(filters).filter((f) => {
//       if (!f?.operator) return false;
//       if (["is empty", "is not empty"].includes(f.operator)) return true;

//       const val = f.value;
//       if (val === null || val === undefined) return false;
//       if (typeof val === "string") return val.trim() !== "";
//       if (typeof val === "boolean") return true;
//       if (typeof val === "number") return !isNaN(val);
//       if (val instanceof Date) return !isNaN(val.getTime());
//       return true;
//     }).length,
//     [filters]);

//   const clearAllFilters = useCallback(() => {
//     setFilters({});
//     setOrder("asc");
//     setOrderBy(null);
//     setHeaderHideColumns(hideColumns);
//   }, [hideColumns]);

//   // ── shared scrollbar styles ────────────────────────────────────
//   const scrollbarSx = {
//     "&::-webkit-scrollbar": { width: "6px", height: "6px" },
//     "&::-webkit-scrollbar-track": { background: "transparent" },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: isDark
//         ? "rgba(255, 255, 255, 0.3)"
//         : "rgba(0, 0, 0, 0.2)",
//       borderRadius: "10px",
//     },
//     "&::-webkit-scrollbar-thumb:hover": {
//       backgroundColor: isDark
//         ? "rgba(255, 255, 255, 0.5)"
//         : "rgba(0, 0, 0, 0.4)",
//     },
//     scrollbarWidth: "thin",
//     scrollbarColor: isDark
//       ? "rgba(255, 255, 255, 0.3) transparent"
//       : "rgba(0, 0, 0, 0.2) transparent",
//     overflowY: "auto",
//   };

//   // ── visible (non-hidden, non-SR_NO) columns ────────────────────
//   const visibleColumns = useMemo(
//     () => columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key)),
//     [columns, headerHideColumns]
//   );

//   return (
//     <>
//       <GlobalLoader open={screenLoading} />
//       <Box
//         sx={{
//           height: tableHeight.length > 0 ? tableHeight : "calc(100vh - 180px)",
//           minHeight: 320,
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           borderRadius: 1,
//           background: alpha(isDark ? "#0f172a" : "#fff", isDark ? 0.5 : 0.6),
//           backdropFilter: "blur(10px)",
//           border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
//         }}
//       >
//         {/* ── Active-filter banner ─────────────────────────────── */}
//         {activeCount > 0 && (
//           <Box
//             sx={{
//               px: 2, py: 0.75,
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               bgcolor: alpha(theme.palette.primary.main, 0.1),
//               borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//               flexShrink: 0,
//             }}
//           >
//             <FilterListAltIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
//             <Typography
//               variant="caption"
//               sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
//             >
//               {activeCount} active filter{activeCount > 1 ? "s" : ""}
//             </Typography>
//             <Tooltip title="Clear all filters">
//               <IconButton
//                 size="small"
//                 onClick={clearAllFilters}
//                 sx={{ ml: "auto", color: theme.palette.primary.main }}
//               >
//                 <FilterAltOffIcon sx={{ fontSize: 16 }} />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}

//         {/* ── Table card ───────────────────────────────────────── */}
//         <Paper
//           sx={{
//             flex: 1,
//             minHeight: 0,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             width: "100%",
//           }}
//         >
//           <TableContainer
//             sx={{
//               flex: 1,
//               overflowX: "auto",
//               overflowY: "auto",
//               ...scrollbarSx,
//             }}
//           >
//             <Table stickyHeader>
//               {/*
//                * <colgroup> is the canonical CSS-table mechanism to enforce a
//                * fixed pixel width on a column.  Without it, the browser
//                * can override width/minWidth set on <th> / <td> for the
//                * checkbox column.
//                *
//                * Rules:
//                *   • Checkbox column → exactly CHECKBOX_W px, no flex
//                *   • Data columns    → defaultWidth from deriveColumns (or
//                *                       the user-dragged value)
//                */}
//               <colgroup>
//                 {EnableCheckboxFlag && (
//                   <col style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W }} />
//                 )}
//                 {visibleColumns.map((col) => {
//                   const w = columnWidths[col.key] ?? col.defaultWidth;
//                   return <col key={col.key} style={{ width: w, minWidth: w }} />;
//                 })}
//               </colgroup>

//               <TableHeader
//                 columns={columns}
//                 columnWidths={columnWidths}
//                 onResizeStart={handleResizeStart}
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 operators={operators}
//                 handleClearFilter={handleClearFilter}
//                 handleSort={handleSort}
//                 order={order}
//                 orderBy={orderBy}
//                 setOrder={setOrder}
//                 setOrderBy={setOrderBy}
//                 currentPageRows={sortedData}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 headerHideColumns={headerHideColumns}
//                 setHeaderHideColumns={setHeaderHideColumns}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 sortedData={sortedData}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 checkboxWidth={CHECKBOX_W}
//                 theme={theme}
//                 isDark={isDark}
//               />

//               <TableBodyRows
//                 rows={sortedData}
//                 columns={columns}
//                 columnWidths={columnWidths}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 headerHideColumns={headerHideColumns}
//                 TableRowHighlight={TableRowHighlight}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 checkboxWidth={CHECKBOX_W}
//                 theme={theme}
//                 isDark={isDark}
//               />

//               {TotalTableColumnValueCount.length > 0 &&
//                 sortedData.length > 0 &&
//                 TotalTableColumnValueCount.some(
//                   (col) => !headerHideColumns.includes(col)
//                 ) && (
//                   <TableFooterTotals
//                     columns={columns}
//                     columnWidths={columnWidths}
//                     currentPageRows={sortedData}
//                     TotalTableColumnValueCount={TotalTableColumnValueCount}
//                     headerHideColumns={headerHideColumns}
//                     EnableCheckboxFlag={EnableCheckboxFlag}
//                     theme={theme}
//                     isDark={isDark}
//                   />
//                 )}
//             </Table>
//           </TableContainer>

//           <TableStats
//             sortedData={sortedData}
//             allPageSelected={allPageSelected}
//             EnableCheckboxFlag={EnableCheckboxFlag}
//             theme={theme}
//             isDark={isDark}
//           />
//         </Paper>
//       </Box>
//     </>
//   );
// }

// "use client";

// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import {
//   Table,
//   TableContainer,
//   Box,
//   useTheme,
//   alpha,
//   IconButton,
//   Tooltip,
//   Typography,
//   Paper,
// } from "@mui/material";
// import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

// import GlobalLoader from "../Loaders/GlobalLoader";
// import TableHeader from "./TableHeaderNoPage";
// import TableBodyRows from "./TableBodyNoPage";
// import TableFooterTotals from "./TableFooterNoPage";
// import TableStats from "./TableFooterRowsCountNoPage";
// import { getComparator, stableSort } from "./TableSortingNoPage";
// import { serializedata } from "./TableDataSerializeNoPage";

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────
// const CHAR_PX = 8;   // px per character at ~13px font-size
// const MIN_COL_PX = 80;  // minimum column width after drag-resize
// const CB_WIDTH = 36;  // exact pixel width of the checkbox column

// // ─────────────────────────────────────────────────────────────────────────────
// // deriveColumns
// // Builds column metadata from the first row of data.
// // ─────────────────────────────────────────────────────────────────────────────
// const deriveColumns = (data) => {
//   if (!data?.length) return [];
//   return Object.keys(data[0]).map((key) => {
//     const label = key
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .trim()
//       .toUpperCase();
//     const labelPx = label.length * CHAR_PX;
//     const defaultWidth = Math.max(labelPx + 24, MIN_COL_PX);
//     const maxWidth = Math.max(labelPx * 7, 220);
//     return { key, label, defaultWidth, maxWidth };
//   });
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CustomTableNoPage
// // ─────────────────────────────────────────────────────────────────────────────
// export default function CustomTableNoPage({
//   data = [],
//   EditableColumns = [],
//   TableDropDowns = {},
//   hideColumns = [],
//   TotalTableColumnValueCount = [],
//   TableRowHighlight = [],
//   EnableCheckboxFlag = true,
//   tableHeight = "",
// }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   const [screenLoading, setScreenLoading] = useState(true);
//   const [columnWidths, setColumnWidths] = useState({});
//   const [filters, setFilters] = useState({});
//   const [tableData, setTableData] = useState([]);
//   const [allPageSelected, setAllPageSelected] = useState([]);
//   const [selected, setSelected] = useState({});
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState(null);
//   const [headerHideColumns, setHeaderHideColumns] = useState(hideColumns);

//   // Columns are derived once from the original data shape
//   const columns = useMemo(() => deriveColumns(data), []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Initial serialisation (adds SR_NO, sorts by first column) ────────────
//   useEffect(() => {
//     if (data.length > 0 && columns.length > 0) {
//       const sorted = stableSort(data, getComparator("asc", columns[0].key));
//       const serialised = serializedata(sorted);
//       setTableData(serialised);
//     }
//     setScreenLoading(false);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Operators list per column type ───────────────────────────────────────
//   const operators = useCallback(
//     (config, columnKey) => {
//       const sample = tableData?.[0]?.[columnKey];
//       const isBoolean = config?.type === "boolean" || typeof sample === "boolean";
//       const isDate = config?.type === "date" || columnKey.toLowerCase().includes("date");
//       const isNumeric = ["number", "float", "currency", "percentage"].includes(config?.type);

//       if (isBoolean || isDate) {
//         return ["equals", "does not equal", "is empty", "is not empty"];
//       }
//       if (isNumeric) {
//         return [
//           "equals", "does not equal",
//           "greater than", "less than",
//           "greater or equal", "less or equal",
//           "is empty", "is not empty",
//         ];
//       }
//       return [
//         "contains", "does not contain",
//         "equals", "does not equal",
//         "starts with", "ends with",
//         "is empty", "is not empty",
//       ];
//     },
//     [tableData]
//   );

//   // ── Filter change ────────────────────────────────────────────────────────
//   const handleFilterChange = useCallback((key, operator, value) => {
//     setFilters((prev) => ({ ...prev, [key]: { operator, value } }));
//   }, []);

//   const handleClearFilter = useCallback((key) => {
//     setFilters((prev) => {
//       const next = { ...prev };
//       delete next[key];
//       return next;
//     });
//   }, []);

//   // ── Filtered rows ────────────────────────────────────────────────────────
//   const filteredData = useMemo(() => {
//     return tableData.filter((row) =>
//       Object.entries(filters).every(([key, filter]) => {
//         if (!filter?.operator) return true;

//         const { operator, value: rawValue } = filter;
//         const rawCell = row[key];

//         // Operators that don't need a value
//         if (operator === "is empty") {
//           return rawCell === null || rawCell === undefined || rawCell === "";
//         }
//         if (operator === "is not empty") {
//           return rawCell !== null && rawCell !== undefined && rawCell !== "";
//         }

//         // Boolean
//         if (typeof rawCell === "boolean") {
//           if (operator === "equals") return rawCell === rawValue;
//           if (operator === "does not equal") return rawCell !== rawValue;
//           return true;
//         }

//         // Number
//         if (typeof rawCell === "number") {
//           const numVal = Number(rawValue);
//           if (isNaN(numVal)) return true;
//           switch (operator) {
//             case "equals": return rawCell === numVal;
//             case "does not equal": return rawCell !== numVal;
//             case "greater than": return rawCell > numVal;
//             case "less than": return rawCell < numVal;
//             case "greater or equal": return rawCell >= numVal;
//             case "less or equal": return rawCell <= numVal;
//             case "contains": return String(rawCell).includes(String(rawValue));
//             case "does not contain": return !String(rawCell).includes(String(rawValue));
//             default: return true;
//           }
//         }

//         // Date
//         if (rawCell instanceof Date || key.toLowerCase().includes("date")) {
//           const cellTime = new Date(rawCell).getTime();
//           const valTime = new Date(rawValue).getTime();
//           if (isNaN(cellTime) || isNaN(valTime)) return true;
//           if (operator === "equals") return cellTime === valTime;
//           if (operator === "does not equal") return cellTime !== valTime;
//           return true;
//         }

//         // String (default)
//         const cell = String(rawCell ?? "").toLowerCase();
//         const val = String(rawValue ?? "").toLowerCase();
//         switch (operator) {
//           case "contains": return cell.includes(val);
//           case "does not contain": return !cell.includes(val);
//           case "equals": return cell === val;
//           case "does not equal": return cell !== val;
//           case "starts with": return cell.startsWith(val);
//           case "ends with": return cell.endsWith(val);
//           default: return true;
//         }
//       })
//     );
//   }, [tableData, filters]);

//   // ── Sorted rows ──────────────────────────────────────────────────────────
//   const sortedData = useMemo(() => {
//     if (!orderBy) return filteredData;
//     return stableSort(filteredData, getComparator(order, orderBy));
//   }, [filteredData, order, orderBy]);

//   const handleSort = useCallback((key, direction) => {
//     setOrder(direction);
//     setOrderBy(key);
//   }, []);

//   // ── Drag-resize ──────────────────────────────────────────────────────────
//   const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
//     e.preventDefault();
//     const startX = e.clientX;
//     const onMove = (mv) => {
//       const newW = Math.min(
//         Math.max(MIN_COL_PX, startWidth + mv.clientX - startX),
//         maxWidth
//       );
//       setColumnWidths((prev) => ({ ...prev, [key]: newW }));
//     };
//     const onUp = () => {
//       document.removeEventListener("mousemove", onMove);
//       document.removeEventListener("mouseup", onUp);
//     };
//     document.addEventListener("mousemove", onMove);
//     document.addEventListener("mouseup", onUp);
//   }, []);

//   // ── Active filter count (for banner) ────────────────────────────────────
//   const activeCount = useMemo(() =>
//     Object.values(filters).filter((f) => {
//       if (!f?.operator) return false;
//       if (["is empty", "is not empty"].includes(f.operator)) return true;
//       const v = f.value;
//       if (v === null || v === undefined) return false;
//       if (typeof v === "string") return v.trim() !== "";
//       if (typeof v === "boolean") return true;
//       if (typeof v === "number") return !isNaN(v);
//       if (v instanceof Date) return !isNaN(v.getTime());
//       return true;
//     }).length,
//     [filters]);

//   const clearAllFilters = useCallback(() => {
//     setFilters({});
//     setOrder("asc");
//     setOrderBy(null);
//     setHeaderHideColumns(hideColumns);
//   }, [hideColumns]);

//   // ── Scrollbar sx (shared) ────────────────────────────────────────────────
//   const scrollbarSx = {
//     "&::-webkit-scrollbar": { width: "6px", height: "6px" },
//     "&::-webkit-scrollbar-track": { background: "transparent" },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)",
//       borderRadius: "10px",
//     },
//     "&::-webkit-scrollbar-thumb:hover": {
//       backgroundColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)",
//     },
//     scrollbarWidth: "thin",
//     scrollbarColor: isDark
//       ? "rgba(255,255,255,0.25) transparent"
//       : "rgba(0,0,0,0.18) transparent",
//   };

//   // Visible columns (no SR_NO, no hidden)
//   const visibleColumns = useMemo(
//     () => columns.filter((c) => c.key !== "SR_NO" && !headerHideColumns.includes(c.key)),
//     [columns, headerHideColumns]
//   );

//   const hasTotals =
//     TotalTableColumnValueCount.length > 0 &&
//     sortedData.length > 0 &&
//     TotalTableColumnValueCount.some((k) => !headerHideColumns.includes(k));

//   return (
//     <>
//       {/* <GlobalLoader open={screenLoading} /> */}

//       <Box
//         sx={{
//           height: tableHeight || "calc(100vh - 180px)",
//           minHeight: 320,
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           borderRadius: 2,
//           overflow: "hidden",
//           background: alpha(isDark ? "#0f172a" : "#fff", isDark ? 0.6 : 0.7),
//           backdropFilter: "blur(12px)",
//           border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
//         }}
//       >
//         {/* Active-filter banner */}
//         {activeCount > 0 && (
//           <Box
//             sx={{
//               px: 2, py: 0.75,
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               flexShrink: 0,
//               bgcolor: alpha(theme.palette.primary.main, 0.1),
//               borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//             }}
//           >
//             <FilterListAltIcon sx={{ fontSize: 15, color: theme.palette.primary.main }} />
//             <Typography
//               variant="caption"
//               sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: 11 }}
//             >
//               {activeCount} active filter{activeCount > 1 ? "s" : ""}
//             </Typography>
//             <Tooltip title="Clear all filters">
//               <IconButton
//                 size="small"
//                 onClick={clearAllFilters}
//                 sx={{ ml: "auto", color: theme.palette.primary.main, p: "3px" }}
//               >
//                 <FilterAltOffIcon sx={{ fontSize: 15 }} />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}

//         {/* Table area */}
//         <Paper
//           elevation={0}
//           sx={{
//             flex: 1,
//             minHeight: 0,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             background: "transparent",
//             borderRadius: 0,
//           }}
//         >
//           <TableContainer
//             sx={{
//               flex: 1,
//               minHeight: 0,
//               overflowX: "auto",
//               overflowY: "auto",
//               ...scrollbarSx,
//             }}
//           >
//             <Table
//               stickyHeader
//               size="small"
//               sx={{ tableLayout: "fixed",// width: "max-content", 
//                 width: "100%"
//                }}
//             >
//               {/*
//                * colgroup is the ONLY reliable way to fix checkbox column width.
//                * It runs before any CSS from TableCell sx props and wins.
//                */}
//               <colgroup>
//                 {EnableCheckboxFlag && (
//                   <col style={{ width: CB_WIDTH, minWidth: CB_WIDTH, maxWidth: CB_WIDTH }} />
//                 )}
//                 {visibleColumns.map((col) => {
//                   const w = columnWidths[col.key] ?? col.defaultWidth;
//                   return <col key={col.key} style={{ width: w, minWidth: w }} />;
//                 })}
//               </colgroup>

//               <TableHeader
//                 columns={columns}
//                 columnWidths={columnWidths}
//                 visibleColumns={visibleColumns}
//                 onResizeStart={handleResizeStart}
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 operators={operators}
//                 handleClearFilter={handleClearFilter}
//                 handleSort={handleSort}
//                 order={order}
//                 orderBy={orderBy}
//                 setOrder={setOrder}
//                 setOrderBy={setOrderBy}
//                 currentPageRows={sortedData}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 headerHideColumns={headerHideColumns}
//                 setHeaderHideColumns={setHeaderHideColumns}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 sortedData={sortedData}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 cbWidth={CB_WIDTH}
//                 theme={theme}
//                 isDark={isDark}
//               />

//               <TableBodyRows
//                 rows={sortedData}
//                 columns={columns}
//                 visibleColumns={visibleColumns}
//                 columnWidths={columnWidths}
//                 selected={selected}
//                 setSelected={setSelected}
//                 allPageSelected={allPageSelected}
//                 setAllPageSelected={setAllPageSelected}
//                 tableData={tableData}
//                 setTableData={setTableData}
//                 EditableColumns={EditableColumns}
//                 TableDropDowns={TableDropDowns}
//                 headerHideColumns={headerHideColumns}
//                 TableRowHighlight={TableRowHighlight}
//                 EnableCheckboxFlag={EnableCheckboxFlag}
//                 cbWidth={CB_WIDTH}
//                 theme={theme}
//                 isDark={isDark}
//               />

//               {hasTotals && (
//                 <TableFooterTotals
//                   columns={columns}
//                   columnWidths={columnWidths}
//                   currentPageRows={sortedData}
//                   TotalTableColumnValueCount={TotalTableColumnValueCount}
//                   headerHideColumns={headerHideColumns}
//                   EnableCheckboxFlag={EnableCheckboxFlag}
//                   theme={theme}
//                   isDark={isDark}
//                 />
//               )}
//             </Table>
//           </TableContainer>

//           <TableStats
//             sortedData={sortedData}
//             allPageSelected={allPageSelected}
//             EnableCheckboxFlag={EnableCheckboxFlag}
//             theme={theme}
//             isDark={isDark}
//           />
//         </Paper>
//       </Box>
//     </>
//   );
// }

//====================================================
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CustomTableNoPage.js
//
// Self-contained data table — no pagination, no external column config needed.
// All columns are derived automatically from data[0] keys.
//
// CRITICAL DESIGN DECISIONS (read before touching):
//
//  1. tableLayout:"fixed"  ← tells the browser to honour declared widths.
//                            Without this the browser ignores colgroup widths.
//
//  2. width:"max-content"  ← table grows to fit all columns, enabling
//     + minWidth:"100%"      horizontal scroll. Without this the table would
//                            be clamped to the container and columns would
//                            fight for space, making checkboxes wide.
//
//  3. <colgroup>           ← THE only reliable cross-browser way to lock a
//                            column to an exact px width.  Works because it
//                            runs before the layout engine sees <th>/<td>.
//
//  4. CB_W constant        ← Single source of truth for checkbox column width.
//                            Passed as prop `cbW` to TableHeader + TableBodyRows
//                            so all three places (colgroup, header, body) are
//                            always in sync.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableContainer,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import GlobalLoader from "../Loaders/GlobalLoader";
import TableHeader from "./TableHeaderNoPage";
import TableBodyRows from "./TableBodyNoPage";
import TableFooterTotals from "./TableFooterNoPage";
import TableStats from "./TableFooterRowsCountNoPage";
import { getComparator, stableSort } from "./TableSortingNoPage";
import { serializedata } from "./TableDataSerializeNoPage";

// ─── constants ───────────────────────────────────────────────────────────────
const CHAR_PX = 8;   // estimated px per character (13 px font)
const MIN_COL_PX = 80;  // minimum column width after drag-resize
const CB_W = 36;  // checkbox column pixel width — single source of truth

// ─── deriveColumns ───────────────────────────────────────────────────────────
// Builds column metadata (key, label, defaultWidth, maxWidth) from data shape.
// Called once on mount via useMemo.
const deriveColumns = (data) => {
  if (!data?.length) return [];
  return Object.keys(data[0]).map((key) => {
    const label = key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .toUpperCase();
    const labelPx = label.length * CHAR_PX;
    const defaultWidth = Math.max(labelPx + 24, MIN_COL_PX);
    const minWidth = Math.max(labelPx * 3, 200);
    const maxWidth = Math.max(labelPx * 7, 200);
    return { key, label, defaultWidth, minWidth, maxWidth };
  });
};

// ─── CustomTableNoPage ───────────────────────────────────────────────────────
export default function CustomTableNoPage({
  data = [],
  EditableColumns = [],
  TableDropDowns = {},
  hideColumns = [],
  TotalTableColumnValueCount = [],
  TableRowHighlight = [],
  EnableCheckboxFlag = true,
  tableHeight = "",
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ── state ─────────────────────────────────────────────────────────────────
  const [screenLoading, setScreenLoading] = useState(true);
  const [columnWidths, setColumnWidths] = useState({});
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);
  const [allPageSelected, setAllPageSelected] = useState([]);
  const [selected, setSelected] = useState({});
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [headerHideColumns, setHeaderHideColumns] = useState(hideColumns);

  const [openAlert, setOpenAlert] = useState(false);

  // columns are derived once from original data shape
  const columns = useMemo(() => deriveColumns(data), []); // eslint-disable-line

  // ── initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (data.length > 0 && columns.length > 0) {
      const sorted = stableSort(data, getComparator("asc", columns[0].key));
      const serialised = serializedata(sorted);
      setTableData(serialised);
    }
    setScreenLoading(false);
  }, []); // eslint-disable-line

  // ── operator list per column type ─────────────────────────────────────────
  const operators = useCallback(
    (config, columnKey) => {
      const sample = tableData?.[0]?.[columnKey];
      const isBoolean = config?.type === "boolean" || typeof sample === "boolean";
      const isDate = config?.type === "date" || columnKey.toLowerCase().includes("date");
      const isNumeric = ["number", "float", "currency", "percentage"].includes(config?.type);

      if (isBoolean || isDate) {
        return ["equals", "does not equal", "is empty", "is not empty"];
      }
      if (isNumeric) {
        return [
          "equals", "does not equal",
          "greater than", "less than",
          "greater or equal", "less or equal",
          "is empty", "is not empty",
        ];
      }
      return [
        "contains", "does not contain",
        "equals", "does not equal",
        "starts with", "ends with",
        "is empty", "is not empty",
      ];
    },
    [tableData]
  );

  // ── filter handlers ───────────────────────────────────────────────────────
  const handleFilterChange = useCallback((key, operator, value) => {
    setFilters((prev) => ({ ...prev, [key]: { operator, value } }));
  }, []);

  const handleClearFilter = useCallback((key) => {
    setFilters((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // ── filtered rows ─────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return tableData.filter((row) =>
      Object.entries(filters).every(([key, filter]) => {
        if (!filter?.operator) return true;
        const { operator, value: rawValue } = filter;
        const rawCell = row[key];

        // value-independent operators
        if (operator === "is empty")
          return rawCell === null || rawCell === undefined || rawCell === "";
        if (operator === "is not empty")
          return rawCell !== null && rawCell !== undefined && rawCell !== "";

        // boolean
        if (typeof rawCell === "boolean") {
          if (operator === "equals") return rawCell === rawValue;
          if (operator === "does not equal") return rawCell !== rawValue;
          return true;
        }

        // number
        if (typeof rawCell === "number") {
          const numVal = Number(rawValue);
          if (isNaN(numVal)) return true;
          switch (operator) {
            case "equals": return rawCell === numVal;
            case "does not equal": return rawCell !== numVal;
            case "greater than": return rawCell > numVal;
            case "less than": return rawCell < numVal;
            case "greater or equal": return rawCell >= numVal;
            case "less or equal": return rawCell <= numVal;
            case "contains": return String(rawCell).includes(String(rawValue));
            case "does not contain": return !String(rawCell).includes(String(rawValue));
            default: return true;
          }
        }

        // date
        if (rawCell instanceof Date || key.toLowerCase().includes("date")) {
          const ct = new Date(rawCell).getTime();
          const vt = new Date(rawValue).getTime();
          if (isNaN(ct) || isNaN(vt)) return true;
          if (operator === "equals") return ct === vt;
          if (operator === "does not equal") return ct !== vt;
          return true;
        }

        // string (default)
        const cell = String(rawCell ?? "").toLowerCase();
        const val = String(rawValue ?? "").toLowerCase();
        switch (operator) {
          case "contains": return cell.includes(val);
          case "does not contain": return !cell.includes(val);
          case "equals": return cell === val;
          case "does not equal": return cell !== val;
          case "starts with": return cell.startsWith(val);
          case "ends with": return cell.endsWith(val);
          default: return true;
        }
      })
    );
  }, [tableData, filters]);

  // ── sorted rows ───────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return stableSort(filteredData, getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const handleSort = useCallback((key, direction) => {
    setOrder(direction);
    setOrderBy(key);
  }, []);

  // ── drag-resize ───────────────────────────────────────────────────────────
  // const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
  //   e.preventDefault();
  //   const startX = e.clientX;
  //   const onMove = (mv) => {
  //     const newW = Math.min(
  //       Math.max(MIN_COL_PX, startWidth + mv.clientX - startX),
  //       maxWidth
  //     );
  //     setColumnWidths((prev) => ({ ...prev, [key]: newW }));
  //   };
  //   const onUp = () => {
  //     document.removeEventListener("mousemove", onMove);
  //     document.removeEventListener("mouseup",   onUp);
  //   };
  //   document.addEventListener("mousemove", onMove);
  //   document.addEventListener("mouseup",   onUp);
  // }, []);
  const handleResizeStart = useCallback((e, key, startWidth, maxWidth) => {
    e.preventDefault();
    const startX = e.clientX;

    let frame = null;

    const onMove = (mv) => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        const newW = Math.min(
          Math.max(MIN_COL_PX, startWidth + mv.clientX - startX),
          maxWidth
        );

        setColumnWidths((prev) => ({ ...prev, [key]: newW }));
        frame = null;
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  // ── active filter count ───────────────────────────────────────────────────
  const activeCount = useMemo(() =>
    Object.values(filters).filter((f) => {
      if (!f?.operator) return false;
      if (["is empty", "is not empty"].includes(f.operator)) return true;
      const v = f.value;
      if (v === null || v === undefined) return false;
      if (typeof v === "string") return v.trim() !== "";
      if (typeof v === "boolean") return true;
      if (typeof v === "number") return !isNaN(v);
      if (v instanceof Date) return !isNaN(v.getTime());
      return true;
    }).length,
    [filters]
  );

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setOrder("asc");
    setOrderBy(null);
    setHeaderHideColumns(hideColumns);
  }, [hideColumns]);

  // ── visible columns (no SR_NO, no hidden) ────────────────────────────────
  // Pre-computed once and passed to both TableHeader and TableBodyRows
  // so they don't each have to re-filter independently.
  const visibleColumns = useMemo(() => {
    return columns.filter(
      (col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key)
    );
  }, [columns, headerHideColumns]);

  // ── scrollbar styles ──────────────────────────────────────────────────────
  const scrollbarSx = {
    "&::-webkit-scrollbar": { width: "6px", height: "6px" },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)",
    },
    scrollbarWidth: "thin",
    scrollbarColor: isDark
      ? "rgba(255,255,255,0.25) transparent"
      : "rgba(0,0,0,0.18) transparent",
  };

  const showTotalsFooter =
    TotalTableColumnValueCount.length > 0 &&
    sortedData.length > 0 &&
    TotalTableColumnValueCount.some((k) => !headerHideColumns.includes(k));

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalLoader open={screenLoading} />

      {/* Outer shell — fills available height, clips overflow */}
      <Box
        sx={{
          height: tableHeight || "calc(100vh - 180px)",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          background: alpha(isDark ? "#0f172a" : "#fff", isDark ? 0.6 : 0.7),
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.08)}`,
        }}
      >
        {/* Active-filter banner */}
        {activeCount > 0 && (
          <Box
            sx={{
              px: 2, py: 0.75,
              display: "flex", alignItems: "center", gap: 1,
              flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <FilterListAltIcon sx={{ fontSize: 15, color: theme.palette.primary.main }} />
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: 11 }}>
              {activeCount} active filter{activeCount > 1 ? "s" : ""}
            </Typography>
            <Tooltip title="Clear all filters">
              <IconButton size="small" onClick={clearAllFilters}
                sx={{ ml: "auto", color: theme.palette.primary.main, p: "3px" }}>
                <FilterAltOffIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Table card */}
        <Paper
          elevation={0}
          sx={{
            flex: 1, minHeight: 0,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            background: "transparent",
            borderRadius: 0,
          }}
        >
          {/* Scrollable container */}
          <TableContainer
            sx={{
              flex: 1, minHeight: 0,
              overflowX: "auto",
              overflowY: "auto",
              ...scrollbarSx,
            }}
          >
            {/*
             * tableLayout:"fixed"  — browser MUST respect declared widths
             * width:"max-content"  — table grows wide enough for all columns
             * minWidth:"100%"      — never narrower than the container
             *
             * These three together allow horizontal scroll while keeping the
             * checkbox column at an exact fixed width via <colgroup>.
             */}
            <Table
              stickyHeader
              size="small"
              sx={{
                tableLayout: "fixed",
                width: "max-content",
                minWidth: "100%",
              }}
            >
              {/*
               * <colgroup> — authoritative column widths.
               * The order must exactly match the <th>/<td> render order.
               *   col[0] = checkbox (CB_W px, locked)
               *   col[1…n] = data columns (defaultWidth or user-dragged)
               */}
              <colgroup>
                {EnableCheckboxFlag && (
                  <col style={{ width: CB_W, minWidth: CB_W, maxWidth: CB_W }} />
                )}
                {visibleColumns.map((col) => {
                  const w = columnWidths[col.key] ?? col.defaultWidth;
                  return <col key={col.key} style={{ width: w, minWidth: w }} />;
                })}
              </colgroup>

              <TableHeader
                columns={columns}
                visibleColumns={visibleColumns}
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
                currentPageRows={sortedData}
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
                cbW={CB_W}
                theme={theme}
                isDark={isDark}
              />

              <TableBodyRows
                rows={sortedData}
                columns={columns}
                visibleColumns={visibleColumns}
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
                TableRowHighlight={TableRowHighlight}
                EnableCheckboxFlag={EnableCheckboxFlag}
                setOpenAlert={setOpenAlert}
                cbW={CB_W}
                theme={theme}
                isDark={isDark}
              />

              {showTotalsFooter && (
                <TableFooterTotals
                  columns={columns}
                  columnWidths={columnWidths}
                  currentPageRows={sortedData}
                  TotalTableColumnValueCount={TotalTableColumnValueCount}
                  headerHideColumns={headerHideColumns}
                  EnableCheckboxFlag={EnableCheckboxFlag}
                  theme={theme}
                  isDark={isDark}
                />
              )}
            </Table>
          </TableContainer>

          {/* Row-count / selection stats bar */}
          <TableStats
            sortedData={sortedData}
            allPageSelected={allPageSelected}
            EnableCheckboxFlag={EnableCheckboxFlag}
            theme={theme}
            isDark={isDark}
          />
        </Paper>

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