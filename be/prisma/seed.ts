import * as bcrypt from 'bcryptjs'
import prisma from '../src/config/database'

async function main() {
  // Hash password for seeding (same password for all test users)
  const hashedPassword = await bcrypt.hash('123567890', 10)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create student user
  const studentUser = await prisma.user.upsert({
    where: { email: 'siswa@siswa.com' },
    update: {
      password: hashedPassword,
      role: 'STUDENT',
    },
    create: {
      email: 'siswa@siswa.com',
      password: hashedPassword,
      role: 'STUDENT',
    },
  })

  // Create company user
  const companyUser = await prisma.user.upsert({
    where: { email: 'industri@industri.com' },
    update: {
      password: hashedPassword,
      role: 'COMPANY',
    },
    create: {
      email: 'industri@industri.com',
      password: hashedPassword,
      role: 'COMPANY',
    },
  })

  console.log('Created users:', adminUser.email, studentUser.email, companyUser.email)

  // Create student profile
  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {
      fullName: 'Siswa Test',
      nis: '12345678',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 812 3456 7890',
      major: 'Teknik Informatika',
      description: 'Mahasiswa yang antusias belajar teknologi.',
      profilePhotoPath: '/uploads/profile-photos/student.jpg',
      gender: 'Laki-laki',
      birthDate: '2000-01-01',
      skills: 'JavaScript, React, Node.js',
    },
    create: {
      fullName: 'Siswa Test',
      nis: '12345678',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 812 3456 7890',
      major: 'Teknik Informatika',
      description: 'Mahasiswa yang antusias belajar teknologi.',
      profilePhotoPath: '/uploads/profile-photos/student.jpg',
      gender: 'Laki-laki',
      birthDate: '2000-01-01',
      skills: 'JavaScript, React, Node.js',
      userId: studentUser.id,
    },
  })

  // Create company profile
  const companyProfile = await prisma.companyProfile.upsert({
    where: { userId: companyUser.id },
    update: {
      companyName: 'PT Industri Test',
      industryType: 'Teknologi',
      address: 'Jl. Industri No. 123, Malang',
      phoneNumber: '+62 821 9876 5432',
      website: 'https://industritest.com',
      description: 'Perusahaan teknologi yang fokus pada pengembangan software.',
      contactPersonName: 'Manager HR',
      contactPersonEmail: 'hr@industritest.com',
      logoPath: '/uploads/logos/industri.png',
    },
    create: {
      companyName: 'PT Industri Test',
      industryType: 'Teknologi',
      address: 'Jl. Industri No. 123, Malang',
      phoneNumber: '+62 821 9876 5432',
      website: 'https://industritest.com',
      description: 'Perusahaan teknologi yang fokus pada pengembangan software.',
      contactPersonName: 'Manager HR',
      contactPersonEmail: 'hr@industritest.com',
      logoPath: '/uploads/logos/industri.png',
      userId: companyUser.id,
    },
  })

  console.log('Created profiles for student and company')

  // Create dummy CV for student
  const studentCv = await prisma.studentCvs.create({
    data: {
      studentProfileId: studentProfile.id,
      filePath: '/uploads/cvs/cv_siswa.pdf',
      fileName: 'CV_Siswa_Test.pdf',
      fileSize: 1024000, // 1MB
      isActive: true,
    },
  })

  console.log('Created CV for student')

  // Create dummy job postings from company
  const job1 = await prisma.jobPosting.create({
    data: {
      companyProfileId: companyProfile.id,
      jobTitle: 'Frontend Developer',
      description: 'Mengembangkan aplikasi web menggunakan React dan TypeScript.',
      requirements: 'Pengalaman 2+ tahun dengan React, TypeScript, dan Git.',
      location: 'Malang',
      salaryRange: 'Rp 5.000.000 - Rp 8.000.000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
    },
  })

  const job2 = await prisma.jobPosting.create({
    data: {
      companyProfileId: companyProfile.id,
      jobTitle: 'Backend Developer',
      description: 'Membangun API dan server-side logic dengan Node.js.',
      requirements: 'Pengalaman dengan Node.js, Express, dan database.',
      location: 'Malang',
      salaryRange: 'Rp 6.000.000 - Rp 10.000.000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
    },
  })

  console.log('Created job postings:', job1.jobTitle, job2.jobTitle)

  // Create dummy applications from student
  const application1 = await prisma.jobApplication.create({
    data: {
      studentProfileId: studentProfile.id,
      jobPostingId: job1.id,
      studentCvId: studentCv.id,
      status: 'PENDING',
    },
  })

  const application2 = await prisma.jobApplication.create({
    data: {
      studentProfileId: studentProfile.id,
      jobPostingId: job2.id,
      studentCvId: studentCv.id,
      status: 'PENDING',
    },
  })

  console.log('Created job applications from student')

  // Create dummy berita (news) from admin - 7 berita
  const berita1 = await prisma.berita.create({
    data: {
      judul: 'Penerimaan Siswa Baru SMK Negeri 6 Malang',
      content: 'Informasi penting tentang penerimaan siswa baru tahun ajaran 2024/2025.',
      imagePath: '/uploads/berita/berita1.jpg',
      userId: adminUser.id,
      kategori: 'Pengumuman',
    },
  })

  const berita2 = await prisma.berita.create({
    data: {
      judul: 'Kerjasama dengan Industri Teknologi',
      content: 'SMK Negeri 6 Malang menjalin kerjasama dengan perusahaan teknologi terkemuka.',
      imagePath: '/uploads/berita/berita2.jpg',
      userId: adminUser.id,
      kategori: 'Kerjasama',
    },
  })

  const berita3 = await prisma.berita.create({
    data: {
      judul: 'Workshop Pengembangan Karir Siswa',
      content: 'Workshop tentang pengembangan karir dan persiapan dunia kerja untuk siswa.',
      imagePath: '/uploads/berita/berita3.jpg',
      userId: adminUser.id,
      kategori: 'Kegiatan',
    },
  })

  const berita4 = await prisma.berita.create({
    data: {
      judul: 'Prestasi Siswa di Kompetisi Nasional',
      content: 'Siswa SMK Negeri 6 Malang berhasil meraih prestasi di kompetisi nasional.',
      imagePath: '/uploads/berita/berita4.jpg',
      userId: adminUser.id,
      kategori: 'Prestasi',
    },
  })

  const berita5 = await prisma.berita.create({
    data: {
      judul: 'Kunjungan Industri ke Perusahaan Teknologi',
      content: 'Kunjungan industri siswa ke perusahaan teknologi untuk melihat dunia kerja.',
      imagePath: '/uploads/berita/berita5.jpg',
      userId: adminUser.id,
      kategori: 'Kunjungan',
    },
  })

  const berita6 = await prisma.berita.create({
    data: {
      judul: 'Pelatihan Soft Skills untuk Siswa',
      content: 'Program pelatihan soft skills untuk meningkatkan kemampuan siswa.',
      imagePath: '/uploads/berita/berita6.jpg',
      userId: adminUser.id,
      kategori: 'Pelatihan',
    },
  })

  const berita7 = await prisma.berita.create({
    data: {
      judul: 'Seminar Teknologi Digital',
      content: 'Seminar tentang perkembangan teknologi digital dan dampaknya.',
      imagePath: '/uploads/berita/berita7.jpg',
      userId: adminUser.id,
      kategori: 'Seminar',
    },
  })

  console.log('Created 7 berita (news)')

  // Create dummy ekstrakulikuler (ekskul) - 5 ekskul
  const ekskul1 = await prisma.ekskul.create({
    data: {
      namaEkskul: 'Basketball Club',
      deskripsi: 'Klub olahraga basket untuk siswa yang tertarik dengan olahraga.',
      kategori: 'Olahraga',
      status: 'Aktif',
      userInternal: adminUser.id,
    },
  })

  const ekskul2 = await prisma.ekskul.create({
    data: {
      namaEkskul: 'Programming Club',
      deskripsi: 'Klub pemrograman untuk mengembangkan keterampilan coding.',
      kategori: 'Teknologi',
      status: 'Aktif',
      userInternal: adminUser.id,
    },
  })

  const ekskul3 = await prisma.ekskul.create({
    data: {
      namaEkskul: 'English Club',
      deskripsi: 'Klub bahasa Inggris untuk meningkatkan kemampuan komunikasi.',
      kategori: 'Bahasa',
      status: 'Aktif',
      userInternal: adminUser.id,
    },
  })

  const ekskul4 = await prisma.ekskul.create({
    data: {
      namaEkskul: 'Robotic Club',
      deskripsi: 'Klub robotika untuk belajar tentang teknologi dan inovasi.',
      kategori: 'Teknologi',
      status: 'Aktif',
      userInternal: adminUser.id,
    },
  })

  const ekskul5 = await prisma.ekskul.create({
    data: {
      namaEkskul: 'Art and Design Club',
      deskripsi: 'Klub seni dan desain untuk mengembangkan kreativitas siswa.',
      kategori: 'Seni',
      status: 'Aktif',
      userInternal: adminUser.id,
    },
  })

  console.log('Created 5 ekstrakulikuler (ekskul)')

  // Create dummy prestasi
  const prestasi1 = await prisma.prestasi.create({
    data: {
      judul: 'Juara 1 Lomba Programming Nasional',
      deskripsi: 'Tim siswa SMK Negeri 6 Malang meraih juara 1 dalam lomba programming nasional.',
      imagePath: '/uploads/prestasi/prestasi1.jpg',
      tanggal: new Date('2024-10-01'),
      kategori: 'Akademik',
    },
  })

  console.log('Created prestasi')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
