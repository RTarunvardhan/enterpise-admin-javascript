export const menuItems = [
  {
    name: "Dashboard",
    path: "/GlobalDashboard",
    roles: ["ADMIN"]
  },
  {
    name: "Employees",
    roles: [""],
    submenu: [
      { name: "Employee Dashboard", path: "/Employees/EmployeeDashboard" },
      { name: "Add Employee", path: "/Employees/AddEmployee" },
      { name: "Employee Roles", path: "/Employees/EmployeeRoles" },
      { name: "Employee Management", path: "/Employees/EmployeeManagement" },
      { name: "Employee Performance", path: "/Employees/EmployeePerformance" }
    ]
  },
  {
    name: "Inventory",
    submenu: [
      { name: "Inventory Dashboard", path: "/Inventory/InventoryDashboard" },
      { name: "Inventory Details", path: "/Inventory/InventoryDetails" },
      { name: "Inventory Screens", path: "/Inventory/InventoryScreens" },
      { name: "Inventory Stock Alerts", path: "/Inventory/InventoryStockAlerts" },
      { name: "Add Inventory", path: "/Inventory/InventoryForm" },
    ]
  },
  {
    name: "Transactions",
    submenu: [
      { name: "Transaction Dashboard", path: "/Transactions/TransactionDashboard" },
      { name: "Transaction Management", path: "/Transactions/TransactionManagement" },
      { name: "Billing Form", path: "/Transactions/BillingForm" },
      { name: "Payment Tracking", path: "/Transactions/PaymentTracking" },
    ]
  }
  // Add more items here as needed
];