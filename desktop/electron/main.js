const { app, BrowserWindow } = require('electron');
const path = require('path');
const Logger = require('./services/logger');
const { registerAuthHandlers } = require('./handlers/authHandlers');
const { registerProductHandlers } = require('./handlers/productHandlers');
const { registerClientHandlers } = require('./handlers/clientHandlers');
const { registerOrderHandlers } = require('./handlers/orderHandlers');
const { registerSizeHandlers } = require('./handlers/sizeHandlers');
const { registerDashboardHandlers } = require('./handlers/dashboardHandlers');
const { registerBannersHandlers } = require('./handlers/bannersHandlers');
const { registerConfigHandlers } = require('./handlers/configHandlers');

// Variaveis globais
let mainWindow;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/pages/login.html'));
  
  // Abrir DevTools apenas em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
    Logger.debug('DevTools aberto (modo desenvolvimento)');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Logger.log('Janela principal criada');
}

// Registrar todos os handlers IPC
function registerHandlers() {
  registerAuthHandlers();
  registerProductHandlers();
  registerClientHandlers();
  registerOrderHandlers();
  registerSizeHandlers();
  registerDashboardHandlers();
  registerBannersHandlers();
  registerConfigHandlers();
  Logger.log('Todos os handlers IPC registrados');
}

app.whenReady().then(() => {
  registerHandlers();
  createWindow();
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

Logger.log('Aplicação Koketsu Desktop iniciada');