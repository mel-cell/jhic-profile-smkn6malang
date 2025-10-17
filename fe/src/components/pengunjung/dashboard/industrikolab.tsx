import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LogoLoop from "@/components/LogoLoop";

interface Company {
  id: string;
  name: string;
  logo?: string;
}

const industryPartners = [
  {
    name: "Sekawan Media",
    logo: "/logosekawan.webp",
  },
  {
    name: "Honda",
    logo: "/logohonda.webp",
  },
  {
    name: "Konecranes",
    logo: "/konecranes.webp",
  },
  {
    name: "Venturo",
    logo: "/venturo.webp",
  },
    {
    name: "jhic",
    logo: "/4logojhic.webp",
  },
];

const logos = industryPartners.map(({ name, logo }) => ({
  src: logo,
  alt: name,
}));

const IndustriKolaborasi: React.FC = () => {
  const primaryOrange = "bg-orange-600 hover:bg-orange-700";

  return (
    <section className="w-full bg-white">
      <div className="py-16 container mx-auto px-6 text-center animate-fade-in-up delay-100">
        <h2 className="text-3xl font-bold text-orange-600 mb-12">
          Industri Kolaborasi
        </h2>

        <LogoLoop
          logos={logos}
          speed={50}
          direction="left"
          logoHeight={120}
          logoWidth={180}
          gap={40}
          pauseOnHover={true}
          scaleOnHover={false}
          ariaLabel="Industri Kolaborasi"
          className="py-8"
        />
      </div>

      <div className="py-20 md:py-32 text-center animate-fade-in-up delay-200">
        <div className="max-w-4xl mx-auto px-4">
          <h6
            className="
            text-3xl md:text-3xl
            font-extrabold text-orange-500
            mb-10
            tracking-wider
          "
          >
            BERGABUNG BERSAMA KAMI
          </h6>

          <Link href="/Pendaftaran" passHref>
            <button
              className={`
                ${primaryOrange} text-white font-bold
                px-12 py-5 rounded-full
                shadow-2xl shadow-orange-300/80
                transition duration-300
                transform hover:scale-[1.05] hover:shadow-orange-400/90
                flex items-center justify-center mx-auto
                text-xl  uppercase
                animate-fade-in-up delay-300
              `}
            >
              AYO DAFTAR SEKARANG
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustriKolaborasi;
