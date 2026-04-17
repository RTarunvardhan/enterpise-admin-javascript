// "use client";

// import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";

// import {
//     TableBody as MuiTableBody,
//     TableRow,
//     TableCell,
//     Checkbox,
//     alpha,
//     TextField,
//     Box,
// } from "@mui/material";

// import Select from "react-select";

// const MemoSelect = React.memo(Select);

// export const Row = React.memo(
//     ({
//         row,
//         columns,
//         columnWidths,
//         isSelected,
//         isClicked,
//         handleRowSelect,
//         headerHideColumns,
//         editableMap,
//         TableDropDowns,
//         editBuffer,
//         handleSelectChange,
//         handleInputChange,
//         commitChange,
//         errors,
//         rowHighlightCache,
//         clickedRowId,
//         setClickedRowId,
//         EnableCheckboxFlag,
//         getClickHighlightStyle,
//         toDateInputFormat,
//         formatDisplayDate,
//         theme,
//         isDark,
//     }) => {
//         const { rowStyle = {}, columnStyles = {} } = rowHighlightCache[row.SR_NO] || {};

//         return (
//             <TableRow
//                 hover //key={uniquekey}
//                 onClick={() => setClickedRowId(row.SR_NO)}
//                 sx={{
//                     ...(isClicked ? getClickHighlightStyle(theme, isDark) : rowStyle),
//                     fontSize: 12, p: 0, "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08), },
//                 }}
//             >
//                 {/* ✅ CHECKBOX */}
//                 {/* {EnableCheckboxFlag && (
//                     <TableCell padding="none" sx={{
//                         position: "sticky", left: 0, zIndex: 5, bgcolor: isDark ? "#0f172a" : "#ffffff",
//                         borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//                         p: 0, m: 0, overflow: "hidden", boxSizing: "border-box", //flexShrink: 0,
//                         backgroundColor: isDark ? "#0f172a" : "#ffffff",
//                         width: 40,
//                         minWidth: 40,
//                         maxWidth: 40,
//                         p: 0,
//                     }}>
//                         <Box display="flex" alignItems="center" justifyContent="center">
//                             <Checkbox
//                                 checked={isSelected}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={() => handleRowSelect(row.SR_NO)}
//                                 size="small"
//                                 sx={{ p: 0.5, color: alpha(theme.palette.text.primary, 0.3), '&.Mui-checked': { color: theme.palette.primary.main }, }}
//                             />
//                         </Box>
//                     </TableCell>
//                 )} */}

//                 {EnableCheckboxFlag && (
//                     <TableCell
//                         padding="none"
//                         sx={{
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 5,
//                             // ✅ Match header exactly — same 30px
//                             width: 30,
//       minWidth: 30,
//       maxWidth: 30,
//                             p: 0,
//                             m: 0,
//                             overflow: "hidden",
//                             boxSizing: "border-box",
//                             bgcolor: isDark ? "#0f172a" : "#ffffff",
//                             borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//                         }}
//                     >
//                         {/* ✅ Fixed 30×30 container — matches header cell exactly */}
//                         <Box
//                             sx={{
//                                 width: 30,
//                                 height: 30,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 // flexShrink: 0,
//                             }}
//                         >
//                             <Checkbox
//                                 checked={isSelected}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={() => handleRowSelect(row.SR_NO)}
//                                 sx={{
//                                     p: 0,
//                                     m: 0,
//                                     color: alpha(theme.palette.text.primary, 0.3),
//                                     "&.Mui-checked": { color: theme.palette.primary.main },
//                                     // ✅ Same 16px lock as header
//                                     "& .MuiSvgIcon-root": {
//                                         fontSize: "16px !important",
//                                         width: "16px !important",
//                                         height: "16px !important",
//                                         flexShrink: 0,
//                                     },
//                                 }}
//                             />
//                         </Box>
//                     </TableCell>
//                 )}

