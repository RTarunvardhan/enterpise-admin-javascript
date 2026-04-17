// "use client";

// import GlobalDashboard from "@/app/(protected)/GlobalDashboard/page";

// export default function Page() {
//   return <GlobalDashboard />;
// }

/**
 * PAGE: Root Page (/)
 * -----------------------------------
 * INPUT: None
 *
 * OUTPUT:
 *  Global dashboard UI
 *
 * PURPOSE:
 *  Entry point after login
 */

import { redirect } from "next/navigation";

export default function RootPage() {
  // This sends the user to /GlobalDashboard
  // Because /GlobalDashboard is inside (protected), it will now use that layout!
  redirect("/GlobalDashboard");
} 