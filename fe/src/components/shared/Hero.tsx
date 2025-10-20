// File: HeroSection.tsx

"use client";

import Image from "next/image";
import React from "react";

const HeroSection: React.FC = () => {
    return (
        <div className="relative w-full h-full z-10 pb-16 md:pb-34">
            {/* Background shapes (Dibiarkan tidak berubah) */}
            <div className="absolute top-[6%] left-[23%] w-[1500px] h-[920px] bg-[#0d99ff] transform -translate-x-1/2 -translate-y-1/2 rotate-[47deg] origin-center rounded-[132px_97px_438px_109px] z-0" />
            <div className="absolute top-[calc(10%-15px)] left-[calc(25%-15px)] w-[1530px] h-[950px] border-[3px] border-red-500 transform -translate-x-1/2 -translate-y-1/2 rotate-[47deg] origin-center rounded-[132px_97px_438px_109px] z-0" />
            <div
                className="absolute top-[67%] left-[36%] transform -translate-x-1/2 -translate-y-1/2 text-[400px] md:text-[800px] text-[#ffffff30] font-bold z-0 select-none"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
                6
            </div>
            <div className="absolute top-[21%] right-[2%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-[#f7bd00e6] opacity-40 rounded-full z-0" />
            <div className="absolute top-[24%] right-[2%] w-[350px] h-[350px] md:w-[650px] md:h-[650px] bg-[#f7bd00e6] rounded-full z-0" />

            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">

                    {/* TEXT/JUDUL SECTION - KEMBALIKAN KELAS ANIMASI */}
                    <div
                        className="
                            lg:w-1/2 text-white mb-12 lg:mb-0 pl-0 lg:pl-20 text-center lg:text-left
                            /* KELAS ANIMASI DIKEMBALIKAN */
                            animate-fade-in-up duration-1000 delay-300
                        "
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-[120px] font-bold leading-none">SMK</h1>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 md:mt-4 mb-6 md:mb-8">Negeri 6 Malang</h2>
                        <p className="text-base md:text-lg lg:text-xl max-w-[600px] mb-8 md:mb-12">
                            Sekolah Menengah Kejuruan yang menghasilkan lulusan siap kerja dengan
                            tingkat penyerapan industri tinggi dan kemitraan dengan perusahaan
                            terkemuka.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-[#FFC727] text-black px-6 md:px-8 py-3 rounded-full font-medium border-2 border-[#FFC727] hover:bg-transparent hover:text-black transition-colors duration-300 shadow-md">
                                Tentang kami
                            </button>
                            <button className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-full
                                font-medium hover:bg-white/20 hover:border-transparent transition-all duration-300">
                                Industri
                            </button>
                        </div>
                    </div>

                    {/* IMAGE SECTION - KEMBALIKAN KELAS ANIMASI */}
                    <div className="lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[750px] flex justify-end">
                        <div
                            className="
                                relative h-full w-full transform translate-x-[10%] md:translate-x-[25%] translate-y-[5%] md:translate-y-[10%]
                                /* KELAS ANIMASI DIKEMBALIKAN */
                                animate-scale-in duration-1000 delay-500
                            "
                        >
                            <Image
                                src="/image4.webp"
                                alt="Siswa SMK Negeri 6 Malang"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
