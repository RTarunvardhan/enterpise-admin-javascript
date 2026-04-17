// "use client";

// import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";

// import {
//   TableBody as MuiTableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   alpha,
//   TextField,
//   Box
// } from "@mui/material";

// import Select from "react-select";
// import { validateValue, getInputType, toDateInputFormat } from "./EditColumnValidateValue";
// import { buildHighlightRules, getRowHighlight, getClickHighlightStyle } from "../../utils/highlight/highLightTheme";
// import { Row } from "./CustomRowRenderTableBody";

// // ═══════════════════════════════════════════════════════════════
// // SUB-COMPONENT ─ TableBodyRows
// // Renders the already-paginated + filtered rows.
// //
// // Props
// //   rows         sliced array of row objects
// //   columns      enriched column array
// //   columnWidths { [key]: px }
// //   theme        MUI theme
// // ═══════════════════════════════════════════════════════════════

// export default function TableBodyRows({
//   rows,
//   columns,
//   columnWidths,
//   selected,
//   setSelected,
//   allPageSelected,
//   setAllPageSelected,
//   tableData,
//   setTableData,
//   EditableColumns,
//   TableDropDowns,
//   headerHideColumns,
//   TableRowHighlight,
//   EnableCheckboxFlag,
//   theme,
//   isDark
// }) {
//   const [clickedRowId, setClickedRowId] = useState(null);

//   /**
//    * HANDLER: handleRowSelect
//    * INPUT: SR_NO (The unique identifier for the row)
//    * PURPOSE: Adds or removes a single ID from the global selection
//    */
//   const handleRowSelectMemo = useCallback((id) => {
//     console.log("id: ", id);
//     setAllPageSelected((prev) => {
//       if (prev.includes(id)) return prev.filter(i => i !== id);
//       return [...prev, id];
//     });
//   }, []);

//   // const handleRowSelectMemo = (SR_NO) => {
//   //   console.log("SR_NO: ", SR_NO);
//   //   setAllPageSelected((prev) => {
//   //     if (prev.includes(SR_NO)) {
//   //       // DESELECT: Filter out this ID
//   //       return prev.filter((id) => id !== SR_NO);
//   //     } else {
//   //       // SELECT: Add this ID
//   //       return [...prev, SR_NO];
//   //     }
//   //   });
//   // };

//   const selectedSet = useMemo(() => new Set(allPageSelected), [allPageSelected]);

//   const [editBuffer, setEditBuffer] = useState({});
//   const [errors, setErrors] = useState({});

//   const handleSelectChange = (srNo, key, selectedOption) => {
//     const value = selectedOption?.value || "";

//     setEditBuffer((prev) => ({
//       ...prev,
//       [`${srNo}_${key}`]: value
//     }));
//   };


//   // ✅ FORMAT: YYYY-MM-DD → DD-MMM-YY
//   const formatDisplayDate = (dateStr) => {
//     if (!dateStr) return "";

//     const d = new Date(dateStr);
//     if (isNaN(d)) return dateStr;

//     return d.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",   // 🔥 KEY FIX
//       year: "numeric",
//     });
//   };

//   // ✅ ENSURE YYYY-MM-DD
//   const formatToISO = (value) => {
//     if (!value) return "";
//     return value.slice(0, 10);
//   };

//   const editableMap = useMemo(() => {
//     const map = {};
//     EditableColumns.forEach(col => {
//       map[col.columnName] = col;
//     });
//     return map;
//   }, [EditableColumns]);

//   const handleInputChange = (srNo, key, value) => {
//     const config = editableMap[key];
//     const bufferKey = `${srNo}_${key}`;

//     // ✅ Always update value
//     setEditBuffer((prev) => ({
//       ...prev,
//       [bufferKey]: value
//     }));

//     // ✅ Validate AFTER update
//     const isValid = validateValue(config, value);

//     setErrors((prev) => ({
//       ...prev,
//       [bufferKey]: !isValid
//     }));
//   };

//   const commitChange = (srNo, key) => {
//     const bufferKey = `${srNo}_${key}`;
//     const newValue = editBuffer[bufferKey];
//     const config = editableMap[key];

//     if (newValue === undefined) return;

//     // ❌ BLOCK HERE (correct place)
//     if (!validateValue(config, newValue)) return;

