/**
 * ROLE PERMISSIONS
 * -----------------------------------
 * Defines which modules each role can access
 */

export const ROLE_ACCESS = {
    ADMIN: ["ALL"],
    MANAGER: ["EMPLOYEES", "INVENTORY"],
    HR: ["EMPLOYEES"],
    FINANCE: ["FINANCE"],
    ANALYST: ["INVENTORY"],
    LOGISTICS: ["TRANSPORT"],
    VIEWER: ["READ_ONLY"]
  };
  
  
  /**
   * FUNCTION: hasAccess
   * -----------------------------------
   * INPUT:
   *  role (string)
   *  module (string)
   *
   * OUTPUT:
   *  boolean
   *
   * PURPOSE:
   *  Check if user has access to module
   */
  
  export const hasAccess = (role, module) => {
    if (!ROLE_ACCESS[role]) return false;
    return (
      ROLE_ACCESS[role].includes("ALL") ||
      ROLE_ACCESS[role].includes(module)
    );
  };