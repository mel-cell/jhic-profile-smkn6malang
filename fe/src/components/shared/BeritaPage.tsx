"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { newsAPI } from '@/app/services/api';

interface BeritaPageProps {
    context: 'pengunjung' | 'siswa' | 'industri';
}

interface NewsItem {
    id: string;
    judul: string;
    content: string;
    imagePath?: string;
    kategori?: string;
    createdAt: string;
}

const BeritaPage: React.FC<BeritaPageProps> = ({ context }) => {
    // Tentukan prefix berdasarkan context
    const prefix = context === 'pengunjung' ? '/pengunjung' : `/${context}`;

    // Offset negatif untuk menaikkan konten di bawah Navbar/Hero
    const NAVBAR_OFFSET = "-mt-[6rem] md:-mt-[10rem]";

    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await newsAPI.getAll();
                if (response.success) {
                    setNewsItems(response.data);
                } else {
                    setError("Failed to load news");
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to load news");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <main className="w-full">

            {/* 1. HERO SECTION (Header Berita) */}
            <section className={`relative w-screen -mx-[calc(50vw-50%)] h-[40vh] md:h-[60vh] flex items-end overflow-hidden ${NAVBAR_OFFSET}`}>
                <Image
                    src="/aboutbg.webp" // Ganti dengan gambar hero Berita yang sesuai
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

            {/* 2. BERITA TERBARU & SEARCH */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                    Berita <span className="text-orange-600">Terbaru</span>
                </h2>

                {/* Input Pencarian */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            className="w-full p-3 pl-12 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Grid Berita */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                {/* Gambar */}
                                <div className="relative w-full h-48">
                                    <Image
                                        src={item.imagePath || '/news-dummy-1.jpg'}
                                        alt={item.judul}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Konten */}
                                <div className="p-6">
                                    <div className="text-sm font-medium text-orange-600 mb-2">{item.kategori || 'Berita'}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                        {item.judul}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {item.content}
                                    </p>

                                    <div className="flex items-center text-xs text-gray-400 mb-4">
                                        <FaCalendar className="mr-1" />
                                        <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                                    </div>

                                    <Link
                                        href={`${prefix}/berita/${item.id}`}
                                        className="text-orange-600 font-semibold text-sm hover:underline flex items-center"
                                    >
                                        Baca Selengkapnya &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tombol Paginasi (Contoh) */}
                <div className="flex justify-center mt-16">
                    <button className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:bg-orange-700 transition-colors">
                        Lihat Lebih Banyak
                    </button>
                </div>
            </section>
        </main>
    );
};

export default BeritaPage;