//                 {/* ✅ COLUMNS */}
//                 {columns //.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//                     .map((col, index) => {
//                         const w = columnWidths[col.key] ?? col.defaultWidth;
//                         const colConfig = editableMap[col.key];
//                         const isEditable = !!colConfig && isSelected;
//                         const isDropdownColumn = TableDropDowns?.[col.key];
//                         const isDateColumn = col.key.toLowerCase().includes("date");
//                         const bufferKey = `${row.SR_NO}_${col.key}`;
//                         return (
//                             <TableCell key={`${row.SR_NO}_${col.key}_${index}`} // key={col.key}
//                                 sx={{
//                                     width: w, minWidth: w, maxWidth: w, 
//                                     p: 0, border: "none",
//                                     // width: columnWidths[col.key] ?? col.defaultWidth,
//                                     // minWidth: columnWidths[col.key] ?? col.defaultWidth,
//                                     // maxWidth: columnWidths[col.key] ?? col.defaultWidth,
//                                     borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                                     fontSize: 12, py: 1, px: 1.5, padding: "0px 8px", ...(rowStyle || {}), ...(columnStyles[col.key] || {})
//                                 }}
//                             >
//                                 {isEditable ? (
//                                     isDropdownColumn ? (
//                                         <MemoSelect
//                                             options={TableDropDowns[col.key] || []}
//                                             value={TableDropDowns[col.key].find((opt) => opt.value === (editBuffer[bufferKey] ?? row[col.key])) || null}
//                                             onChange={(selected) => handleSelectChange(row.SR_NO, col.key, selected)}
//                                             onBlur={() => commitChange(row.SR_NO, col.key)}
//                                             isSearchable
//                                             menuPortalTarget={document.body}
//                                             sx={selectStyle(theme, isDark)}
//                                         />
//                                     ) : (
//                                         <TextField
//                                             type={getInputType(colConfig)}
//                                             value={editBuffer[bufferKey] ?? row[col.key] ?? (isDateColumn ? formatToISO(row[col.key]) : row[col.key] ?? "")}
//                                             onChange={(e) => handleInputChange(row.SR_NO, col.key, isDateColumn ? formatToISO(e.target.value) : e.target.value)}
//                                             onBlur={() => commitChange(row.SR_NO, col.key)}
//                                             size="small"
//                                             fullWidth
//                                             variant="standard"
//                                             error={!!errors[bufferKey]}
//                                             onKeyDown={(e) => { if (e.key === "Enter") { commitChange(row.SR_NO, col.key); } }}
//                                             inputProps={{
//                                                 min: colConfig?.type === "date" ? toDateInputFormat(colConfig?.minValue) : colConfig?.minValue ?? undefined,
//                                                 max: colConfig?.type === "date" ? toDateInputFormat(colConfig?.maxValue) : colConfig?.maxValue ?? undefined,
//                                                 step: colConfig?.type === "float" ? "0.1" : undefined,
//                                                 maxLength: colConfig?.type === "string" ? (colConfig.maxValue || 200) : undefined,
//                                             }}
//                                             helperText={errors[bufferKey] ? "Invalid value" : ""}
//                                             sx={TextfieldStyle(theme, isDark, !!errors[bufferKey])}
//                                         />
//                                     )
//                                 ) : (
//                                     // <span>{
//                                     isDateColumn ? formatDisplayDate(row[col.key]) : typeof row[col.key] === "boolean" ? row[col.key] ? "Yes" : "No" : row[col.key] ?? "—"
//                                     // }</span>
//                                 )}
//                             </TableCell>
//                         );
//                     })}
//             </TableRow>
//         );
//     },

//     // 🔥 IMPORTANT: Prevent unnecessary re-render
//     (prev, next) => {
//         return (
//             prev.row === next.row &&
//             prev.isSelected === next.isSelected &&
//             prev.isClicked === next.isClicked &&
//             prev.editBuffer === next.editBuffer &&
//             prev.isDark === next.isDark &&
//             prev.headerHideColumns === next.headerHideColumns &&
//             prev.headerHideColumns?.join(',') === next.headerHideColumns?.join(',') &&
//             prev.columns.length === next.columns.length
//         );
//     }
// );

// const selectStyle = (theme, isDark) => ({
//     control: (base, state) => ({
//         ...base,
//         minHeight: 28,
//         height: 28,
//         fontSize: 12,
//         borderRadius: 6,
//         padding: "0px 4px",

//         background: isDark
//             ? "rgba(255,255,255,0.03)"
//             : "rgba(0,0,0,0.03)",

//         border: `1px solid ${state.isFocused
//             ? theme.palette.primary.main
//             : isDark
//                 ? "rgba(255,255,255,0.08)"
//                 : "rgba(0,0,0,0.08)"
//             }`,

//         boxShadow: state.isFocused
//             ? `0 0 0 1px ${theme.palette.primary.main}`
//             : "none",

//         "&:hover": {
//             borderColor: theme.palette.primary.main,
//             background: isDark
//                 ? "rgba(255,255,255,0.06)"
//                 : "rgba(0,0,0,0.05)",
//         },
//     }),

//     valueContainer: (base) => ({
//         ...base,
//         padding: "0 6px",
//     }),

//     singleValue: (base) => ({
//         ...base,
//         fontSize: 12,
//         color: theme.palette.text.primary,
//     }),

//     input: (base) => ({
//         ...base,
//         color: theme.palette.text.primary,
//         fontSize: 12,
//     }),

