import ProdutosView from "../ProdutosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ProdutoListar {
    constructor() {
        this.view = new ProdutosView();
        this.mensagem = new MensagemDeAlerta();
    }

    async renderizarLista() {
        const dados = await window.api.listarProdutos();
        setTimeout(() => this.adicionarEventos(), 0);
        return this.view.renderizarLista(dados);
    }

    adicionarEventos() {
        const container = document.querySelector('.container-estoque');
        
        // Evento para fechar modal
        const closeBtn = document.querySelector('.close-modal');
        if(closeBtn) closeBtn.onclick = () => this.view.fecharModal();

        container.addEventListener('click', async (e) => {
            const uuid = e.target.getAttribute('data-id');

            // --- EXCLUIR ---
            if (e.target.classList.contains('excluir-prod')) {
                if(confirm("Tem certeza que deseja excluir este item do estoque?")) {
                    const res = await window.api.removerProduto(uuid);
                    if (res) {
                        this.mensagem.sucesso("Produto removido!");
                        document.getElementById("app").innerHTML = await this.renderizarLista();
                    } else {
                        this.mensagem.erro("Erro ao remover.");
                    }
                }
            }

            // --- EDITAR (Abrir Modal) ---
            if (e.target.classList.contains('editar-prod')) {
                const produto = await window.api.buscarProduto(uuid);
                document.getElementById('edit_uuid').value = produto.uuid;
                document.getElementById('edit_nome').value = produto.nome;
                document.getElementById('edit_tamanho').value = produto.tamanho;
                document.getElementById('edit_quantidade').value = produto.quantidade;
                document.getElementById('edit_preco_venda').value = produto.preco_venda;
                document.getElementById('edit_preco_custo').value = produto.preco_custo;
                this.view.abrirModal();
            }
        });

        // --- SALVAR EDIÇÃO ---
        const formEdit = document.getElementById('form-editar-produto');
        if(formEdit) {
            formEdit.addEventListener('submit', async (e) => {
                e.preventDefault();
                const produto = {
                    uuid: document.getElementById('edit_uuid').value,
                    nome: document.getElementById('edit_nome').value,
                    tamanho: document.getElementById('edit_tamanho').value,
                    quantidade: document.getElementById('edit_quantidade').value,
                    preco_venda: document.getElementById('edit_preco_venda').value,
                    preco_custo: document.getElementById('edit_preco_custo').value
                };
                
                const res = await window.api.atualizarProduto(produto);
                if(res) {
                    this.mensagem.sucesso("Estoque atualizado!");
                    this.view.fecharModal();
                    document.getElementById("app").innerHTML = await this.renderizarLista();
                } else {
                    this.mensagem.erro("Erro ao atualizar.");
                }
            });
        }
    }
}
export default ProdutoListar;