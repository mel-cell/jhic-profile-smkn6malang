// src/app/(main)/pengunjung/berita/[slug]/page.tsx
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { notFound } from 'next/navigation';
import Image from "next/image";
import Link from 'next/link';

// Data Dummy Detail (Harus sama dengan di index agar rute berfungsi)
const allNews = [
    { 
        slug: 'juara-lomba-pencak-silat-nasional', 
        title: 'Juara Lomba Pencak Silat Tingkat Nasional', 
        date: '10 Oktober 2025', 
        mainImage: '/news-detail.jpg', // Ganti dengan gambar detail
        content: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc vivamus ullamcorper. Nec tincidunt nisl scelerisque. Vivamus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique. Enim nunc tristique.",
            "Viverra mauris in aliquam sem fringilla ut morbi tincidunt. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Tellus id interdum velit euismod in. Ultricies lacus sed turpis tincidunt id. Tellus elementum ligula eget. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Ornare massa eget egestas purus viverra accumsan in nisl.",
            "Semper feugiat nibh sed pulvinar proin gravida. Suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Enim nunc vivamus ullamcorper. Sed adipiscing diam donec adipiscing tristique. Ornare massa eget egestas purus viverra accumsan in nisl.",
        ],
    },
    { 
        slug: 'penerimaan-siswa-baru-angkatan-2026', 
        title: 'Penerimaan Siswa Baru Angkatan 2026 Dibuka!', 
        date: '01 September 2025', 
        mainImage: '/news-detail-psb.jpg', 
        content: ["Informasi pendaftaran lengkap bisa dilihat di situs PPDB resmi sekolah.", "Tersedia 10 jurusan unggulan."],
    },
    // ... tambahkan item lain sesuai data newsItems
];

const allNewsMap = allNews.reduce((map, item) => {
    map[item.slug] = item;
    return map;
}, {} as Record<string, typeof allNews[0]>);

// Fungsi ini penting untuk Static Site Generation (SSG) di Next.js
export async function generateStaticParams() {
    return allNews.map((news) => ({
        slug: news.slug,
    }));
}

interface NewsPageProps {
    params: {
        slug: string;
    };
}

const NewsDetailPage = ({ params }: NewsPageProps) => {
    const { slug } = params;
    const news = allNewsMap[slug];

    if (!news) {
        notFound();
    }

    const NAVBAR_HEIGHT_NEG = "-mt-[6rem] md:-mt-[10rem]"; 

    return (
        <main className="w-full">
            {/* 1. HERO SECTION (Header Berita Detail) */}
            <section className={`relative 
                w-screen -mx-[calc(50vw-50%)] 
                h-[40vh] md:h-[60vh] 
                flex items-end overflow-hidden
                ${NAVBAR_HEIGHT_NEG}
            `}>
                <Image
                    src="/aboutbg.webp" 
                    alt="Papan Nama Sekolah"
                    fill
                    className="object-cover brightness-[0.5] transition-transform duration-1000"
                    priority
                    sizes="100vw"
                />
                <div className="relative z-10 w-full p-8 md:p-12">
                    <h1 className="text-white font-bold text-5xl md:text-8xl tracking-wider drop-shadow-lg">
                        Berita
                    </h1>
                </div>
            </section>

            {/* 2. KONTEN DETAIL BERITA */}
            <section className="max-w-4xl mx-auto px-6 pt-16 pb-20">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">
                    {news.title}
                </h2>
                <div className="flex justify-center items-center text-gray-500 mb-10">
                    <FaCalendar className="mr-2" />
                    <span className="text-lg">{news.date}</span>
                </div>

                {/* Gambar Utama */}
                <div className="relative w-full h-96 mb-12 rounded-xl shadow-2xl overflow-hidden">
                    <Image
                        src={news.mainImage}
                        alt={news.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Paragraf Isi Berita */}
                <div className="text-gray-700 text-lg leading-relaxed">
                    {news.content.map((paragraf, index) => (
                        <p key={index} className="mb-6">{paragraf}</p>
                    ))}
                </div>
                
                {/* Tombol Kembali */}
                <Link
                    // Tautan Kembali ke Index Berita (Absolute Path)
                    href="/berita"
                    className="mt-16 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Kembali ke Semua Berita
                </Link>

            </section>

        </main>
    );
};

export default NewsDetailPage;