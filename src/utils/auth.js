/**
 * FUNCTION: loginUser
 * -----------------------------------
 * INPUT:
 *  userName (string)
 *  password (string)
 *
 * OUTPUT:
 *  user object OR null
 *
 * PURPOSE:
 *  Validates user credentials
 */

import { USERS } from "../data/users";

export const loginUser = (userName, password) => {
  return USERS.find(
    (user) => user.userName === userName && user.password === password
  );
};


/**
 * FUNCTION: getCurrentUser
 * -----------------------------------
 * INPUT: None
 *
 * OUTPUT:
 *  user object OR null
 *
 * PURPOSE:
 *  Fetch user from localStorage
 */

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    // If it's malformed, clear it and return null
    localStorage.removeItem("user");
    return null;
  }
};


/**
 * FUNCTION: logoutUser
 * -----------------------------------
 * INPUT: None
 *
 * OUTPUT: None
 *
 * PURPOSE:
 *  Clears session
 */

export const logoutUser = () => {
  localStorage.removeItem("user");
};