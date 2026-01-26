const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');
const Logger = require('../services/logger');

// Caminho do arquivo de configuração
const CONFIG_PATH = path.join(__dirname, '../../storage/config.json');

// Config padrão expandido
const DEFAULT_CONFIG = {
  admin: {
    username: 'admin',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' // admin123
  },
  sessions: {},
  app: {
    theme: 'dark',
    autoStart: false,
    showInTray: true,
    closeToTray: false,
    language: 'pt-BR'
  },
  api: {
    baseUrl: 'http://localhost:8000/api',
    timeout: 30000,
    retryAttempts: 3
  },
  logs: {
    enabled: true,
    level: 'info',
    maxFiles: 10,
    maxSizeMB: 5
  },
  backup: {
    enabled: true,
    autoBackup: true,
    frequency: 'daily',
    maxBackups: 7,
    path: path.join(app.getPath('userData'), 'backups')
  }
};

// Carregar configurações
function carregarConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      const config = JSON.parse(data);
      // Merge com padrões para garantir campos obrigatórios
      return {
        ...DEFAULT_CONFIG,
        ...config,
        app: { ...DEFAULT_CONFIG.app, ...(config.app || {}) },
        api: { ...DEFAULT_CONFIG.api, ...(config.api || {}) },
        logs: { ...DEFAULT_CONFIG.logs, ...(config.logs || {}) },
        backup: { ...DEFAULT_CONFIG.backup, ...(config.backup || {}) }
      };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    Logger.error('Erro ao carregar config', error.message);
    return DEFAULT_CONFIG;
  }
}

// Salvar configurações
function salvarConfig(config) {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    Logger.log('Configurações salvas');
  } catch (error) {
    Logger.error('Erro ao salvar config', error.message);
    throw error;
  }
}

function registerConfigHandlers() {
  // Obter todas as configurações
  ipcMain.handle('config:obter', () => {
    try {
      const config = carregarConfig();
      // Não retornar dados sensíveis como passwordHash e sessions
      return {
        app: config.app,
        api: config.api,
        logs: config.logs,
        backup: config.backup
      };
    } catch (error) {
      Logger.error('Erro ao obter config', error.message);
      throw error;
    }
  });

  // Atualizar configurações do aplicativo
  ipcMain.handle('config:atualizar-app', (event, dados) => {
    try {
      const config = carregarConfig();
      
      if (dados.theme && !['dark', 'light'].includes(dados.theme)) {
        throw new Error('Tema inválido');
      }
      
      config.app = {
        ...config.app,
        ...dados
      };
      
      salvarConfig(config);
      Logger.log('Configurações do app atualizadas');
      return { success: true, message: 'Configurações atualizadas' };
    } catch (error) {
      Logger.error('Erro ao atualizar config app', error.message);
      throw error;
    }
  });

  // Atualizar configurações de API
  ipcMain.handle('config:atualizar-api', (event, dados) => {
    try {
      const config = carregarConfig();
      
      if (dados.baseUrl && !dados.baseUrl.startsWith('http')) {
        throw new Error('URL da API inválida');
      }
      
      if (dados.timeout && (dados.timeout < 1000 || dados.timeout > 120000)) {
        throw new Error('Timeout deve estar entre 1000ms e 120000ms');
      }
      
      config.api = {
        ...config.api,
        ...dados
      };
      
      salvarConfig(config);
      Logger.log('Configurações de API atualizadas');
      return { success: true, message: 'Configurações de API atualizadas' };
    } catch (error) {
      Logger.error('Erro ao atualizar config API', error.message);
      throw error;
    }
  });

  // Atualizar configurações de logs
  ipcMain.handle('config:atualizar-logs', (event, dados) => {
    try {
      const config = carregarConfig();
      
      if (dados.level && !['error', 'warn', 'info', 'debug'].includes(dados.level)) {
        throw new Error('Nível de log inválido');
      }
      
      config.logs = {
        ...config.logs,
        ...dados
      };
      
      salvarConfig(config);
      Logger.log('Configurações de logs atualizadas');
      return { success: true, message: 'Configurações de logs atualizadas' };
    } catch (error) {
      Logger.error('Erro ao atualizar config logs', error.message);
      throw error;
    }
  });

  // Atualizar configurações de backup
  ipcMain.handle('config:atualizar-backup', (event, dados) => {
    try {
      const config = carregarConfig();
      
      if (dados.frequency && !['daily', 'weekly', 'monthly'].includes(dados.frequency)) {
        throw new Error('Frequência de backup inválida');
      }
      
      config.backup = {
        ...config.backup,
        ...dados
      };
      
      salvarConfig(config);
      Logger.log('Configurações de backup atualizadas');
      return { success: true, message: 'Configurações de backup atualizadas' };
    } catch (error) {
      Logger.error('Erro ao atualizar config backup', error.message);
      throw error;
    }
  });

  // Alterar credenciais (mantido para compatibilidade)
  ipcMain.handle('config:alterar-credenciais', (event, dados) => {
    try {
      const config = carregarConfig();
      
      // Verificar credenciais atuais (compatibilidade com formato antigo)
      const loginAtual = config.admin?.username || config.login;
      const senhaAtual = config.admin?.passwordHash || config.senha;
      
      if (loginAtual !== dados.loginAtual || senhaAtual !== dados.senhaAtual) {
        throw new Error('Credenciais atuais inválidas');
      }

      // Validações
      if (!dados.novoLogin || dados.novoLogin.length < 3) {
        throw new Error('Novo login deve ter no mínimo 3 caracteres');
      }

      if (!dados.novaSenha || dados.novaSenha.length < 6) {
        throw new Error('Nova senha deve ter no mínimo 6 caracteres');
      }

      // Atualizar credenciais no novo formato
      config.admin = {
        username: dados.novoLogin,
        passwordHash: dados.novaSenha, // Em produção, usar hash real
        updatedAt: new Date().toISOString()
      };

      salvarConfig(config);
      
      Logger.log(`Credenciais alteradas - Novo login: ${dados.novoLogin}`);
      return { success: true, message: 'Credenciais alteradas com sucesso' };
    } catch (error) {
      Logger.error('Erro ao alterar credenciais', error.message);
      throw error;
    }
  });

  // Resetar configurações para padrão
  ipcMain.handle('config:resetar', () => {
    try {
      const config = carregarConfig();
      // Preservar admin e sessions
      const novoConfig = {
        ...DEFAULT_CONFIG,
        admin: config.admin,
        sessions: config.sessions
      };
      salvarConfig(novoConfig);
      Logger.log('Configurações resetadas para padrão');
      return { success: true, message: 'Configurações resetadas' };
    } catch (error) {
      Logger.error('Erro ao resetar config', error.message);
      throw error;
    }
  });

  Logger.log('Handlers de configurações registrados');
}

module.exports = { registerConfigHandlers };
