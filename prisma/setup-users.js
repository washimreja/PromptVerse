const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'washimreja19120@gmail.com';
  console.log(`Setting up user roles & memberships...`);

  // 1. Promote Washim Reja to ADMIN & PRO
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      membership: 'PRO',
    },
    create: {
      email: adminEmail,
      name: 'Washim Reja (Admin)',
      role: 'ADMIN',
      membership: 'PRO',
    },
  });

  console.log('>>> SUCCESS! Updated Admin Account:');
  console.log({
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    membership: adminUser.membership,
  });
}

main()
  .catch((e) => console.error('Error configuring user roles:', e))
  .finally(async () => await prisma.$disconnect());
