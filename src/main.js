import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module'; 

// --- CONFIGURAÇÃO DE COMPATIBILIDADE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
// ---------------------------------------------------------

// Importa suas configurações
import { initDatabase } from './Main_back/Database/db.js';
import ProdutoController from './Main_back/Controllers/ProdutoController.js';

initDatabase();
const produtoCtrl = new ProdutoController();

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // --- CORREÇÃO DO ERRO ---
  // Usamos 'typeof' para verificar se a variável existe antes de usar.
  // Isso evita o crash "ReferenceError".
  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined' && MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Fallback seguro se a variável do nome não existir
    const rendererName = typeof MAIN_WINDOW_VITE_NAME !== 'undefined' ? MAIN_WINDOW_VITE_NAME : 'main_window';
    mainWindow.loadFile(path.join(__dirname, `../renderer/${rendererName}/index.html`));
  }
};

app.on('ready', () => {
  // --- ROTAS DO ESTOQUE (IPC) ---
  ipcMain.handle('produto:listar', async () => await produtoCtrl.listar());
  ipcMain.handle('produto:criar', async (event, dados) => await produtoCtrl.cadastrar(dados));
  ipcMain.handle('produto:buscar', async (event, uuid) => await produtoCtrl.buscar(uuid));
  ipcMain.handle('produto:atualizar', async (event, dados) => await produtoCtrl.atualizar(dados));
  ipcMain.handle('produto:remover', async (event, uuid) => await produtoCtrl.remover(uuid));
  // -----------------------------

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});