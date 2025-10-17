"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    FaRunning, FaCode, FaPaintBrush, FaMicrophone, FaBook, 
    FaLeaf, FaPray, FaUsers, FaChild, FaGlobe, FaBrain 
} from "react-icons/fa";

const ekstrakurikulerData = [
    { name: "Osis", icon: FaUsers, color: "bg-blue-600", description: "Organisasi Siswa Intra Sekolah yang melatih kepemimpinan, tanggung jawab, dan kemampuan mengelola kegiatan sekolah. Merupakan wadah resmi siswa untuk berorganisasi.", images: ["/ekstra/osis.webp", "/ekstra/osis2.webp"] },
    { name: "Pramuka", icon: FaChild, color: "bg-green-600", description: "Gerakan kepanduan yang fokus pada pembentukan karakter, kedisiplinan, kemandirian, dan keterampilan hidup di alam terbuka (scouting).", images: ["/ekstra/pramuka.webp"] },
    { name: "Eco Smart", icon: FaLeaf, color: "bg-yellow-600", description: "Kelompok lingkungan hidup yang berfokus pada pelestarian alam, daur ulang, dan menjadikan sekolah sebagai Adiwiyata (sekolah berwawasan lingkungan).", images: ["/ekstra/ecosmart.webp"] },
    { name: "Karya Ilmiah Remaja (KIR)", icon: FaBrain, color: "bg-red-600", description: "Wadah bagi siswa yang memiliki minat dalam penelitian, penulisan karya ilmiah, dan pengembangan inovasi di bidang sains dan teknologi.", images: ["/ekstra/kir.webp"] },
    { name: "Badan Dakwah Islam (BDI)", icon: FaPray, color: "bg-indigo-600", description: "Organisasi keagamaan yang berfokus pada pengembangan nilai-nilai spiritual, moral, dan kegiatan syiar Islam di lingkungan sekolah.", images: ["/ekstra/bdi.webp"] },
    { name: "Futsal", icon: FaRunning, color: "bg-orange-600", description: "Ekskul olahraga populer yang melatih kerjasama tim, kecepatan, dan teknik bermain sepak bola dalam lapangan indoor.", images: ["/ekstra/futsal.webp"] },
    { name: "Paskibra", icon: FaUsers, color: "bg-red-600", description: "Pasukan Pengibar Bendera Pusaka yang melatih kedisiplinan, baris-berbaris, mental, dan nasionalisme siswa.", images: ["/ekstra/paskibra.webp"] },
    { name: "Pencak silat", icon: FaRunning, color: "bg-black", description: "Seni bela diri tradisional Indonesia yang fokus pada pertahanan diri, kekuatan fisik, dan nilai-nilai budaya luhur.", images: ["/ekstra/silat.webp"] },
    { name: "Karate", icon: FaRunning, color: "bg-blue-800", description: "Ekskul bela diri modern yang mengajarkan teknik pukulan, tendangan, dan mentalitas disiplin tinggi.", images: ["/ekstra/karate.webp"] },
    { name: "Bola Voli", icon: FaRunning, color: "bg-teal-600", description: "Olahraga bola besar yang melatih kerjasama, teknik smash, passing, dan ketangkasan.", images: ["/ekstra/voli.webp"] },
    { name: "Catur", icon: FaBook, color: "bg-gray-800", description: "Ekskul yang mengasah kemampuan berpikir strategis, logis, dan mental yang tenang.", images: ["/ekstra/catur.webp"] },
    { name: "Bahasa Asing (Jepang, Jerman, Mandarin)", icon: FaGlobe, color: "bg-pink-600", description: "Program pengembangan kemampuan berbahasa asing untuk meningkatkan daya saing global siswa, terutama untuk program Ausbildung.", images: ["/ekstra/bahasa.webp"] },
    { name: "Badminton", icon: FaRunning, color: "bg-yellow-800", description: "Ekskul bulutangkis yang melatih kelincahan, kecepatan, dan teknik bermain shuttlecock.", images: ["/ekstra/badminton.webp"] },
    { name: "PK (Pusat Informasi Konseling Remaja)", icon: FaUsers, color: "bg-purple-600", description: "Wadah konsultasi dan informasi kesehatan reproduksi, perencanaan karir, dan masalah remaja lainnya.", images: ["/ekstra/pk.webp"] },
    { name: "Al banjari", icon: FaMicrophone, color: "bg-lime-600", description: "Seni musik Islami yang menggunakan rebana dan vokal untuk melantunkan sholawat.", images: ["/ekstra/albanjari.webp"] },
    { name: "Bahasa Inggris", icon: FaGlobe, color: "bg-cyan-600", description: "Ekskul yang meningkatkan kemampuan komunikasi, reading, dan writing dalam Bahasa Inggris.", images: ["/ekstra/inggris.webp"] },
    { name: "PMR", icon: FaChild, color: "bg-red-800", description: "Palang Merah Remaja, fokus pada kesehatan, pertolongan pertama, dan kegiatan sosial kemanusiaan.", images: ["/ekstra/pmr.webp"] },
    { name: "Sepak bola", icon: FaRunning, color: "bg-green-700", description: "Ekskul olahraga favorit yang melatih fisik, strategi, dan kerja sama tim di lapangan hijau.", images: ["/ekstra/sepakbola.webp"] },
    { name: "Seni musik dan vokal", icon: FaMicrophone, color: "bg-indigo-400", description: "Mengembangkan bakat siswa dalam bermain alat musik dan teknik vokal.", images: ["/ekstra/musik.webp"] },
    { name: "Bola basket", icon: FaRunning, color: "bg-orange-800", description: "Olahraga bola besar yang melatih koordinasi, teknik dribble, dan shoot.", images: ["/ekstra/basket.webp"] },
    { name: "Matematika", icon: FaBook, color: "bg-amber-600", description: "Kelompok studi yang fokus pada pendalaman dan aplikasi matematika, sering dipersiapkan untuk olimpiade.", images: ["/ekstra/matematika.webp"] },
    { name: "Seni Tari", icon: FaPaintBrush, color: "bg-fuchsia-600", description: "Ekskul yang melestarikan dan mengembangkan seni tari tradisional maupun modern.", images: ["/ekstra/tari.webp"] },
    { name: "Seni lukis dan patung", icon: FaPaintBrush, color: "bg-purple-800", description: "Mengasah kreativitas dan keterampilan siswa dalam menciptakan karya seni rupa dua dan tiga dimensi.", images: ["/ekstra/lukis.webp"] },
    { name: "Krida", icon: FaChild, color: "bg-gray-500", description: "Kegiatan yang bertujuan untuk meningkatkan kebugaran jasmani dan rohani melalui berbagai jenis permainan dan aktivitas fisik.", images: ["/ekstra/krida.webp"] },
    { name: "Rohis (Rohani Islam)", icon: FaPray, color: "bg-teal-800", description: "Serupa dengan BDI, fokus pada pengajian, kajian Islam, dan pembinaan karakter religius.", images: ["/ekstra/rohis.webp"] },
    { name: "Multimedia", icon: FaCode, color: "bg-sky-600", description: "Ekskul teknologi yang mengajarkan desain grafis, videografi, editing, dan produksi konten digital.", images: ["/ekstra/multimedia.webp"] }
];

