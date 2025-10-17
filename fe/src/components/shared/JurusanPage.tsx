import Link from 'next/link';
import { FaSchool, FaCode, FaTools, FaBuilding } from 'react-icons/fa';

interface JurusanPageProps {
    context: 'pengunjung' | 'siswa' | 'industri';
}

// Data subMenus (Tautan HREF diubah menjadi huruf kecil semua)
const subMenus = [
    { name: 'Rekayasa Perangkat Lunak', code: 'rpl', icon: FaCode, description: 'Fokus pada pemrograman, pengembangan web, dan gim.' },
    { name: 'Teknik Komputer & Jaringan', code: 'tkj', icon: FaTools, description: 'Spesialisasi dalam instalasi, konfigurasi, dan maintenance jaringan.' },
    { name: 'Sistem Informasi Jaringan & Aplikasi', code: 'sija', icon: FaCode, description: 'Menggabungkan keahlian jaringan dengan pengembangan aplikasi.' },
    { name: 'Teknik Pemesinan', code: 'tpm', icon: FaTools, description: 'Belajar proses produksi komponen mesin presisi.' },
    { name: 'Teknik Alat Berat', code: 'tab', icon: FaTools, description: 'Keahlian dalam perawatan dan perbaikan alat-alat berat industri.' },
    { name: 'Teknik Kendaraan Ringan', code: 'tkr', icon: FaTools, description: 'Perbaikan dan perawatan mobil penumpang dan kendaraan ringan.' },
    { name: 'Teknik Otomotif', code: 'oto', icon: FaTools, description: 'Keterampilan menyeluruh di bidang teknik otomotif.' },
    { name: 'Teknik Instalasi Tenaga Listrik', code: 'titl', icon: FaTools, description: 'Instalasi, perbaikan, dan pemeliharaan sistem kelistrikan.' },
    { name: 'Desain Pemodelan & Informasi Bangunan', code: 'dpib', icon: FaBuilding, description: 'Keterampilan desain arsitektur dan gambar teknik.' },
    { name: 'Kimia Industri & Jasa Inti', code: 'kjij', icon: FaSchool, description: 'Proses kimia dan pengawasan mutu dalam industri manufaktur.' },
];

const JurusanPage: React.FC<JurusanPageProps> = ({ context }) => {
    // Tentukan prefix berdasarkan context
    const prefix = context === 'pengunjung' ? '/pengunjung' : `/${context}`;

    return (
        <main className="max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-5xl mt-25 font-extrabold text-center text-gray-800 mb-4">
                Pilih <span className="text-orange-600">Kompetensi Keahlian</span>
            </h1>
            <p className="text-center text-lg text-gray-600 mb-12">
                SMK Kami menawarkan 10 Program Keahlian unggulan yang siap mencetak lulusan kompeten.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subMenus.map((jurusan) => {
                    const Icon = jurusan.icon;
                    return (
                        <Link
                            key={jurusan.code}
                            href={`${prefix}/jurusan/${jurusan.code}`}
                            className="group block bg-white rounded-xl shadow-xl p-6 border-t-8 border-orange-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <Icon className="text-4xl text-orange-600 mb-4 transition-transform group-hover:scale-110" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {jurusan.name} ({jurusan.code.toUpperCase()})
                            </h2>
                            <p className="text-sm text-gray-600">
                                {jurusan.description}
                            </p>
                            <span className="mt-3 inline-block text-orange-600 font-semibold text-sm group-hover:underline">
                                Lihat Detail &rarr;
                            </span>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
};

export default JurusanPage;
