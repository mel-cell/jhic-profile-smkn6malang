"use client";
import Image from "next/image";
// Import icon untuk memperindah daftar fasilitas
import { FaGraduationCap, FaTools, FaBook, FaWifi, FaTree, FaClipboardList, FaMapMarkedAlt } from "react-icons/fa";

const FasilitasSekolah = () => {
    // Asumsi tinggi Navbar adalah 6rem
    const NAVBAR_HEIGHT_NEG = "-mt-[6rem]";
    
    // Data list fasilitas detail
    const fasilitasList = [
        {
            title: "Bengkel Praktik (Otomotif & Industri)",
            description: "Tempat praktik siswa jurusan teknik otomotif dan industri dengan peralatan lengkap berstandar DUDI untuk simulasi perawatan dan perbaikan.",
            icon: FaTools,
            image: "/denah/bengkel.webp"
        },
        {
            title: "Laboratorium (Komputer & Bahasa)",
            description: "Lab modern untuk praktik TIK, pemrograman, multimedia, dan pengembangan kemampuan berbahasa asing (Jepang, Jerman, Mandarin).",
            icon: FaClipboardList,
            image: "/denah/laboratorium.webp"
        },
        {
            title: "Perpustakaan Digital",
            description: "Menyediakan koleksi buku cetak, referensi digital, dan area baca yang nyaman untuk menambah wawasan siswa di berbagai bidang ilmu.",
            icon: FaBook,
            image: "/denah/perpustakaan.webp"
        },
        {
            title: "Ruang Kelas Modern",
            description: "Ruang kelas yang nyaman, ber-AC, dilengkapi LCD proyektor, dan kursi ergonomis, serta mendukung pembelajaran hybrid.",
            icon: FaGraduationCap,
            image: "/denah/kelas.webp"
        },
        {
            title: "Area Hijau dan Kantin Sehat",
            description: "Lingkungan sekolah dilengkapi area hijau yang asri dan kantin yang menyediakan makanan sehat untuk kenyamanan siswa.",
            icon: FaTree,
            image: "/denah/area_hijau.webp"
        },
        {
            title: "Akses Internet & Wi-Fi",
            description: "Akses internet kecepatan tinggi (Wi-Fi) tersedia di seluruh area sekolah untuk menunjang kegiatan belajar berbasis teknologi.",
            icon: FaWifi,
            image: "/denah/wifi.webp"
        },
    ];

    return (
        <main className="w-full">
            {/* 1. HERO SECTION (FULL WIDTH & TINGGI) */}
            <section className={`relative
                // Full-width trick
                w-screen -mx-[calc(50vw-50%)]
                
                // Ketinggian: 40% (mobile) hingga 60% (desktop) tinggi layar
                h-[40vh] md:h-[60vh]
                
                flex items-center justify-center overflow-hidden
                ${NAVBAR_HEIGHT_NEG} // Margin atas negatif
            `}>
                <Image
                    // Menggunakan gambar yang sesuai dengan file yang diupload
                    src="/aboutbg.webp"
                    alt="Denah dan Fasilitas Sekolah"
                    fill
                    className="object-cover brightness-[0.55] transition-transform duration-1000"
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
                >Denah & Fasilitas</h1>
            </section>

            {/* 2. FASILITAS SEKOLAH KAMI - INTRO */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
                {/* Gambar Kiri */}
                <div className="order-2 md:order-1">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                        <Image
                            src="/denah/fasilitas.webp"
                            alt="Fasilitas SMKN 6 Malang"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
                {/* Deskripsi Kanan */}
                <div className="order-1 md:order-2">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                        <span className="text-orange-600">Fasilitas</span> Sekolah Kami
                    </h2>
                    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                        SMK Negeri 6 Malang menyediakan various fasilitas lengkap yang mendukung proses
                        pembelajaran berbasis kompetensi keahlian, mulai dari bengkel praktik
                        modern, laboratorium teknologi, hingga sarana penunjang kenyamanan siswa.
                    </p>
                    <p className="text-md text-gray-600 border-l-4 border-orange-500 pl-3 italic">
                        Kami berkomitmen memberikan pengalaman belajar terbaik dengan lingkungan
                        yang nyaman dan teknologi yang up-to-date.
                    </p>
                </div>
            </section>

            {/* 3. GRID FASILITAS DETAIL */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h3 className="text-center text-4xl font-extrabold text-gray-800 mb-10">
                    Detail <span className="text-orange-600">Sarana Prasarana</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {fasilitasList.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-xl p-5 border-t-4 border-orange-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className="text-2xl text-orange-600" />
                                    <h4 className="text-gray-900 font-bold text-xl">
                                        {item.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>
            
            {/* 4. DENAH LOKASI SEKOLAH */}
            <section className="bg-gray-50 max-w-7xl mx-auto px-6 py-16 rounded-3xl mb-12 shadow-inner">
                <h3 className="text-center text-4xl font-extrabold text-gray-800 mb-10">
                    <FaMapMarkedAlt className="inline-block text-orange-600 mr-3 text-3xl" />
                    Denah Lokasi Sekolah
                </h3>

                <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                        // Menggunakan gambar denah yang diupload atau placeholder denah
                        src="/denah dan fasilitas.jpg"
                        alt="Denah dan Peta Lokasi SMKN 6 Malang"
                        fill
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
                        <p className="text-white text-xl font-semibold p-4 bg-orange-600/80 rounded-lg">
                            Peta Denah Sekolah (Ganti dengan Peta/Sketsa Denah Sekolah Anda)
                        </p>
                    </div>
                </div>
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Denah lokasi SMKN 6 Malang dapat diakses melalui tautan di bawah ini.
                </p>
            </section>

        </main>
    );
};

export default FasilitasSekolah;