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
    async getPage(Rotas){
        // /usuario_listar
            // UsuarioListar()
        return await this.rotas[Rotas]();
    }
}
export default Rotas;