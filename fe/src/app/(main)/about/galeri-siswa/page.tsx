"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

const kegiatanList = [
    {
        title: 'Kegiatan P5 Aksata bergaya',
        date: '08 / 07 / 2025',
        image: '/kegiatan1.jpg',
    },
    {
        title: 'Upacara hari kemerdekaan RI',
        date: '17 / 08 / 2025',
        image: '/kegiatan2.jpg',
    },
    {
        title: 'Senam pagi bapak ibu guru & staf',
        date: '15 / 08 / 2025',
        image: '/kegiatan3.jpg',
    },
    {
        title: 'Persiapan pengambilan foto year book kelas 12',
        date: '20 / 05 / 2025',
        image: '/kegiatan4.jpg',
    },
];

export default function KegiatanSekolah() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const heroTransitionClass = `transition-all duration-1000 ease-out transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`;
    const contentTransitionClass = `transition-all duration-1000 ease-out transform delay-300 ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`;

    const KegiatanCard = ({ item, isLarge }) => (
        <div
            className={`relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer 
                        ${isLarge ? 'h-full' : 'h-[250px] sm:h-[300px]'} 
                        transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
        >
            <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={isLarge}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div
                className={`absolute bottom-0 left-0 right-0 text-white p-5 transition-transform duration-300 ${
                    isLarge ? 'p-6' : 'p-4'
                }`}
            >
                <h3 className={`font-extrabold mb-1 ${isLarge ? 'text-xl md:text-2xl' : 'text-lg'}`}>{item.title}</h3>
                <p className={`text-orange-400 ${isLarge ? 'text-sm md:text-base' : 'text-sm'}`}>{item.date}</p>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* 1. HERO SECTION (FULL WIDTH) */}
            <section
                className={`relative 
                w-screen -mx-[calc(50vw-50%)] 
                h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden
                ${heroTransitionClass}
                -mt-[6rem]
                `}
            >
                <Image
                    src="/aboutbg.webp"
                    alt="Galeri Kegiatan Sekolah"
                    fill
                    className="object-cover brightness-[0.40] scale-110 transition-transform duration-[1500ms] ease-out"
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
                >Galeri Siswa</h1>
            </section>

            {/* 2. PROGRAM CONTENT (GRID GALLERY) */}
            <div className={`px-4 py-16 max-w-7xl mx-auto ${contentTransitionClass}`}>
                <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-800 mb-12">
                    Momen Siswa Siswi SMK Negeri 6 Malang
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                    {/* Kolom 1 */}
                    <div className="md:row-span-2">
                        <KegiatanCard item={kegiatanList[0]} isLarge={true} />
                    </div>

                    {/* Kolom 2 */}
                    <div className="md:col-span-1">
                        <KegiatanCard item={kegiatanList[1]} isLarge={false} />
                    </div>

                    {/* Kolom 3 */}
                    <div className="md:col-span-1">
                        <KegiatanCard item={kegiatanList[2]} isLarge={false} />
                    </div>

                    {/* Kolom 4 */}
                    <div className="md:col-span-2">
                        <div
                            className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer 
                            h-[300px] md:h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                        >
                            <Image
                                src={kegiatanList[3].image}
                                alt={kegiatanList[3].title}
                                fill
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 66vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="absolute bottom-0 left-0 right-0 text-white p-6">
                                <h3 className="text-2xl font-extrabold mb-1">{kegiatanList[3].title}</h3>
                                <p className="text-base text-orange-400">{kegiatanList[3].date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
