// "use client";

// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import {
//   TableHead,
//   TableRow,
//   TableCell,
//   TableSortLabel,
//   alpha,
//   Box,
//   Tooltip,
//   IconButton,
//   Checkbox
// } from "@mui/material";

// import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
// import TableHeaderFiltersPage from "./TableHeaderFiltersNoPage";

// // ═══════════════════════════════════════════════════════════════
// // SUB-COMPONENT ─ TableHeader
// // Sticky header row.  Each cell has:
// //   • a filter icon that opens FilterPopover
// //   • a 5 px drag handle on its right edge for resizing
// //
// // Props
// //   columns        Array of enriched column objects (from deriveColumns)
// //   columnWidths   { [key]: px }  — live override from drag-resize
// //   onResizeStart  (e, key, startWidth, maxWidth) => void
// //   filters        { [key]: string }
// //   onFilterChange (key, value) => void
// //   theme / isDark MUI theme refs
// // ═══════════════════════════════════════════════════════════════
// export default function TableHeader({
//   columns,
//   columnWidths,
//   onResizeStart,
//   filters,
//   onFilterChange,
//   operators,
//   handleClearFilter,
//   handleSort,
//   order,
//   orderBy,
//   setOrder,
//   setOrderBy,
//   currentPageRows,
//   selected,
//   setSelected,
//   allPageSelected,
//   setAllPageSelected,
//   tableData,
//   setTableData,
//   headerHideColumns,
//   setHeaderHideColumns,
//   EditableColumns,
//   TableDropDowns,
//   sortedData,
//   EnableCheckboxFlag,
//   theme,
//   isDark
// }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeColumn, setActiveColumn] = useState(null);

//   const openFilter = (e, col) => {
//     e.stopPropagation();

//     const cell = e.currentTarget.closest("th"); // 🔥 get TableCell

//     setAnchorEl(cell); // ✅ anchor to full column
//     setActiveColumn(col);
//   };
//   // const closeFilter = () => setAnchor({ el: null, key: null, label: null });
//   const closeFilter = () => {
//     setAnchorEl(null);
//     setActiveColumn(null);
//     setOrder('asc');
//     setOrderBy(null);
//   };

//   const selectedSet = new Set(allPageSelected);

//   const selectedCountOnPage = currentPageRows.filter((row) =>
//     selectedSet.has(row.SR_NO)
//   ).length;

//   const isIndeterminate =
//     selectedCountOnPage > 0 &&
//     selectedCountOnPage < currentPageRows.length;

//   const isChecked =
//     currentPageRows.length > 0 &&
//     selectedCountOnPage === currentPageRows.length;
//   /**
//  * HANDLER: handleSelectAll
//  * INPUT: rows (The current visible filtered rows - currentPageRows)
//  * PURPOSE: Toggles selection for only the visible filtered items
//  */
//   const handleSelectAll = (rows) => {
//     const visibleIds = rows.map(r => r.SR_NO);
//     setAllPageSelected(prev => {
//       // Check if ALL currently visible rows are already in the selection
//       const isAllVisibleSelected = visibleIds.every(id => prev.includes(id));

//       if (isAllVisibleSelected) {
//         // DESELECT: Remove only the visibleIds from the global selection
//         return prev.filter(id => !visibleIds.includes(id));
//       } else {
//         // SELECT: Add visibleIds to global selection (avoiding duplicates)
//         return [...new Set([...prev, ...visibleIds])];
//       }
//     });
//   };
//   /**
//    * EFFECT: Sync 'selected' object based on 'allPageSelected'
//    * PURPOSE: Categorizes selected IDs into their original page buckets (1-30, 31-60, etc.)
//    */

//   return (
//     <>
//       <TableHead>
//         <TableRow >
//           {/* {EnableCheckboxFlag &&
//             <TableCell
//               padding="none"
//               sx={{
//                 position: "sticky",
//                 left: 0, // Freeze horizontally
//                 top: 0,  // Freeze vertically
//                 zIndex: 10, // Higher than other headers
//                 bgcolor: isDark ? "#1e293b" : "#e2e8f0", // Match header color
//                 borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`, // Visual separator
//                 width: "30px !important",
//                 minWidth: "30px !important",
//                 maxWidth: "30px !important",
//                 p: 0, m: 0,

