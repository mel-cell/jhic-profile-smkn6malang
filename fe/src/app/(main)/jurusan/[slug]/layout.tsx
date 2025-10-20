// src/app/berita/[id]/layout.tsx

// Fungsi Server Component ini wajib ada untuk Static Export pada Dynamic Routes.
// Ini dieksekusi di Server pada Build Time.
export async function generateStaticParams() {
    // Membuat satu halaman statis dummy dengan slug='1'.
    return [{ slug: '1' }];
}

// Layout ini membungkus page.tsx (yang kemungkinan besar adalah Client Component).
export default function JurusanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}