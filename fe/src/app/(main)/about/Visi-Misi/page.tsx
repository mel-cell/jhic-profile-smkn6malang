// ❗ BARIS INI WAJIB ADA JIKA MENGGUNAKAN STATE ATAU ANIMASI
"use client"; 

import Image from 'next/image';
import { useState, useEffect } from 'react';

const VisiMisi = () => {
    // State untuk memicu animasi fade-in
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Kelas untuk animasi fade-in (CSS Murni - Tailwind)
    const heroTransitionClass = `transition-all duration-1000 ease-out transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`;
    const contentTransitionClass = `transition-all duration-1000 ease-out transform delay-300 ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`;

    return (
        <div className="w-full">
            {/* 1. HERO SECTION (MEMPERTAHANKAN BACKGROUND DAN JUDUL) */}
            <section className={`relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${heroTransitionClass}`}>
                <Image
                    // ❗ PASTIKAN PATH INI BENAR (relative terhadap folder /public)
                    src="/aboutbg.webp" 
                    alt="Visi & Misi Background"
                    fill
                    className="object-cover brightness-[0.6] scale-110 transition-transform duration-[1500ms] ease-out"
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
                >Visi dan Misi</h1>
            </section>

            {/* 2. KONTEN VISI DAN MISI (ATRAKTIF) */}
            <div className={`px-4 py-16 space-y-14 max-w-6xl mx-auto ${contentTransitionClass}`}>
                
                {/* VISI CARD */}
                <div className="bg-white rounded-3xl shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 border-l-8 border-orange-600 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start transform hover:scale-[1.01]">
                    <div className="mb-8 md:mb-0 md:mr-10 flex-shrink-0 order-1">
                        <div className="bg-yellow-50 rounded-full p-6 shadow-xl border-4 border-yellow-400">
                            <Image
                                src="/Light bulb.webp" 
                                alt="Visi Icon"
                                width={70}
                                height={70}
                            />
                        </div>
                    </div>

                    <div className="flex-1 order-2">
                        <h2 className="text-orange-600 text-3xl font-extrabold mb-4 pb-2 border-b-2 border-orange-100">
                            Visi Sekolah
                        </h2>
                        <p className="text-lg text-gray-800 leading-relaxed italic">
                            &ldquo;Terwujudnya lulusan yang **unggul dalam iman dan takwa**, menguasai **ilmu pengetahuan dan teknologi**, 
                            berkarakter, memiliki **jiwa wirausaha**, peduli terhadap lingkungan, **berbudaya industri**, 
                            serta siap bersaing di era digital.&rdquo;
                        </p>
                    </div>
                </div>

                {/* MISI SECTION */}
                <div className="bg-gray-50 rounded-3xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 border-r-8 border-yellow-500 p-8 md:p-12 transform hover:scale-[1.01]">
                    <h2 className="text-orange-600 text-3xl font-extrabold mb-8 text-center border-b-4 border-orange-300 inline-block px-8 pb-3 mx-auto w-full">
                        Misi Utama
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-start">
                        
                        <div className="mb-8 md:mb-0 md:mr-10 flex-shrink-0 hidden md:block">
                            <div className="bg-orange-50 rounded-full p-6 shadow-xl border-4 border-orange-400 mt-2">
                                <Image
                                    src="/Dart.webp"
                                    alt="Misi Icon"
                                    width={70}
                                    height={70}
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <ol className="list-decimal text-lg text-gray-800 pl-6 space-y-4 leading-relaxed marker:font-bold marker:text-orange-600">
                                <li>
                                    Menanamkan sikap religius, moral, dan kebangsaan sebagai **dasar pembentukan karakter siswa**.
                                </li>
                                <li>
                                    Melaksanakan pembelajaran berbasis **ilmu pengetahuan, teknologi, dan industri** sesuai dengan kompetensi keahlian.
                                </li>
                                <li>
                                    Mengembangkan minat, bakat, dan kepribadian siswa melalui **kegiatan pengembangan diri** yang berkesinambungan.
                                </li>
                                <li>
                                    Menumbuhkan **jiwa kewirausahaan** melalui pembelajaran dan praktik kerja industri.
                                </li>
                                <li>
                                    Meningkatkan kesadaran menjaga **kelestarian lingkungan** sejak dini.
                                </li>
                                <li>
                                    Melaksanakan Sistem **Penjaminan Mutu Internal (SPMI)** secara konsisten.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisiMisi;