import LoginView from './LoginView.js';

class Login {
    constructor() {
        this.view = new LoginView();
    }

    async renderizar() {
    const html = this.view.renderizarLogin();
    // Agendar a atribuição de eventos após o DOM ser atualizado pela rota
    setTimeout(() => this.adicionarEventos(), 0);
    return html;
    }

    adicionarEventos() {
        const form = document.getElementById('form-login');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('login_nome').value.trim();
            const senha = document.getElementById('login_senha').value;
            const res = await window.api.login({ nome, senha });
            const msg = document.getElementById('login_msg');
            if (res && res.success) {
                // armazenar sessão simples (remover senha caso venha)
                const user = Object.assign({}, res.user);
                if (user.senha) delete user.senha;
                user.role = user.role || 'vendedor';
                localStorage.setItem('user', JSON.stringify(user));
                // redirecionar para lista de produtos
                location.hash = '#produto_listar';
            } else {
                if (msg) msg.textContent = res.message || 'Erro ao autenticar';
            }
        });
    }
}
export default Login;
