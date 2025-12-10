import UsuariosView from "../UsuariosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";
class UsuarioForm{
    constructor(){
        this.view = new UsuariosView();
        this.mensagem = new MensagemDeAlerta();
    }
    renderizarFormulario(){
        setTimeout(() => {
            this.adicionarEventos();
            console.log("evento criado")
        }, 0);
        return this.view.renderizarFomulario();
    }
    adicionarEventos(){
        const formulario = document.getElementById('form-usuario');
        formulario.addEventListener('submit', async (event) =>{
            event.preventDefault();
            console.log(event)
            const nome = document.getElementById('nome');
            const idade = document.getElementById('idade');
            const senha = document.getElementById('senha');
            const role = document.getElementById('role');
            const usuario = {
                nome: nome.value,
                idade: idade.value
        , senha: senha ? senha.value : undefined
        , role: role ? role.value : undefined
        , actor: (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; } })()
            }
            const res = await window.api.cadastrar(usuario);
                     if(res && res.success){
                         nome.value = '';
                         idade.value = '';
                         if (senha) senha.value = '';
                         if (role) role.value = '';
                         this.mensagem.sucesso();
                     }else{
                         // tratamento de permissão específico
                         if (res && res.error === 'permission'){
                             this.mensagem.erro('Ação negada: permissões insuficientes.');
                         } else {
                             const msg = res && res.error ? res.error : undefined;
                             this.mensagem.erro(msg);
                         }
                     }
            
        })
    }
}
export default UsuarioForm;