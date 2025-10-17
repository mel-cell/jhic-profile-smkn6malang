// src/app/(main)/pengunjung/jurusan/[slug]/page.tsx
"use client"; 

import { FaArrowLeft, FaGraduationCap, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// Ubah import notFound dan tambahkan useParams
import { notFound, useParams } from 'next/navigation'; 
import Image from "next/image";
import Link from 'next/link';
import React, { useEffect } from 'react'; 
// Hapus import 'use' jika ada.

// Data Jurusan dipertahankan...
const allJurusanArray = [
    // ... (data jurusan yang sama) ...
    { slug: 'rpl', title: "Rekayasa Perangkat Lunak & Gim (RPL)", mainImage: "/denah/rpl.webp", competencies: ["Web Programing", "UI/UX Design", "Mobile Development", "Data Analyst"], description: ["Rekayasa Perangkat Lunak (RPL) fokus pada pengembangan aplikasi berbasis web dan mobile. Jurusan ini membekali siswa dengan kemampuan membuat, menguji, dan memelihara sistem perangkat lunak, termasuk perancangan database dan keamanan aplikasi. Lulusan RPL siap berkarir sebagai Junior Developer atau Freelancer.", "Kami berkomitmen memberikan pengalaman belajar terbaik dengan lingkungan yang nyaman dan teknologi yang up-to-date di bidang IT."], },
    { slug: 'tkj', title: "Teknik Komputer & Jaringan (TKJ)", mainImage: "/denah/tkj.webp", competencies: ["Sistem Operasi Jaringan", "Mikrotik & Cisco", "Server Administration"], description: ["Teknik Komputer & Jaringan (TKJ) mempelajari instalasi dan konfigurasi perangkat keras komputer, infrastruktur jaringan, hingga administrasi server. Siswa dilatih untuk merancang dan membangun jaringan skala kecil hingga menengah.", "Lulusan TKJ memiliki prospek kerja yang luas sebagai teknisi jaringan, administrator sistem, atau tenaga IT support."], },
    { slug: 'sija', title: "Sistem Informasi Jaringan & Aplikasi (SIJA)", mainImage: "/denah/sija.webp", competencies: ["Network Programming", "IoT", "Cloud Services"], description: ["SIJA menggabungkan keahlian jaringan komputer dengan pengembangan aplikasi dan sistem informasi, menciptakan lulusan yang mampu merancang dan mengimplementasikan solusi IT terpadu di era digital."], },
    { slug: 'tpm', title: "Teknik Pemesinan (TPM)", mainImage: "/denah/tpm.webp", competencies: ["Mesin Bubut", "CNC", "CAD/CAM"], description: ["TPM membekali siswa dengan keterampilan untuk mengoperasikan mesin-mesin industri, membuat komponen mesin presisi, serta menggunakan teknologi Computer Aided Manufacturing (CAM).."], },
    { slug: 'tab', title: "Teknik Alat Berat (TAB)", mainImage: "/denah/tab.webp", competencies: ["Hydraulic System", "Engine Overhaul", "Perawatan Alat Berat"], description: ["TAB melatih siswa untuk menjadi teknisi alat berat yang handal, fokus pada perawatan, perbaikan, dan diagnosis kerusakan pada sistem mesin dan hidrolik alat berat di sektor pertambangan atau konstruksi."], },
    { slug: 'tkr', title: "Teknik Kendaraan Ringan (TKR)", mainImage: "/denah/tkr.webp", competencies: ["Engine Repair", "Chassis & Power Train", "Electrical System"], description: ["TKR menyiapkan siswa dengan pengetahuan dan keterampilan dalam perawatan, perbaikan, dan pemeliharaan kendaraan bermotor roda empat, mencakup mesin, sasis, dan sistem kelistrikan."] },
    { slug: 'oto', title: "Teknik Otomotif (OTO)", mainImage: "/denah/oto.webp", competencies: ["General Otomotif", "Diagnosa Kerusakan", "Manajemen Bengkel"], description: ["OTO adalah keahlian umum yang mencakup seluruh aspek kendaraan bermotor, memberikan dasar yang kuat untuk karir di bidang perbengkelan, penjualan, dan layanan purnajual otomotif."] },
    { slug: 'titl', title: "Teknik Instalasi Tenaga Listrik (TITL)", mainImage: "/denah/titl.webp", competencies: ["Instalasi Penerangan", "Instalasi Tenaga", "PLC"], description: ["TITL melatih siswa untuk merancang dan menginstalasi sistem tenaga dan penerangan listrik di gedung, industri, dan perumahan, dengan fokus pada keselamatan dan efisiensi energi."], },
    { slug: 'dpib', title: "Desain Pemodelan & Informasi Bangunan (DPIB)", mainImage: "/denah/dpib.webp", competencies: ["Menggambar Teknik", "AutoCAD", "SketchUp"], description: ["DPIB mengajarkan siswa untuk membuat gambar teknik arsitektur dan konstruksi, pemodelan 3D bangunan, serta memahami spesifikasi material dan biaya proyek."], },
    { slug: 'kjij', title: "Kimia Industri & Jasa Inti (KJIJ)", mainImage: "/denah/kjij.webp", competencies: ["Analisis Kimia", "Quality Control", "Operasi Pabrik"], description: ["KJIJ membekali siswa dengan kemampuan untuk melakukan analisis kimia, mengoperasikan peralatan laboratorium, dan terlibat dalam proses produksi dan kontrol kualitas di industri kimia."], },
];

const allJurusanMap = allJurusanArray.reduce((map, item) => {
    map[item.slug] = item;
    return map;
}, {} as Record<string, typeof allJurusanArray[0]>);


interface JurusanPageProps {
    // Hapus params dari sini karena kita akan menggunakan hook useParams
    // params: { slug: string; }; 
    // Kita biarkan saja, tapi kita TIDAK akan menggunakannya. 
    params: {
        slug: string;
    };
}

// Hapus props params dari sini
const JurusanDetailPage = () => { 
    // ***********************************************
    // PERBAIKAN: Menggunakan useParams hook
    // ***********************************************
    const routerParams = useParams();
    const slug = routerParams.slug as string; // Ambil slug dari hook

    // ... KODE LOGIKA JURUSAN SAMA ...

    const jurusan = allJurusanMap[slug];
    const currentIndex = allJurusanArray.findIndex(j => j.slug === slug);
    
    const prevJurusan = currentIndex > 0 ? allJurusanArray[currentIndex - 1] : null;
    const nextJurusan = currentIndex < allJurusanArray.length - 1 ? allJurusanArray[currentIndex + 1] : null;

    useEffect(() => {
        // Efek auto-scroll tetap berfungsi
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    if (!jurusan) {
        notFound();
    }

    const NAVBAR_HEIGHT_NEG = "-mt-[6rem]"; 

    return (
        <main className="w-full">
            {/* 1. HERO SECTION (Tampilan header besar) */}
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
                        Jurusan
                    </h1>
                </div>
            </section>

            {/* 2. BACK BUTTON & INTRO JURUSAN */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <Link
                    href="/jurusan"
                    className="flex items-center text-orange-600 font-semibold mb-12 hover:text-orange-700 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Kembali ke Daftar Jurusan
                </Link>

                <div className="grid md:grid-cols-3 gap-10 items-start">
                    <div className="md:col-span-2">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{jurusan.title}</h2>
                        {jurusan.description.map((paragraf, index) => (
                            <p key={index} className="text-lg text-gray-700 mb-4">{paragraf}</p>
                        ))}
                    </div>
                    
                    <div className="md:col-span-1 flex justify-center md:justify-end">
                        <div className="relative w-full max-w-sm h-64 bg-gray-200 rounded-xl overflow-hidden shadow-xl">
                            <Image 
                                src={jurusan.mainImage} 
                                alt={`Denah ${jurusan.title}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. KOMPETENSI KEAHLIAN */}
            <section className="bg-gray-50 max-w-7xl mx-auto px-6 py-16 rounded-3xl mb-12 shadow-inner">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <FaGraduationCap className="mr-3 text-orange-600" />
                    Kompetensi Keahlian
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {jurusan.competencies.map((kompetensi, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
                            <p className="font-semibold text-gray-700">{kompetensi}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. NAVIGASI SEBELUMNYA/SELANJUTNYA */}
            <section className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center mb-12">
                {/* Tombol Sebelumnya */}
                {prevJurusan ? (
                    <Link
                        href={`/pengunjung/jurusan/${prevJurusan.slug}`}
                        className="flex items-center text-orange-600 hover:text-orange-800 transition-colors p-3 border border-orange-200 rounded-lg shadow-md"
                    >
                        <FaChevronLeft className="mr-2" />
                        <span className="text-sm font-semibold hidden sm:inline">Sebelumnya:</span> 
                        <span className="ml-1 font-bold text-base">{prevJurusan.slug.toUpperCase()}</span>
                    </Link>
                ) : (
                    <div className="w-[100px] sm:w-[200px] opacity-0"></div> 
                )}

                {/* Tombol Selanjutnya */}
                {nextJurusan ? (
                    <Link
                        href={`/pengunjung/jurusan/${nextJurusan.slug}`} 
                        className="flex items-center text-orange-600 hover:text-orange-800 transition-colors p-3 border border-orange-200 rounded-lg shadow-md ml-auto"
                    >
                        <span className="text-sm font-semibold hidden sm:inline">Selanjutnya:</span>
                        <span className="mr-1 font-bold text-base">{nextJurusan.slug.toUpperCase()}</span>
                        <FaChevronRight className="ml-2" />
                    </Link>
                ) : (
                    <div className="w-[100px] sm:w-[200px] opacity-0"></div> 
                )}
            </section>

        </main>
    );
};

export default JurusanDetailPage;