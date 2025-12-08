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
                <button id="btn_logout" style="margin-left:auto; background:#e74c3c; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">Sair</button>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input type="search" id="buscar_produto" placeholder="Buscar por nome..." style="padding:8px; border-radius:4px; border:1px solid #ccc; min-width:240px;">
                    <select id="filtro_qtd_operador" style="padding:8px; border-radius:4px; border:1px solid #ccc;">
                        <option value="">Qtd</option>
                        <option value="lt">&lt;=</option>
                        <option value="gt">&gt;=</option>
                        <option value="eq">=</option>
                    </select>
                    <input type="number" id="filtro_qtd_valor" placeholder="0" style="padding:8px; border-radius:4px; border:1px solid #ccc; width:100px;">
                    ${(() => { try { const u = JSON.parse(localStorage.getItem('user')); return (u && u.role === 'admin') ? '<a href="#produto_criar" class="btn-novo">+ Novo Produto</a>' : ''; } catch (e) { return ''; } })()}
                </div>
            </div>

            <table class="tabela-estoque">
                <thead>
                    <tr>
                        <th data-col="nome" style="cursor:pointer">Produto <span class="sort-ind" data-col="nome"></span></th>
                        <th data-col="tamanho" style="cursor:pointer">Tam. <span class="sort-ind" data-col="tamanho"></span></th>
                        <th data-col="codigo_produto" style="cursor:pointer">Código <span class="sort-ind" data-col="codigo_produto"></span></th>
                        <th>Imagem</th>
                        <th data-col="quantidade" style="cursor:pointer">Qtd. <span class="sort-ind" data-col="quantidade"></span></th>
                        <th data-col="preco_venda" style="cursor:pointer">Preço Venda <span class="sort-ind" data-col="preco_venda"></span></th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="produtos_tbody">`;

    html += this.renderizarLinhas(produtos);

        html += `</tbody></table>
        
        <div id="modalEdicao" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Editar Produto</h3>
                <form id="form-editar-produto">
                    <input type="hidden" id="edit_uuid">
                    <label>Nome:</label> <input type="text" id="edit_nome" required><br>
                    <label>Tamanho:</label> <input type="text" id="edit_tamanho"><br>
                    <label>Categoria:</label> <input type="text" id="edit_categoria"><br>
                    <label>Código do Produto:</label> <input type="text" id="edit_codigo_produto"><br>
                    <label>Imagem (substituir):</label> <input type="file" id="edit_imagem_produto" accept="image/*"><br>
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

    renderizarLinhas(produtos) {
        let rows = '';
        if (!produtos || produtos.length === 0) {
            rows = `<tr><td colspan="7" style="text-align:center; padding: 20px;">Nenhum produto cadastrado. Clique em "Novo Produto".</td></tr>`;
        } else {
            produtos.forEach(p => {
                const cor = p.quantidade < 5 ? 'color: red; font-weight: bold;' : '';
                rows += `
                    <tr>
                        <td>${p.nome}</td>
                        <td>${p.tamanho}</td>
                        <td>${p.codigo_produto || ''}</td>
                        <td>${p.imagem ? `<img src="file://${p.imagem.replace(/\\/g, '/')}" style="height:40px; object-fit:cover;"/>` : ''}</td>
                        <td style="${cor}">${p.quantidade}</td>
                        <td>R$ ${p.preco_venda}</td>
                        <td>
                            ${(() => { try { const u = JSON.parse(localStorage.getItem('user')); if (u && u.role === 'admin') { return `<button class="editar-prod btn-acao" data-id="${p.uuid}">✏️</button>\n                            <button class="excluir-prod btn-acao remove" data-id="${p.uuid}">🗑️</button>` } return ''; } catch(e){ return ''; } })()}
                        </td>
                    </tr>`;
            });
        }
        return rows;
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
                    
                    <label>Categoria:</label>
                    <input type="text" id="categoria" placeholder="Ex: Camisetas, Calçados...">

                    <label>Código do Produto:</label>
                    <input type="text" id="codigo_produto" placeholder="Código interno ou referência">

                    <label>Imagem do Produto:</label>
                    <input type="file" id="imagem_produto" accept="image/*">

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