//     setTableData((prev) =>
//       prev.map((row) =>
//         row.SR_NO === srNo
//           ? { ...row, [key]: newValue }
//           : row
//       )
//     );

//     setEditBuffer((prev) => {
//       const updated = { ...prev };
//       delete updated[bufferKey];
//       return updated;
//     });

//     setErrors((prev) => {
//       const updated = { ...prev };
//       delete updated[bufferKey];
//       return updated;
//     });
//   };

//   const highlightRules = useMemo(() => {
//     if (!TableRowHighlight) return [];
//     return buildHighlightRules(TableRowHighlight, theme, isDark);
//   }, [TableRowHighlight, theme, isDark]);

//   const rowHighlightCache = useMemo(() => {
//     const cache = {};
//     rows.forEach((row) => {
//       cache[row.SR_NO] = getRowHighlight(row, highlightRules);
//     });
//     return cache;
//   }, [rows, highlightRules]);

//   const visibleColumns = useMemo(() => {
//     return columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key));
//   }, [columns, headerHideColumns]);

//   return (
//     <MuiTableBody>
//       {rows.length === 0 ? (
//         <TableRow key="no-records-row">
//           <TableCell
//             colSpan={columns.length}
//             align="center"
//             sx={{ py: 8, color: alpha(theme.palette.text.primary, 0.35), fontSize: 14 }}
//           >
//             No records found.
//           </TableCell>
//         </TableRow>
//       ) : (
//         rows.map((row, index) => {
//           const isSelected = selectedSet.has(row.SR_NO);
//           const isClicked = clickedRowId === row.SR_NO;
//           return (
//             <Row
//               // key={row.SR_NO}
//               key={row.SR_NO ? `row-${row.SR_NO}` : `row-idx-${index}`}
//               row={row}
//               columns={visibleColumns}
//               columnWidths={columnWidths}
//               isSelected={isSelected}
//               isClicked={isClicked}
//               handleRowSelect={handleRowSelectMemo}
//               headerHideColumns={headerHideColumns}
//               editableMap={editableMap}
//               allPageSelected={allPageSelected}
//               TableDropDowns={TableDropDowns}
//               editBuffer={editBuffer}
//               handleSelectChange={handleSelectChange}
//               handleInputChange={handleInputChange}
//               commitChange={commitChange}
//               errors={errors}
//               rowHighlightCache={rowHighlightCache}
//               clickedRowId={clickedRowId}
//               setClickedRowId={setClickedRowId}
//               EnableCheckboxFlag={EnableCheckboxFlag}
//               getClickHighlightStyle={getClickHighlightStyle}
//               toDateInputFormat={toDateInputFormat}
//               formatDisplayDate={formatDisplayDate}
//               theme={theme}
//               isDark={isDark}
//             />
//           )
//         })
//       )}
//     </MuiTableBody>
//   )
// };

// rows.map((row, i) => {
//   const isSelected = selectedSet.has(row.SR_NO);
//   const isClicked = clickedRowId === row.SR_NO;

//   const { rowStyle = {}, columnStyles = {} } = rowHighlightCache[row.SR_NO] || {};
//   return (
//     <TableRow
//       key={row.SR_NO || i}
//       hover
//       onClick={() => handleRowClick(row)}
//       sx={{
//         ...(isClicked ? getClickHighlightStyle(theme, isDark) : rowStyle)
//         , padding: 0,
//         fontSize: 12,
//         "&:hover": {
//           backgroundColor: alpha(theme.palette.primary.main, 0.08),
//         },
//       }}>
//       {EnableCheckboxFlag &&
//         <TableCell
//           padding="none"
//           sx={{
//             position: "sticky",
//             left: 0, // Freeze horizontally
//             zIndex: 5,
//             bgcolor: isDark ? "#0f172a" : "#ffffff", // Must have solid color for overlap
//             borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//             p: 0, m: 0,

