import VendaListar from "../Views/Vendas/listar/VendaListar.js"
import VendaForm from "../Views/Vendas/form/VendaForm.js"
import VendasView from "../Views/Vendas/VendasView.js"
class Rotas{
    constructor(){
        this.rotas={
            "/vendas_listar": async () =>{
                return new VendaListar().renderizarLista();
            },
            "/vendas_cadastrar": () => {
                return new VendaForm().renderizarFormulario();
            },
            "/listar_menu": () => {
                return new VendasView().renderizarMenu();
            }
        }        
    }
    async getPage(rota){
            return await this.rotas[rota]();
        }
}
export default Rotas;