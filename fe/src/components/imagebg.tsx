"use client";

import Image from "next/image";

const ImageBg = ({ title }) => {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/bgweb.webp"
        alt={title || "Background Image"}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">
          {title || "Judul Default"}
        </h1>
      </div>
    </div>
  );
};

export default ImageBg;
