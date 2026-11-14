import { scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaClient } from '@prisma/client';

const scrypt = promisify(scryptCallback);
const prisma = new PrismaClient();
const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];

try {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error('Usage: npm run admin:add -- <email> <strong-password>');
  }
  if (!password || password.length < 14 || password.length > 1024) {
    throw new Error('Password must be between 14 and 1024 characters.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 32)).toString('hex');
  await prisma.adminAccount.create({ data: { email, passwordHash: `${salt}:${hash}` } });
  console.log(`Admin account ${email} created.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not create admin account.');
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
