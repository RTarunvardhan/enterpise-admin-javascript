export const serializedata = (datatable) => {
    let newTabledata = [];
    let count = 1;
    if (datatable.length > 0) {
        datatable.map(item => {
            item['SR_NO'] = count;
            count++;
            newTabledata.push(item);
        });
        // setTabledataclone(newTabledata)
        return newTabledata;
    }
};
export const deserializeData = (tableData) => {
    if (!Array.isArray(tableData)) return []; // Handle invalid input gracefully

    return tableData.map(({ SR_NO, ...rest }) => rest); // Remove the `SR_NO` property
};