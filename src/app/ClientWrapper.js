"use client";

import Providers from "../components/Providers";
import AuthGuard from "../components/AuthGuard";
import { useEffect, } from "react";

export default function ClientWrapper({ children }) {
    // useEffect(() => {
    //     const handleUnload = () => {
    //         localStorage.removeItem("user");
    //     };
    //     window.addEventListener("beforeunload", handleUnload);
    //     return () => {
    //         window.removeEventListener("beforeunload", handleUnload);
    //     };
    // }, []);

    return (
        <Providers>
            <AuthGuard>
                {children}
            </AuthGuard>
        </Providers>
    );
}
