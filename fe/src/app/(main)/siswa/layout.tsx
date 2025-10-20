// File: src/app/(main)/siswa/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderSiswa from "@/components/siswa/HeaderSiswa";
import FooterSiswa from "@/components/siswa/FooterSiswa";
import ButtonAi from "@/components/chatbot/ButtonAi";

interface SiswaLayoutProps {
  children: React.ReactNode;
}

export default function SiswaLayout({ children }: SiswaLayoutProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");

      if (!token || userRole !== "STUDENT") {
        // Redirect to login if not authenticated or wrong role
        router.replace("/siswa/login");
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // If auth check passes, render children
  if (isAuthorized) {
    return (
      <>
        <main className="top-0 relative">{children}</main>
        {/* AI Chatbot Button - Fixed position bottom right */}
        <ButtonAi />
      </>
    );
  }

  // This should not be reached, but just in case
  return null;
}
