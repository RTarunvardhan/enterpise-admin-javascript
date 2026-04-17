export const validateValue = (config, value) => {
    if (!config) return true;

    const { type, minValue, maxValue } = config;

    // EMPTY allowed
    if (value === "" || value === null || value === undefined) return true;

    // TYPE VALIDATION
    if (type === "number") {
        if (!/^\d+$/.test(value)) return false;
    }

    if (type === "float") {
        if (!/^\d+(\.\d+)?$/.test(value)) return false;
    }

    if (type === "percentage") {
        if (!/^\d+(\.\d+)?$/.test(value)) return false;
    }

    if (type === "currency") {
        if (!/^\d+(\.\d{0,2})?$/.test(value)) return false;
    }

    if (type === "date") {
        const d = new Date(value);
        if (isNaN(d)) return false;
    }

    if (type === "string") {
        const maxLen = maxValue || 200;
        if (value.length > maxLen) return false;
    }

    // RANGE VALIDATION
    if (type !== "string" && type !== "date") {
        const num = Number(value);
        if (minValue !== null && num < minValue) return false;
        if (maxValue !== null && num > maxValue) return false;
    }

    if (type === "date") {
        const time = new Date(value).getTime();
        if (minValue && time < minValue) return false;
        if (maxValue && time > maxValue) return false;
    }

    return true;
};

export const getInputType = (config) => {
    if (!config) return "text";

    switch (config.type) {
        case "number":
        case "float":
        case "percentage":
        case "currency":
            return "number";
        case "date":
            return "date";
        default:
            return "text";
    }
};

export const toDateInputFormat = (value) => {
    if (!value) return undefined;

    const d = new Date(value);
    if (isNaN(d)) return undefined;

    return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const getOperators = (isBooleanColumn, isDateColumn) => {
    if (isBooleanColumn || isDateColumn) {
        return [
            "equals",
            "does not equal",
            "is empty",
            "is not empty",
        ];
    }

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