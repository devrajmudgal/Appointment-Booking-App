const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash('Passw0rd!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword, // match your model
      role: 'admin',
    },
  });

  // Patient
  const patientPassword = await bcrypt.hash('Passw0rd!', 10);
  await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      name: 'Patient User',
      email: 'patient@example.com',
      passwordHash: patientPassword, // match your model
      role: 'patient',
    },
  });

  console.log('✅ Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
