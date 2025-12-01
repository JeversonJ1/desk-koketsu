class VendasView{
    constructor(){
    }
    renderizarMenu(){
        return `<div class="container">
                    <ul>
                        <li><a href="#vendas_listar">Listar Vendas</a></li>
                        <li><a href="#vendas_cadastrar">Cadastrar Venda</a></li>
                    </ul>
                </div>`; 
    }
    renderizarLista(vendas){
        let container = `<div style="overflow-x:auto;" id="container-vendas">
                            <table>
                              <tr>
                                <th>ID Venda</th>
                                <th>Data</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>`;
        
        vendas.forEach(venda => {
            const dataFormatada = new Date(venda.data_venda).toLocaleDateString('pt-BR');
            const valorFormatado = venda.valor_venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            container += `<tr>
            <td>${venda.id_venda}</td>
            <td>${dataFormatada}</td>
            <td>${valorFormatado}</td>
            <td>${venda.status_venda}</td>
            <td> 
            <button class="editar-venda" data-id="${venda.id_venda}">Editar</button> 
            <button class="excluir-venda" data-id="${venda.id_venda}">Excluir</button>
            </td>
            </tr>`;
        });
        
        container += `</table></div>
        
        <div id="myModal" class="modal">
            <div class="modal-content">
               <span class="close" id="fechar">&times;</span>
               
               <form id="form-venda"> 
               <input type="hidden" id="id_venda"> <h3>Editar Venda</h3>
                    
                    <label for="status_venda">Status</label>
                    <select id="status_venda">
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                    </select>

                    <label for="metodo_pagamento">Método de Pagamento</label>
                    <input type="text" id="metodo_pagamento" placeholder="Ex: Cartão, Pix">
                    
                    <button type="submit">Salvar Alterações</button>
                </form>
            </div>
        </div>
        `;
        return container;
    }
    renderizarFormulario(){
        return `<form id="form-venda">
                    <h3>Cadastrar Nova Venda</h3>
                    
                    <label for="id_usuarios">ID do Cliente (Temporário)</label>
                    <input type="number" id="id_usuarios" placeholder="ID do Cliente" required>
                    
                    <label for="valor_venda">Valor Total</label>
                    <input type="number" step="0.01" id="valor_venda" placeholder="0.00" required>
                    
                    <label for="metodo_pagamento">Método de Pagamento</label>
                    <input type="text" id="metodo_pagamento" placeholder="Ex: Cartão, Pix" required>
                    
                    <button type="submit">Finalizar Venda</button>
                </form>`;
    }
    abrirModal(){
        const modal = document.getElementById("myModal")
        if (modal) modal.style.display = "block"
    }
    
    fecharModal(){
        const modal = document.getElementById("myModal")
        if (modal) modal.style.display = "none"
    }
}
export default VendasView;