//     placeholder: (base) => ({
//         ...base,
//         fontSize: 11,
//         color: isDark
//             ? "rgba(255,255,255,0.4)"
//             : "rgba(0,0,0,0.4)",
//     }),

//     indicatorsContainer: (base) => ({
//         ...base,
//         height: 28,
//     }),

//     dropdownIndicator: (base) => ({
//         ...base,
//         padding: 4,
//         color: theme.palette.text.primary,
//     }),

//     menuPortal: (base) => ({
//         ...base,
//         zIndex: 9999,
//     }),

//     menu: (base) => ({
//         ...base,
//         borderRadius: 8,
//         overflow: "hidden",
//         background: isDark
//             ? "rgba(15,23,42,0.95)"
//             : "#ffffff",
//         backdropFilter: "blur(10px)",
//         border: `1px solid ${theme.palette.divider}`,
//         fontSize: 12,
//     }),

//     option: (base, state) => ({
//         ...base,
//         fontSize: 12,
//         cursor: "pointer",

//         background: state.isSelected
//             ? theme.palette.primary.main
//             : state.isFocused
//                 ? isDark
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.05)"
//                 : "transparent",

//         color: state.isSelected
//             ? "#fff"
//             : theme.palette.text.primary,
//     }),
//     menuList: (base) => ({
//         ...base,
//         maxHeight: 180,
//         overflowY: "auto",

//         // 🔥 Smooth scroll
//         scrollBehavior: "smooth",

//         // 🔥 Firefox
//         scrollbarWidth: "thin",
//         scrollbarColor: "#888 transparent",

//         // 🔥 Chrome / Edge / Safari
//         "&::-webkit-scrollbar": {
//             width: 6,
//         },
//         "&::-webkit-scrollbar-track": {
//             background: "transparent",
//         },
//         "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "rgba(255,255,255,0.3)",
//             borderRadius: 10,
//         },
//         "&::-webkit-scrollbar-thumb:hover": {
//             backgroundColor: "rgba(255,255,255,0.6)",
//         },
//     }),
// })

// const TextfieldStyle = (theme, isDark, hasError) => ({
//     // 🔥 ROOT
//     "& .MuiInputBase-root": {
//         fontSize: 12,
//         px: 1,
//         py: 0.3,
//         borderRadius: 1,
//         transition: "all 0.2s ease",

//         // 🎨 THEME BACKGROUND
//         background: isDark
//             ? "rgba(255,255,255,0.03)"
//             : "rgba(0,0,0,0.03)",

//         border: `1px solid ${hasError
//             ? "#ef4444" // red
//             : isDark
//                 ? "rgba(255,255,255,0.08)"
//                 : "rgba(0,0,0,0.08)"
//             }`,

//         // ✨ HOVER
//         "&:hover": {
//             background: isDark
//                 ? "rgba(255,255,255,0.06)"
//                 : "rgba(0,0,0,0.05)",
//             borderColor: alpha(theme.palette.primary.main, 0.4),
//         },

//         // 🔥 FOCUS
//         "&.Mui-focused": {
//             background: `1px solid ${hasError
//                 ? "#ef4444" // red
//                 : isDark
//                     ? "rgba(99,102,241,0.12)"
//                     : "rgba(99,102,241,0.08)"
//                 }`,

//             border: `1px solid ${theme.palette.primary.main}`,

//             boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
//         },
//         "&::-webkit-calendar-picker-indicator": {
//             position: 'absolute',
//             left: 0,
//             top: 0,
//             width: '100%',
//             height: '100%',
//             opacity: 0, // Make the whole box clickable for the picker
//             cursor: 'pointer',
//         },
//     },

//     // 🔤 INPUT TEXT
//     "& .MuiInputBase-input": {
//         p: 0,
//         fontSize: 12,
//         fontWeight: 500,
//         color: theme.palette.text.primary,

//         // Placeholder styling
//         "&::placeholder": {
//             color: alpha(theme.palette.text.primary, 0.4),
//             opacity: 1,
//         },
//     },
//     // 📅 DATE ICON FIX (for date inputs)
//     "& input[type='date']::-webkit-calendar-picker-indicator": {
//         filter: isDark ? "invert(1)" : "none",
//         cursor: "pointer",
//     },

//     // ❌ DISABLED STATE (optional)
//     "& .Mui-disabled": {
//         opacity: 0.5,
//         cursor: "not-allowed",
//     },
//     // ❌ FIX WHITE SPINNER BACKGROUND (Chrome, Edge, Safari)
//     "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
//         // Use invert to turn the black arrows white for dark mode
//         filter: isDark ? "invert(0.91) brightness(2)" : "none",

