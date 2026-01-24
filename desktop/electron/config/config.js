// Configuração centralizada da aplicação
const config = {
  app: {
    name: 'Koketsu Desktop',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    passwordMinLength: 6,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos
  },

  database: {
    dataFile: './database/data.json',
    configFile: './storage/config.json',
    logsDir: './storage/logs'
  },

  features: {
    enableDevTools: process.env.NODE_ENV === 'development',
    enableLogging: true,
    autoBackup: true,
    backupInterval: 24 * 60 * 60 * 1000 // 24 horas
  },

  window: {
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: 'electron/preload.js'
    }
  }
};

module.exports = config;
