// src/app/berita/[id]/layout.tsx

// Fungsi Server Component ini wajib ada untuk Static Export pada Dynamic Routes.
// Ini dieksekusi di Server pada Build Time.
export async function generateStaticParams() {
    // Membuat satu halaman statis dummy dengan id='1'.
    return [{ id: '1' }]; 
}

// Layout ini membungkus page.tsx (yang kemungkinan besar adalah Client Component).
export default function IndustriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}