//             overflow: "hidden",
//             boxSizing: "border-box",
//             flexShrink: 0,
//           }}
//         >
//           <Box display="flex" alignItems="center" justifyContent="center">
//             <Checkbox
//               checked={isSelected}
//               onClick={(e) => e.stopPropagation()} // 🔥 VERY IMPORTANT
//               onChange={() => handleRowSelectMemo(row.SR_NO)}
//               size="small"
//               sx={{
//                 p: 0.5,
//                 color: alpha(theme.palette.text.primary, 0.3),
//                 '&.Mui-checked': { color: theme.palette.primary.main },
//               }}
//             />
//           </Box>
//         </TableCell>
//       }
//       {columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//         .map((col) => {
//           const w = columnWidths[col.key] ?? col.defaultWidth;
//           const colConfig = editableMap[col.key];
//           const isEditable = !!colConfig && isSelected;
//           const isDateColumn = col.key.toLowerCase().includes("date");
//           const isDropdownColumn = TableDropDowns?.[col.key];
//           return (
//             <TableCell
//               key={col.key}
//               sx={{
//                 width: w,
//                 minWidth: w,
//                 maxWidth: w,
//                 borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 ...(rowStyle || {}),
//                 fontSize: 12,
//                 py: 1,
//                 px: 1.5, padding: "0px 8px",
//                 ...(columnStyles[col.key] || {})
//               }}
//             >
//               {isEditable ? (
//                 isDropdownColumn ? (
//                   <MemoSelect
//                     options={TableDropDowns[col.key] || []}
//                     value={
//                       TableDropDowns[col.key].find(
//                         (opt) =>
//                           opt.value ===
//                           (editBuffer[`${row.SR_NO}_${col.key}`] ?? row[col.key])
//                       ) || null
//                     }
//                     onChange={(selected) =>
//                       handleSelectChange(row.SR_NO, col.key, selected)
//                     }
//                     onBlur={() => commitChange(row.SR_NO, col.key)}
//                     isSearchable
//                     menuPortalTarget={document.body} // 🔥 fix overflow
//                     // 🔥 THEME STYLES
//                     styles={{
//                       control: (base, state) => ({
//                         ...base,
//                         minHeight: 28,
//                         height: 28,
//                         fontSize: 12,
//                         borderRadius: 6,
//                         padding: "0px 4px",

//                         background: isDark
//                           ? "rgba(255,255,255,0.03)"
//                           : "rgba(0,0,0,0.03)",

//                         border: `1px solid ${state.isFocused
//                           ? theme.palette.primary.main
//                           : isDark
//                             ? "rgba(255,255,255,0.08)"
//                             : "rgba(0,0,0,0.08)"
//                           }`,

//                         boxShadow: state.isFocused
//                           ? `0 0 0 1px ${theme.palette.primary.main}`
//                           : "none",

//                         "&:hover": {
//                           borderColor: theme.palette.primary.main,
//                           background: isDark
//                             ? "rgba(255,255,255,0.06)"
//                             : "rgba(0,0,0,0.05)",
//                         },
//                       }),

//                       valueContainer: (base) => ({
//                         ...base,
//                         padding: "0 6px",
//                       }),

//                       singleValue: (base) => ({
//                         ...base,
//                         fontSize: 12,
//                         color: theme.palette.text.primary,
//                       }),

//                       input: (base) => ({
//                         ...base,
//                         color: theme.palette.text.primary,
//                         fontSize: 12,
//                       }),

//                       placeholder: (base) => ({
//                         ...base,
//                         fontSize: 11,
//                         color: isDark
//                           ? "rgba(255,255,255,0.4)"
//                           : "rgba(0,0,0,0.4)",
//                       }),

//                       indicatorsContainer: (base) => ({
//                         ...base,
//                         height: 28,
//                       }),

//                       dropdownIndicator: (base) => ({
//                         ...base,
//                         padding: 4,
//                         color: theme.palette.text.primary,
//                       }),

//                       menuPortal: (base) => ({
//                         ...base,
//                         zIndex: 9999,
//                       }),

//                       menu: (base) => ({
//                         ...base,
//                         borderRadius: 8,
//                         overflow: "hidden",
//                         background: isDark
//                           ? "rgba(15,23,42,0.95)"
//                           : "#ffffff",
//                         backdropFilter: "blur(10px)",
//                         border: `1px solid ${theme.palette.divider}`,
//                         fontSize: 12,
//                       }),

//                       option: (base, state) => ({
//                         ...base,
//                         fontSize: 12,
//                         cursor: "pointer",

//                         background: state.isSelected
//                           ? theme.palette.primary.main
//                           : state.isFocused
//                             ? isDark
//                               ? "rgba(255,255,255,0.08)"
//                               : "rgba(0,0,0,0.05)"
//                             : "transparent",