//                 overflow: "hidden",
//                 boxSizing: "border-box",
//                 // flexShrink: 0,
//                 border: "1px solid red"
//               }}
//             >
//               <Box sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "100%",
//                 overflow: "hidden",
//               }} >
//                 <Checkbox
//                   indeterminate={isIndeterminate}
//                   checked={isChecked}
//                   onChange={() => handleSelectAll(currentPageRows)}
//                   size="small"
//                   sx={{
//                     p: 0.5, m: 0,
//                     // border: '1px solid red', 
//                     color: alpha(theme.palette.primary.main, 0.5),
//                     '&.Mui-checked': { color: theme.palette.primary.main },
//                     '&.MuiCheckbox-indeterminate': { color: theme.palette.primary.main },
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 18,   // 🔥 FIXED SIZE
//                     },
//                   }}
//                 />
//               </Box>
//             </TableCell>
//           } */}
//           {EnableCheckboxFlag &&
//             <TableCell
//               padding="none"
//               sx={{
//                 position: "sticky",
//                 // left: 0,
//                 // top: 0,
//                 // zIndex: 10,
//                 bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                 borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//                 // ✅ Lock to exactly 30px — !important overrides MUI's TableCell defaults
//                 width: "30px !important",
//                 minWidth: "30px !important",
//                 maxWidth: "30px !important",
//                 padding: "0 !important",
//                 border: '1px solid green',
//                 // p: 0,
//                 m: 0,
//                 overflow: "hidden",
//                 boxSizing: "border-box",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 30,
//                   height: 30,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   // flexShrink: 0,
//                   border: '1px solid white'
//                 }}
//               >
//                 <Checkbox
//                   indeterminate={isIndeterminate}
//                   checked={isChecked}
//                   onChange={() => handleSelectAll(currentPageRows)}
//                   sx={{
//                     p: 0,
//                     m: 0,
//                     color: alpha(theme.palette.primary.main, 0.5),
//                     "&.Mui-checked": { color: theme.palette.primary.main },
//                     "&.MuiCheckbox-indeterminate": { color: theme.palette.primary.main },
//                     // ✅ Force SVG to exact 16px — never inherits from parent font-size
//                     "& .MuiSvgIcon-root": {
//                       fontSize: "16px !important",
//                       width: "16px !important",
//                       height: "16px !important",
//                       flexShrink: 0,
//                     },
//                   }}
//                 />
//               </Box>
//             </TableCell>
//           }
//           {columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//             .map((col) => {
//               const w = columnWidths[col.key] ?? col.defaultWidth;
//               const isFiltered = Boolean(filters[col.key]?.operator);
//               return (
//                 <TableCell
//                   key={col.key}
//                   sx={{
//                     // sticky positioning
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 2,
//                     // column sizing — all three must match so layout is fixed
//                     width: w,
//                     minWidth: w,
//                     // maxWidth: w,
//                     // appearance
//                     fontWeight: 700,
//                     fontSize: 12,
//                     letterSpacing: 0.4,
//                     bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                     color: theme.palette.text.primary,
//                     borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     userSelect: "none",
//                     padding: "1px 8px 1px 12px",
//                   }}
//                 // sx={{
//                 //   position: "sticky",
//                 //   top: 0,
//                 //   zIndex: 2,
//                 //   bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                 //   borderRight: "none",
//                 //   p: 0,
//                 //   width: columnWidths[col.key] ?? col.defaultWidth,
//                 //   minWidth: columnWidths[col.key] ?? col.defaultWidth,
//                 //   maxWidth: columnWidths[col.key] ?? col.defaultWidth,
//                 //   fontWeight: 700,
//                 //   fontSize: 12,
//                 //   letterSpacing: 0.4,
//                 //   bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                 //   color: theme.palette.text.primary,
//                 //   borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
//                 //   whiteSpace: "nowrap",
//                 //   overflow: "hidden",
//                 //   userSelect: "none",
//                 //   padding: "1px 8px 1px 12px",
//                 // }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: "8px" }}>
//                     <Box sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
//                       <TableSortLabel
//                         active={orderBy === col.key}
//                         direction={orderBy === col.key ? order : "asc"}
//                         onClick={() =>
//                           handleSort(
//                             col.key,
//                             orderBy === col.key && order === "asc" ? "desc" : "asc"
//                           )
//                         }
//                         sx={{
//                           fontSize: 12,
//                           fontWeight: 600,
//                           maxWidth: "100%",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           color: theme.palette.text.primary,

//                           "&.Mui-active": {
//                             color: theme.palette.primary.main,
//                           },
//                           "& .MuiTableSortLabel-icon": {
//                             color: `${theme.palette.primary.main} !important`,
//                             fontSize: 16,
//                           },
//                         }}
//                       >
//                         {col.label}
//                       </TableSortLabel>
//                     </Box>
//                     <Tooltip title={isFiltered ? `Filtering: "${filters[col.key]}"` : "Add filter"} arrow>
//                       <IconButton
//                         size="small"
//                         // onClick={(e) => openFilter(e, col.key, col.label)}
//                         onClick={(e) => openFilter(e, col)}
//                         sx={{
//                           p: "2px",
//                           color: isFiltered ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.35),
//                           "&:hover": { color: theme.palette.primary.main },
//                           flexShrink: 0,
//                         }}
//                       >
//                         <FilterListAltIcon sx={{ fontSize: 14, padding: 0 }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                   <Box
//                     onMouseDown={(e) => onResizeStart(e, col.key, w, col.maxWidth)}
//                     sx={{
//                       position: "absolute",
//                       right: 0, top: 0, bottom: 0,
//                       width: "5px",
//                       cursor: "col-resize",
//                       zIndex: 3,
//                       transition: "background 0.15s",
//                       "&:hover": { background: theme.palette.primary.main, opacity: 0.7 },
//                     }}
//                   />
//                 </TableCell>
//               );
//             })}
//         </TableRow>
//       </TableHead>

//       <TableHeaderFiltersPage
//         anchorEl={anchorEl}
//         onClose={closeFilter}
//         column={activeColumn}
//         filterValue={filters[activeColumn?.key]}
//         onFilterChange={onFilterChange}
//         onSort={handleSort}
//         // onHideColumn={handleHideColumn}
//         onClearFilter={handleClearFilter}
//         operators={operators}
//         columns={columns}
//         headerHideColumns={headerHideColumns}
//         setHeaderHideColumns={setHeaderHideColumns}
//         tableData={tableData}
//         setTableData={setTableData}
//         EditableColumns={EditableColumns}
//         TableDropDowns={TableDropDowns}
//         currentPageRows={currentPageRows}
//         allPageSelected={allPageSelected}
//         sortedData={sortedData}
//         theme={theme}
//         isDark={isDark}
//       />
//     </>
//   );
// };

// "use client";

// import React, { useState } from "react";
// import {
//   TableHead,
//   TableRow,
//   TableCell,
//   TableSortLabel,
//   alpha,
//   Box,
//   Tooltip,
//   IconButton,
//   Checkbox,
// } from "@mui/material";
// import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
// import TableHeaderFiltersPage from "./TableHeaderFiltersNoPage";

// // ═══════════════════════════════════════════════════════════════
// // TableHeader
// //
// // Sticky header row.  Each data cell has:
// //   • a sort label
// //   • a filter icon that opens FilterPopover
// //   • a 5 px drag handle on its right edge for column resizing
// //
// // The checkbox column is sized by `checkboxWidth` (passed from the
// // parent) so it matches the <colgroup> declaration exactly.
// // ═══════════════════════════════════════════════════════════════
// export default function TableHeader({
//   columns,
//   columnWidths,
//   onResizeStart,
//   filters,
//   onFilterChange,
//   operators,
//   handleClearFilter,
//   handleSort,
//   order,
//   orderBy,
//   setOrder,
//   setOrderBy,
//   currentPageRows,
//   selected,
//   setSelected,
//   allPageSelected,
//   setAllPageSelected,
//   tableData,
//   setTableData,
//   headerHideColumns,
//   setHeaderHideColumns,
//   EditableColumns,
//   TableDropDowns,
//   sortedData,
//   EnableCheckboxFlag,
//   checkboxWidth = 32,   // ← must match CHECKBOX_W in CustomTableNoPage
//   theme,
//   isDark,
// }) {
//   const [anchorEl,     setAnchorEl]     = useState(null);
//   const [activeColumn, setActiveColumn] = useState(null);

