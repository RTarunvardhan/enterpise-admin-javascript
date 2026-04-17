export const serializedata = (datatable) => {
    return datatable.map((item, i) => ({
        ...item,
        SR_NO: i + 1
    }));
};

export const deserializeData = (tableData) => {
    if (!Array.isArray(tableData)) return []; // Handle invalid input gracefully

    return tableData.map(({ SR_NO, ...rest }) => rest); // Remove the `SR_NO` property
};