//                         color: state.isSelected
//                           ? "#fff"
//                           : theme.palette.text.primary,
//                       }),
//                       menuList: (base) => ({
//                         ...base,
//                         maxHeight: 180,
//                         overflowY: "auto",

//                         // 🔥 Smooth scroll
//                         scrollBehavior: "smooth",

//                         // 🔥 Firefox
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#888 transparent",

//                         // 🔥 Chrome / Edge / Safari
//                         "&::-webkit-scrollbar": {
//                           width: 6,
//                         },
//                         "&::-webkit-scrollbar-track": {
//                           background: "transparent",
//                         },
//                         "&::-webkit-scrollbar-thumb": {
//                           backgroundColor: "rgba(255,255,255,0.3)",
//                           borderRadius: 10,
//                         },
//                         "&::-webkit-scrollbar-thumb:hover": {
//                           backgroundColor: "rgba(255,255,255,0.6)",
//                         },
//                       }),
//                     }}
//                   />
//                 ) : (
//                   <TextField
//                     // type={isDateColumn ? "date" : "text"} // 🔥 KEY CHANGE
//                     type={getInputType(colConfig)}
//                     value={
//                       editBuffer[`${row.SR_NO}_${col.key}`] ??
//                       (isDateColumn
//                         ? formatToISO(row[col.key])
//                         : row[col.key] ?? "")
//                     }
//                     onChange={(e) =>
//                       handleInputChange(
//                         row.SR_NO,
//                         col.key,
//                         isDateColumn
//                           ? formatToISO(e.target.value) // store ISO
//                           : e.target.value
//                       )
//                     }
//                     onBlur={() => commitChange(row.SR_NO, col.key)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         commitChange(row.SR_NO, col.key);
//                       }
//                     }}
//                     fullWidth
//                     autoComplete="off"
//                     variant="standard"
//                     InputProps={{
//                       disableUnderline: true,
//                     }}
//                     inputProps={{
//                       min:
//                         colConfig?.type === "date"
//                           ? toDateInputFormat(colConfig?.minValue)
//                           : colConfig?.minValue ?? undefined,

//                       max:
//                         colConfig?.type === "date"
//                           ? toDateInputFormat(colConfig?.maxValue)
//                           : colConfig?.maxValue ?? undefined,
//                       step: colConfig?.type === "float" ? "0.1" : undefined,
//                       maxLength: colConfig?.type === "string"
//                         ? (colConfig.maxValue || 200)
//                         : undefined,
//                     }}
//                     error={!!errors[`${row.SR_NO}_${col.key}`]}
//                     helperText={
//                       errors[`${row.SR_NO}_${col.key}`]
//                         ? "Invalid value"
//                         : ""
//                     }
//                     sx={{
//                       // 🔥 ROOT
//                       "& .MuiInputBase-root": {
//                         fontSize: 12,
//                         px: 1,
//                         py: 0.3,
//                         borderRadius: 1,
//                         transition: "all 0.2s ease",

//                         // 🎨 THEME BACKGROUND
//                         background: isDark
//                           ? "rgba(255,255,255,0.03)"
//                           : "rgba(0,0,0,0.03)",

//                         border: `1px solid ${errors[`${row.SR_NO}_${col.key}`]
//                           ? "#ef4444" // red
//                           : isDark
//                             ? "rgba(255,255,255,0.08)"
//                             : "rgba(0,0,0,0.08)"
//                           }`,

//                         // ✨ HOVER
//                         "&:hover": {
//                           background: isDark
//                             ? "rgba(255,255,255,0.06)"
//                             : "rgba(0,0,0,0.05)",
//                           borderColor: alpha(theme.palette.primary.main, 0.4),
//                         },

//                         // 🔥 FOCUS
//                         "&.Mui-focused": {
//                           background: `1px solid ${errors[`${row.SR_NO}_${col.key}`]
//                             ? "#ef4444" // red
//                             : isDark
//                               ? "rgba(99,102,241,0.12)"
//                               : "rgba(99,102,241,0.08)"
//                             }`,

//                           border: `1px solid ${theme.palette.primary.main}`,

