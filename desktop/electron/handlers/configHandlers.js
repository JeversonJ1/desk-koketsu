const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const Logger = require('../services/logger');

// Caminho do arquivo de configuração
const CONFIG_PATH = path.join(__dirname, '../../storage/config.json');

// Carregar configurações
function carregarConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
    // Config padrão
    return {
      login: 'admin',
      senha: 'admin123'
    };
  } catch (error) {
    Logger.error('Erro ao carregar config', error.message);
    return {
      login: 'admin',
      senha: 'admin123'
    };
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
  // Alterar credenciais
  ipcMain.handle('config:alterar-credenciais', (event, dados) => {
    try {
      const config = carregarConfig();
      
      // Verificar credenciais atuais
      if (config.login !== dados.loginAtual || config.senha !== dados.senhaAtual) {
        throw new Error('Credenciais atuais inválidas');
      }

      // Validações
      if (!dados.novoLogin || dados.novoLogin.length < 3) {
        throw new Error('Novo login deve ter no mínimo 3 caracteres');
      }

      if (!dados.novaSenha || dados.novaSenha.length < 6) {
        throw new Error('Nova senha deve ter no mínimo 6 caracteres');
      }

      // Atualizar credenciais
      config.login = dados.novoLogin;
      config.senha = dados.novaSenha;
      config.dataAlteracao = new Date().toISOString();

      salvarConfig(config);
      
      Logger.log(`Credenciais alteradas - Novo login: ${dados.novoLogin}`);
      return { success: true, message: 'Credenciais alteradas com sucesso' };
    } catch (error) {
      Logger.error('Erro ao alterar credenciais', error.message);
      throw error;
    }
  });

  Logger.log('Handlers de configurações registrados');
}

module.exports = { registerConfigHandlers };
