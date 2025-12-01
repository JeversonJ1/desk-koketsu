import UsuarioListar from "../Views/Usuario/listar/UsuarioListar.js"
import UsuarioForm from "../Views/Usuario/form/UsuarioForm.js"
import UsuariosView from "../Views/Usuario/UsuariosView.js"
import ProdutoListar from "../Views/Produto/listar/ProdutoListar.js"
import ProdutoForm from "../Views/Produto/form/ProdutoForm.js"
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
            "/produto_listar": async () => {
                return new ProdutoListar().renderizarLista();
            },
            "/produto_criar": () => {
                return new ProdutoForm().renderizarFormulario();
            }
        }
    }
    async getPage(rota){
        // rota ex: /usuario_listar
        const handler = this.rotas[rota];
        if (!handler) {
            // Rota não encontrada -> retornar mensagem amigável
            return `<h2>Página não encontrada</h2><p>Rota: ${rota}</p>`;
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