//   const openFilter = (e, col) => {
//     e.stopPropagation();
//     const cell = e.currentTarget.closest("th");
//     setAnchorEl(cell);
//     setActiveColumn(col);
//   };

//   const closeFilter = () => {
//     setAnchorEl(null);
//     setActiveColumn(null);
//     setOrder("asc");
//     setOrderBy(null);
//   };

//   // ── Select-all state derived from currentPageRows ──────────
//   const selectedSet = new Set(allPageSelected);

//   const selectedCountOnPage = currentPageRows.filter((row) =>
//     selectedSet.has(row.SR_NO)
//   ).length;

//   const isIndeterminate =
//     selectedCountOnPage > 0 &&
//     selectedCountOnPage < currentPageRows.length;

//   const isChecked =
//     currentPageRows.length > 0 &&
//     selectedCountOnPage === currentPageRows.length;

//   /**
//    * handleSelectAll
//    * Toggles selection for all currently visible (filtered) rows.
//    * If every visible row is already selected → deselect them.
//    * Otherwise → add them all to the global selection.
//    */
//   const handleSelectAll = (rows) => {
//     const visibleIds = rows.map((r) => r.SR_NO);
//     setAllPageSelected((prev) => {
//       const isAllVisibleSelected = visibleIds.every((id) => prev.includes(id));
//       if (isAllVisibleSelected) {
//         return prev.filter((id) => !visibleIds.includes(id));
//       }
//       return [...new Set([...prev, ...visibleIds])];
//     });
//   };

//   return (
//     <>
//       <TableHead>
//         <TableRow>
//           {/* ── Checkbox header cell ──────────────────────────── */}
//           {EnableCheckboxFlag && (
//             <TableCell
//               padding="none"
//               sx={{
//                 position: "sticky",
//                 top: 0,
//                 zIndex: 10,                // above data header cells
//                 width: checkboxWidth,
//                 minWidth: checkboxWidth,
//                 maxWidth: checkboxWidth,
//                 p: 0,
//                 m: 0,
//                 overflow: "hidden",
//                 boxSizing: "border-box",
//                 bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                 borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: checkboxWidth,
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Checkbox
//                   indeterminate={isIndeterminate}
//                   checked={isChecked}
//                   onChange={() => handleSelectAll(currentPageRows)}
//                   sx={{
//                     p: 0,
//                     m: 0,
//                     color: alpha(theme.palette.primary.main, 0.5),
//                     "&.Mui-checked":            { color: theme.palette.primary.main },
//                     "&.MuiCheckbox-indeterminate":{ color: theme.palette.primary.main },
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 16,
//                       flexShrink: 0,
//                     },
//                   }}
//                 />
//               </Box>
//             </TableCell>
//           )}

//           {/* ── Data column header cells ─────────────────────── */}
//           {columns
//             .filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//             .map((col) => {
//               const w          = columnWidths[col.key] ?? col.defaultWidth;
//               const isFiltered = Boolean(filters[col.key]?.operator);

