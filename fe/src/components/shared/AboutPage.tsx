"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/pagination';

// --- IMPORT KOMPONEN TERPISAH (Sesuai struktur folder yang disarankan pengguna) ---
import VisiMisi from '@/app/(main)/about/Visi-Misi/page';
import ProfilSekolahContent from '@/app/(main)/about/Tentang-Sekolah/page';
import ProgramSekolah from '@/app/(main)/about/program-unggulan/page';
import KegiatanSekolah from '@/app/(main)/about/galeri-siswa/page';
import Ekstrakurikuler from '@/app/(main)/about/ekstra/page';
import FasilitasSekolah from '@/app/(main)/about/denah-Fasilitas/page';
import PrestasiGrid from '@/app/(main)/about/prestasi-siswa/page';

interface AboutPageProps {
    context: 'pengunjung' | 'siswa' | 'industri';
}

const AboutPage: React.FC<AboutPageProps> = ({ context }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 7;

    // ***********************************************
    // PERBAIKAN: Efek samping untuk melakukan auto-scroll
    // ***********************************************
    useEffect(() => {
        // Scroll ke bagian atas jendela (top: 0) dengan efek halus (smooth)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]); // Dependency array: efek ini hanya berjalan saat 'currentPage' berubah
    // ***********************************************

    // Fungsi untuk menentukan Judul Hero berdasarkan halaman
    const getHeroTitle = (page: number) => {
        switch (page) {
            case 1: return 'Visi dan Misi';
            case 2: return 'Profile Sekolah';
            case 3: return 'Program Unggulan';
            case 4: return 'Prestasi Siswa';
            case 5: return 'Ekstrakurikuler';
            case 6: return 'Denah dan Fasilitas';
            case 7: return 'Prestasi Siswa';
            default: return 'Profile Sekolah';
        }
    };

    const renderContent = () => {
        switch (currentPage) {
            case 1:
                return <VisiMisi />;

            case 2:
                return <ProfilSekolahContent />;

            case 3:
                return <ProgramSekolah />;

            case 4:
                // Catatan: Anda menggunakan KegiatanSekolah di page 4 dan PrestasiGrid di page 7.
                // Saya mempertahankan struktur asli Anda.
                return (
                    <div className="py-12 max-w-7xl mx-auto">
                        <KegiatanSekolah />
                    </div>
                );

            case 5:
                return <Ekstrakurikuler />;

            case 6:
                return <FasilitasSekolah />;

            case 7:
                return (
                    <PrestasiGrid />
                );

            default:
                return (
                    <div className="px-4 py-12 max-w-5xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl text-gray-700 font-bold mb-4">Konten Tidak Tersedia</h2>
                        <p className="text-lg text-gray-500">
                            Silakan gunakan navigasi paginasi di bawah untuk melihat subhalaman.
                        </p>
                    </div>
                );
        }
    };

    // --- KODE UTAMA DENGAN HERO DAN PAGINASI ---

    return (
        <div className="w-full">

            {/* Konten (tergantung currentPage) - Menggunakan Komponen Terpisah */}
            {renderContent()}

            {/* Footer / Pagination Section */}
            <section className=" bg-yellow-50 border-t border-yellow-200">
                <div className="max-w-6xl mx-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
