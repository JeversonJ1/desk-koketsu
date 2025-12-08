class LoginView {
    renderizarLogin() {
        return `
        <div class="login-container" style="max-width:420px; margin:40px auto;">
            <h2>Login</h2>
            <form id="form-login">
                <label>Usuário:</label>
                <input type="text" id="login_nome" required style="width:100%; padding:8px; margin-bottom:8px;">
                <label>Senha:</label>
                <input type="password" id="login_senha" required style="width:100%; padding:8px; margin-bottom:12px;">
                <div style="display:flex; gap:8px;">
                    <button type="submit" class="btn-salvar" style="flex:1;">Entrar</button>
                </div>
            </form>
            <div id="login_msg" style="margin-top:12px;color:red;"></div>
        </div>
        `;
    }
}
export default LoginView;
