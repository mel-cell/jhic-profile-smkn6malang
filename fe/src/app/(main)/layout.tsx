// File: src/app/(main)/layout.tsx (Layout Grup Main - DENGAN HEADER & FOOTER)
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    // Gunakan Fragment sebagai wrapper
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />  
    </>
  );
}
