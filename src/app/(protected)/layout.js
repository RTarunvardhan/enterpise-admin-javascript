"use client";

import LayoutWrapper from "../../components/Layout/MainLayout";

export default function ProtectedLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}