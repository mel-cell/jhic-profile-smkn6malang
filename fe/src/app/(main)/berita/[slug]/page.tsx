"use client";

import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { notFound } from 'next/navigation';
import Image from "next/image";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { newsAPI } from '@/app/services/api';

interface NewsDetail {
    id: string;
    judul: string;
    content: string;
    imagePath?: string;
    kategori?: string;
    createdAt: string;
}

const NewsDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string;

    const [news, setNews] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await newsAPI.getById(slug);
                if (response.success) {
                    setNews(response.data);
                } else {
                    setError("Failed to load news detail");
                }
            } catch (err) {
                console.error("Error fetching news detail:", err);
                setError("Failed to load news detail");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [slug]);

    if (loading) {
        return (
            <main className="w-full flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </main>
        );
    }

    if (error || !news) {
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
                    {news.judul}
                </h2>
                <div className="flex justify-center items-center text-gray-500 mb-10">
                    <FaCalendar className="mr-2" />
                    <span className="text-lg">{new Date(news.createdAt).toLocaleDateString('id-ID')}</span>
                </div>

                {/* Gambar Utama */}
                <div className="relative w-full h-96 mb-12 rounded-xl shadow-2xl overflow-hidden">
                    <Image
                        src={news.imagePath || '/news-detail.jpg'}
                        alt={news.judul}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Isi Berita */}
                <div className="text-gray-700 text-lg leading-relaxed">
                    <p className="mb-6">{news.content}</p>
                </div>

                {/* Tombol Kembali */}
                <Link
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