export default function Ekstrakurikuler() {
    const [activeEkskul, setActiveEkskul] = useState(ekstrakurikulerData[0]);
    const [isMounted, setIsMounted] = useState(false);

    const dataWithImages = ekstrakurikulerData.filter(item => item.images.length > 0);
    const activeData = activeEkskul || dataWithImages[0];

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
                        {ekstrakurikulerData.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = activeEkskul?.name === item.name;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveEkskul(item)}
                                    className={`w-full text-left py-3 px-3 my-1 rounded-lg transition-all duration-200 flex items-center gap-3
                                        ${isActive 
                                            ? `${item.color.replace('bg-', 'bg-')} text-white shadow-md font-bold` 
                                            : 'text-gray-700 hover:bg-gray-200 font-medium'
                                        }`}
                                >
                                    <Icon className={`text-lg ${isActive ? 'text-white' : item.color.replace('bg-', 'text-')}`} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="md:w-2/3 lg:w-3/4 bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                    <div key={activeData.name} className="animate-fadeIn space-y-6">
                        <h2 className={`text-4xl font-extrabold mb-4 ${activeData.color.replace('bg-', 'text-')}`}>
                            {activeData.name}
                        </h2>
                        
                        <p className="text-lg text-gray-800 leading-relaxed border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-50">
                            {activeData.description}
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Galeri Kegiatan</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeData.images.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                                    <Image
                                        src={image}
                                        alt={`Foto ${activeData.name} ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <p className="text-white text-sm font-medium">{activeData.name} - {index + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