//                           boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
//                         },
//                         "&::-webkit-calendar-picker-indicator": {
//                           position: 'absolute',
//                           left: 0,
//                           top: 0,
//                           width: '100%',
//                           height: '100%',
//                           opacity: 0, // Make the whole box clickable for the picker
//                           cursor: 'pointer',
//                         },
//                       },

//                       // 🔤 INPUT TEXT
//                       "& .MuiInputBase-input": {
//                         p: 0,
//                         fontSize: 12,
//                         fontWeight: 500,
//                         color: theme.palette.text.primary,

//                         // Placeholder styling
//                         "&::placeholder": {
//                           color: alpha(theme.palette.text.primary, 0.4),
//                           opacity: 1,
//                         },
//                       },
//                       // 📅 DATE ICON FIX (for date inputs)
//                       "& input[type='date']::-webkit-calendar-picker-indicator": {
//                         filter: isDark ? "invert(1)" : "none",
//                         cursor: "pointer",
//                       },

//                       // ❌ DISABLED STATE (optional)
//                       "& .Mui-disabled": {
//                         opacity: 0.5,
//                         cursor: "not-allowed",
//                       },
//                       // ❌ FIX WHITE SPINNER BACKGROUND (Chrome, Edge, Safari)
//                       "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
//                         // Use invert to turn the black arrows white for dark mode
//                         filter: isDark ? "invert(0.91) brightness(2)" : "none",

//                         // Force the background to be transparent so the theme shows through
//                         backgroundColor: "transparent",

//                         // Adjust opacity so they aren't too distracting until hover
//                         opacity: 0.5,
//                         cursor: "pointer",

//                         // Ensure they don't add extra height to your small rows
//                         height: "14px",
//                       },

//                       // Optional: Make arrows fully visible on hover
//                       "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": {
//                         opacity: 1,
//                       },

//                       // Firefox fix (Firefox handles this differently)
//                       "& input[type=number]": {
//                         MozAppearance: "textfield", // Use this if you want to hide them entirely in Firefox
//                       },
//                     }}
//                   />
//                 )) : (
//                 isDateColumn
//                   ? formatDisplayDate(row[col.key])
//                   : typeof row[col.key] === "boolean"
//                     ? row[col.key] ? "Yes" : "No"
//                     : row[col.key] ?? "—"
//               )}
//             </TableCell>
//           );
//         })}
//     </TableRow>
//   )
// })

//====================================================================================
// "use client";

// import React, { useState, useCallback, useMemo, memo } from "react";
// import {
//   TableBody as MuiTableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   alpha,
//   TextField,
//   Box,
// } from "@mui/material";
// import Select from "react-select";
// import { validateValue, getInputType, toDateInputFormat } from "./EditColumnValidateValue";
// import { buildHighlightRules, getRowHighlight, getClickHighlightStyle } from "../../utils/highlight/highLightTheme";
// import { Row } from "./CustomRowRenderTableBody";

// export default function TableBodyRows({
//   rows,
//   columns,
//   columnWidths,
//   selected,
//   setSelected,
//   allPageSelected,
//   setAllPageSelected,
//   tableData,
//   setTableData,
//   EditableColumns,
//   TableDropDowns,
//   headerHideColumns,
//   TableRowHighlight,
//   EnableCheckboxFlag,
//   checkboxWidth = 32,
//   theme,
//   isDark,
// }) {
//   const [clickedRowId, setClickedRowId] = useState(null);

//   const handleRowSelectMemo = useCallback((id) => {
//     setAllPageSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   }, []);

//   const selectedSet = useMemo(() => new Set(allPageSelected), [allPageSelected]);

//   const [editBuffer, setEditBuffer] = useState({});
//   const [errors,     setErrors]     = useState({});

//   const editableMap = useMemo(() => {
//     const map = {};
//     EditableColumns.forEach((col) => { map[col.columnName] = col; });
//     return map;
//   }, [EditableColumns]);

//   const handleSelectChange = (srNo, key, selectedOption) => {
//     const value = selectedOption?.value || "";
//     setEditBuffer((prev) => ({ ...prev, [`${srNo}_${key}`]: value }));
//   };

//   const handleInputChange = (srNo, key, value) => {
//     const config    = editableMap[key];
//     const bufferKey = `${srNo}_${key}`;
//     setEditBuffer((prev) => ({ ...prev, [bufferKey]: value }));
//     setErrors((prev) => ({ ...prev, [bufferKey]: !validateValue(config, value) }));
//   };

//   const commitChange = (srNo, key) => {
//     const bufferKey = `${srNo}_${key}`;
//     const newValue  = editBuffer[bufferKey];
//     const config    = editableMap[key];
//     if (newValue === undefined) return;
//     if (!validateValue(config, newValue)) return;

//     setTableData((prev) =>
//       prev.map((row) => row.SR_NO === srNo ? { ...row, [key]: newValue } : row)
//     );
//     setEditBuffer((prev) => { const u = { ...prev }; delete u[bufferKey]; return u; });
//     setErrors((prev)     => { const u = { ...prev }; delete u[bufferKey]; return u; });
//   };

//   const formatDisplayDate = (dateStr) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     if (isNaN(d)) return dateStr;
//     return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
//   };

//   const formatToISO = (value) => {
//     if (!value) return "";
//     return String(value).slice(0, 10);
//   };

//   const highlightRules = useMemo(
//     () => (TableRowHighlight ? buildHighlightRules(TableRowHighlight, theme, isDark) : []),
//     [TableRowHighlight, theme, isDark]
//   );

//   const rowHighlightCache = useMemo(() => {
//     const cache = {};
//     rows.forEach((row) => { cache[row.SR_NO] = getRowHighlight(row, highlightRules); });
//     return cache;
//   }, [rows, highlightRules]);

//   const visibleColumns = useMemo(
//     () => columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key)),
//     [columns, headerHideColumns]
//   );

//   return (
//     <MuiTableBody>
//       {rows.length === 0 ? (
//         <TableRow>
//           <TableCell
//             colSpan={visibleColumns.length + (EnableCheckboxFlag ? 1 : 0)}
//             align="center"
//             sx={{ py: 8, color: alpha(theme.palette.text.primary, 0.35), fontSize: 14 }}
//           >
//             No records found.
//           </TableCell>
//         </TableRow>
//       ) : (
//         rows.map((row, index) => (
//           <Row
//             key={row.SR_NO ? `row-${row.SR_NO}` : `row-idx-${index}`}
//             row={row}
//             columns={visibleColumns}
//             columnWidths={columnWidths}
//             isSelected={selectedSet.has(row.SR_NO)}
//             isClicked={clickedRowId === row.SR_NO}
//             handleRowSelect={handleRowSelectMemo}
//             headerHideColumns={headerHideColumns}
//             editableMap={editableMap}
//             TableDropDowns={TableDropDowns}
//             editBuffer={editBuffer}
//             handleSelectChange={handleSelectChange}
//             handleInputChange={handleInputChange}
//             commitChange={commitChange}
//             errors={errors}
//             rowHighlightCache={rowHighlightCache}
//             clickedRowId={clickedRowId}
//             setClickedRowId={setClickedRowId}
//             EnableCheckboxFlag={EnableCheckboxFlag}
//             checkboxWidth={checkboxWidth}
//             getClickHighlightStyle={getClickHighlightStyle}
//             toDateInputFormat={toDateInputFormat}
//             formatDisplayDate={formatDisplayDate}
//             formatToISO={formatToISO}
//             theme={theme}
//             isDark={isDark}
//           />
//         ))
//       )}
//     </MuiTableBody>
//   );
// }

//==============================================================
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TableBodyNoPage.jsx
//
// Renders all filtered + sorted rows using the memoised <Row> component.
// Owns edit state (editBuffer, errors) and passes handlers down to <Row>.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useMemo } from "react";
import {
  TableBody as MuiTableBody,
  TableRow,
  TableCell,
  alpha,
} from "@mui/material";
import { validateValue, toDateInputFormat } from "./EditColumnValidateValue";
import {
  buildHighlightRules,
  getRowHighlight,
  getClickHighlightStyle,
} from "../../utils/highlight/highLightTheme";
import { Row } from "./CustomRowRenderTableBody";

