// src/app/(admin)/admin/notifikasi-event/[id]/layout.tsx

// Fungsi Server Component ini wajib ada untuk Static Export pada Dynamic Routes.
export async function generateStaticParams() {
    // Membuat satu halaman statis dummy dengan id='1'.
    return [{ id: '1' }]; 
}

// Layout ini membungkus page.tsx atau folder 'edit' di dalamnya.
export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}