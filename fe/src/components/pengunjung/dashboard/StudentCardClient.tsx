// src/components/pengunjung/dashboard/StudentCardClient.tsx
'use client';

import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Definisikan tipe data props yang sama seperti di file page.tsx
interface StudentCardProps {
    name: string;
    status: 'Diterima' | 'Magang';
    major: string;
    class: string;
    image: string;
    location: string;
    startDate: string;
    // Tambahkan itemVariants sebagai prop, agar animasi dapat diatur dari parent
    variants: any; 
}

const StudentCardClient: React.FC<StudentCardProps> = ({ name, status, major, class: studentClass, image, location, startDate, variants }) => {
    const statusColor = status === 'Diterima' ? 'bg-green-500' : 'bg-orange-500';
    const statusText = status === 'Diterima' ? 'Diterima' : 'Magang';

    return (
        // Menggunakan motion.div untuk animasi
        <motion.div 
            className="bg-white rounded-lg shadow-xl p-4 relative overflow-hidden"
            variants={variants} // Menerima varian dari parent (ProgramPKLPage)
        >
            {/* Status Badge */}
            <div className={`absolute top-2 right-2 ${statusColor} text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow`}>
                @{statusText}
            </div>

            {/* Foto Profil */}
            <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                    <Image
                        src={image} 
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Detail */}
            <h3 className="text-lg font-bold text-center text-gray-900 mb-1 line-clamp-1">{name}</h3>
            
            <div className="flex justify-center items-center text-sm text-gray-600 mb-4">
                <FaGraduationCap className="mr-1 text-orange-600" />
                <span>{major.toUpperCase()} ({studentClass})</span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span className='line-clamp-2'>{location}</span>
                </div>
                <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span>{startDate}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentCardClient;