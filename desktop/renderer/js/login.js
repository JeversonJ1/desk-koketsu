// Script de login com autenticação real
class LoginManager {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.usernameInput = document.getElementById('username');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.btnText = document.getElementById('btnText');
    this.alertContainer = document.getElementById('alertContainer');
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleLogin(e));
    this.usernameInput.focus();
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;

    if (!username || !password) {
      this.showAlert('Preencha todos os campos', 'warning');
      return;
    }

    this.setLoading(true);
    this.clearAlert();

    try {
      const result = await window.api.login(username, password);
      
      if (result.sessionId) {
        // Salvar sessionId no localStorage
        localStorage.setItem('sessionId', result.sessionId);
        localStorage.setItem('username', result.username);
        
        // Redirecionar para dashboard
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      console.error('Erro no login:', error);
      this.showAlert(error.message || 'Erro ao fazer login', 'danger');
      this.passwordInput.value = '';
      this.passwordInput.focus();
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.loginBtn.disabled = loading;
    if (loading) {
      this.btnText.innerHTML = '<span class="loading-spinner"></span>Entrando...';
    } else {
      this.btnText.textContent = 'Entrar';
    }
  }

  showAlert(message, type = 'info') {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    this.alertContainer.innerHTML = alertHtml;
  }

  clearAlert() {
    this.alertContainer.innerHTML = '';
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Sempre iniciar pela tela de login
  new LoginManager();
});
