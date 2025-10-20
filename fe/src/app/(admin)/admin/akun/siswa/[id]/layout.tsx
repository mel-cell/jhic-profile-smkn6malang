// src/app/(admin)/admin/akun/siswa/[id]/layout.tsx

// PENTING: Karena ini adalah Server Component, JANGAN ada 'use client'.

// Fungsi ini akan dijalankan saat build time (Server-side)
export async function generateStaticParams() {
    // Membuat satu halaman statis dummy dengan id='1'.
    // Ini menyelesaikan error build untuk semua dynamic routes (seperti [id])
    return [{ id: '1' }]; 
}

// Layout ini hanya sebagai wrapper/wadah untuk page.tsx (Client Component) Anda
export default function StudentDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}