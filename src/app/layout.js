// "use client";

// // import { useEffect, useState } from "react";
// // import { getCurrentUser } from "@/utils/auth";
// // import { useRouter } from "next/navigation";
// // import GlobalLoader from "../components/Loaders/GlobalLoader";
// // import Providers from "../components/Providers"; 

// // /**
// //  * ROOT LAYOUT
// //  * -----------------------------------
// //  * INPUT: children
// //  *
// //  * OUTPUT:
// //  *  Protected layout
// //  *
// //  * PURPOSE:
// //  *  Global auth guard
// //  */

// // export default function RootLayout({ children }) {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const user = getCurrentUser();

// //     if (!user) {
// //       router.push("/signin");
// //     } else {
// //       setLoading(false);
// //     }
// //   }, []);

// //   if (loading) return <GlobalLoader />;

// //   return (
// //     <html lang="en">
// //       <body>
// //         <Providers>
// //           {children}
// //         </Providers>
// //       </body>
// //     </html>
// //   );
// // }

// // app/layout.js
// import Providers from "../components/Providers";
// import AuthGuard from "../components/AuthGuard";
// import { useEffect, } from "react";

// export default function RootLayout({ children }) {
//   useEffect(() => {
//     const handleUnload = () => {
//       localStorage.removeItem("user");
//     };
//     window.addEventListener("beforeunload", handleUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleUnload);
//     };
//   }, []);

//   return (
//     <html lang="en">
//       <body>
//         <Providers>
//           <AuthGuard>
//             {children}
//           </AuthGuard>
//         </Providers>
//       </body>
//     </html>
//   );
// }

// export const metadata = {
//   title: "D-Mart Admin Dashboard",
//   description: "Enterprise Dashboard",
// };

///////=================================
import ClientWrapper from "./ClientWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Admin Dashboard",
  description: "Enterprise Dashboard",
  icons: {
    icon: "/bg-7.jpg",
  },
};