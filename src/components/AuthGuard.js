// "use client";

// import { useEffect, useState } from "react";
// import { getCurrentUser } from "@/utils/auth";
// import { useRouter } from "next/navigation";
// import GlobalLoader from "./Loaders/GlobalLoader";

// export default function AuthGuard({ children }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const user = getCurrentUser();
//     if (!user) {
//       router.push("/SignIn");
//     } else {
//       setLoading(false);
//     }
//   }, [router]);

//   if (loading) {
//     return <GlobalLoader />;
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/auth";
import { useRouter, usePathname } from "next/navigation"; // Add usePathname
// import GlobalLoader from "./Loaders/GlobalLoader";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    const isPublicPage = pathname === "/SignIn";

    if (!user && !isPublicPage) {
      // Not logged in and trying to access a private page
      router.push("/SignIn");
    } else if (user && isPublicPage) {
      // Already logged in and trying to go to signin
      router.push("/");
    } else {
      // Either we're on signin or we're logged in
      setLoading(false);
    }
  }, [router, pathname]);

  return <>{children}</>;
}