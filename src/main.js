import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import VendasController from './Main_back/Controllers/VendasController.js';
import { initDatabase } from './Main_back/Database/db.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const controllerVendas = new VendasController();

const createWindow = () => {
  // Create the browser window.
    const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    transparent: false,
    alwaysOnTop: false,
    resizable: true,
    fullscreen: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  initDatabase();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle("vendas:listar", async () => {
  return await controllerVendas.listar();
})

ipcMain.handle("vendas:cadastrar", async (event, vendaData) => {
  const resultado = await controllerVendas.cadastrar(vendaData);
  return resultado;
})

ipcMain.handle("vendas:removervenda", async (event, uuid) => {
  return await controllerVendas.removerVenda(uuid);
})

ipcMain.handle("vendas:editar", async (event, venda) => {
  const resultado = await controllerVendas.atualizarVenda(venda);
  return resultado;
})

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})




app.on

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
