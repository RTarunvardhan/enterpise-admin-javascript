const PRODUCT_MASTER = [
    {
        type: "Rice",
        category: "Food",
        units: ["1kg", "5kg", "10kg"],
        brands: ["India Gate", "Daawat", "Fortune"]
    },
    {
        type: "Wheat Flour",
        category: "Food",
        units: ["1kg", "5kg"],
        brands: ["Aashirvaad", "Pillsbury"]
    },
    {
        type: "Milk",
        category: "Dairy",
        units: ["500ml", "1L", "2L"],
        brands: ["Amul", "Mother Dairy"]
    },
    {
        type: "LED TV",
        category: "Electronics",
        units: ["32 inch", "43 inch", "55 inch"],
        brands: ["Samsung", "LG", "Sony"]
    },
    {
        type: "Laptop",
        category: "Electronics",
        units: ["i5", "i7", "Ryzen 5"],
        brands: ["Dell", "HP", "Lenovo"]
    },
    {
        type: "Mobile Phone",
        category: "Electronics",
        units: ["64GB", "128GB", "256GB"],
        brands: ["Apple", "Samsung", "OnePlus"]
    },
    {
        type: "Shirt",
        category: "Clothing",
        units: ["S", "M", "L", "XL"],
        brands: ["Zara", "H&M", "Levi's"]
    },
    {
        type: "Shoes",
        category: "Footwear",
        units: ["UK 7", "UK 8", "UK 9"],
        brands: ["Nike", "Adidas", "Puma"]
    },
    {
        type: "Refrigerator",
        category: "Electronics",
        units: ["180L", "250L", "350L"],
        brands: ["LG", "Whirlpool", "Samsung"]
    },
    {
        type: "Cooking Oil",
        category: "Food",
        units: ["1L", "2L", "5L"],
        brands: ["Fortune", "Saffola"]
    }
];

const generateProduct = (i) => {
    const product = PRODUCT_MASTER[i % PRODUCT_MASTER.length];

    const brand = product.brands[i % product.brands.length];
    const unit = product.units[i % product.units.length];

    return {
        productName: `${brand} ${product.type} ${unit}`,
        category: product.category,
        brand,
        unit
    };
};

const CATEGORY_RULES = {
    Food: {
        returnable: false,
        fragile: false,
        temperatureSensitive: true,
        discountChance: 0.3,
    },
    Dairy: {
        returnable: false,
        fragile: false,
        temperatureSensitive: true,
        discountChance: 0.4,
    },
    Electronics: {
        returnable: true,
        fragile: true,
        temperatureSensitive: false,
        discountChance: 0.2,
    },
    Clothing: {
        returnable: true,
        fragile: false,
        temperatureSensitive: false,
        discountChance: 0.5,
    },
    Footwear: {
        returnable: true,
        fragile: false,
        temperatureSensitive: false,
        discountChance: 0.4,
    }
};