//               return (
//                 <TableCell
//                   key={col.key}
//                   sx={{
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 2,
//                     width: w,
//                     minWidth: w,
//                     fontWeight: 700,
//                     fontSize: 12,
//                     letterSpacing: 0.4,
//                     bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                     color: theme.palette.text.primary,
//                     borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     userSelect: "none",
//                     padding: "1px 8px 1px 12px",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: "8px" }}>
//                     {/* Sort label */}
//                     <Box sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
//                       <TableSortLabel
//                         active={orderBy === col.key}
//                         direction={orderBy === col.key ? order : "asc"}
//                         onClick={() =>
//                           handleSort(
//                             col.key,
//                             orderBy === col.key && order === "asc" ? "desc" : "asc"
//                           )
//                         }
//                         sx={{
//                           fontSize: 12,
//                           fontWeight: 600,
//                           maxWidth: "100%",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           color: theme.palette.text.primary,
//                           "&.Mui-active": { color: theme.palette.primary.main },
//                           "& .MuiTableSortLabel-icon": {
//                             color: `${theme.palette.primary.main} !important`,
//                             fontSize: 16,
//                           },
//                         }}
//                       >
//                         {col.label}
//                       </TableSortLabel>
//                     </Box>

//                     {/* Filter icon */}
//                     <Tooltip
//                       title={
//                         isFiltered
//                           ? `Filtering: "${filters[col.key]?.value}"`
//                           : "Add filter"
//                       }
//                       arrow
//                     >
//                       <IconButton
//                         size="small"
//                         onClick={(e) => openFilter(e, col)}
//                         sx={{
//                           p: "2px",
//                           color: isFiltered
//                             ? theme.palette.primary.main
//                             : alpha(theme.palette.text.primary, 0.35),
//                           "&:hover": { color: theme.palette.primary.main },
//                           flexShrink: 0,
//                         }}
//                       >
//                         <FilterListAltIcon sx={{ fontSize: 14, padding: 0 }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>

//                   {/* Drag-resize handle */}
//                   <Box
//                     onMouseDown={(e) => onResizeStart(e, col.key, w, col.maxWidth)}
//                     sx={{
//                       position: "absolute",
//                       right: 0, top: 0, bottom: 0,
//                       width: "5px",
//                       cursor: "col-resize",
//                       zIndex: 3,
//                       transition: "background 0.15s",
//                       "&:hover": {
//                         background: theme.palette.primary.main,
//                         opacity: 0.7,
//                       },
//                     }}
//                   />
//                 </TableCell>
//               );
//             })}
//         </TableRow>
//       </TableHead>

//       <TableHeaderFiltersPage
//         anchorEl={anchorEl}
//         onClose={closeFilter}
//         column={activeColumn}
//         filterValue={filters[activeColumn?.key]}
//         onFilterChange={onFilterChange}
//         onSort={handleSort}
//         onClearFilter={handleClearFilter}
//         operators={operators}
//         columns={columns}
//         headerHideColumns={headerHideColumns}
//         setHeaderHideColumns={setHeaderHideColumns}
//         tableData={tableData}
//         setTableData={setTableData}
//         EditableColumns={EditableColumns}
//         TableDropDowns={TableDropDowns}
//         currentPageRows={currentPageRows}
//         allPageSelected={allPageSelected}
//         sortedData={sortedData}
//         theme={theme}
//         isDark={isDark}
//       />
//     </>
//   );
// }
//==================================================================================
// "use client";

// import React, { useState } from "react";
// import {
//   TableHead,
//   TableRow,
//   TableCell,
//   TableSortLabel,
//   alpha,
//   Box,
//   Tooltip,
//   IconButton,
//   Checkbox,
// } from "@mui/material";
// import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
// import TableHeaderFiltersPage from "./TableHeaderFiltersNoPage";

// export default function TableHeader({
//   columns,
//   columnWidths,
//   onResizeStart,
//   filters,
//   onFilterChange,
//   operators,
//   handleClearFilter,
//   handleSort,
//   order,
//   orderBy,
//   setOrder,
//   setOrderBy,
//   currentPageRows,
//   selected,
//   setSelected,
//   allPageSelected,
//   setAllPageSelected,
//   tableData,
//   setTableData,
//   headerHideColumns,
//   setHeaderHideColumns,
//   EditableColumns,
//   TableDropDowns,
//   sortedData,
//   EnableCheckboxFlag,
//   checkboxWidth = 32,
//   theme,
//   isDark,
// }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeColumn, setActiveColumn] = useState(null);

//   const openFilter = (e, col) => {
//     e.stopPropagation();
//     setAnchorEl(e.currentTarget.closest("th"));
//     setActiveColumn(col);
//   };

