import VendasView from "../VendasView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class VendaListar{
    constructor(){
        this.view = new VendasView();
        this.mensagem = new MensagemDeAlerta();
    }
    async renderizarLista() {
        const dados = await window.api.listar(); 
        console.log('Dados na lista de vendas', dados);
        setTimeout(() => {
            this.adicionarEventos();
        },0);
        return this.view.renderizarLista(dados);
    }
    adicionarEventos() {
        const btnfechar = document.getElementById("fechar");
            btnfechar.addEventListener("click", () => {
                this.view.fecharModal();
            })
        const container = document.getElementById("container-vendas");
        if (!container) {
            console.error("Erro: Elemento 'container-vendas' não encontrado.");
            return;
        }
        container.addEventListener("click", async (e) => {
            const idVenda = e.target.getAttribute("data-id"); 
            if (e.target.classList.contains("editar-venda")) { 
                console.log("Editar venda com ID:", idVenda);
                const venda = await window.api.buscarVendaPorId(idVenda);
                const id_venda_campo = document.getElementById("id_venda");
                const status_venda_campo = document.getElementById("status_venda");
                const metodo_pagamento_campo = document.getElementById("metodo_pagamento");
                
                if (id_venda_campo) id_venda_campo.value = venda.id_venda;
                if (status_venda_campo) status_venda_campo.value = venda.status_venda;
                if (metodo_pagamento_campo) metodo_pagamento_campo.value = venda.metodo_pagamento;
                
                this.view.abrirModal();
            }
            if (e.target.classList.contains("excluir-venda")) {
                const resultado = await window.api.removerVenda(idVenda);
                
                if (resultado) {
                    this.mensagem.sucesso("Venda excluída com sucesso!");
                    setTimeout(async () => {
                        document.getElementById("app").innerHTML = await this.renderizarLista();
                    }, 1500);
                } else {
                    this.mensagem.erro("Erro ao excluir venda!");
                }
            }

            if (e.target.classList.contains("close")) {
                this.view.fecharModal();
            }
        });
        const formulario = document.getElementById('form-venda');
        if (!formulario) {
            console.warn("Atenção: 'form-venda' não encontrado para evento de submit (edição).");
            return;
        }

        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id_venda = document.getElementById('id_venda');
            const status_venda = document.getElementById('status_venda');
            const metodo_pagamento = document.getElementById('metodo_pagamento');
            
            const vendaAtualizada = {
                id_venda: parseInt(id_venda.value),
                status_venda: status_venda.value,
                metodo_pagamento: metodo_pagamento.value,
            };
            const resultado = await window.api.atualizarVenda(vendaAtualizada);
            
            if (resultado) {
                this.mensagem.sucesso("Venda atualizada com sucesso!");
                this.view.fecharModal();
                setTimeout(async () => {
                    document.getElementById("app").innerHTML = await this.renderizarLista();
                }, 500);
            } else {
                this.mensagem.erro("Erro ao atualizar venda!");
            }
        });
    }
}

export default VendaListar;
