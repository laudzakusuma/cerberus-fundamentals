const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Mock WebSocket Server...\n');

const serverPath = path.join(__dirname, 'websocket-server.ts');

const server = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true,
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`);
    process.exit(code);
  }
});

process.on('SIGINT', () => {
  console.log('\n Stopping server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n Stopping server...');
  server.kill('SIGTERM');
});