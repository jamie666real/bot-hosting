import { scrypt as scryptCallback, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const password = process.argv[2];
if (!password || password.length < 14) {
  console.error('Usage: npm run auth:hash -- "a-password-at-least-14-characters"');
  process.exit(1);
}
const salt = randomBytes(16).toString('hex');
const hash = (await scrypt(password, salt, 32) as Buffer).toString('hex');
console.log(`${salt}:${hash}`);
