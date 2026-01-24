// Utilitário de autenticação para uso em outras páginas
class AuthHelper {
  static getSessionId() {
    return localStorage.getItem('sessionId');
  }

  static getUsername() {
    return localStorage.getItem('username');
  }

  static isAuthenticated() {
    return !!this.getSessionId();
  }

  static async validateAndRedirect() {
    const sessionId = this.getSessionId();
    
    if (!sessionId) {
      window.location.href = 'login.html';
      return false;
    }

    try {
      const result = await window.api.validateSession(sessionId);
      if (!result.valido) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao validar sessão:', error);
      this.logout();
      return false;
    }
  }

  static logout() {
    const sessionId = this.getSessionId();
    if (sessionId) {
      window.api.logout(sessionId).catch(err => console.error('Erro ao fazer logout:', err));
    }
    localStorage.removeItem('sessionId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  }

  static async changePassword(oldPassword, newPassword) {
    const sessionId = this.getSessionId();
    if (!sessionId) {
      throw new Error('Não autenticado');
    }

    return window.api.changePassword(sessionId, oldPassword, newPassword);
  }

  static showUserInfo() {
    const username = this.getUsername();
    const userElements = document.querySelectorAll('[data-user-name]');
    if (userElements.length > 0 && username) {
      userElements.forEach(el => el.textContent = username);
    }
  }
}

// Validar autenticação ao carregar páginas protegidas
document.addEventListener('DOMContentLoaded', () => {
  // Só valida se a página atual não é login.html
  if (window.location.pathname.includes('login.html') === false && 
      window.location.pathname.includes('.html')) {
    
    // Verificar se está autenticado
    if (!AuthHelper.isAuthenticated()) {
      console.log('Usuário não autenticado, redirecionando...');
      window.location.href = 'login.html';
      return;
    }

    // Validar sessão
    AuthHelper.validateAndRedirect().catch(err => {
      console.error('Erro na validação:', err);
      // Não força logout se der erro, pode ser problema de rede
    });
  }
  
  AuthHelper.showUserInfo();
});

// Adicionar botão de logout se existir
document.addEventListener('DOMContentLoaded', () => {
  const logoutButtons = document.querySelectorAll('[data-logout]');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthHelper.logout();
    });
  });
});
