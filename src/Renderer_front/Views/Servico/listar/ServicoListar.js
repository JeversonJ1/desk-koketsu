import ServicosView from "../ServicosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ServicoListar {
    constructor() {
        this.view = new ServicosView();
        this.mensagem = new MensagemDeAlerta();
    }

    async renderizarLista() {
        const dados = await window.api.listarServicos();
        setTimeout(() => this.adicionarEventos(), 0);
        return this.view.renderizarLista(dados);
    }

    adicionarEventos() {
        const container = document.querySelector('.container-servicos');
        if (!container) return;

        // --- Evento para fechar modal ---
        const closeBtn = document.querySelector('.close-modal-servico');
        if(closeBtn) closeBtn.onclick = () => this.view.fecharModal();

        container.addEventListener('click', async (e) => {
            const uuid = e.target.getAttribute('data-id');

            // --- EXCLUIR ---
            if (e.target.classList.contains('excluir-serv')) {
                if(confirm("Tem certeza que deseja excluir este serviço?")) {
                    const res = await window.api.removerServico(uuid);
                    if (res) {
                        this.mensagem.sucesso("Serviço removido!");
                        document.getElementById("app").innerHTML = await this.renderizarLista();
                    } else {
                        this.mensagem.erro("Erro ao remover o serviço.");
                    }
                }
            }

            // --- EDITAR (Abrir Modal) ---
            if (e.target.classList.contains('editar-serv')) {
                const servico = await window.api.buscarServico(uuid);
                document.getElementById('edit_uuid_servico').value = servico.uuid;
                document.getElementById('edit_nome_servico').value = servico.nome;
                document.getElementById('edit_preco_servico').value = servico.preco;
                this.view.abrirModal();
            }
        });

        // --- SALVAR EDIÇÃO ---
        const formEdit = document.getElementById('form-editar-servico');
        if(formEdit) {
            formEdit.addEventListener('submit', async (e) => {
                e.preventDefault();
                const servico = {
                    uuid: document.getElementById('edit_uuid_servico').value,
                    nome: document.getElementById('edit_nome_servico').value,
                    preco: Number(document.getElementById('edit_preco_servico').value)
                };
                
                const res = await window.api.atualizarServico(servico);
                if(res) {
                    this.mensagem.sucesso("Serviço atualizado!");
                    this.view.fecharModal();
                    document.getElementById("app").innerHTML = await this.renderizarLista();
                } else {
                    this.mensagem.erro("Erro ao atualizar o serviço.");
                }
            });
        }
    }
}

export default ServicoListar;

