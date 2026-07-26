const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const membership = (args[1] || 'PRO').toUpperCase(); // PRO or FREE

  if (!email) {
    console.log('Usage: node prisma/set-user-membership.js <user-email> [PRO|FREE]');
    process.exit(1);
  }

  console.log(`Updating membership for ${email} to ${membership}...`);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { membership },
    });
    console.log(`>>> SUCCESS! ${user.email} is now a ${user.membership} member!`);
  } catch (error) {
    console.error(`User with email "${email}" not found in database. Make sure they have logged in at least once.`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
