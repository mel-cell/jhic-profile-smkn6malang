"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGraduationCap, FaBrain, FaLeaf, FaAppleAlt, FaGlobe, FaTachometerAlt } from "react-icons/fa"; // Menambah FaGlobe dan FaTachometerAlt untuk visual

const ProgramSekolah = () => {
    const [activeProgram, setActiveProgram] = useState("KJIJ");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Kelas untuk animasi fade-in (CSS Murni - Tailwind)
    const heroTransitionClass = `transition-all duration-1000 ease-out transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`;
    const contentTransitionClass = (delay: number) => 
        `transition-all duration-1000 ease-out transform delay-${delay} ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`;
    
    // Transisi untuk konten KJIJ/SIJA saat berganti
    const tabContentTransition = (program: string) => 
        `transition-all duration-500 ease-in-out ${
            activeProgram === program ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute w-full top-0 left-0'
        }`;
        
    const isKJIJActive = activeProgram === "KJIJ";

    return (
        <div className="w-full">
            {/* 1. HERO SECTION (DIPERINDAH & ANIMASI) */}
            <section className={`relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${heroTransitionClass}`}>
                <Image
                    // Menggunakan gambar Program unggulan.jpg
                    src="/aboutbg.webp" 
                    alt="Program Unggulan Background"
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
                >Program Unggulan</h1>
            </section>

            {/* 2. PROGRAM CONTENT */}
            <div className="px-4 py-16 space-y-16 max-w-6xl mx-auto">
                
                {/* Ausbildung Card */}
                <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-l-8 border-orange-600 transition-all duration-300 hover:shadow-orange-400/50 transform hover:scale-[1.01] ${contentTransitionClass(300)}`}>
                    
                    <div className="order-1 flex-shrink-0">
                        <div className="bg-orange-50 rounded-2xl p-3 shadow-lg">
                            <FaGlobe size={60} className="text-orange-600"/>
                        </div>
                    </div>
                    
                    <div className="flex-1 order-2 md:order-3">
                        <h2 className="text-orange-600 text-3xl font-bold mb-4 border-b-2 border-orange-100 pb-2">
                            Ausbildung (Vokasi ke Jerman)
                        </h2>
                        <p className="text-lg text-gray-800 leading-relaxed">
                            SMK Negeri 6 Malang memiliki program kerjasama internasional{" "}
                            <span className="font-extrabold text-blue-800">Ausbildung</span> ke Jerman.
                            Program intensif ini memberikan kesempatan bagi lulusan untuk mendapatkan **pendidikan vokasi ganda**,
                            bekerja di Eropa, dan mendapatkan penghasilan yang kompetitif.
                        </p>
                    </div>

                    <Image
                        // Menggunakan Program unggulan.jpg sebagai placeholder
                        src="/program/ausbildung.webp" 
                        alt="Ausbildung"
                        width={300}
                        height={200}
                        className="rounded-xl shadow-xl border-2 border-gray-100 order-3 md:order-2 object-cover"
                        sizes="(max-width: 768px) 90vw, 30vw"
                    />
                </div>

                {/* PROGRAM 4 TAHUN CARD */}
                <div className={`bg-gray-50 rounded-3xl shadow-2xl p-8 md:p-12 border-r-8 border-blue-600 transition-all duration-300 hover:shadow-blue-400/50 transform hover:scale-[1.01] ${contentTransitionClass(500)}`}>
                    <h2 className="text-blue-800 text-3xl font-black text-center mb-8">
                        Program Pendidikan 4 Tahun (Setara D3)
                    </h2>

                    {/* Toggle Button */}
                    <div className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => setActiveProgram("KJIJ")}
                            className={`px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-md ${
                                isKJIJActive
                                    ? "bg-orange-600 text-white shadow-orange-500/50"
                                    : "bg-white text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            KJIJ
                        </button>
                        <button
                            onClick={() => setActiveProgram("SIJA")}
                            className={`px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-md ${
                                !isKJIJActive
                                    ? "bg-blue-600 text-white shadow-blue-500/50"
                                    : "bg-white text-gray-700 hover:bg-blue-50"
                            }`}
                        >
                            SIJA
                        </button>
                    </div>

                    {/* Konten KJIJ / SIJA Container */}
                    <div className="relative min-h-[250px] md:min-h-[200px]">
                        {/* KJIJ Content */}
                        <div className={tabContentTransition("KJIJ")}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-orange-600 font-extrabold text-2xl mb-2 flex items-center gap-2">
                                        <FaTachometerAlt className="text-xl"/> Konstruksi Jalan, Irigasi, dan Jembatan
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Kompetensi keahlian ini membekali siswa dalam perencanaan,
                                        pelaksanaan, serta pengawasan pembangunan **infrastruktur sipil**
                                        seperti jalan, irigasi, dan jembatan. Lulusan dipersiapkan menjadi
                                        tenaga ahli madya (setara D3) yang siap terjun ke proyek konstruksi nasional.
                                    </p>
                                    <div className="flex items-center gap-3 bg-orange-100 p-3 rounded-lg border-l-4 border-orange-500">
                                        <FaGraduationCap className="text-orange-600 text-3xl" />
                                        <div>
                                            <p className="font-bold text-base text-gray-800">Lulus setara D3</p>
                                            <p className="text-sm text-gray-600">Siswa dibekali keahlian teknis konstruksi dan manajemen proyek yang diakui industri selama 4 tahun.</p>
                                        </div>
                                    </div>
                                </div>
                                <Image
                                    src="/program/jurusan.webp" // Placeholder gambar KJIJ
                                    alt="KJIJ"
                                    width={250}
                                    height={180}
                                    className="rounded-xl shadow-lg flex-shrink-0"
                                />
                            </div>
                        </div>

                        {/* SIJA Content */}
                        <div className={tabContentTransition("SIJA")}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-blue-600 font-extrabold text-2xl mb-2 flex items-center gap-2">
                                        <FaTachometerAlt className="text-xl"/> Sistem Informasi, Jaringan, dan Aplikasi
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Kompetensi ini fokus pada pengembangan {" "}
                                        <span className="font-extrabold text-blue-800">IT modern (Jaringan & Coding)</span>.
                                        Siswa dibekali keterampilan IT mulai dari *network engineering*, *cloud computing*,
                                        hingga pengembangan aplikasi sesuai kebutuhan industri digital dan revolusi 4.0.
                                    </p>
                                    <div className="flex items-center gap-3 bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500">
                                        <FaGraduationCap className="text-blue-600 text-3xl" />
                                        <div>
                                            <p className="font-bold text-base text-gray-800">Lulus setara D3</p>
                                            <p className="text-sm text-gray-600">Siswa SIJA dipersiapkan untuk karir di dunia teknologi maupun melanjutkan ke perguruan tinggi selama 4 tahun.</p>
                                        </div>
                                    </div>
                                </div>
                                <Image
                                    src="/program/jurusan.webp" // Placeholder gambar SIJA
                                    alt="SIJA"
                                    width={250}
                                    height={180}
                                    className="rounded-xl shadow-lg flex-shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* GSS Card */}
                <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-l-8 border-green-600 transition-all duration-300 hover:shadow-green-400/50 transform hover:scale-[1.01] ${contentTransitionClass(700)}`}>
                    
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                        <h2 className="text-green-700 text-3xl font-black mb-4 border-b-2 border-green-100 pb-2 flex items-center gap-2">
                            <FaLeaf className="text-2xl"/> Gerakan Sekolah Sehat (GSS)
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            Program <span className="font-extrabold text-green-700">GSS</span> dilaksanakan
                            untuk membentuk lingkungan belajar yang sehat, nyaman, dan
                            mendukung perkembangan siswa secara optimal. Fokus pada Trias UKS yang dimodernisasi.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Card Sehat Mental */}
                            <div className="p-4 bg-green-50 rounded-lg shadow-sm border-t-2 border-green-500">
                                <FaBrain className="text-green-600 text-2xl mb-2" />
                                <p className="font-semibold text-sm text-green-700">Sehat Mental</p>
                                <p className="text-xs text-gray-600">Pendampingan konseling & awareness kesehatan mental.</p>
                            </div>
                            {/* Card Makan Sehat */}
                            <div className="p-4 bg-green-50 rounded-lg shadow-sm border-t-2 border-green-500">
                                <FaAppleAlt className="text-green-600 text-2xl mb-2" />
                                <p className="font-semibold text-sm text-green-700">Makan Sehat</p>
                                <p className="text-xs text-gray-600">Edukasi dan pembiasaan pola makan bergizi.</p>
                            </div>
                            {/* Card Lingkungan Sehat */}
                            <div className="p-4 bg-green-50 rounded-lg shadow-sm border-t-2 border-green-500">
                                <FaLeaf className="text-green-600 text-2xl mb-2" />
                                <p className="font-semibold text-sm text-green-700">Lingkungan Sehat</p>
                                <p className="text-xs text-gray-600">Budaya menjaga kebersihan dan kelestarian sekolah (Adiwiyata).</p>
                            </div>
                        </div>
                    </div>
                    <Image
                        src="/program/gss.webp" // Placeholder gambar GSS
                        alt="Healthy Life"
                        width={280}
                        height={200}
                        className="rounded-xl shadow-xl flex-shrink-0 order-1 md:order-2 object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProgramSekolah;