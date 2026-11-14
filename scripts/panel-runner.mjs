import { spawn } from 'node:child_process';
import readline from 'node:readline';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env: process.env });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)));
  });
}

await run('npx', ['prisma', 'db', 'push', '--skip-generate']);
const web = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '0.0.0.0', '-p', process.env.PORT || '3000'], {
  stdio: ['ignore', 'inherit', 'inherit'],
  env: process.env,
});

const terminal = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
terminal.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  if (trimmed === 'help') {
    console.log('Panel commands: admin:add <email> <password> | admin:list | admin:remove <email>');
    return;
  }
  if (trimmed === 'admin:list') {
    const child = spawn('npx', ['prisma', 'db', 'execute', '--stdin'], { stdio: ['pipe', 'inherit', 'inherit'], env: process.env });
    child.stdin.end('SELECT email, createdAt FROM AdminAccount ORDER BY email;');
    return;
  }
  const add = /^admin:add\s+(\S+)\s+(.+)$/.exec(trimmed);
  if (add) {
    console.log('Adding admin account…');
    try {
      await run(process.execPath, ['scripts/add-admin.mjs', add[1], add[2]]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Admin creation failed.');
    }
    return;
  }
  const remove = /^admin:remove\s+(\S+)$/.exec(trimmed);
  if (remove) {
    console.log('Admin removal must be run with: npm run admin:remove -- <email> while the app is stopped.');
    return;
  }
  console.log('Unknown command. Type help for available commands.');
});

function shutdown() {
  terminal.close();
  if (!web.killed) web.kill('SIGTERM');
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
web.once('exit', (code) => { process.exitCode = code ?? 0; terminal.close(); });
