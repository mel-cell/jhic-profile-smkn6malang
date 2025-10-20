// File: src/app/(main)/halaman-ai/layout.tsx

import React from "react";

interface HalamanAiLayoutProps {
  children: React.ReactNode;
}

export default function HalamanAiLayout({ children }: HalamanAiLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