//   const closeFilter = () => {
//     setAnchorEl(null);
//     setActiveColumn(null);
//     setOrder("asc");
//     setOrderBy(null);
//   };

//   const selectedSet = new Set(allPageSelected);
//   const selectedCountOnPage = currentPageRows.filter((r) => selectedSet.has(r.SR_NO)).length;
//   const isIndeterminate = selectedCountOnPage > 0 && selectedCountOnPage < currentPageRows.length;
//   const isChecked = currentPageRows.length > 0 && selectedCountOnPage === currentPageRows.length;

//   const handleSelectAll = (rows) => {
//     const ids = rows.map((r) => r.SR_NO);
//     setAllPageSelected((prev) => {
//       const allSelected = ids.every((id) => prev.includes(id));
//       return allSelected
//         ? prev.filter((id) => !ids.includes(id))
//         : [...new Set([...prev, ...ids])];
//     });
//   };

//   const headerBg = isDark ? "#1e293b" : "#e2e8f0";

//   return (
//     <>
//       <TableHead>
//         <TableRow>
//           {EnableCheckboxFlag && (
//             <TableCell
//               padding="none"
//               sx={{
//                 position: "sticky",
//                 top: 0,
//                 // left: 0,
//                 zIndex: 10,
//                 bgcolor: headerBg,
//                 borderRight: `2px solid ${alpha(theme.palette.divider, 0.25)}`,
//                 p: 0,
//                 m: 0,
//                 overflow: "hidden",
//                 // border:'1px solid white',
//                 // justifyContent: 'center',
//                 // display: 'flex',
//                 height: 30,
//                 // position: "sticky",
//                 // top: 0,
//                 // zIndex: 10,                // above data header cells
//                 width: "32px !important",
//                 minWidth: "32px !important",
//                 maxWidth: "32px !important",
//                 // width:'auto'
//                 // p: 0,
//                 // m: 0,
//                 // overflow: "hidden",
//                 // boxSizing: "border-box",
//                 // bgcolor: isDark ? "#1e293b" : "#e2e8f0",
//                 // borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 30,
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center", border:'1px solid red'
//                 }}
//               >
//                 <Checkbox
//                   indeterminate={isIndeterminate}
//                   checked={isChecked}
//                   onChange={() => handleSelectAll(currentPageRows)}
//                   sx={{
//                     p: 0, m: 0,
//                     color: alpha(theme.palette.primary.main, 0.5),
//                     "&.Mui-checked": { color: theme.palette.primary.main },
//                     "&.MuiCheckbox-indeterminate": { color: theme.palette.primary.main },
//                     "& .MuiSvgIcon-root": { fontSize: 16 },
//                   }}
//                 />
//               </Box>
//             </TableCell>
//           )}

//           {columns
//             .filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//             .map((col) => {
//               const w = columnWidths[col.key] ?? col.defaultWidth;
//               const isFiltered = Boolean(filters[col.key]?.operator);
//               const isLessColumns = columns.length < 10
//               return (
//                 <TableCell
//                   key={col.key}
//                   sx={{
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 2,
//                     fontWeight: 700,
//                     fontSize: 12,
//                     letterSpacing: 0.4,
//                     bgcolor: headerBg,
//                     color: theme.palette.text.primary,
//                     borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     userSelect: "none",
//                     padding: "1px 8px 1px 12px",
//                     width: isLessColumns ? "auto" : w,
//                     minWidth: w,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: "8px" }}>
//                     <Box sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
//                       <TableSortLabel
//                         active={orderBy === col.key}
//                         direction={orderBy === col.key ? order : "asc"}
//                         onClick={() =>
//                           handleSort(col.key, orderBy === col.key && order === "asc" ? "desc" : "asc")
//                         }
//                         sx={{
//                           fontSize: 12, fontWeight: 600,
//                           maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis",
//                           color: theme.palette.text.primary,
//                           "&.Mui-active": { color: theme.palette.primary.main },
//                           "& .MuiTableSortLabel-icon": {
//                             color: `${theme.palette.primary.main} !important`,
//                             fontSize: 16,
//                           },
//                         }}
//                       >
//                         {col.label}
//                       </TableSortLabel>
//                     </Box>

