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
import startApi from './Main_back/api.js';

initDatabase();
const produtoCtrl = new ProdutoController();
const servicoCtrl = new ServicoController();
const usuarioCtrl = new UsuarioController();
const vendaCtrl = new VendaController();

// Helper para padronizar respostas retornadas aos renderers
function normalizeResponse(result) {
  try {
    if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'success')) {
      // já está no formato esperado
      return result;
    }
    if (Array.isArray(result)) return { success: true, data: result };
    if (result === null || result === undefined) return { success: false };
    if (typeof result === 'boolean') return { success: result };
    // outros tipos (string, number, object sem success): embrulhar como data
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Wrapper para handlers: captura exceções e sempre retorna objeto padronizado
function wrapHandler(fn) {
  return async function(...args) {
    try {
      const res = await fn(...args);
      return normalizeResponse(res);
    } catch (err) {
      console.error('IPC handler error:', err);
      return normalizeResponse({ success: false, error: String(err) });
    }
  };
}

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
  // Inicia API local para operação offline (HTTP local)
  try {
    const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;
    const apiServer = startApi(port);
    // se o servidor emitiu erro de EADDRINUSE, já será logado; guardamos referência se precisarmos fechar
    if (apiServer && apiServer.listening) {
      console.log(`API local escutando na porta ${port}`);
    }
  } catch (err) {
    console.error('Falha ao iniciar API local:', err);
  }
  
  ipcMain.handle('produto:listar', wrapHandler(async () => await produtoCtrl.listar()));
  ipcMain.handle('produto:criar', wrapHandler(async (event, dados) => await produtoCtrl.cadastrar(dados)));
  ipcMain.handle('produto:buscar', wrapHandler(async (event, uuid) => await produtoCtrl.buscar(uuid)));
  ipcMain.handle('produto:atualizar', wrapHandler(async (event, dados) => await produtoCtrl.atualizar(dados)));
  ipcMain.handle('produto:remover', wrapHandler(async (event, uuid) => await produtoCtrl.remover(uuid)));
  // upload de imagem do produto: recebe path do arquivo no renderer e copia para userData/imagens_produtos
  const fs = require('node:fs');
  const cryptoLib = require('node:crypto');
  ipcMain.handle('produto:upload_imagem', wrapHandler(async (event, filePath) => {
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
    return { path: dest };
  }));
  
  ipcMain.handle('servico:listar', wrapHandler(async () => await servicoCtrl.listar()));
  ipcMain.handle('servico:adicionar', wrapHandler(async (event, dados) => await servicoCtrl.adicionar(dados)));
  ipcMain.handle('servico:buscar', wrapHandler(async (event, uuid) => await servicoCtrl.buscar(uuid)));
  ipcMain.handle('servico:atualizar', wrapHandler(async (event, dados) => await servicoCtrl.atualizar(dados)));
  ipcMain.handle('servico:remover', wrapHandler(async (event, uuid) => await servicoCtrl.remover(uuid)));
  ipcMain.handle('usuario:login', wrapHandler(async (event, dados) => await usuarioCtrl.login(dados)));
  ipcMain.handle('usuario:logout', wrapHandler(async () => true));
  ipcMain.handle('usuario:cadastrar', wrapHandler(async (event, dados) => {
    console.log('ipcMain -> usuario:cadastrar recebido:', dados);
    const resultado = await usuarioCtrl.cadastrar(dados);
    console.log('ipcMain -> usuario:cadastrar resultado:', resultado);
    return resultado;
  }));
  ipcMain.handle('usuario:listar', wrapHandler(async () => await usuarioCtrl.listar()));
  ipcMain.handle('usuario:buscar', wrapHandler(async (event, uuid) => await usuarioCtrl.buscarUsuarioPorId(uuid)));
  ipcMain.handle('usuario:atualizar', wrapHandler(async (event, dados) => await usuarioCtrl.atualizarusuario(dados)));
  ipcMain.handle('usuario:remover', wrapHandler(async (event, uuid) => await usuarioCtrl.removerUsuario(uuid)));
  ipcMain.handle('venda:criar', wrapHandler(async (event, dados) => await vendaCtrl.criar(dados)));
  ipcMain.handle('venda:listar', wrapHandler(async () => await vendaCtrl.listar()));
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