class ServicosView {
    renderizarLista(servicos) {
        let html = `
        <div class="container-servicos">
            <div class="header-servicos">
                <h2>Serviços Disponíveis</h2>
                <a href="#servico_criar" class="btn-novo">+ Novo Serviço</a>
            </div>

            <table class="tabela-servicos">
                <thead>
                    <tr>
                        <th>Serviço</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        if (servicos.length === 0) {
            html += `<tr><td colspan="3" style="text-align:center; padding: 20px;">Nenhum serviço cadastrado.</td></tr>`;
        } else {
            servicos.forEach(s => {
                html += `
                    <tr>
                        <td>${s.nome}</td>
                        <td>R$ ${s.preco}</td>
                        <td>
                            <button class="editar-serv btn-acao" data-id="${s.uuid}">✏️</button>
                            <button class="excluir-serv btn-acao remove" data-id="${s.uuid}">🗑️</button>
                        </td>
                    </tr>`;
            });
        }

        html += `</tbody></table>
        
        <div id="modalEdicaoServico" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close-modal-servico">&times;</span>
                <h3>Editar Serviço</h3>
                <form id="form-editar-servico">
                    <input type="hidden" id="edit_uuid_servico">
                    <label>Nome:</label> <input type="text" id="edit_nome_servico" required><br>
                    <label>Preço:</label> <input type="number" step="0.01" id="edit_preco_servico" required><br>
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
                <h3>Cadastrar Novo Serviço</h3>
                <form id="form-servico">
                    <label>Nome do Serviço:</label>
                    <input type="text" id="nome" placeholder="Ex: Funilaria" required>
                    
                    <label>Preço (R$):</label>
                    <input type="number" step="0.01" id="preco" required>
                    
                    <div class="grupo-botoes" style="margin-top: 20px; display: flex; gap: 10px;">
                        <button type="submit" class="btn-salvar" style="flex: 1;">Cadastrar</button>
                        <a href="#/servico_listar" class="btn-voltar" style="flex: 1; text-align: center;">Voltar</a>
                    </div>
                </form>
            </div>
        `;
    }

    abrirModal() { document.getElementById("modalEdicaoServico").style.display = "block"; }
    fecharModal() { document.getElementById("modalEdicaoServico").style.display = "none"; }
}

export default ServicosView;