//         // Force the background to be transparent so the theme shows through
//         backgroundColor: "transparent",

//         // Adjust opacity so they aren't too distracting until hover
//         opacity: 0.5,
//         cursor: "pointer",

//         // Ensure they don't add extra height to your small rows
//         height: "14px",
//     },

//     // Optional: Make arrows fully visible on hover
//     "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": {
//         opacity: 1,
//     },

//     // Firefox fix (Firefox handles this differently)
//     "& input[type=number]": {
//         MozAppearance: "textfield", // Use this if you want to hide them entirely in Firefox
//     },
// })


// "use client";

// import React, { memo } from "react";
// import {
//     TableRow,
//     TableCell,
//     Checkbox,
//     alpha,
//     TextField,
//     Box,
// } from "@mui/material";
// import Select from "react-select";

// const MemoSelect = React.memo(Select);

// // ─────────────────────────────────────────────────────────────────
// // Helpers (kept file-local so Row has no external deps beyond MUI)
// // ─────────────────────────────────────────────────────────────────

// /** Normalise any date value to YYYY-MM-DD for <input type="date"> */
// const formatToISO = (value) => {
//     if (!value) return "";
//     return String(value).slice(0, 10);
// };

// // ═══════════════════════════════════════════════════════════════
// // Row
// // A single memoised table row.  Re-renders only when its own
// // slice of state changes (see the comparator at the bottom).
// // ═══════════════════════════════════════════════════════════════
// export const Row = memo(
//     ({
//         row,
//         columns,
//         columnWidths,
//         isSelected,
//         isClicked,
//         handleRowSelect,
//         headerHideColumns,
//         editableMap,
//         TableDropDowns,
//         editBuffer,
//         handleSelectChange,
//         handleInputChange,
//         commitChange,
//         errors,
//         rowHighlightCache,
//         clickedRowId,
//         setClickedRowId,
//         EnableCheckboxFlag,
//         checkboxWidth = 32,   // ← must match CHECKBOX_W in CustomTableNoPage
//         getClickHighlightStyle,
//         toDateInputFormat,
//         formatDisplayDate,
//         theme,
//         isDark,
//     }) => {
//         const { rowStyle = {}, columnStyles = {} } =
//             rowHighlightCache[row.SR_NO] || {};

//         return (
//             <TableRow
//                 hover
//                 onClick={() => setClickedRowId(row.SR_NO)}
//                 sx={{
//                     ...(isClicked ? getClickHighlightStyle(theme, isDark) : rowStyle),
//                     fontSize: 12,
//                     p: 0,
//                     "&:hover": {
//                         backgroundColor: alpha(theme.palette.primary.main, 0.08),
//                     },
//                 }}
//             >
//                 {/* ── Checkbox body cell ──────────────────────────────── */}
//                 {EnableCheckboxFlag && (
//                     <TableCell
//                         padding="none"
//                         sx={{
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 5,
//                             width: checkboxWidth,
//                             minWidth: checkboxWidth,
//                             maxWidth: checkboxWidth,
//                             p: 0,
//                             m: 0,
//                             overflow: "hidden",
//                             boxSizing: "border-box",
//                             bgcolor: isDark ? "#0f172a" : "#ffffff",
//                             borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 width: checkboxWidth,
//                                 height: "100%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             <Checkbox
//                                 checked={isSelected}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={() => handleRowSelect(row.SR_NO)}
//                                 sx={{
//                                     p: 0,
//                                     m: 0,
//                                     color: alpha(theme.palette.text.primary, 0.3),
//                                     "&.Mui-checked": { color: theme.palette.primary.main },
//                                     "& .MuiSvgIcon-root": {
//                                         fontSize: 16,
//                                         flexShrink: 0,
//                                     },
//                                 }}
//                             />
//                         </Box>
//                     </TableCell>
//                 )}

