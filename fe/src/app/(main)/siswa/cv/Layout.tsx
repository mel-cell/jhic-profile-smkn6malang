// src/app/siswa/cv/Layout.tsx
import React from 'react';

// Jika Anda mengalami error 'The default export is not a React Component...', 
// ini adalah struktur yang harus Anda ikuti.

interface CVLayoutProps {
  children: React.ReactNode;
}

export default function CVLayout({ children }: CVLayoutProps) {
    return (
        <div className="bg-white p-4">
            {/* Header spesifik untuk modul CV, misalnya: "Modul Pengelolaan CV" */}
            {children}
        </div>
    );
}