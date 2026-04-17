/**
 * USERS DATASET
 * -----------------------------------
 * INPUT: None (static data)
 * OUTPUT: Array of user objects
 * PURPOSE: Used for authentication + RBAC
 */

export const USERS = [
    {
      id: 1,
      userName: "admin",
      email: "admin@dmart.com",
      password: "admin",
      role: "ADMIN",
      department: "Management",
      status: "ACTIVE",
      lastLogin: "2026-04-01",
    },
  
    // 👉 Add 20 users (IMPORTANT)
    ...Array.from({ length: 19 }, (_, i) => ({
      id: i + 2,
      userName: `User${i + 2}`,
      email: `user${i + 2}@dmart.com`,
      password: "1234",
      role: ["MANAGER","HR","FINANCE","ANALYST","LOGISTICS","VIEWER"][i % 6],
      department: "General",
      status: "ACTIVE",
      lastLogin: "2026-04-01",
    }))
  ];