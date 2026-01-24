const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

const configPath = path.join(__dirname, '../../storage/config.json');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Dados padrão de credenciais
const defaultConfig = {
  admin: {
    username: 'admin',
    passwordHash: hashPassword('admin123'), // Mudar em produção
  },
  sessions: {}
};

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
    return defaultConfig;
  } catch (error) {
    Logger.error('Erro ao carregar configuração', error);
    return defaultConfig;
  }
}

function saveConfig(config) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    Logger.log('Configuração salva com sucesso');
  } catch (error) {
    Logger.error('Erro ao salvar configuração', error);
    throw error;
  }
}

class AuthService {
  static login(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Usuário e senha são obrigatórios');
      }

      const config = loadConfig();
      const passwordHash = hashPassword(password);

      if (username !== config.admin.username || passwordHash !== config.admin.passwordHash) {
        Logger.warn(`Tentativa de login falha para usuário: ${username}`);
        throw new Error('Usuário ou senha inválidos');
      }

      const sessionId = crypto.randomBytes(32).toString('hex');
      const session = {
        sessionId,
        username,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      };

      config.sessions[sessionId] = session;
      saveConfig(config);

      Logger.log(`Login bem-sucedido para usuário: ${username}`);
      return { sessionId, username };
    } catch (error) {
      Logger.error('Erro no login', error.message);
      throw error;
    }
  }

  static logout(sessionId) {
    try {
      const config = loadConfig();
      if (config.sessions[sessionId]) {
        delete config.sessions[sessionId];
        saveConfig(config);
        Logger.log(`Logout bem-sucedido para sessão: ${sessionId}`);
      }
    } catch (error) {
      Logger.error('Erro no logout', error.message);
      throw error;
    }
  }

  static validateSession(sessionId) {
    try {
      const config = loadConfig();
      const session = config.sessions[sessionId];

      if (!session) {
        return null;
      }

      if (new Date(session.expiresAt) < new Date()) {
        delete config.sessions[sessionId];
        saveConfig(config);
        return null;
      }

      return session;
    } catch (error) {
      Logger.error('Erro ao validar sessão', error.message);
      return null;
    }
  }

  static changePassword(sessionId, oldPassword, newPassword) {
    try {
      const session = this.validateSession(sessionId);
      if (!session) {
        throw new Error('Sessão inválida ou expirada');
      }

      const config = loadConfig();
      const oldHash = hashPassword(oldPassword);

      if (oldHash !== config.admin.passwordHash) {
        throw new Error('Senha atual inválida');
      }

      if (newPassword.length < 6) {
        throw new Error('Nova senha deve ter pelo menos 6 caracteres');
      }

      config.admin.passwordHash = hashPassword(newPassword);
      saveConfig(config);

      Logger.log(`Senha alterada para usuário: ${session.username}`);
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao alterar senha', error.message);
      throw error;
    }
  }
}

module.exports = AuthService;
