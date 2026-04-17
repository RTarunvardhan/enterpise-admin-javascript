// Inventory stock Alerts custom css
export const customTextfieldStyles = (theme, isDark, alpha) =>
({
    width: "100%",
    // 🔥 ROOT
    "& .MuiInputBase-root": {
        fontSize: 12,
        px: 1,
        py: 0.3,
        height: 35,
        width: 150,
        borderRadius: 1,
        transition: "all 0.2s ease",

        // 🎨 THEME BACKGROUND
        background: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.01)",

        border: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.03)",

        // ✨ HOVER
        "&:hover": {
            background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
            borderColor: alpha(theme.palette.primary.main, 0.4),
        },

        // 🔥 FOCUS
        "&.Mui-focused": {
            background: isDark
                ? "rgba(99,102,241,0.12)"
                : "rgba(99,102,241,0.08)",

            border: `1px solid ${theme.palette.primary.main}`,

            boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        },
        "&::-webkit-calendar-picker-indicator": {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0, // Make the whole box clickable for the picker
            cursor: 'pointer',
        },
    },

    // 🔤 INPUT TEXT
    "& .MuiInputBase-input": {
        p: 0,
        fontSize: 12,
        fontWeight: 500,
        color: theme.palette.text.primary,

        // Placeholder styling
        "&::placeholder": {
            color: alpha(theme.palette.text.primary, 0.4),
            opacity: 1,
        },
    },
    // 📅 DATE ICON FIX (for date inputs)
    "& input[type='date']::-webkit-calendar-picker-indicator": {
        filter: isDark ? "invert(1)" : "none",
        cursor: "pointer",
    },

    // ❌ DISABLED STATE (optional)
    "& .Mui-disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
    },
    // ❌ FIX WHITE SPINNER BACKGROUND (Chrome, Edge, Safari)
    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
        // Use invert to turn the black arrows white for dark mode
        filter: isDark ? "invert(0.91) brightness(2)" : "invert(0.1) brightness(1) contrast(1)",

        // Force the background to be transparent so the the    me shows through
        backgroundColor: "transparent",

        // Adjust opacity so they aren't too distracting until hover
        opacity: 0.5,
        cursor: "pointer",

        // Ensure they don't add extra height to your small rows
        height: "16px",
    },

    // Optional: Make arrows fully visible on hover
    "& .MuiInputBase-root:hover input::-webkit-inner-spin-button": {
        opacity: 1,
    },

    // Firefox fix (Firefox handles this differently)
    "& input[type=number]": {
        MozAppearance: "textfield", // Use this if you want to hide them entirely in Firefox
    },

    "& input[type='date']": {
        position: "relative",
    },
});


export const customSingleSelectStyles = (theme, isDark) =>
({
    control: (base, state) => ({
        ...base,
        minHeight: 35,
        height: 35,
        fontSize: 12,
        width: 150,
        borderRadius: 5,
        padding: "0px 4px",

        background: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.01)",

        border: `1px solid ${state.isFocused
            ? theme.palette.primary.main
            : isDark
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.4)"
            }`,

        boxShadow: state.isFocused
            ? `0 0 0 1px ${theme.palette.primary.main}`
            : "none",

        "&:hover": {
            borderColor: theme.palette.primary.main,
            background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
        },
    }),

    valueContainer: (base) => ({
        ...base,
        padding: "0 6px",
    }),

    singleValue: (base) => ({
        ...base,
        fontSize: 12,
        color: theme.palette.text.primary,
    }),

    input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        fontSize: 12,
    }),

    placeholder: (base) => ({
        ...base,
        fontSize: 11,
        color: isDark
            ? "rgba(255,255,255,0.4)"
            : "rgba(0,0,0,0.4)",
    }),

    indicatorsContainer: (base) => ({
        ...base,
        height: 35,
    }),

    dropdownIndicator: (base) => ({
        ...base,
        padding: 4,
        color: theme.palette.text.primary,
    }),

    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),

    menu: (base) => ({
        ...base,
        borderRadius: 8,
        overflow: "hidden",
        background: isDark
            ? "rgba(15,23,42,0.95)"
            : "#ffffff",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        fontSize: 12,
    }),

    option: (base, state) => ({
        ...base,
        fontSize: 12,
        cursor: "pointer",

        background: state.isSelected
            ? theme.palette.primary.main
            : state.isFocused
                ? isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)"
                : "transparent",

        color: state.isSelected
            ? "#fff"
            : theme.palette.text.primary,
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: 250,
        overflowY: "auto",

        // 🔥 Smooth scroll
        scrollBehavior: "smooth",

        // 🔥 Firefox
        scrollbarWidth: "thin",
        scrollbarColor: "#888 transparent",

        // 🔥 Chrome / Edge / Safari
        "&::-webkit-scrollbar": {
            width: 6,
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 10,
        },
        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(255,255,255,0.6)",
        },
    }),
});

export const customMultiSelectStyles = (theme, isDark) =>
({
    control: (base, state) => ({
        ...base,
        minHeight: 35,
        height: 35,              // ✅ fixed height
        display: "flex",
        alignItems: "center",    // ✅ center vertically
        fontSize: 12,
        width: '100%',
        borderRadius: 6,
        padding: "0px 4px",

        background: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.01)",

        border: `1px solid ${state.isFocused
            ? theme.palette.primary.main
            : isDark
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.4)"
            }`,

        boxShadow: state.isFocused
            ? `0 0 0 1px ${theme.palette.primary.main}`
            : "none",

        "&:hover": {
            borderColor: theme.palette.primary.main,
            background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
        },
    }),

    valueContainer: (base) => ({
        ...base,
        height: "100%",
        display: "flex",
        alignItems: "center",    // ✅ center content
        padding: "0 6px",
        overflow: "hidden",
    }),

    singleValue: (base) => ({
        ...base,
        fontSize: 12,
        color: theme.palette.text.primary,
    }),

    input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        fontSize: 12,
        margin: 0, padding: 0
    }),

    placeholder: (base) => ({
        ...base,
        fontSize: 11,
        color: isDark
            ? "rgba(255,255,255,0.4)"
            : "rgba(0,0,0,0.4)",
    }),

    indicatorsContainer: (base) => ({
        ...base,
        height: 35,
    }),

    dropdownIndicator: (base) => ({
        ...base,
        padding: 4,
        color: theme.palette.text.primary,
    }),

    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),

    menu: (base) => ({
        ...base,
        borderRadius: 8,
        overflow: "hidden",
        background: isDark
            ? "rgba(15,23,42,0.95)"
            : "#ffffff",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        fontSize: 12,
        height: 250
    }),

    option: (base, state) => ({
        ...base,
        fontSize: 12,
        cursor: "pointer",

        background: state.isSelected
            ? theme.palette.primary.main + "22"   // 🔥 soft highlight
            : state.isFocused
                ? isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)"
                : "transparent",

        color: state.isSelected
            ? theme.palette.primary.main
            : theme.palette.text.primary,

        fontWeight: state.isSelected ? 600 : 400,
    }),
    multiValue: (base) => ({
        ...base,
        maxWidth: 80,
        borderRadius: 4,
        fontSize: 11,
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    multiValueLabel: (base) => ({
        ...base,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: 250,
        overflowY: "auto",

        // 🔥 Smooth scroll
        scrollBehavior: "smooth",

        // 🔥 Firefox
        scrollbarWidth: "thin",
        scrollbarColor: "#888 transparent",

        // 🔥 Chrome / Edge / Safari
        "&::-webkit-scrollbar": {
            width: 6,
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 10,
        },
        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(255,255,255,0.6)",
        },
    }),
});