const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'washimreja19120@gmail.com';
  console.log(`Granting ADMIN role and PRO membership to ${email}...`);

  const user = await prisma.user.update({
    where: { email },
    data: {
      role: 'ADMIN',
      membership: 'PRO',
    },
  });

  console.log('>>> SUCCESS! Updated user profile:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    membership: user.membership,
  });
}

main()
  .catch((e) => console.error('Error updating user:', e))
  .finally(async () => await prisma.$disconnect());
