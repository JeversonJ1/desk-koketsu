const { ipcMain } = require('electron');
const AuthService = require('../services/authService');
const Logger = require('../services/logger');

// Middleware para validar sessão
function requireAuth(handler) {
  return async (event, sessionId, ...args) => {
    const session = AuthService.validateSession(sessionId);
    if (!session) {
      const error = new Error('Não autenticado');
      error.code = 'AUTH_REQUIRED';
      throw error;
    }
    return handler(event, ...args);
  };
}

// Registrar handlers de autenticação
function registerAuthHandlers() {
  ipcMain.handle('auth:login', async (event, username, password) => {
    try {
      const result = AuthService.login(username, password);
      return { sucesso: true, ...result };
    } catch (error) {
      Logger.error('Erro no IPC auth:login', error.message);
      throw new Error(error.message);
    }
  });

  ipcMain.handle('auth:logout', async (event, sessionId) => {
    try {
      AuthService.logout(sessionId);
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro no IPC auth:logout', error.message);
      throw error;
    }
  });

  ipcMain.handle('auth:validate', async (event, sessionId) => {
    const session = AuthService.validateSession(sessionId);
    return session ? { valido: true, usuario: session.username } : { valido: false };
  });

  ipcMain.handle('auth:changePassword', async (event, sessionId, oldPassword, newPassword) => {
    try {
      return AuthService.changePassword(sessionId, oldPassword, newPassword);
    } catch (error) {
      Logger.error('Erro no IPC auth:changePassword', error.message);
      throw new Error(error.message);
    }
  });
}

module.exports = {
  registerAuthHandlers,
  requireAuth
};
