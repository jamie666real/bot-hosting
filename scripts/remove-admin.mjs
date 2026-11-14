import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Usage: npm run admin:remove -- <email>');
  const count = await prisma.adminAccount.count();
  if (count < 2) throw new Error('Cannot remove the last admin account.');
  await prisma.adminAccount.delete({ where: { email } });
  console.log(`Admin account ${email} removed.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not remove admin account.');
  process.exitCode = 1;
} finally { await prisma.$disconnect(); }
