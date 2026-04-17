// import {
//     TableFooter,
//     TableRow,
//     TableCell,
//     alpha
// } from "@mui/material";
// import { useMemo } from "react";

// export default function TableFooterTotals({
//     columns,
//     columnWidths,
//     currentPageRows,
//     TotalTableColumnValueCount,
//     headerHideColumns,
//     EnableCheckboxFlag,
//     theme,
//     isDark,
// }) {

//     const pageTotals = useMemo(() => {
//         if (!currentPageRows?.length) return {};

//         const totals = {};

//         TotalTableColumnValueCount.forEach((key) => {
//             totals[key] = currentPageRows.reduce((sum, row) => {
//                 const val = parseFloat(row[key]);
//                 return sum + (isNaN(val) ? 0 : val);
//             }, 0);
//         });

//         return totals;
//     }, [currentPageRows, TotalTableColumnValueCount]);

//     return (
//         <TableFooter>
//             <TableRow
//                 sx={{
//                     position: "sticky",
//                     bottom: 0,
//                     zIndex: 5,
//                     background: isDark ? "#020617" : "#f8fafc",
//                     borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//                 }}
//             >
//                 {EnableCheckboxFlag &&
//                     < TableCell
//                         sx={{
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 5,
//                             bgcolor: isDark ? "#020617" : "#f8fafc",
//                         }}
//                     />
//                 }
//                 {columns.filter((col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key))
//                     .map((col, i) => {
//                         const isTotalColumn =
//                             TotalTableColumnValueCount.includes(col.key);

//                         return (
//                             <TableCell
//                                 key={col.key}
//                                 sx={{
//                                     fontSize: 12,
//                                     py: 1,
//                                     px: 1.0,
//                                     fontWeight: isTotalColumn ? 700 : 500,
//                                     color: isTotalColumn
//                                         ? theme.palette.primary.main
//                                         : theme.palette.text.secondary,
//                                     borderRight: `1px solid ${alpha(
//                                         theme.palette.divider,
//                                         0.1
//                                     )}`,
//                                     whiteSpace: "nowrap",
//                                 }}
//                             >
//                                 {i === 0
//                                     ? "Total :"
//                                     : isTotalColumn
//                                         ? pageTotals[col.key]?.toLocaleString("en-IN")
//                                         : ""}
//                             </TableCell>
//                         );
//                     })}
//             </TableRow>
//         </TableFooter>
//     );
// }

import { TableFooter, TableRow, TableCell, alpha } from "@mui/material";
import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TableFooterTotals
// Sticky footer row that sums specified numeric columns.
// ─────────────────────────────────────────────────────────────────────────────
export default function TableFooterTotals({
  columns,
  columnWidths,
  currentPageRows,
  TotalTableColumnValueCount,
  headerHideColumns,
  EnableCheckboxFlag,
  theme,
  isDark,
}) {
  const pageTotals = useMemo(() => {
    if (!currentPageRows?.length) return {};
    const totals = {};
    TotalTableColumnValueCount.forEach((key) => {
      totals[key] = currentPageRows.reduce((sum, row) => {
        const v = parseFloat(row[key]);
        return sum + (isNaN(v) ? 0 : v);
      }, 0);
    });
    return totals;
  }, [currentPageRows, TotalTableColumnValueCount]);

  const visibleCols = columns.filter(
    (col) => col.key !== "SR_NO" && !headerHideColumns.includes(col.key)
  );

  const footerBg = isDark ? "#020617" : "#f1f5f9";

  return (
    <TableFooter>
      <TableRow
        sx={{
          position:  "sticky",
          bottom:    0,
          zIndex:    5,
          background: footerBg,
          borderTop: `2px solid ${alpha(theme.palette.divider, 0.25)}`,
        }}
      >
        {/* Blank cell under the checkbox column */}
        {EnableCheckboxFlag && (
          <TableCell
            padding="none"
            sx={{
              position: "sticky",
              left:     0,
              zIndex:   6,
              bgcolor:  footerBg,
              borderRight: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
              p: 0,
            }}
          />
        )}

        {visibleCols.map((col, i) => {
          const isTotal = TotalTableColumnValueCount.includes(col.key);
          const w       = columnWidths[col.key] ?? col.defaultWidth;
          return (
            <TableCell
              key={col.key}
              sx={{
                width:     w,
                minWidth:  w,
                fontSize:  12,
                py:        "6px",
                px:        1,
                fontWeight: isTotal ? 700 : 500,
                color:     isTotal
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                whiteSpace: "nowrap",
                boxSizing:  "border-box",
              }}
            >
              {i === 0
                ? "Total :"
                : isTotal
                  ? pageTotals[col.key]?.toLocaleString("en-IN")
                  : ""}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}