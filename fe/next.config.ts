import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // api ini untuk menghubungkan ke backend
      {
        source: "/api/:path*",
        destination: "http://localhost:8089/:path*", // Ganti dengan URL backend Anda
      },

      // ini untuk route custom
      {
        source: "/home",
        destination: "/pengunjung", // contoh route custom
      },// route nya ke /pengunjung
      {
      source: "/about",
      destination: "/pengunjung/about", // biar bisa akses /about
    },
    {
      source: "/jurusan",
      destination: "/pengunjung/jurusan", // biar bisa akses /jurusan
    },
    {
      source: "/pendaftaran",
      destination: "/pengunjung/pendaftaran", // biar bisa akses /pendaftaran
    },

      // tambahkan rewrites lainnya sesuai kebutuhan
    ];
  }
};

export default nextConfig;
