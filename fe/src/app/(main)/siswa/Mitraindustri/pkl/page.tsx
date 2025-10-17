'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { jobsAPI } from '@/app/services/api';

interface Job {
  id: string;
  title: string;
  description?: string;
  location?: string;
  companyName?: string;
  createdAt: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const ProgramPKLPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobsAPI.getAll();
        if (response.success) {
          setJobs(response.data);
        } else {
          setError("Failed to load job data");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load job data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const NAVBAR_OFFSET = "-mt-[6rem] md:-mt-[10rem]";

  return (
    <main className="w-full">
      <section className={`relative w-screen -mx-[calc(50vw-50%)] h-[40vh] md:h-[60vh] flex items-end overflow-hidden ${NAVBAR_OFFSET}`}>
        <Image
          src="/aboutbg.webp"
          alt="Latar Belakang Industri"
          fill
          className="object-cover brightness-[0.5] transition-transform duration-1000"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 w-full p-8 md:p-12">
          <motion.h1
            className="text-white font-bold text-5xl md:text-8xl tracking-wider drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PKL
          </motion.h1>
        </div>
      </section>

      <motion.section
        className="max-w-7xl mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-4"
          variants={itemVariants}
        >
          Program <span className="text-orange-600">PKL</span>
        </motion.h1>
        <motion.p
          className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          variants={itemVariants}
        >
          Kolaborasi SMK dan industri sangat penting untuk meningkatkan kompetensi siswa, mempersiapkan dunia kerja, dan membuka kesempatan magang maupun penyerapan tenaga kerja
        </motion.p>

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-8"
          variants={itemVariants}
        >
          Lowongan Magang Tersedia
          <span className="ml-2 text-orange-600 font-extrabold">{jobs.length} lowongan</span>
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.companyName || 'Perusahaan'}</p>
                <p className="text-sm text-gray-500 mb-4">{job.location || 'Lokasi tidak tersedia'}</p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {job.description || 'Deskripsi tidak tersedia'}
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  Diposting: {new Date(job.createdAt).toLocaleDateString('id-ID')}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div variants={itemVariants}>
          <Link
            href="/Mitraindustri"
            className="mt-16 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Kembali ke Daftar Industri
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default ProgramPKLPage;
