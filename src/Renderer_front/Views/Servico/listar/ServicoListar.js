import ServicosView from "../ServicosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ServicoListar {
    constructor() {
        this.view = new ServicosView();
        this.mensagem = new MensagemDeAlerta();
    }

    async renderizarLista() {
    const res = await window.api.listarServicos();
    const dados = res && res.success ? (Array.isArray(res.data) ? res.data : []) : [];
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
                    if (res && res.success) {
                        this.mensagem.sucesso("Serviço removido!");
                        document.getElementById("app").innerHTML = await this.renderizarLista();
                    } else {
                        const msg = res && res.error ? res.error : 'Erro ao remover o serviço.';
                        this.mensagem.erro(msg);
                    }
                }
            }

            // --- EDITAR (Abrir Modal) ---
            if (e.target.classList.contains('editar-serv')) {
                const res = await window.api.buscarServico(uuid);
                const servico = res && res.success ? res.data || res : null;
                if (servico) {
                    document.getElementById('edit_uuid_servico').value = servico.uuid;
                    document.getElementById('edit_nome_servico').value = servico.nome;
                    document.getElementById('edit_preco_servico').value = servico.preco;
                    this.view.abrirModal();
                } else {
                    this.mensagem.erro('Serviço não encontrado.');
                }
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
                if(res && res.success) {
                    this.mensagem.sucesso("Serviço atualizado!");
                    this.view.fecharModal();
                    document.getElementById("app").innerHTML = await this.renderizarLista();
                } else {
                    const msg = res && res.error ? res.error : 'Erro ao atualizar o serviço.';
                    this.mensagem.erro(msg);
                }
            });
        }
    }
}

export default ServicoListar;

