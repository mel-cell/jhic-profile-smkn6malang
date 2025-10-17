// File: src/app/(main)/pengunjung/about/Tentang-Sekolah/page.tsx
"use client";
import Image from 'next/image';
import { Briefcase, GraduationCap, Store } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProfilSekolahContent = () => {
    // State untuk memicu animasi fade-in setelah komponen dimuat
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Kelas untuk animasi fade-in (CSS Murni - Tailwind)
    const heroTransitionClass = `transition-all duration-1000 ease-out transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`;
    // Staggered transition for main content
    const contentTransitionClass = (delay: number) => 
        `transition-all duration-1000 ease-out transform delay-${delay} ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`;

    return (
        <div className="w-full">
            {/* 1. HERO SECTION (MEMPERINDAH) */}
            <section className={`relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${heroTransitionClass}`}>
                <Image
                    // ❗ Menggunakan gambar gerbang sekolah yang konsisten
                    src="/aboutbg.webp" 
                    alt="Profile Sekolah Background"
                    fill
                    className="object-cover brightness-[0.55] scale-110 transition-transform duration-[1500ms] ease-out" 
                    priority
                    sizes="(max-width: 768px) 100vw, 100vw"
                />
                <h1 
                className="
                    absolute left-0 bottom-4 md:bottom-8 lg:bottom-12 
                    ml-4 md:ml-8 lg:ml-12 
                    z-20 
                    text-white font-black 
                    text-4xl md:text-5xl lg:text-6xl 
                    tracking-wide drop-shadow-lg"
                >Profile Sekolah</h1>
            </section>
            
            <main className="py-16">
                {/* 2. SECTION TUJUAN DIDIRIKAN (ATRAKTIF & ANIMASI) */}
                <section className={`grid md:grid-cols-2 gap-10 p-6 max-w-6xl mx-auto ${contentTransitionClass(300)}`}>
                    
                    <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-orange-500/50 hover:shadow-2xl transition-shadow duration-300">
                        <Image
                            // ❗ Menggunakan gambar sekolah (seperti About us.jpg bagian dalam)
                            src="/tujuan.webp" 
                            alt="Gedung SMK Negeri 6 Malang"
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    
                    <div className="flex flex-col justify-center">
                        <h2 className="text-orange-600 font-extrabold text-3xl mb-4 pb-2 border-b-2 border-yellow-300">
                            Tujuan Didirikan
                        </h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            SMK Negeri 6 Malang didirikan pada tahun ajaran 2002/2003 melalui
                            Surat Keputusan Direktur Dikmenjur Depdiknas No. 1502/C5/PS/2002
                            tertanggal 5 Agustus 2002, sebagai hasil alih fungsi dari Balai
                            Latihan Pendidikan.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-orange-400">
                            Sekolah ini bertujuan menghasilkan lulusan yang **unggul**: memiliki
                            iman dan takwa, penguasaan ilmu dan teknologi, karakter yang baik,
                            kemampuan berwirausaha, kepedulian terhadap lingkungan, dan siap
                            bersaing di tingkat lokal maupun global.
                        </p>
                    </div>
                </section>

                <div className="border-t-2 border-orange-100 max-w-6xl mx-auto my-12" />

                {/* 3. SECTION PERKEMBANGAN (ATRAKTIF & ANIMASI) */}
                <section className={`grid md:grid-cols-2 gap-10 p-6 max-w-6xl mx-auto ${contentTransitionClass(500)}`}>
                    
                    <div className="order-2 md:order-1 flex flex-col justify-center">
                        <h2 className="text-orange-600 font-extrabold text-3xl mb-4 pb-2 border-b-2 border-yellow-300">
                            Perkembangan SMK Negeri 6 Malang
                        </h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            Sejak berdiri dengan dua program keahlian, SMKN 6 Malang terus
                            berkembang menambah kompetensi keahlian seperti Rekayasa Perangkat
                            Lunak, Teknik Ototronik, Teknik Alat Berat, hingga Teknik Komputer
                            dan Jaringan.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                            Sekolah telah meraih berbagai prestasi: <br />
                            Akreditasi A, <br />
                            sertifikasi mutu ISO 9001:2008, <br />
                            menjadi Sekolah Adiwiyata Nasional sejak 2009,<br />
                            serta berbagai penghargaan di bidang lingkungan hidup dan kompetisi siswa. <br />
                        </p>
                    </div>
                    
                    <div className="relative w-full h-[350px] md:h-[450px] order-1 md:order-2 rounded-2xl overflow-hidden shadow-xl border-4 border-yellow-500/50 hover:shadow-2xl transition-shadow duration-300">
                        <Image
                            // ❗ Menggunakan gambar kegiatan/siswa (seperti About us.jpg bagian kanan)
                            src="/perkembangan.webp" 
                            alt="Kegiatan Siswa"
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </section>

                {/* 4. SECTION KEUNGGULAN (ATRAKTIF & ANIMASI) */}
                <section className={`bg-orange-600/5 py-16 px-6 mt-12 ${contentTransitionClass(700)}`}>
                    <h3 className="text-center text-orange-600 font-black text-3xl mb-12">
                        Keunggulan Kompetitif di Bidang Vokasi
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        
                        {/* Card Bekerja */}
                        <div className="bg-white flex flex-col items-center justify-center p-8 h-64 rounded-3xl shadow-2xl border-b-8 border-orange-500 transition-all duration-300 hover:bg-orange-100 transform hover:-translate-y-1">
                            <Briefcase size={70} className="text-orange-600 mb-4" />
                            <p className="font-bold text-xl text-gray-800">Bekerja</p>
                            <p className="text-sm text-gray-500 mt-1 text-center">Siap diserap industri</p>
                        </div>

                        {/* Card Melanjutkan */}
                        <div className="bg-white flex flex-col items-center justify-center p-8 h-64 rounded-3xl shadow-2xl border-b-8 border-yellow-500 transition-all duration-300 hover:bg-yellow-100 transform hover:-translate-y-1">
                            <GraduationCap size={70} className="text-yellow-600 mb-4" />
                            <p className="font-bold text-xl text-gray-800">Melanjutkan</p>
                            <p className="text-sm text-gray-500 mt-1 text-center">Akses ke Perguruan Tinggi</p>
                        </div>

                        {/* Card Wirausaha */}
                        <div className="bg-white flex flex-col items-center justify-center p-8 h-64 rounded-3xl shadow-2xl border-b-8 border-orange-300 transition-all duration-300 hover:bg-orange-100 transform hover:-translate-y-1">
                            <Store size={70} className="text-orange-400 mb-4" />
                            <p className="font-bold text-xl text-gray-800">Wirausaha</p>
                            <p className="text-sm text-gray-500 mt-1 text-center">Menciptakan peluang usaha</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilSekolahContent;