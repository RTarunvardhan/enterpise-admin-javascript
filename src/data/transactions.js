/**
 * LARGE TRANSACTIONS DATASET (2000 x 50)
 */

const categories = ["Food", "Electronics", "Clothing", "Pharmacy", "Home"];
const paymentMethods = ["Cash", "Card", "UPI", "NetBanking"];
const paymentStatusList = ["Success", "Pending", "Failed"];
const cities = ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi"];
const shifts = ["Morning", "Afternoon", "Evening"];
const devices = ["POS", "Mobile", "Web"];
const banks = ["HDFC", "ICICI", "SBI", "Axis"];
const cardTypes = ["Visa", "Mastercard", "RuPay"];

export const TRANSACTIONS = Array.from({ length: 2000 }, (_, i) => {
  const quantity = 1 + (i % 5);
  const price = 100 + i * 3;
  const subtotal = quantity * price;
  const discount = (i % 5) * 10;
  const taxRate = 18;
  const taxAmount = (subtotal - discount) * 0.18;
  const finalAmount = subtotal - discount + taxAmount;

  return {
    // --- CORE ---
    id: i + 1,
    transactionId: `TXN${100000 + i}`,
    orderId: `ORD${50000 + i}`,
    invoiceNumber: `INV${70000 + i}`,
    referenceNumber: `REF${90000 + i}`,

    // --- CUSTOMER ---
    customerId: `CUST${1000 + i}`,
    customerName: `Customer ${i + 1}`,
    customerEmail: `customer${i + 1}@mail.com`,
    customerPhone: `90000${(10000 + i).toString().slice(-5)}`,
    customerType: ["Regular", "Premium"][i % 2],

    // --- PRODUCT ---
    productId: `PROD${i % 100}`,
    productName: `Product ${i % 100}`,
    category: categories[i % categories.length],
    brand: `Brand ${i % 20}`,
    sku: `SKU${i % 200}`,

    // --- BILLING ---
    quantity,
    price,
    subtotal,
    discount,
    couponCode: i % 3 === 0 ? `SAVE${i % 20}` : "",
    taxRate,
    taxAmount,
    finalAmount,
    currency: "INR",

    // --- PAYMENT ---
    paymentMethod: paymentMethods[i % paymentMethods.length],
    paymentStatus: paymentStatusList[i % paymentStatusList.length],
    paymentGateway: ["Razorpay", "Paytm", "Stripe"][i % 3],
    transactionFee: finalAmount * 0.02,
    netAmount: finalAmount * 0.98,

    // --- CARD DETAILS ---
    cardType: cardTypes[i % cardTypes.length],
    cardLast4: `${1000 + (i % 9000)}`,
    bankName: banks[i % banks.length],

    // --- LOCATION ---
    storeId: `STORE${i % 20}`,
    storeLocation: cities[i % cities.length],
    terminalId: `TERM${i % 50}`,
    cashierId: `EMP${i % 30}`,
    cashierName: `Cashier ${i % 30}`,

    // --- OPERATIONS ---
    shift: shifts[i % shifts.length],
    device: devices[i % devices.length],
    channel: ["Offline", "Online"][i % 2],
    orderSource: ["POS", "App", "Website"][i % 3],

    // --- REFUNDS ---
    refundStatus: ["No", "Yes"][i % 4 === 0 ? 1 : 0],
    refundAmount: i % 4 === 0 ? 100 : 0,
    refundReason: i % 4 === 0 ? "Product Defect" : "",
    refundDate: i % 4 === 0 ? "2026-04-05" : "",

    // --- LOYALTY ---
    loyaltyPointsEarned: i % 200,
    loyaltyPointsUsed: i % 3 === 0 ? 50 : 0,

    // --- TIMESTAMPS ---
    transactionDate: `2026-04-${String((i % 28) + 1).padStart(2, "0")}`,
    createdAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")}T10:00:00`,
    updatedAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")}T12:00:00`,

    // --- FLAGS ---
    isFraud: i % 97 === 0,
    isHighValue: finalAmount > 5000,
    isInternational: i % 50 === 0
  };
});

