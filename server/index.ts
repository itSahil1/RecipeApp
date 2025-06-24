// Temporary redirect to frontend-only application
import { spawn } from 'child_process';
import path from 'path';

console.log('Starting frontend-only Recipe Book application...');

const clientDir = path.resolve(process.cwd(), 'client');
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: clientDir,
  stdio: 'inherit'
});

viteProcess.on('error', (error) => {
  console.error(`Failed to start Vite: ${error}`);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit();
});