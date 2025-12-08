class UsuariosView{
    constructor(){
    }
    renderizarMenu(){
        return `<div class="container">
                    <ul>
                        <li><a href="#usuario_criar">Criar Usuário</a></li>
                        <li><a href="#usuario_listar">Listar Usuários</a></li>
                    </ul>
                </div>`;
    }



    renderizarLista(Usuarios){
        let container = `<div style="overflow-x:auto;" id="container">
                            <table>
                            <tr>
                              <th>Nome</th><th>Idade</th><th>ações</th>
                            </tr>`;
        Usuarios.forEach(usuario => { // data = atributto
            container += `<tr><td> ${usuario.nome} </td><td> ${usuario.idade} </td><td> 
            <button class="editar-user" data-id="${usuario.uuid}">Editar</button>
            <button class="excluir-user" data-id="${usuario.uuid}">Excluir</button> </td><tr>`
        });
    container += `</table></div>
    <!-- The Modal -->
<div id="myModal" class="modal">
    
  <!-- Modal content -->
    <div class="modal-content">
    <span class="close">&times;</span>
    <form id="form-formulario">
                    <input type="hidden" id="id" />
                    <label>Nome:</label>
                    <input type="text" id="nome"/>
                    <label>Idade:</label>
                    <input type="number" id="idade"/>
                    <label>Senha:</label>
                    <input type="password" id="senha"/>
                    <label>Role:</label>
                    <select id="role">
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button>Salvar</button>
                </form>
  </div>
    
</div>`;
        return container;
    }
    renderizarFomulario(){
        return `<form id="form-usuario">
                    <label>Nome:</label>
                    <input type="text" id="nome"/>
                    <label>Idade:</label>
                    <input type="number" id="idade"/>
                    <label>Senha:</label>
                    <input type="password" id="senha"/>
                    <label>Role:</label>
                    <select id="role">
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button>Salvar</button>
                </form>`
            
    }
    abrirModal(){
        const modal = document.getElementById("myModal")
        modal.style.display = "block";
    }
    fecharModal(){
        const modal = document.getElementById("myModal")
        modal.style.display = "none";
    }
}
export default UsuariosView;