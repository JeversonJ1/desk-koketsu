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
import ServicoController from './Main_back/Controllers/ServicoController.js';
import UsuarioController from './Main_back/Controllers/UsuarioController.js';
import VendaController from './Main_back/Controllers/VendaController.js';

initDatabase();
const produtoCtrl = new ProdutoController();
const servicoCtrl = new ServicoController();
const usuarioCtrl = new UsuarioController();
const vendaCtrl = new VendaController();

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

  
  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined' && MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    
    const rendererName = typeof MAIN_WINDOW_VITE_NAME !== 'undefined' ? MAIN_WINDOW_VITE_NAME : 'main_window';
    mainWindow.loadFile(path.join(__dirname, `../renderer/${rendererName}/index.html`));
  }
};

app.on('ready', () => {
  
  ipcMain.handle('produto:listar', async () => await produtoCtrl.listar());
  ipcMain.handle('produto:criar', async (event, dados) => await produtoCtrl.cadastrar(dados));
  ipcMain.handle('produto:buscar', async (event, uuid) => await produtoCtrl.buscar(uuid));
  ipcMain.handle('produto:atualizar', async (event, dados) => await produtoCtrl.atualizar(dados));
  ipcMain.handle('produto:remover', async (event, uuid) => await produtoCtrl.remover(uuid));
  // upload de imagem do produto: recebe path do arquivo no renderer e copia para userData/imagens_produtos
  const fs = require('node:fs');
  const cryptoLib = require('node:crypto');
  ipcMain.handle('produto:upload_imagem', async (event, filePath) => {
    try {
      if (!filePath) return null;
      // salvar dentro da pasta do projeto: ../assets/imagens
      const projectImagesDir = path.join(__dirname, '..', 'assets', 'imagens');
      if (!fs.existsSync(projectImagesDir)) fs.mkdirSync(projectImagesDir, { recursive: true });
      const ext = path.extname(filePath) || '';
      const filename = `${Date.now()}-${cryptoLib.randomUUID()}${ext}`;
      const dest = path.join(projectImagesDir, filename);
      // copiar arquivo (renderer pode passar caminho local)
      fs.copyFileSync(filePath, dest);
      // retornar caminho absoluto para ser salvo no DB e exibido no renderer
      return dest;
    } catch (err) {
      console.error('Erro ao salvar imagem do produto', err);
      return null;
    }
  });
  
  ipcMain.handle('servico:listar', async () => await servicoCtrl.listar());
  ipcMain.handle('servico:adicionar', async (event, dados) => await servicoCtrl.adicionar(dados));
  ipcMain.handle('servico:buscar', async (event, uuid) => await servicoCtrl.buscar(uuid));
  ipcMain.handle('servico:atualizar', async (event, dados) => await servicoCtrl.atualizar(dados));
  ipcMain.handle('servico:remover', async (event, uuid) => await servicoCtrl.remover(uuid));
  ipcMain.handle('usuario:login', async (event, dados) => await usuarioCtrl.login(dados));
  ipcMain.handle('usuario:logout', async () => {
    // logout é gerenciado no renderer (localStorage). Mantemos handler para extensibilidade.
    return true;
  });
  ipcMain.handle('usuario:cadastrar', async (event, dados) => {
    console.log('ipcMain -> usuario:cadastrar recebido:', dados);
    try {
      const resultado = await usuarioCtrl.cadastrar(dados);
      console.log('ipcMain -> usuario:cadastrar resultado:', resultado);
      return resultado;
    } catch (err) {
      console.error('ipcMain -> usuario:cadastrar erro:', err);
      return false;
    }
  });
  ipcMain.handle('usuario:listar', async () => await usuarioCtrl.listar());
  ipcMain.handle('usuario:buscar', async (event, uuid) => await usuarioCtrl.buscarUsuarioPorId(uuid));
  ipcMain.handle('usuario:atualizar', async (event, dados) => await usuarioCtrl.atualizarusuario(dados));
  ipcMain.handle('usuario:remover', async (event, uuid) => await usuarioCtrl.removerUsuario(uuid));
  ipcMain.handle('venda:criar', async (event, dados) => await vendaCtrl.criar(dados));
  ipcMain.handle('venda:listar', async () => await vendaCtrl.listar());
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