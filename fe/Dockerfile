# Stage 1: Install dependencies and build the project
# Ubah base image dari 'oven/bun' menjadi 'node:20-alpine' (Node.js LTS yang ringan)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json dan package-lock.json
# PENTING: Jika Anda menggunakan package-lock.json (standar NPM), masukkan file tersebut.
# Jika Anda menggunakan npm, pastikan tidak ada bun.lockb di direktori Anda saat ini.
COPY package.json package-lock.json ./

# Instal semua dependensi menggunakan NPM
RUN npm install

# Copy sisa kode aplikasi
COPY . .

# Build Next.js application menggunakan NPM
RUN npm run build

# --- Stage 2: Server/Runtime Image (Menggunakan NGINX/Alpine untuk Static File) ---

# Karena Anda menggunakan 'output: export', hasilnya adalah file statis (HTML/CSS/JS).
# Image NGINX adalah yang terbaik untuk melayani file statis, bukan Node.js runtime.
FROM nginx:alpine

# Hapus konfigurasi NGINX default
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy konfigurasi NGINX kustom (Opsional, jika ada)
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 

# Copy hasil build statis (folder 'out' dari next build --export) ke root NGINX
# Jika distDir Anda di next.config.ts adalah 'out', ini sudah benar.
COPY --from=builder /app/out /usr/share/nginx/html

# Port default NGINX
EXPOSE 80

# Jalankan NGINX
CMD ["nginx", "-g", "daemon off;"]