//                 {/* ── Data cells ─────────────────────────────────────── */}
//                 {columns.map((col, index) => {
//                     const w = columnWidths[col.key] ?? col.defaultWidth;
//                     const colConfig = editableMap[col.key];
//                     const isEditable = !!colConfig && isSelected;
//                     const isDropdown = Boolean(TableDropDowns?.[col.key]);
//                     const isDateCol = col.key.toLowerCase().includes("date");
//                     const bufferKey = `${row.SR_NO}_${col.key}`;
//                     const hasError = Boolean(errors[bufferKey]);
// const isLessColumns = columns.length < 10
//                     return (
//                         <TableCell
//                             key={`${row.SR_NO}_${col.key}_${index}`}
//                             sx={{
//                                 width: isLessColumns ? "auto" : w,
//                                 minWidth: isLessColumns ? "auto" : w,
//                                 maxWidth: w,
//                                 borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 fontSize: 12,
//                                 padding: "0px 8px",
//                                 ...rowStyle,
//                                 ...(columnStyles[col.key] || {}),
//                             }}
//                         >
//                             {isEditable ? (
//                                 isDropdown ? (
//                                     /* ── Dropdown editor ──────────────────────── */
//                                     <MemoSelect
//                                         options={TableDropDowns[col.key] || []}
//                                         value={
//                                             TableDropDowns[col.key].find(
//                                                 (opt) =>
//                                                     opt.value ===
//                                                     (editBuffer[bufferKey] ?? row[col.key])
//                                             ) || null
//                                         }
//                                         onChange={(selected) =>
//                                             handleSelectChange(row.SR_NO, col.key, selected)
//                                         }
//                                         onBlur={() => commitChange(row.SR_NO, col.key)}
//                                         isSearchable
//                                         menuPortalTarget={document.body}
//                                         styles={buildSelectStyles(theme, isDark)}
//                                     />
//                                 ) : (
//                                     /* ── Text / date / number editor ─────────── */
//                                     <TextField
//                                         type={
//                                             isDateCol
//                                                 ? "date"
//                                                 : colConfig?.type === "number" ||
//                                                     colConfig?.type === "float" ||
//                                                     colConfig?.type === "currency" ||
//                                                     colConfig?.type === "percentage"
//                                                     ? "number"
//                                                     : "text"
//                                         }
//                                         value={
//                                             editBuffer[bufferKey] ??
//                                             (isDateCol
//                                                 ? formatToISO(row[col.key])
//                                                 : row[col.key] ?? "")
//                                         }
//                                         onChange={(e) =>
//                                             handleInputChange(
//                                                 row.SR_NO,
//                                                 col.key,
//                                                 isDateCol
//                                                     ? formatToISO(e.target.value)
//                                                     : e.target.value
//                                             )
//                                         }
//                                         onBlur={() => commitChange(row.SR_NO, col.key)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter") commitChange(row.SR_NO, col.key);
//                                         }}
//                                         size="small"
//                                         fullWidth
//                                         variant="standard"
//                                         error={hasError}
//                                         helperText={hasError ? "Invalid value" : ""}
//                                         InputProps={{ disableUnderline: true }}
//                                         inputProps={{
//                                             min:
//                                                 colConfig?.type === "date"
//                                                     ? toDateInputFormat(colConfig?.minValue)
//                                                     : colConfig?.minValue ?? undefined,
//                                             max:
//                                                 colConfig?.type === "date"
//                                                     ? toDateInputFormat(colConfig?.maxValue)
//                                                     : colConfig?.maxValue ?? undefined,
//                                             step:
//                                                 colConfig?.type === "float" ? "0.1" : undefined,
//                                             maxLength:
//                                                 colConfig?.type === "string"
//                                                     ? colConfig.maxValue || 200
//                                                     : undefined,
//                                         }}
//                                         sx={buildTextFieldStyles(theme, isDark, hasError)}
//                                     />
//                                 )
//                             ) : (
//                                 /* ── Read-only display ────────────────────── */
//                                 isDateCol
//                                     ? formatDisplayDate(row[col.key])
//                                     : typeof row[col.key] === "boolean"
//                                         ? row[col.key]
//                                             ? "Yes"
//                                             : "No"
//                                         : row[col.key] ?? "—"
//                             )}
//                         </TableCell>
//                     );
//                 })}
//             </TableRow>
//         );
//     },

//     // ── Memo comparator: skip re-render if nothing relevant changed ──
//     (prev, next) =>
//         prev.row === next.row &&
//         prev.isSelected === next.isSelected &&
//         prev.isClicked === next.isClicked &&
//         prev.editBuffer === next.editBuffer &&
//         prev.errors === next.errors &&
//         prev.isDark === next.isDark &&
//         prev.headerHideColumns?.join(",") ===
//         next.headerHideColumns?.join(",") &&
//         prev.columns.length === next.columns.length
// );

// // ═══════════════════════════════════════════════════════════════
// // Style helpers (extracted so JSX stays readable)
// // ═══════════════════════════════════════════════════════════════

