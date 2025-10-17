"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

const getNavItems = (context: string) => {
  const baseItems = [
    {
      name: "Beranda",
      href: context === "pengunjung" ? "/" : `/${context}`,
    },
    {
      name: "About Us",
      href: context === "pengunjung" ? "/about" : `/${context}/about`,
      subMenus: [
        {
          name: "Tentang Sekolah",
          href:
            context === "pengunjung"
              ? "/about/Tentang-Sekolah"
              : `/${context}/about/Tentang-Sekolah`,
        },
        {
          name: "Visi & Misi",
          href:
            context === "pengunjung"
              ? "/about/Visi-Misi"
              : `/${context}/about/Visi-Misi`,
        },
        {
          name: "Denah & Fasilitas",
          href:
            context === "pengunjung"
              ? "/about/denah-Fasilitas"
              : `/${context}/about/denah-Fasilitas`,
        },
        {
          name: "Program Unggulan",
          href:
            context === "pengunjung"
              ? "/about/program-unggulan"
              : `/${context}/about/program-unggulan`,
        },
        {
          name: "Ekstrakulikuler",
          href:
            context === "pengunjung"
              ? "/about/ekstra"
              : `/${context}/about/ekstra`,
        },
        {
          name: "Galeri Siswa",
          href:
            context === "pengunjung"
              ? "/about/galeri-siswa"
              : `/${context}/about/galeri-siswa`,
        },
        {
          name: "Prestasi Siswa",
          href:
            context === "pengunjung"
              ? "/about/prestasi-siswa"
              : `/${context}/about/prestasi-siswa`,
        },
      ],
    },
    {
      name: "Jurusan",
      href: context === "pengunjung" ? "/jurusan" : `/${context}/jurusan`,
      subMenus: [
        {
          name: "RPL",
          href:
            context === "pengunjung"
              ? "/jurusan/rpl"
              : `/${context}/jurusan/rpl`,
        },
        {
          name: "TKJ",
          href:
            context === "pengunjung"
              ? "/jurusan/tkj"
              : `/${context}/jurusan/tkj`,
        },
        {
          name: "SIJA",
          href:
            context === "pengunjung"
              ? "/jurusan/sija"
              : `/${context}/jurusan/sija`,
        },
        {
          name: "TPM",
          href:
            context === "pengunjung"
              ? "/jurusan/tpm"
              : `/${context}/jurusan/tpm`,
        },
        {
          name: "TAB",
          href:
            context === "pengunjung"
              ? "/jurusan/tab"
              : `/${context}/jurusan/tab`,
        },
        {
          name: "TKR",
          href:
            context === "pengunjung"
              ? "/jurusan/tkr"
              : `/${context}/jurusan/tkr`,
        },
        {
          name: "OTO",
          href:
            context === "pengunjung"
              ? "/jurusan/oto"
              : `/${context}/jurusan/oto`,
        },
        {
          name: "TITL",
          href:
            context === "pengunjung"
              ? "/jurusan/titl"
              : `/${context}/jurusan/titl`,
        },
        {
          name: "DPIB",
          href:
            context === "pengunjung"
              ? "/jurusan/dpib"
              : `/${context}/jurusan/dpib`,
        },
        {
          name: "KJIJ",
          href:
            context === "pengunjung"
              ? "/jurusan/kjij"
              : `/${context}/jurusan/kjij`,
        },
      ],
    },
  ];

  if (context === "pengunjung") {
    baseItems.push(
      { name: "Berita", href: "/berita" },
      { name: "MitraIndustri", href: "/Mitraindustri" },
      { name: "Pendaftaran", href: "/Pendaftaran" }
    );
  } else if (context === "siswa") {
    baseItems.push(
      { name: "Berita", href: "/siswa/berita" },
      { name: "MitraIndustri", href: "/siswa/Mitraindustri" },
      { name: "Lowongan", href: "/siswa/lowongan" },
      { name: "Profile", href: "/siswa/profile" }
    );
  } else if (context === "industri") {
    baseItems.push(
      { name: "Berita", href: "/berita" },
      { name: "CV Siswa", href: "/industri/cvSiswa" },
      { name: "Lowongan", href: "/industri/lowongan" },
      { name: "Profile", href: "/industri/profile" }
    );
  }

  return baseItems;
};

export default function Header() {
  const pathname = usePathname();
  const context = pathname.startsWith("/siswa")
    ? "siswa"
    : pathname.startsWith("/industri")
    ? "industri"
    : "pengunjung";
  const navItems = getNavItems(context);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (idx: number) => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
    setOpenMenu(idx);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 700);
  };

  return (
    <header className="fixed top-0 z-50 w-full h-20 md:h-24 lg:h-28 bg-transparent">
      <div className="container mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="Logo Sekolah"
              width={50}
              height={50}
              className="object-contain w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
            />
          </Link>
        </div>

        {/* Navigasi */}
        <nav className="hidden md:flex items-center bg-white rounded-full shadow-md px-4 md:px-6 lg:px-8 py-2 gap-4 md:gap-6">
          {navItems.map((item, idx) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className="text-black hover:text-red-600 font-medium px-2 py-1 text-sm md:text-base"
              >
                {item.name}
              </Link>
              {item.subMenus && openMenu === idx && (
                <div className="absolute left-0 mt-2 bg-white rounded shadow-lg min-w-[150px] z-10">
                  {item.subMenus.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-black hover:bg-red-100 text-sm"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Tombol Contact/Logout */}
        <div className="flex-shrink-0">
          {context === "siswa" || context === "industri" ? (
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                window.location.href = "/";
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          ) : (
            <Link href="">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm md:text-base">
                Contact
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
