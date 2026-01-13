const { app, BrowserWindow } = require("electron");
const path = require("path");
// log básico e captura de exceções para diagnóstico
process.on('uncaughtException', (err) => {
  console.error('UncaughtException in main:', err && err.stack ? err.stack : err);
});

console.log('Starting Electron main process');

// 🔥 AUTO RELOAD com ajuste para Windows
const electronReload = require("electron-reload");
const electronBin = process.platform === "win32"
  ? path.join(__dirname, "../node_modules/.bin/electron.cmd")
  : path.join(__dirname, "../node_modules/.bin/electron");

electronReload(path.join(__dirname, "../renderer"), { electron: electronBin });

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(
    path.join(__dirname, "../renderer/pages/login.html")
  );
}

app.whenReady().then(() => {
  try {
    createWindow();
  } catch (err) {
    console.error('createWindow error:', err && err.stack ? err.stack : err);
  }
}).catch(err => console.error('whenReady error:', err && err.stack ? err.stack : err));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