// const buildSelectStyles = (theme, isDark) => ({
//     control: (base, state) => ({
//         ...base,
//         minHeight: 28,
//         height: 28,
//         fontSize: 12,
//         borderRadius: 6,
//         padding: "0px 4px",
//         background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
//         border: `1px solid ${state.isFocused
//                 ? theme.palette.primary.main
//                 : isDark
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.08)"
//             }`,
//         boxShadow: state.isFocused
//             ? `0 0 0 1px ${theme.palette.primary.main}`
//             : "none",
//         "&:hover": {
//             borderColor: theme.palette.primary.main,
//             background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
//         },
//     }),
//     valueContainer: (base) => ({ ...base, padding: "0 6px" }),
//     singleValue: (base) => ({
//         ...base,
//         fontSize: 12,
//         color: theme.palette.text.primary,
//     }),
//     input: (base) => ({ ...base, color: theme.palette.text.primary, fontSize: 12 }),
//     placeholder: (base) => ({
//         ...base,
//         fontSize: 11,
//         color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
//     }),
//     indicatorsContainer: (base) => ({ ...base, height: 28 }),
//     dropdownIndicator: (base) => ({
//         ...base,
//         padding: 4,
//         color: theme.palette.text.primary,
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     menu: (base) => ({
//         ...base,
//         borderRadius: 8,
//         overflow: "hidden",
//         background: isDark ? "rgba(15,23,42,0.95)" : "#ffffff",
//         backdropFilter: "blur(10px)",
//         border: `1px solid ${theme.palette.divider}`,
//         fontSize: 12,
//     }),
//     option: (base, state) => ({
//         ...base,
//         fontSize: 12,
//         cursor: "pointer",
//         background: state.isSelected
//             ? theme.palette.primary.main
//             : state.isFocused
//                 ? isDark
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.05)"
//                 : "transparent",
//         color: state.isSelected ? "#fff" : theme.palette.text.primary,
//     }),
//     menuList: (base) => ({
//         ...base,
//         maxHeight: 180,
//         overflowY: "auto",
//         scrollBehavior: "smooth",
//         scrollbarWidth: "thin",
//         scrollbarColor: "#888 transparent",
//         "&::-webkit-scrollbar": { width: 6 },
//         "&::-webkit-scrollbar-track": { background: "transparent" },
//         "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "rgba(255,255,255,0.3)",
//             borderRadius: 10,
//         },
//         "&::-webkit-scrollbar-thumb:hover": {
//             backgroundColor: "rgba(255,255,255,0.6)",
//         },
//     }),
// });

// const buildTextFieldStyles = (theme, isDark, hasError) => ({
//     "& .MuiInputBase-root": {
//         fontSize: 12,
//         px: 1,
//         py: 0.3,
//         borderRadius: 1,
//         transition: "all 0.2s ease",
//         background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
//         border: `1px solid ${hasError
//                 ? "#ef4444"
//                 : isDark
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.08)"
//             }`,
//         "&:hover": {
//             background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
//             borderColor: alpha(theme.palette.primary.main, 0.4),
//         },
//         "&.Mui-focused": {
//             background: isDark
//                 ? "rgba(99,102,241,0.12)"
//                 : "rgba(99,102,241,0.08)",
//             border: `1px solid ${hasError ? "#ef4444" : theme.palette.primary.main
//                 }`,
//             boxShadow: `0 0 0 1px ${hasError ? "#ef4444" : theme.palette.primary.main
//                 }`,
//         },
//     },
//     "& .MuiInputBase-input": {
//         p: 0,
//         fontSize: 12,
//         fontWeight: 500,
//         color: theme.palette.text.primary,
//         "&::placeholder": {
//             color: alpha(theme.palette.text.primary, 0.4),
//             opacity: 1,
//         },
//     },
//     "& input[type='date']::-webkit-calendar-picker-indicator": {
//         filter: isDark ? "invert(1)" : "none",
//         cursor: "pointer",
//     },
//     "& .Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
//     "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
//         filter: isDark ? "invert(0.91) brightness(2)" : "none",
//         backgroundColor: "transparent",
//         opacity: 0.5,
//         cursor: "pointer",
//         height: "14px",
//     },
//     "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": {
//         opacity: 1,
//     },
//     "& input[type=number]": { MozAppearance: "textfield" },
// });

// ===============================================
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CustomRowRenderTableBody.jsx
//
// Memoised single-row component.  Receives all data + handlers as props —
// no internal state, no hooks beyond what memo needs.
//
// Width contract (same as header):
//   Cell widths are driven by colgroup in the parent <Table>.  The width/
//   minWidth on sx here are visual fallbacks only — they do not override
//   the colgroup declaration.
//
//   The checkbox cell is additionally pinned with position:sticky/left:0
//   so it stays visible during horizontal scroll.
// ─────────────────────────────────────────────────────────────────────────────

import React, { memo } from "react";
import {
    TableRow,
    TableCell,
    Checkbox,
    alpha,
    TextField,
    Box,
} from "@mui/material";
import Select from "react-select";

