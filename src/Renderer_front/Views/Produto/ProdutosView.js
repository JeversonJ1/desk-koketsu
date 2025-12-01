class ProdutosView {
    renderizarMenu() {
        return `
            <div class="menu-estoque">
                <h2>Gerenciamento de Estoque</h2>
                <a href="#produto_listar" class="btn">Ver Estoque</a>
                <a href="#produto_criar" class="btn">Novo Produto</a>
            </div>
        `;
    }
renderizarLista(produtos) {
        let html = `
        <div class="container-estoque">
            <div class="header-estoque">
                <h2>📦 Estoque Atual</h2>
                <a href="#produto_criar" class="btn-novo">+ Novo Produto</a>
            </div>

            <table class="tabela-estoque">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Tam.</th>
                        <th>Qtd.</th>
                        <th>Preço Venda</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        if (produtos.length === 0) {
            html += `<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhum produto cadastrado. Clique em "Novo Produto".</td></tr>`;
        } else {
            produtos.forEach(p => {
                const cor = p.quantidade < 5 ? 'color: red; font-weight: bold;' : '';
                html += `
                    <tr>
                        <td>${p.nome}</td>
                        <td>${p.tamanho}</td>
                        <td style="${cor}">${p.quantidade}</td>
                        <td>R$ ${p.preco_venda}</td>
                        <td>
                            <button class="editar-prod btn-acao" data-id="${p.uuid}">✏️</button>
                            <button class="excluir-prod btn-acao remove" data-id="${p.uuid}">🗑️</button>
                        </td>
                    </tr>`;
            });
        }

        html += `</tbody></table>
        
        <div id="modalEdicao" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Editar Produto</h3>
                <form id="form-editar-produto">
                    <input type="hidden" id="edit_uuid">
                    <label>Nome:</label> <input type="text" id="edit_nome" required><br>
                    <label>Tamanho:</label> <input type="text" id="edit_tamanho"><br>
                    <label>Qtd:</label> <input type="number" id="edit_quantidade" required><br>
                    <label>Preço Venda:</label> <input type="number" step="0.01" id="edit_preco_venda"><br>
                    <label>Preço Custo:</label> <input type="number" step="0.01" id="edit_preco_custo"><br>
                    <button type="submit" class="btn-salvar">Salvar Alterações</button>
                </form>
            </div>
        </div>
        </div>`;
        return html;
    }
renderizarFormulario() {
        return `
            <div class="form-container">
                <h3>Cadastrar Nova Peça</h3>
                <form id="form-produto">
                    <label>Nome da Peça:</label>
                    <input type="text" id="nome" placeholder="Ex: Camiseta Básica" required>
                    
                    <label>Tamanho:</label>
                    <input type="text" id="tamanho" placeholder="P, M, G, 38, 40...">
                    
                    <label>Quantidade em Estoque:</label>
                    <input type="number" id="quantidade" value="1" required>
                    
                    <label>Preço de Custo (R$):</label>
                    <input type="number" step="0.01" id="preco_custo">
                    
                    <label>Preço de Venda (R$):</label>
                    <input type="number" step="0.01" id="preco_venda">
                    
                    <div class="grupo-botoes" style="margin-top: 20px; display: flex; gap: 10px;">
                        <button type="submit" class="btn-salvar" style="flex: 1;">Cadastrar</button>
                        
                        <a href="#/produto_listar" class="btn-voltar" style="flex: 1; text-align: center;">Voltar</a>
                    </div>
                </form>
            </div>
        `;
    }

    

    abrirModal() { document.getElementById("modalEdicao").style.display = "block"; }
    fecharModal() { document.getElementById("modalEdicao").style.display = "none"; }
}
export default ProdutosView;