"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full h-16 md:h-20 lg:h-24 xl:h-28 bg-transparent">
        <div className="container mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="Logo Sekolah"
                width={50}
                height={50}
                className="object-contain w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16"
              />
            </Link>
          </div>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center bg-white rounded-full shadow-md px-4 md:px-6 lg:px-8 py-2 gap-3 md:gap-4 lg:gap-6">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Desktop Action Button */}
          <div className="hidden md:flex flex-shrink-0">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white shadow-lg overflow-y-auto">
            <nav className="px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item, idx) => (
                  <div key={item.name} className="border-b border-gray-100 pb-4">
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block text-gray-800 hover:text-red-600 font-medium text-lg py-2"
                    >
                      {item.name}
                    </Link>
                    {item.subMenus && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.subMenus.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeMobileMenu}
                            className="block text-gray-600 hover:text-red-600 text-base py-1"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Action Button */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                {context === "siswa" || context === "industri" ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("userRole");
                      window.location.href = "/";
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors text-base"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="" onClick={closeMobileMenu}>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors text-base">
                      Contact
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
