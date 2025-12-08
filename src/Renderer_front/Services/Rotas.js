import UsuarioListar from "../Views/Usuario/listar/UsuarioListar.js"
import UsuarioForm from "../Views/Usuario/form/UsuarioForm.js"
import UsuariosView from "../Views/Usuario/UsuariosView.js"
import Login from "../Views/Usuario/Login.js"
import ProdutoListar from "../Views/Produto/listar/ProdutoListar.js"
import ProdutoForm from "../Views/Produto/form/ProdutoForm.js"
import ServicoListar from "../Views/Servico/listar/ServicoListar.js"
import ServicoForm from "../Views/Servico/form/ServicoForm.js"
import Pdv from "../Views/Venda/Pdv.js"

class Rotas {
    constructor(){
    this.rotas = {
            // chave         : valor
            "/usuario_listar": async () =>{
                return new UsuarioListar().renderizarLista();
            },
            "/usuario_criar": () =>{
                return new UsuarioForm().renderizarFormulario();
            },
            "/usuario_menu": () =>{
                return new UsuariosView().renderizarMenu();
            },
            "/login": async () => {
                return new Login().renderizar();
            },
            "/produto_listar": async () => {
                return new ProdutoListar().renderizarLista();
            },
            "/produto_criar": () => {
                return new ProdutoForm().renderizarFormulario();
            },
            "/venda_criar": async () => {
                return new Pdv().renderizar();
            },
            "/servico_listar": async () => {
                return new ServicoListar().renderizarLista();
            },
            "/servico_criar": () => {
                return new ServicoForm().renderizarFormulario();
            }
        }
    }
    // Retorna o usuário atual (se houver)
    getCurrentUser() {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (err) {
            console.error('Rotas.getCurrentUser -> erro ao ler user do localStorage', err);
            return null;
        }
    }

    // Definição simples de proteção de rotas
    isRouteProtected(rota) {
        // rotas que exigem autenticação
        const protectedRoutes = [
            '/usuario_listar', '/usuario_criar', '/usuario_menu',
            '/produto_listar', '/produto_criar', '/servico_listar', '/servico_criar'
        ];
        return protectedRoutes.includes(rota);
    }

    // rotas que exigem role 'admin'
    isAdminOnly(rota) {
        const adminRoutes = ['/usuario_listar', '/usuario_criar'];
        return adminRoutes.includes(rota);
    }

    async getPage(rota){
        // rota ex: /usuario_listar
        const handler = this.rotas[rota];
        if (!handler) {
            // Rota não encontrada -> retornar mensagem amigável
            return `<h2>Página não encontrada</h2><p>Rota: ${rota}</p>`;
        }

        // Verificar autenticação/authorization
        const user = this.getCurrentUser();
        if (this.isRouteProtected(rota) && !user) {
            // força redirecionamento para login
            location.hash = '#/login';
            return '';
        }
        if (this.isAdminOnly(rota) && user && user.role !== 'admin') {
            return `<h2>Acesso negado</h2><p>Você não tem permissão para acessar esta página.</p>`;
        }

        try {
            return await handler();
        } catch (err) {
            console.error('Erro ao renderizar rota', rota, err);
            return `<h2>Erro ao carregar a página</h2><pre>${err.message}</pre>`;
        }
    }
}
export default Rotas;