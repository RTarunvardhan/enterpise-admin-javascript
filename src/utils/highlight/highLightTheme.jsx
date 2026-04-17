import { alpha } from "@mui/material";

// export const getHighlightTheme = (theme, isDark) => ({
//     error: {
//         bgcolor: alpha("#ef4444", isDark ? 0.28 : 0.32),
//         color: isDark ? "#fecaca" : "#7f1d1d",
//     },
//     warning: {
//         bgcolor: alpha("#eab308", isDark ? 0.28 : 0.35),
//         color: isDark ? "#fef08a" : "#78350f",
//     },
//     success: {
//         bgcolor: alpha("#22c55e", isDark ? 0.28 : 0.32),
//         color: isDark ? "#bbf7d0" : "#14532d",
//     },
// });

// export const buildHighlightRules = (config, theme, isDark) => {
//     const colors = getHighlightTheme(theme, isDark);

//     return config.map((rule) => {
//         let styles = {};

//         if (rule.errorType === "error") {
//             styles = colors.error;
//         } else if (rule.errorType === "warning") {
//             styles = colors.warning;
//         } else {
//             styles = colors.success;
//         }

//         return {
//             ...rule,
//             styles,
//         };
//     });
// };

// export const getRowHighlight = (row, rules) => {
//     console.log("rules:", row, rules);
//     // 🔥 PRIORITY 1: errorType
//     for (const rule of rules) {
//         if (
//             rule.errorType &&
//             String(row[rule.columnName]).toLowerCase() === rule.errorType.toLowerCase()
//         ) {
//             return {
//                 rowStyle: rule.styles,
//                 columnStyles: {},
//             };
//         }
//     }

//     // 🔥 PRIORITY 2: column-based
//     let rowStyle = {};
//     let columnStyles = {};

//     for (const rule of rules) {
//         if (!rule.errorType) {
//             const value = row[rule.columnName];

//             if (
//                 String(value).toLowerCase() ===
//                 String(rule.columnValue).toLowerCase()
//             ) {
//                 if (rule.rowHighlightFlag) {
//                     rowStyle = rule.styles;
//                 } else {
//                     columnStyles[rule.columnName] = rule.styles;
//                 }
//             }
//         }
//     }

//     return { rowStyle, columnStyles };
// };

// export const getClickHighlightStyle = (theme, isDark) => ({
//     bgcolor: isDark
//       ? alpha(theme.palette.primary.main, 0.45)
//       : alpha(theme.palette.primary.main, 0.45),
//     transition: "all 0.2s ease",
//   });

export const getHighlightTheme = (theme, isDark) => ({
    error: {
        bgcolor: alpha("#ef4444", isDark ? 0.28 : 0.32),
        color: isDark ? "#fecaca" : "#7f1d1d",
    },
    warning: {
        bgcolor: alpha("#eab308", isDark ? 0.28 : 0.35),
        color: isDark ? "#fef08a" : "#78350f",
    },
    success: {
        bgcolor: alpha("#22c55e", isDark ? 0.28 : 0.32),
        color: isDark ? "#bbf7d0" : "#14532d",
    },
});

export const buildHighlightRules = (config, theme, isDark) => {
    const colors = getHighlightTheme(theme, isDark);

    return config.map((rule) => {
        let styles = {};

        // 🔥 map columnValue → style
        const value = String(rule.columnValue).toLowerCase();

        if (value === "error") styles = colors.error;
        else if (value === "warning") styles = colors.warning;
        else if (value === "success" || value === "true") styles = colors.success;

        return {
            ...rule,
            styles,
        };
    });
};

export const getRowHighlight = (row, rules) => {
    let rowStyle = {};
    let columnStyles = {};

    for (const rule of rules) {
        const cellValue = row[rule.columnName];

        // 🔥 skip if no value match
        if (
            String(cellValue).toLowerCase() !==
            String(rule.columnValue).toLowerCase()
        ) {
            continue;
        }

        // 🔥 SPECIAL CASE (Highest Priority)
        const special =
            typeof rule.specialCase === "function"
                ? rule.specialCase(row)
                : rule.specialCase;

        if (special && Object.keys(special).length > 0) {
            const sxStyles = special.sx || special;

            if (rule.rowHighlightFlag) {
                return {
                    rowStyle: sxStyles,
                    columnStyles: {},
                };
            }

            if (rule.columnHighLightFlag) {
                columnStyles[rule.columnName] = sxStyles;
                continue;
            }
        }

        // 🔥 NORMAL RULES
        if (rule.rowHighlightFlag) {
            rowStyle = rule.styles;
        }

        if (rule.columnHighLightFlag) {
            columnStyles[rule.columnName] = rule.styles;
        }
    }

    return { rowStyle, columnStyles };
};

export const getClickHighlightStyle = (theme, isDark) => ({
    bgcolor: isDark
        ? alpha('#000000', 0.65)
        : alpha('#787878', 0.45),
    transition: "all 0.1s ease",
});