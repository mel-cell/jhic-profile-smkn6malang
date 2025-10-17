import prisma from '../src/config/database'

async function main() {
  // Upsert test users for companies (handle existing users)
  const user1 = await prisma.user.upsert({
    where: { email: 'testcompany@example.com' },
    update: {
      password: 'hashedpassword', // In real scenario, hash this
      role: 'COMPANY',
    },
    create: {
      email: 'testcompany@example.com',
      password: 'hashedpassword', // In real scenario, hash this
      role: 'COMPANY',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'testmanufacturing@example.com' },
    update: {
      password: 'hashedpassword',
      role: 'COMPANY',
    },
    create: {
      email: 'testmanufacturing@example.com',
      password: 'hashedpassword',
      role: 'COMPANY',
    },
  })

  console.log('Upserted test users:', user1.email, user2.email)

  // Upsert test company 1
  const company1 = await prisma.companyProfile.upsert({
    where: { userId: user1.id },
    update: {
      companyName: 'Test Company Inc.',
      industryType: 'Technology',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 123 456 789',
      website: 'https://testcompany.com',
      description: 'A test technology company for job postings.',
      contactPersonName: 'John Doe',
      contactPersonEmail: 'john@test.com',
      logoPath: '/test-logo.png',
    },
    create: {
      companyName: 'Test Company Inc.',
      industryType: 'Technology',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 123 456 789',
      website: 'https://testcompany.com',
      description: 'A test technology company for job postings.',
      contactPersonName: 'John Doe',
      contactPersonEmail: 'john@test.com',
      logoPath: '/test-logo.png',
      userId: user1.id,
    },
  })

  // Upsert test company 2
  const company2 = await prisma.companyProfile.upsert({
    where: { userId: user2.id },
    update: {
      companyName: 'Test Manufacturing Co.',
      industryType: 'Manufacturing',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 987 654 321',
      website: 'https://testmanufacturing.com',
      description: 'A test manufacturing company.',
      contactPersonName: 'Jane Smith',
      contactPersonEmail: 'jane@test.com',
      logoPath: '/test-logo2.png',
    },
    create: {
      companyName: 'Test Manufacturing Co.',
      industryType: 'Manufacturing',
      address: 'Malang, Indonesia',
      phoneNumber: '+62 987 654 321',
      website: 'https://testmanufacturing.com',
      description: 'A test manufacturing company.',
      contactPersonName: 'Jane Smith',
      contactPersonEmail: 'jane@test.com',
      logoPath: '/test-logo2.png',
      userId: user2.id,
    },
  })

  console.log('Upserted companies:', company1.companyName, company2.companyName)

  // Create test jobs for company 1 (Technology)
  const job1 = await prisma.jobPosting.create({
    data: {
      jobTitle: 'Software Engineer',
      description: 'Develop web applications using React and Node.js.',
      requirements: '2+ years experience, React, Node.js',
      location: 'Malang',
      salaryRange: 'Rp 5,000,000 - Rp 10,000,000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
      companyProfileId: company1.id,
    },
  })

  const job2 = await prisma.jobPosting.create({
    data: {
      jobTitle: 'Frontend Developer',
      description: 'Build user interfaces with modern frameworks.',
      requirements: 'Experience with React, TypeScript',
      location: 'Malang',
      salaryRange: 'Rp 4,000,000 - Rp 8,000,000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
      companyProfileId: company1.id,
    },
  })

  // Create test job for company 2 (Manufacturing) - different industry test
  const job3 = await prisma.jobPosting.create({
    data: {
      jobTitle: 'Production Manager',
      description: 'Manage production lines and quality control.',
      requirements: '5+ years in manufacturing',
      location: 'Malang',
      salaryRange: 'Rp 7,000,000 - Rp 12,000,000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
      companyProfileId: company2.id,
    },
  })

  // Create another job in Technology industry for similar test
  const job4 = await prisma.jobPosting.create({
    data: {
      jobTitle: 'Backend Developer',
      description: 'Build server-side applications with Node.js.',
      requirements: 'Experience with Node.js, databases',
      location: 'Malang',
      salaryRange: 'Rp 6,000,000 - Rp 11,000,000',
      employmentType: 'Full Time',
      applicationDeadline: new Date('2024-12-31'),
      status: 'APPROVED',
      companyProfileId: company1.id,
    },
  })

  // Update all existing job postings to APPROVED status for testing
  await prisma.jobPosting.updateMany({
    where: {},
    data: { status: 'APPROVED' }
  })

  console.log('All job postings updated to APPROVED status')

  console.log('Created jobs:', job1.jobTitle, job2.jobTitle, job3.jobTitle, job4.jobTitle)
  console.log('Job IDs for testing:')
  console.log('- Software Engineer (Tech):', job1.id)
  console.log('- Frontend Developer (Tech):', job2.id)
  console.log('- Production Manager (Manufacturing):', job3.id)
  console.log('- Backend Developer (Tech):', job4.id)
  console.log('Company IDs:')
  console.log('- Test Company Inc. (Tech):', company1.id)
  console.log('- Test Manufacturing Co. (Manufacturing):', company2.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
