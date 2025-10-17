// File: src/app/admin/lowongan-kerja/[id]/detail/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Briefcase, Mail, MapPin, DollarSign, 
    Users, Clock, User, Trash2, Edit2 
} from 'lucide-react';

// --- DATA DUMMY ---
const LOWONGAN_DETAIL = {
    id: 1,
    company: 'PT. Ballerina cappucina',
    location: 'JL. sound horog jaya no 18 malang',
    logo: '/logo-ballerina.png', // Placeholder logo
    jobTitle: 'Desainer UI/UX',
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis lacinia nibh. Curabitur cursus sem nec nunc ornare, et feugiat eros bibendum. Integer augue dui, vulputate ac tortor vitae, volutpat congue justo. Fusce at dignissim arcu. Cras in leo magna. Vivamus mattis a nunc sed auctor. Ut nec venenatis augue, et ullamcorper dui. \n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec non volutpat nunc, eget vehicula nunc.",
    
    // Informasi Lowongan
    field: 'Desain & Kreatif',
    jobType: 'Full Time & Part Time',
    remoteType: 'Remote / WFH',
    salary: '2.500.000 - 3.000.000',
    applicants: 30,
    gender: 'Laki - laki & Perempuan',
    
    // Kualifikasi
    qualifications: [
        'Laki-laki / perempuan',
        'Jurusan IT / Non IT (RPL dan Sija Di Utamakan)',
        'Menguasai tools desain seperti Figma, Adobe XD, atau Sketch',
        'Memahami prinsip User Interface dan User Experience (hierarki visual, konsistensi, usability)',
        'Mampu membuat wireframe, prototype, dan mockup yang interaktif',
        'Memiliki portofolio yang menunjukkan proyek desain UI/UX yang pernah dikerjakan',
    ],
};

// Data Pelamar (5 pelamar sesuai screenshot)
const PELAMAR_DATA = [
    { id: 1, name: 'Kim Sunoo', class: 'XII RPL 3', image: '/kim-sunoo-1.jpg' },
    { id: 2, name: 'Kim Sunoo', class: 'XII RPL 3', image: '/kim-sunoo-2.jpg' },
    { id: 3, name: 'Kim Sunoo', class: 'XII RPL 3', image: '/kim-sunoo-3.jpg' },
    { id: 4, name: 'Kim Sunoo', class: 'XII RPL 3', image: '/kim-sunoo-4.jpg' },
    { id: 5, name: 'Kim Sunoo', class: 'XII RPL 3', image: '/kim-sunoo-5.jpg' },
];

// --- KOMPONEN ITEM INFO (FIELD LOWONGAN) ---
const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col mb-4 w-1/3 min-w-[150px]">
        <div className="flex items-center text-sm font-semibold text-gray-500 mb-1">
            <Icon className="w-4 h-4 mr-1 text-blue-500" />
            {label}
        </div>
        <p className="text-gray-900 font-medium">{value}</p>
    </div>
);

// --- KOMPONEN KARTU PELAMAR ---
const PelamarCard = ({ data }) => (
    <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-sm">
        <div className="w-16 h-16 overflow-hidden rounded-full mb-2 border-2 border-gray-300">
            <img 
                src={data.image} 
                alt={data.name} 
                className="w-full h-full object-cover"
            />
        </div>
        <h4 className="text-sm font-bold text-gray-900 leading-tight">{data.name}</h4>
        <p className="text-xs text-gray-500 mb-3">{data.class}</p>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
            Lihat CV
        </button>
    </div>
);

// --- KOMPONEN UTAMA DETAIL LOWONGAN ---
const AdminDetailLowonganPage: React.FC = () => {
    const data = LOWONGAN_DETAIL; // Menggunakan data dummy

    return (
        <div className="p-8">
            <div className="flex items-center mb-8">
                {/* Link Kembali ke Daftar Lowongan */}
                <Link href="/admin/lowongan" className="text-xl font-bold text-gray-900 hover:text-blue-600 mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Detail lowongan</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Kolom Kiri (Deskripsi Utama & Pelamar) - 3/4 Lebar */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                        
                        {/* Header Perusahaan & Pekerjaan */}
                        <div className="flex items-start mb-6 border-b pb-4">
                            <div className="w-16 h-16 rounded-lg border flex-shrink-0 mr-4">
                                <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">{data.company}</h2>
                                <p className="text-sm text-gray-500 mb-3 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" /> {data.location}
                                </p>
                                <h1 className="text-4xl font-extrabold text-gray-900">{data.jobTitle}</h1>
                            </div>
                        </div>

                        {/* Deskripsi Lowongan */}
                        <div className="mb-8">
                            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{data.description}</p>
                        </div>

                        {/* Rincian Info Lowongan (Bidang, Tipe, Gaji, dll) */}
                        <div className="flex flex-wrap border-b pb-6 mb-6">
                            <InfoItem label="Bidang pekerjaan" value={data.field} icon={Briefcase} />
                            <InfoItem label="Jenis pekerjaan" value={data.jobType} icon={Clock} />
                            <InfoItem label="Tipe pekerjaan" value={data.remoteType} icon={MapPin} />
                            <InfoItem label="Jenis Kelamin" value={data.gender} icon={User} />
                            <InfoItem label="Gaji" value={data.salary} icon={DollarSign} />
                            <InfoItem label="Pelamar" value={`${data.applicants} orang`} icon={Users} />
                        </div>

                        {/* Kualifikasi */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Kualifikasi</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                {data.qualifications.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Tombol Aksi Admin */}
                        <div className="flex justify-start space-x-4 border-t pt-4">
                            <button
                                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4 mr-2" /> Edit lowongan
                            </button>
                            <button
                                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus lowongan
                            </button>
                        </div>
                    </div>
                    
                    {/* Daftar Pelamar */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pelamar ({PELAMAR_DATA.length})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {PELAMAR_DATA.map(pelamar => (
                                <PelamarCard key={pelamar.id} data={pelamar} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan (Lowongan Lain / Info Tambahan) - 1/4 Lebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Lowongan Lain</h3>
                        {/* Simulasi Card Lowongan Lain */}
                        <div className="border-b pb-3 mb-3">
                            <p className="text-sm font-semibold text-gray-900">Front-end Junior</p>
                            <p className="text-xs text-gray-500">PT. Ballerina cappucina</p>
                            <span className="text-xs text-blue-500">Magang, Full Time</span>
                            <Link href="#" className="block mt-2 text-blue-500 text-sm hover:underline">Detail</Link>
                        </div>
                        <div className="border-b pb-3 mb-3">
                            <p className="text-sm font-semibold text-gray-900">Technical Writer</p>
                            <p className="text-xs text-gray-500">PT. Ballerina cappucina</p>
                            <span className="text-xs text-blue-500">Part Time</span>
                            <Link href="#" className="block mt-2 text-blue-500 text-sm hover:underline">Detail</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailLowonganPage;