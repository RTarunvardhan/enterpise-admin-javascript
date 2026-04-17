/**
 * FINANCIAL DATASET
 * -----------------------------------
 * INPUT: None
 * OUTPUT: Array<FinancialRecord>
 *
 * PURPOSE:
 *  Tracks revenue, expenses, profit
 */

export const FINANCIAL = Array.from({ length: 400 }, (_, i) => ({
  id: i + 1,
  recordId: `FIN${10000 + i}`,
  transactionId: `TXN${i}`,
  store: ["Hyderabad", "Bangalore", "Chennai"][i % 3],
  department: ["Sales", "Operations", "Logistics"][i % 3],
  category: ["Revenue", "Expense"][i % 2],
  subCategory: ["Online", "Offline"][i % 2],
  revenue: 1000 + i * 20,
  expense: 500 + i * 10,
  profit: (1000 + i * 20) - (500 + i * 10),
  tax: 18,
  netProfit: ((1000 + i * 20) - (500 + i * 10)) * 0.82,
  paymentMethod: ["Cash", "Card", "UPI"][i % 3],
  status: ["Completed", "Pending"][i % 2],
  region: ["South", "North"][i % 2],
  manager: `Manager ${i % 10}`,
  fiscalYear: "2025-2026",
  quarter: ["Q1", "Q2", "Q3", "Q4"][i % 4],
  month: i % 12,
  day: i % 28,
  createdAt: "2025-01-01",
  updatedAt: "2026-01-01",
  auditStatus: ["Verified", "Pending"][i % 2],
  remarks: "OK",
  currency: "INR"
}));