/**
 * ENTERPRISE TRANSACTIONS DATASET
 * -----------------------------------
 * ROWS: 2000
 * COLUMNS: 50+
 * NOTE: Deterministic realistic patterns (NO Math.random)
 */

const CUSTOMERS = Array.from({ length: 300 }, (_, i) => ({
  id: `CUST${1000 + i}`,
  name: `Customer ${i + 1}`,
  tier: ["Silver", "Gold", "Platinum"][i % 3],
  city: ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi"][i % 5],
}));

const PRODUCTS = Array.from({ length: 200 }, (_, i) => ({
  id: `PROD${2000 + i}`,
  name: `Product ${i + 1}`,
  category: ["Food", "Electronics", "Clothing", "Home", "Pharmacy"][i % 5],
  brand: ["BrandA", "BrandB", "BrandC", "BrandD"][i % 4],
  basePrice: 50 + (i * 7) % 500,
}));

export const TRANSACTIONS_1 = Array.from({ length: 2000 }, (_, i) => {
  const customer = CUSTOMERS[i % 300];
  const product = PRODUCTS[(i * 7) % 200];

  const quantity = (i % 5) + 1;
  const price = product.basePrice + (i % 20);
  const subtotal = price * quantity;
  const discount = (i % 4) * 5;
  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const finalAmount = subtotal + taxAmount - discount;

  const day = (i % 28) + 1;
  const date = `2026-04-${String(day).padStart(2, "0")}`;

  return {
    // Core IDs
    id: i + 1,
    transactionId: `TXN${100000 + i}`,
    orderId: `ORD${50000 + i}`,
    invoiceId: `INV${70000 + i}`,

    // Customer
    customerId: customer.id,
    customerName: customer.name,
    customerTier: customer.tier,
    customerCity: customer.city,
    customerPhone: `90000${(10000 + i) % 90000}`,
    customerEmail: `user${i}@mail.com`,

    // Product
    productId: product.id,
    productName: product.name,
    category: product.category,
    brand: product.brand,

    // Pricing
    quantity,
    unitPrice: price,
    subtotal,
    discount,
    discountType: ["Flat", "Coupon", "Seasonal"][i % 3],
    taxRate: 18,
    taxAmount,
    finalAmount,

    // Payment
    paymentMethod: ["Cash", "Card", "UPI", "Wallet"][i % 4],
    paymentGateway: ["Razorpay", "Stripe", "Paytm"][i % 3],
    paymentStatus: ["Success", "Pending", "Failed"][i % 3],
    transactionReference: `REF${90000 + i}`,

    // Billing
    billingAddress: `Street ${i % 100}, Area ${(i * 3) % 50}`,
    billingCity: customer.city,
    billingPincode: `${500000 + (i % 1000)}`,

    // Store Info
    storeId: `STORE${i % 20}`,
    storeLocation: ["Hyderabad", "Bangalore", "Chennai"][i % 3],
    terminalId: `TERM${i % 10}`,
    cashier: `Cashier ${i % 15}`,
    shift: ["Morning", "Evening", "Night"][i % 3],

    // Refunds
    refundStatus: ["No", "Requested", "Completed"][i % 3],
    refundAmount: i % 3 === 2 ? subtotal * 0.5 : 0,
    refundReason: ["Damaged", "Wrong Item", "Customer Cancel"][i % 3],

    // Logistics
    deliveryType: ["Pickup", "Home Delivery"][i % 2],
    deliveryStatus: ["Pending", "Shipped", "Delivered"][i % 3],
    deliveryPartner: ["Dunzo", "Swiggy", "Zomato"][i % 3],

    // Device & Channel
    device: ["POS", "Mobile", "Web"][i % 3],
    channel: ["InStore", "Online"][i % 2],
    ipAddress: `192.168.${i % 255}.${(i * 3) % 255}`,

    // Loyalty
    loyaltyPointsEarned: i % 100,
    loyaltyPointsUsed: i % 20,

    // Audit
    transactionDate: date,
    createdAt: date,
    updatedAt: date,
  };
});