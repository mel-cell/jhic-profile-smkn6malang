"use client";

import Link from 'next/link';
import Image from 'next/image';

interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

const industryPartners: Company[] = [
  { 
    id: '1',
    name: 'Sekawan Media', 
    logo: '/logosekawan.webp', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.' 
  },
  { 
    id: '2',
    name: 'Honda', 
    logo: '/logohonda.webp', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.' 
  },
  { 
    id: '3',
    name: 'Konecranes', 
    logo: '/konecranes.webp', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.' 
  },
  { 
    id: '4',
    name: 'Venturo', 
    logo: '/venturo.webp', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.' 
  },
];

const IndustriIndexPage = () => {
  const NAVBAR_OFFSET = "-mt-[6rem] md:-mt-[10rem]";

  return (
    <main className="w-full">
      <section className={`relative w-screen -mx-[calc(50vw-50%)] h-[40vh] md:h-[60vh] flex items-end overflow-hidden ${NAVBAR_OFFSET}`}>
        <Image
          src="/aboutbg.webp"
          alt="Papan Nama Sekolah"
          fill
          className="object-cover brightness-[0.5] transition-transform duration-1000"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 w-full p-8 md:p-12">
          <h1 className="text-white font-bold text-5xl md:text-8xl tracking-wider drop-shadow-lg">
            Industri
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Kolaborasi SMK dan <span className="text-orange-600">Dunia Industri</span>
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          Kolaborasi SMK dan industri sangat penting untuk meningkatkan kompetensi siswa, mempersiapkan dunia kerja, dan membuka kesempatan magang maupun penyerapan tenaga kerja
        </p>

        <div className="flex flex-col gap-12">
          {industryPartners.map((company) => (
            <div key={company.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start pb-8 border-b last:border-b-0 border-gray-200">
              <div className="md:col-span-1 flex flex-col items-start">
                <div className="relative w-40 h-16 mb-4">
                  <Image
                    src={company.logo || '/logo.webp'}
                    alt={company.name}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <p className="text-gray-700 mb-4">{company.description || 'Deskripsi perusahaan belum tersedia.'}</p>
                <p className="text-gray-700">{company.description || 'Informasi lebih lanjut akan segera ditambahkan.'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-15 gap-6 flex flex-col md:flex-row justify-center items-center gap-6">
          <Link
            href="/industri/login"
            className="inline-block px-8 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg transition-colors duration-300 hover:bg-orange-700"
          >
            Bergabunglah Dengan Kami
          </Link>

          <Link
            href="/Mitraindustri/pkl"
            className="inline-block px-8 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg transition-colors duration-300 hover:bg-orange-700"
          >
            Lihat Program Magang &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
};

export default IndustriIndexPage;
