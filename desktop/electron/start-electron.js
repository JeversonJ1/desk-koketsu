const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function start() {
  const projectRoot = path.resolve(__dirname, '..');
  let electronPath;

  if (process.platform === 'win32') {
    electronPath = path.join(projectRoot, 'node_modules', 'electron', 'dist', 'electron.exe');
  } else if (process.platform === 'darwin') {
    electronPath = path.join(projectRoot, 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron');
  } else {
    electronPath = path.join(projectRoot, 'node_modules', 'electron', 'dist', 'electron');
  }

  if (!fs.existsSync(electronPath)) {
    console.warn('Electron binary not found at', electronPath);
    console.warn('Falling back to `electron` on PATH. Ensure electron is installed globally or in project.');
    electronPath = 'electron';
  }

  const args = ['.'];
  const child = spawn(electronPath, args, { stdio: 'inherit', windowsHide: false });

  child.on('close', (code) => {
    process.exit(code);
  });

  child.on('error', (err) => {
    console.error('Failed to spawn Electron:', err && err.stack ? err.stack : err);
    process.exit(1);
  });
}

start();