export default function TableBodyRows({
  rows,
  columns,
  visibleColumns,    // pre-filtered from parent — no SR_NO, no hidden cols
  columnWidths,
  selected,
  setSelected,
  allPageSelected,
  setAllPageSelected,
  tableData,
  setTableData,
  EditableColumns,
  TableDropDowns,
  headerHideColumns,
  TableRowHighlight,
  EnableCheckboxFlag,
  cbW = 36,          // checkbox column width — matches colgroup col[0]
  theme,
  isDark,
}) {
  const [clickedRowId, setClickedRowId] = useState(null);
  const [editBuffer,   setEditBuffer]   = useState({});
  const [errors,       setErrors]       = useState({});

  // ── row selection ─────────────────────────────────────────────────────────
  const handleRowSelect = useCallback((id) => {
    setAllPageSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectedSet = useMemo(() => new Set(allPageSelected), [allPageSelected]);

  // ── editable column map ───────────────────────────────────────────────────
  const editableMap = useMemo(() => {
    const map = {};
    EditableColumns.forEach((col) => { map[col.columnName] = col; });
    return map;
  }, [EditableColumns]);

  // ── edit handlers ─────────────────────────────────────────────────────────
  const handleSelectChange = useCallback((srNo, key, selectedOption) => {
    const value = selectedOption?.value ?? "";
    setEditBuffer((prev) => ({ ...prev, [`${srNo}_${key}`]: value }));
  }, []);

  const handleInputChange = useCallback((srNo, key, value) => {
    const config    = editableMap[key];
    const bufferKey = `${srNo}_${key}`;
    setEditBuffer((prev) => ({ ...prev, [bufferKey]: value }));
    setErrors((prev)     => ({ ...prev, [bufferKey]: !validateValue(config, value) }));
  }, [editableMap]);

  const commitChange = useCallback((srNo, key) => {
    const bufferKey = `${srNo}_${key}`;
    const newValue  = editBuffer[bufferKey];
    const config    = editableMap[key];
    if (newValue === undefined)              return;
    if (!validateValue(config, newValue))   return;

    setTableData((prev) =>
      prev.map((row) => row.SR_NO === srNo ? { ...row, [key]: newValue } : row)
    );
    setEditBuffer((prev) => { const u = { ...prev }; delete u[bufferKey]; return u; });
    setErrors((prev)     => { const u = { ...prev }; delete u[bufferKey]; return u; });
  }, [editBuffer, editableMap, setTableData]);

  // ── display helpers ───────────────────────────────────────────────────────
  const formatDisplayDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }, []);

  const formatToISO = useCallback((value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  }, []);

  // ── highlight rules (computed once per row-set change) ────────────────────
  const highlightRules = useMemo(
    () => (TableRowHighlight?.length ? buildHighlightRules(TableRowHighlight, theme, isDark) : []),
    [TableRowHighlight, theme, isDark]
  );

  const rowHighlightCache = useMemo(() => {
    const cache = {};
    rows.forEach((row) => {
      cache[row.SR_NO] = getRowHighlight(row, highlightRules);
    });
    return cache;
  }, [rows, highlightRules]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <MuiTableBody>
      {rows.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={visibleColumns.length + (EnableCheckboxFlag ? 1 : 0)}
            align="center"
            sx={{ py: 8, color: alpha(theme.palette.text.primary, 0.35), fontSize: 14 }}
          >
            No records found.
          </TableCell>
        </TableRow>
      ) : (
        rows.map((row, index) => (
          <Row
            key={row.SR_NO ? `row-${row.SR_NO}` : `row-idx-${index}`}
            row={row}
            columns={visibleColumns}
            columnWidths={columnWidths}
            isSelected={selectedSet.has(row.SR_NO)}
            isClicked={clickedRowId === row.SR_NO}
            handleRowSelect={handleRowSelect}
            editableMap={editableMap}
            TableDropDowns={TableDropDowns}
            editBuffer={editBuffer}
            handleSelectChange={handleSelectChange}
            handleInputChange={handleInputChange}
            commitChange={commitChange}
            errors={errors}
            rowHighlightCache={rowHighlightCache}
            clickedRowId={clickedRowId}
            setClickedRowId={setClickedRowId}
            EnableCheckboxFlag={EnableCheckboxFlag}
            cbW={cbW}
            getClickHighlightStyle={getClickHighlightStyle}
            toDateInputFormat={toDateInputFormat}
            formatDisplayDate={formatDisplayDate}
            formatToISO={formatToISO}
            theme={theme}
            isDark={isDark}
          />
        ))
      )}
    </MuiTableBody>
  );
}