//                     <Tooltip
//                       title={isFiltered ? `Filtering: "${filters[col.key]?.value}"` : "Add filter"}
//                       arrow
//                     >
//                       <IconButton
//                         size="small"
//                         onClick={(e) => openFilter(e, col)}
//                         sx={{
//                           p: "2px",
//                           color: isFiltered
//                             ? theme.palette.primary.main
//                             : alpha(theme.palette.text.primary, 0.35),
//                           "&:hover": { color: theme.palette.primary.main },
//                           flexShrink: 0,
//                         }}
//                       >
//                         <FilterListAltIcon sx={{ fontSize: 14 }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>

//                   <Box
//                     onMouseDown={(e) => onResizeStart(e, col.key, w, col.maxWidth)}
//                     sx={{
//                       position: "absolute",
//                       right: 0, top: 0, bottom: 0,
//                       width: 5,
//                       cursor: "col-resize",
//                       zIndex: 3,
//                       transition: "background 0.15s",
//                       "&:hover": { background: theme.palette.primary.main, opacity: 0.7 },
//                     }}
//                   />
//                 </TableCell>
//               );
//             })}
//           {/* <TableCell sx={{ p: 0, width: "auto", border: "none" }} /> */}
//         </TableRow>
//       </TableHead>

//       <TableHeaderFiltersPage
//         anchorEl={anchorEl}
//         onClose={closeFilter}
//         column={activeColumn}
//         filterValue={filters[activeColumn?.key]}
//         onFilterChange={onFilterChange}
//         onSort={handleSort}
//         onClearFilter={handleClearFilter}
//         operators={operators}
//         columns={columns}
//         headerHideColumns={headerHideColumns}
//         setHeaderHideColumns={setHeaderHideColumns}
//         tableData={tableData}
//         setTableData={setTableData}
//         EditableColumns={EditableColumns}
//         TableDropDowns={TableDropDowns}
//         currentPageRows={currentPageRows}
//         allPageSelected={allPageSelected}
//         sortedData={sortedData}
//         theme={theme}
//         isDark={isDark}
//       />
//     </>
//   );
// }

//=============================================================
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TableHeaderNoPage.jsx
//
// Sticky header row with:
//   • Checkbox select-all cell (width = cbW prop, matches colgroup col[0])
//   • Per-column sort labels
//   • Per-column filter icon (opens TableHeaderFiltersPage popover)
//   • Per-column drag-resize handle (5px hit area on right edge)
//
// Width contract:
//   The <th> cells do NOT need to enforce pixel widths themselves — that job
//   belongs to <colgroup> in the parent.  We still set width/minWidth on each
//   <th> as a visual fallback but the actual layout is driven by colgroup +
//   tableLayout:"fixed".
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  alpha,
  Box,
  Tooltip,
  IconButton,
  Checkbox,
} from "@mui/material";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import TableHeaderFiltersPage from "./TableHeaderFiltersNoPage";

