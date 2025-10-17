"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    FaRunning, FaCode, FaPaintBrush, FaMicrophone, FaBook,
    FaLeaf, FaPray, FaUsers, FaChild, FaGlobe, FaBrain
} from "react-icons/fa";
import { extracurricularAPI } from '@/app/services/api';

interface Extracurricular {
    id: string;
    namaEkskul: string;
    deskripsi?: string;
    kategori?: string;
    status?: string;
}

export default function Ekstrakurikuler() {
    const [ekstrakurikulerData, setEkstrakurikulerData] = useState<Extracurricular[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeEkskul, setActiveEkskul] = useState<Extracurricular | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchEkstrakurikuler = async () => {
            try {
                setLoading(true);
                const response = await extracurricularAPI.getAll();
                if (response.success) {
                    setEkstrakurikulerData(response.data);
                    if (response.data.length > 0) {
                        setActiveEkskul(response.data[0]);
                    }
                } else {
                    setError("Failed to load extracurricular data");
                }
            } catch (err) {
                console.error("Error fetching extracurricular data:", err);
                setError("Failed to load extracurricular data");
            } finally {
                setLoading(false);
            }
        };

        fetchEkstrakurikuler();
    }, []);

    const dataWithImages = ekstrakurikulerData.filter(item => item.namaEkskul); // Filter items that have names
    const activeData = activeEkskul || (dataWithImages.length > 0 ? dataWithImages[0] : null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const contentTransitionClass = (delay: number) => 
        `transition-all duration-700 ease-out transform delay-${delay} ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`;

    return (
        <div className="w-full">
            <section className={`relative 
                w-screen -mx-[calc(50vw-50%)] 
                h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden
                -mt-[6rem] 
                transition-all duration-1000 ease-out transform ${
                    isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                }
            `}>
                <Image
                    src="/aboutbg.webp" 
                    alt="Ekstrakurikuler Background"
                    fill
                    className="object-cover brightness-[0.55] transition-transform duration-[1500ms] ease-out" 
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
                >Ekstrakurikuler</h1>
            </section>

            <div className={`px-4 py-16 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 ${contentTransitionClass(300)}`}>
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="bg-gray-50 rounded-2xl shadow-xl p-6 md:sticky md:top-24 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Pilihan Kegiatan</h2>
                        {loading && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-8">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        {!loading && !error && ekstrakurikulerData.map((item, index) => {
                            const isActive = activeEkskul?.namaEkskul === item.namaEkskul;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveEkskul(item)}
                                    className={`w-full text-left py-3 px-3 my-1 rounded-lg transition-all duration-200 flex items-center gap-3
                                        ${isActive
                                            ? 'bg-orange-600 text-white shadow-md font-bold'
                                            : 'text-gray-700 hover:bg-gray-200 font-medium'
                                        }`}
                                >
                                    <FaUsers className={`text-lg ${isActive ? 'text-white' : 'text-orange-600'}`} />
                                    {item.namaEkskul}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="md:w-2/3 lg:w-3/4 bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                    {loading && (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-red-600 text-lg">{error}</p>
                        </div>
                    )}

                    {!loading && !error && activeData && (
                        <div key={activeData.namaEkskul} className="animate-fadeIn space-y-6">
                            <h2 className="text-4xl font-extrabold mb-4 text-orange-600">
                                {activeData.namaEkskul}
                            </h2>

                            <p className="text-lg text-gray-800 leading-relaxed border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-50">
                                {activeData.deskripsi || "Deskripsi tidak tersedia"}
                            </p>

                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Informasi Kegiatan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-800">Kategori</h4>
                                        <p className="text-gray-600">{activeData.kategori || "Tidak dikategorikan"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-800">Status</h4>
                                        <p className="text-gray-600">{activeData.status || "Aktif"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