export const INVENTORY = Array.from({ length: 1000 }, (_, i) => {
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    const stockQty = Math.floor(seededRandom(i) * 200);
    const reservedStock = Math.floor(seededRandom(i + 1) * 20);
    const availableStock = Math.max(stockQty - reservedStock, 0);

    // 🔥 STOCK ALERT
    let stockAlert = "OK";
    if (stockQty < 20) stockAlert = "ERROR";
    else if (stockQty < 50) stockAlert = "WARNING";

    // 🔥 MESSAGE SYSTEM
    let error_message = null;
    let messageType = null;

    if (availableStock === 0) {
        error_message = "Out of stock";
        messageType = "error";
    } else if (availableStock < 10) {
        error_message = "Critical low stock";
        messageType = "error";
    } else if (availableStock < 20) {
        error_message = "Low stock warning";
        messageType = "warning";
    }

    // Helpers
    const randomInt = (seed, max) => Math.floor(seededRandom(seed) * max);

    const randomFloat = (seed, max) =>
        (seededRandom(seed) * max).toFixed(2);

    const randomBool = (seed, probability = 0.5) =>
        seededRandom(seed) < probability;

    const getSeededDate = (seed, start, end) => {
        const ratio = seededRandom(seed);
        return new Date(
            start.getTime() + ratio * (end.getTime() - start.getTime())
        );
    };

    // 🔥 PRODUCT
    const product = generateProduct(i);

    // 🔥 SMART FLAGS (NOT RANDOM)
    const rules = CATEGORY_RULES[product.category] || {};

    // ✅ RETURNABLE / FRAGILE / TEMP (REAL LOGIC)
    const returnable = rules.returnable ?? false;
    const fragile = rules.fragile ?? false;
    const temperatureSensitive = rules.temperatureSensitive ?? false;

    // ✅ NEW PRODUCT (based on created date)
    const newProduct = (i % 21 === 0 && i !== 0);

    // ✅ TRENDING (based on demand + sales)
    const demandScore = randomInt(i + 10, 100);
    const salesLast7Days = randomInt(i + 20, 200);

    const trending = demandScore > 75 && salesLast7Days > 120;

    // ✅ DISCOUNT (category-based probability)
    const discounted = randomBool(i + 30, rules.discountChance || 0.2);

    // 🔥 DATE LOGIC
    const getRandomDate = (start, end) => {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
    };

    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const formatDate = (date) => {
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const today = new Date();

    // Manufacture: 1–24 months ago
    const manufactureDateObj = getSeededDate(
        i + 100,
        new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    );

    // Expiry (depends on category)
    let expiryDateObj;

    if (product.category === "Food" || product.category === "Dairy") {
        // Short shelf life (30–365 days)
        expiryDateObj = addDays(manufactureDateObj, randomInt(i + 110, 365) + 30);
    } else {
        // Long shelf life (1–5 years)
        expiryDateObj = addDays(manufactureDateObj, randomInt(i + 110, 1500) + 365);
    }

    // CreatedAt: after manufacture
    const createdAtObj = getSeededDate(
        i + 120,
        manufactureDateObj,
        addDays(manufactureDateObj, 30)
    );

    // UpdatedAt: after createdAt
    const updatedAtObj = getSeededDate(
        i + 130,
        createdAtObj,
        today
    );

    // Last Restocked: recent (after createdAt)
    const lastRestockedObj = getSeededDate(
        i + 140,
        createdAtObj,
        today
    );

    return {
        id: i + 1,
        sku: `SKU${10000 + i}`,

        // ✅ PRODUCT
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        unit: product.unit,

        subCategory: ["A", "B", "C"][i % 3],
        model: `Model-${i}`,
        variant: `V${i % 5}`,

        // 🔥 SUPPLY
        supplier: `Supplier ${i % 30}`,
        supplierRating: randomFloat(i + 40, 5),
        purchasePrice: 100 + i * 2,
        sellingPrice: 150 + i * 3,
        margin: 20 + (i % 15),

        // 🔥 INVENTORY
        stockQty,
        reservedStock,
        availableStock,
        minStockLevel: 50,
        maxStockLevel: 1000,
        reorderLevel: 100,

        // 🔥 ALERT SYSTEM
        stockAlert,

        // 🔥 MESSAGE SYSTEM
        error_message,
        messageType, // error | warning | null

        // 🔥 STATUS FLAGS (CLEAN)
        status: i % 10 === 0 ? "inactive" : "active",
        newProduct,
        trending,
        discounted,
        returnable,
        fragile,
        temperatureSensitive,

        // 🔥 LOCATION
        warehouse: `Warehouse ${i % 5}`,
        zone: `Zone ${i % 10}`,
        rack: `R-${i % 50}`,
        bin: `BIN-${i % 100}`,

        // 🔥 TRANSPORT
        transportStatus: ["In Transit", "Delivered", "Pending"][i % 3],
        region: ["South", "North", "West", "East"][i % 4],

        // 🔥 DEMAND & SALES
        demandScore: randomInt(i + 50, 100),
        salesLast7Days: randomInt(i + 60, 200),
        salesLast30Days: randomInt(i + 70, 500),

        // 🔥 PRODUCT DETAILS
        weight: randomFloat(i + 80, 10),
        dimensions: `${10 + (i % 50)}x${5 + (i % 20)}x${2 + (i % 10)}`,
        color: ["Red", "Blue", "Green", "Black"][i % 4],
        size: ["S", "M", "L", "XL"][i % 4],

        // 🔥 DATES
        expiryDate: formatDate(expiryDateObj),
        manufactureDate: formatDate(manufactureDateObj),
        createdAt: formatDate(createdAtObj),
        updatedAt: formatDate(updatedAtObj),
        lastRestocked: formatDate(lastRestockedObj),

        // 🔥 FINANCIALS
        taxPercent: 18,
        discountPercent: i % 20,
        profit: (50 + i * 1.5).toFixed(2),

        // 🔥 EXTRA
        barcode: `BAR${100000 + i}`,
        qrCode: `QR${200000 + i}`,
        batchNo: `BATCH${i}`,
        serialNumber: `SN${i}`,
        warrantyMonths: i % 24,
    };
});