export default function TableHeader({
  columns,           // full column array (including hidden + SR_NO)
  visibleColumns,    // pre-filtered: no SR_NO, no hidden — matches colgroup cols
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
  cbW = 36,          // checkbox column width — must match colgroup col[0]
  theme,
  isDark,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const openFilter = (e, col) => {
    e.stopPropagation();
    // Anchor to the full <th> element so the popover opens below the header
    setAnchorEl(e.currentTarget.closest("th"));
    setActiveColumn(col);
  };

  const closeFilter = () => {
    setAnchorEl(null);
    setActiveColumn(null);
    setOrder("asc");
    setOrderBy(null);
  };

  // ── select-all state ──────────────────────────────────────────────────────
  const selectedSet = new Set(allPageSelected);
  const selectedCountOnPage = currentPageRows.filter((r) => selectedSet.has(r.SR_NO)).length;
  const isIndeterminate = selectedCountOnPage > 0 && selectedCountOnPage < currentPageRows.length;
  const isChecked = currentPageRows.length > 0 && selectedCountOnPage === currentPageRows.length;

  const handleSelectAll = (rows) => {
    const ids = rows.map((r) => r.SR_NO);
    setAllPageSelected((prev) => {
      const allAlreadySelected = ids.every((id) => prev.includes(id));
      return allAlreadySelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])];
    });
  };

  const headerBg = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <>
      <TableHead>
        <TableRow>
          {/* ── Checkbox column header ─────────────────────────────────────
           * Width is set by colgroup col[0].  We do NOT put width/minWidth
           * on the sx here — colgroup is authoritative.  We only need p:0
           * so MUI's default cell padding doesn't push things out.
           * ────────────────────────────────────────────────────────────── */}
          {EnableCheckboxFlag && (
            <TableCell
              padding="none"
              sx={{
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 12,          // above data header cells (zIndex:2) + body sticky (zIndex:5)
                bgcolor: headerBg,
                borderRight: `2px solid ${alpha(theme.palette.divider, 0.25)}`,
                p: 0,
                m: 0,
                overflow: "hidden",
              }}
            >
              {/* Inner box centred to cbW so checkbox sits in the middle */}
              <Box
                sx={{
                  // width: cbW,
                  height: "100%",
                  minHeight: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isChecked}
                  onChange={() => handleSelectAll(currentPageRows)}
                  sx={{
                    p: 0, m: 0,
                    color: alpha(theme.palette.primary.main, 0.5),
                    "&.Mui-checked": { color: theme.palette.primary.main },
                    "&.MuiCheckbox-indeterminate": { color: theme.palette.primary.main },
                    "& .MuiSvgIcon-root": { fontSize: 16 },
                  }}
                />
              </Box>
            </TableCell>
          )}

          {/* ── Data column headers ─────────────────────────────────────── */}
          {visibleColumns.map((col, index) => {
            const w = columnWidths[col.key] ?? col.defaultWidth;
            const isFiltered = Boolean(filters[col.key]?.operator);
            const isLastRow = index === visibleColumns.length - 1
            const isMinWidth = col.minWidth;

            return (
              <TableCell
                key={col.key}
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  // Width repeated here is a visual fallback only —
                  // colgroup is the authoritative width source.
                  // width: w,
                  // minWidth: w,
                  width: isLastRow ? isMinWidth : w,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 0.4,
                  bgcolor: headerBg,
                  color: theme.palette.text.primary,
                  borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  userSelect: "none",
                  padding: "2px 8px 2px 12px",
                }}
              >
                {/* Label row: sort label + filter icon */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: "8px" }}>
                  <Box sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={() =>
                        handleSort(col.key, orderBy === col.key && order === "asc" ? "desc" : "asc")
                      }
                      sx={{
                        fontSize: 12, fontWeight: 600,
                        maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis",
                        color: theme.palette.text.primary,
                        "&.Mui-active": { color: theme.palette.primary.main },
                        "& .MuiTableSortLabel-icon": {
                          color: `${theme.palette.primary.main} !important`,
                          fontSize: 16,
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </Box>

                  <Tooltip
                    title={isFiltered ? `Filtering: "${filters[col.key]?.value}"` : "Add filter"}
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => openFilter(e, col)}
                      sx={{
                        p: "2px",
                        color: isFiltered
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.primary, 0.35),
                        "&:hover": { color: theme.palette.primary.main },
                        flexShrink: 0,
                      }}
                    >
                      <FilterListAltIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Drag-resize handle — 5px invisible hit area on the right edge */}
                <Box
                  onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, col.key, w, col.maxWidth) }}
                  sx={{
                    position: "absolute",
                    right: 0, top: 0, bottom: 0,
                    width: 5,
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

      {/* Filter popover — rendered outside TableHead so it escapes overflow:hidden */}
      <TableHeaderFiltersPage
        anchorEl={anchorEl}
        onClose={closeFilter}
        column={activeColumn}
        filterValue={filters[activeColumn?.key]}
        onFilterChange={onFilterChange}
        onSort={handleSort}
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
}