const { spawn } = require('node:child_process');

const port = process.env.PORT || '3000';
const nextCli = require.resolve('next/dist/bin/next');

const server = spawn(
  process.execPath,
  [nextCli, 'start', '-H', '0.0.0.0', '-p', port],
  { stdio: 'inherit', env: process.env },
);

server.on('error', (error) => {
  console.error('Could not start Next.js:', error);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal));
}

server.on('exit', (code) => process.exit(code ?? 1));