const MemoSelect = React.memo(Select);

// ─── Row ─────────────────────────────────────────────────────────────────────
export const Row = memo(
    ({
        row,
        columns,          // visible columns only (SR_NO + hidden already removed)
        columnWidths,
        isSelected,
        isClicked,
        handleRowSelect,
        editableMap,
        TableDropDowns,
        editBuffer,
        handleSelectChange,
        handleInputChange,
        commitChange,
        errors,
        rowHighlightCache,
        clickedRowId,
        setClickedRowId,
        EnableCheckboxFlag,
        cbW = 36,         // checkbox column width — matches colgroup col[0]
        getClickHighlightStyle,
        toDateInputFormat,
        formatDisplayDate,
        formatToISO,
        theme,
        isDark,
    }) => {
        const { rowStyle = {}, columnStyles = {} } = rowHighlightCache?.[row.SR_NO] || {};

        return (
            <TableRow
                hover
                onClick={() => setClickedRowId(row.SR_NO)}
                sx={{
                    ...(isClicked ? getClickHighlightStyle(theme, isDark) : rowStyle),
                    fontSize: 12,
                    p: 0,
                    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                }}
            >
                {/* ── Checkbox body cell ─────────────────────────────────────────────
         * Sticky so it stays visible when scrolling horizontally.
         * Width is driven by colgroup — we do NOT set it in sx (that would
         * fight the layout engine). We only set positional/visual props.
         * ────────────────────────────────────────────────────────────────── */}
                {EnableCheckboxFlag && (
                    <TableCell
                        padding="none"
                        sx={{
                            position: "sticky",
                            left: 0,
                            zIndex: 5,
                            bgcolor: isDark ? "#0f172a" : "#ffffff",
                            borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                            p: 0,
                            m: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                // width: cbW,
                                height: "100%",
                                minHeight: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Checkbox
                                checked={isSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleRowSelect(row.SR_NO)}
                                sx={{
                                    p: 0, m: 0,
                                    color: alpha(theme.palette.text.primary, 0.3),
                                    "&.Mui-checked": { color: theme.palette.primary.main },
                                    "& .MuiSvgIcon-root": { fontSize: 16 },
                                }}
                            />
                        </Box>
                    </TableCell>
                )}

                {/* ── Data cells ─────────────────────────────────────────────────── */}
                {columns.map((col, index) => {
                    const w = columnWidths[col.key] ?? col.defaultWidth;
                    const colConfig = editableMap[col.key];
                    const isEditable = !!colConfig && isSelected;
                    const isDropdown = Boolean(TableDropDowns?.[col.key]);
                    const isDateCol = col.key.toLowerCase().includes("date");
                    const bufferKey = `${row.SR_NO}_${col.key}`;
                    const hasError = Boolean(errors[bufferKey]);
                    const isLastRow = index === columns.length - 1
                    const isMinWidth = col.minWidth;
                    return (
                        <TableCell
                            key={`${row.SR_NO}_${col.key}_${index}`}
                            sx={{
                                // Width fallback — authoritative width comes from colgroup
                                // width: w,
                                // minWidth: w,
                                width: isLastRow ? isMinWidth : w,
                                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: 12,
                                padding: "0px 8px",
                                ...rowStyle,
                                ...(columnStyles[col.key] || {}),
                            }}
                        >
                            {isEditable ? (
                                isDropdown ? (
                                    /* ── react-select dropdown ─────────────────────────── */
                                    <MemoSelect
                                        options={TableDropDowns[col.key] || []}
                                        value={
                                            TableDropDowns[col.key].find(
                                                (opt) => opt.value === (editBuffer[bufferKey] ?? row[col.key])
                                            ) || null
                                        }
                                        onChange={(sel) => handleSelectChange(row.SR_NO, col.key, sel)}
                                        onBlur={() => commitChange(row.SR_NO, col.key)}
                                        isSearchable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                        styles={selectStyles(theme, isDark)}
                                    />
                                ) : (
                                    /* ── text / number / date input ────────────────────── */
                                    <TextField
                                        type={
                                            isDateCol
                                                ? "date"
                                                : ["number", "float", "currency", "percentage"].includes(colConfig?.type)
                                                    ? "number"
                                                    : "text"
                                        }
                                        value={
                                            editBuffer[bufferKey] ??
                                            (isDateCol ? formatToISO(row[col.key]) : row[col.key] ?? "")
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                row.SR_NO, col.key,
                                                isDateCol ? formatToISO(e.target.value) : e.target.value
                                            )
                                        }
                                        onBlur={() => commitChange(row.SR_NO, col.key)}
                                        onKeyDown={(e) => { if (e.key === "Enter") commitChange(row.SR_NO, col.key); }}
                                        size="small"
                                        fullWidth
                                        variant="standard"
                                        error={hasError}
                                        helperText={hasError ? "Invalid value" : ""}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{
                                            min: colConfig?.type === "date" ? toDateInputFormat(colConfig?.minValue) : colConfig?.minValue ?? undefined,
                                            max: colConfig?.type === "date" ? toDateInputFormat(colConfig?.maxValue) : colConfig?.maxValue ?? undefined,
                                            step: colConfig?.type === "float" ? "0.1" : undefined,
                                            maxLength: colConfig?.type === "string" ? (colConfig.maxValue || 200) : undefined,
                                        }}
                                        sx={textFieldStyles(theme, isDark, hasError)}
                                    />
                                )
                            ) : (
                                /* ── read-only display ─────────────────────────────────── */
                                isDateCol
                                    ? formatDisplayDate(row[col.key])
                                    : typeof row[col.key] === "boolean"
                                        ? row[col.key] ? "Yes" : "No"
                                        : row[col.key] ?? "—"
                            )}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    },

    // ── memo comparator — skip re-render when nothing relevant changed ────────
    (prev, next) =>
        prev.row === next.row &&
        prev.isSelected === next.isSelected &&
        prev.isClicked === next.isClicked &&
        prev.editBuffer === next.editBuffer &&
        prev.errors === next.errors &&
        prev.isDark === next.isDark &&
        prev.headerHideColumns?.join(',') === next.headerHideColumns?.join(',') &&
        prev.columns.length === next.columns.length
    //    && prev.columnWidths === next.columnWidths
);

// ─── style factories (outside component — not recreated on every render) ─────

const selectStyles = (theme, isDark) => ({
    control: (base, state) => ({
        ...base,
        minHeight: 28, height: 28, fontSize: 12, borderRadius: 6, padding: "0 4px",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        border: `1px solid ${state.isFocused
            ? theme.palette.primary.main
            : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
            }`,
        boxShadow: state.isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : "none",
        "&:hover": {
            borderColor: theme.palette.primary.main,
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 6px" }),
    singleValue: (base) => ({ ...base, fontSize: 12, color: theme.palette.text.primary }),
    input: (base) => ({ ...base, color: theme.palette.text.primary, fontSize: 12 }),
    placeholder: (base) => ({ ...base, fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }),
    indicatorsContainer: (base) => ({ ...base, height: 28 }),
    dropdownIndicator: (base) => ({ ...base, padding: 4, color: theme.palette.text.primary }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
        ...base, borderRadius: 8, overflow: "hidden", fontSize: 12,
        background: isDark ? "rgba(15,23,42,0.95)" : "#fff",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
    }),
    option: (base, state) => ({
        ...base, fontSize: 12, cursor: "pointer",
        background: state.isSelected
            ? theme.palette.primary.main
            : state.isFocused
                ? isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
                : "transparent",
        color: state.isSelected ? "#fff" : theme.palette.text.primary,
    }),
    menuList: (base) => ({
        ...base, maxHeight: 180, overflowY: "auto",
        scrollbarWidth: "thin", scrollbarColor: "#888 transparent",
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(100,100,100,0.4)", borderRadius: 10 },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(100,100,100,0.7)" },
    }),
});

const textFieldStyles = (theme, isDark, hasError) => ({
    "& .MuiInputBase-root": {
        fontSize: 12, px: 1, py: 0.3, borderRadius: 1,
        transition: "all 0.2s ease",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        border: `1px solid ${hasError ? "#ef4444" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
            }`,
        "&:hover": {
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            borderColor: alpha(theme.palette.primary.main, 0.4),
        },
        "&.Mui-focused": {
            background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
            border: `1px solid ${hasError ? "#ef4444" : theme.palette.primary.main}`,
            boxShadow: `0 0 0 1px ${hasError ? "#ef4444" : theme.palette.primary.main}`,
        },
    },
    "& .MuiInputBase-input": {
        p: 0, fontSize: 12, fontWeight: 500, color: theme.palette.text.primary,
        "&::placeholder": { color: alpha(theme.palette.text.primary, 0.4), opacity: 1 },
    },
    "& input[type='date']::-webkit-calendar-picker-indicator": {
        filter: isDark ? "invert(1)" : "none", cursor: "pointer",
    },
    "& .Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
        filter: isDark ? "invert(0.91) brightness(2)" : "none",
        backgroundColor: "transparent", opacity: 0.5, cursor: "pointer", height: "14px",
    },
    "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": { opacity: 1 },
    "& input[type=number]": { MozAppearance: "textfield" },
});