"use client";

import React from "react";
import Image from "next/image";
import {
  FaCheckSquare,
  FaCalendarAlt,
  FaUsers,
  FaGlobe,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";

const PPDBPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero */}

      <div className="px-4 pt-30 pb-12 max-w-6xl mx-auto space-y-16">
        {/* Info Section */}
        <div className="text-center space-y-6">
          <h1 className="text-orange-600 text-auto md:text-2xl font-bold">
            Informasi PPDB SMK Negeri 6 Malang
          </h1>
          <p className="text-gray-600">
            Penerimaan Peserta Didik Baru (PPDB) tahun ajaran 2025/2026
          </p>
          <div className="flex justify-center">
            <Image
              src="/pendaftaran/poster.webp"
              alt="SPMB Banner"
              width={600}
              height={500}
              className="rounded-xl shadow"
            />
          </div>
        </div>

        {/* Syarat Pendaftaran */}
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
          <Image
            src="/pendaftaran/cuate.webp"
            alt="Dokumen Pendaftaran"
            width={400}
            height={350}
            className="rounded-xl"
          />
          <div className="flex-1">
            <h3 className="text-orange-600 font-bold text-xl mb-4">
              Syarat Pendaftaran
            </h3>
            <ul className="space-y-2 text-gray-700">
              {[
                "Scan Kartu Keluarga",
                "Scan Akta Kelahiran",
                "Scan Raport SMP kelas 7–9",
                "Scan Ijazah / SKL",
                "Pas Foto Berwarna 3×4 (2 lembar)",
                "Surat Keterangan Sehat dari Puskesmas/Rumah Sakit",
                "Kartu NISN (Nomor Induk Siswa Nasional)",
                "Kartu Identitas Orang Tua/Wali (KTP)",
                "Kartu Program Bantuan (KIP/KKS/PKH) – opsional",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FaCheckSquare className="text-blue-600 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-orange-600 font-bold text-xl mb-6 text-center">
            Timeline PPDB SMK Negeri 6 Malang 2025
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 text-center">
            {[
              { icon: <FaCalendarAlt />, date: "19 – 31 Mei" },
              { icon: <FaUsers />, date: "2 – 13 Juni" },
              { icon: <FaClipboardList />, date: "2 – 14 Juni" },
              { icon: <FaFileAlt />, date: "9 – 11 Juni" },
              { icon: <FaGlobe />, date: "16 – 17 Juni" },
              { icon: <FaUsers />, date: "26 – 27 Juni" },
              { icon: <FaCalendarAlt />, date: "2 – 3 Juli" },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
              >
                <div className="text-3xl text-orange-500 mb-2">{step.icon}</div>
                <p className="font-semibold text-sm">{step.date}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Proses tahap {idx + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alur Pendaftaran */}
        <div className="text-center space-y-6">
          <h3 className="text-orange-600 font-bold text-xl">
            Alur Pendaftaran Online
          </h3>
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-600">
              Diagram alur akan diumumkan segera
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-orange-600 font-bold text-xl mb-4">FAQ</h3>
          <div className="space-y-4">
            <details className="bg-gray-50 border rounded p-4">
              <summary className="font-semibold cursor-pointer">
                Apakah PPDB diadakan secara online?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Ya, semua pendaftaran dilakukan secara online melalui website resmi SMK Negeri 6 Malang kecuali daftar ulang yang dilakukan offline.
              </p>
            </details>
            <details className="bg-gray-50 border rounded p-4">
              <summary className="font-semibold cursor-pointer">
                Kapan pengumuman kelulusan PPDB?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Pengumuman kelulusan biasanya pada minggu pertama setelah verifikasi berkas selesai.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PPDBPage; 