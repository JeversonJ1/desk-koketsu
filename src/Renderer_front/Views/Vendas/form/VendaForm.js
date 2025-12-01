import VendasView from "../VendasView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class VendaForm{
    constructor() {
        this.view = new VendasView();
        this.mensagem = new MensagemDeAlerta();
    }

    renderizarFormulario() {
        setTimeout(() => {
            this.adicionarEventos();
            console.log('Eventos adicionados ao formulário de Vendas');
        }, 0);
        return this.view.renderizarFormulario(); 
    }

    adicionarEventos() {
        const formulario = document.getElementById('form-venda'); 
        if (!formulario) {
            console.error("Erro: Elemento 'form-venda' não encontrado.");
            return;
        }
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id_usuarios = document.getElementById('id_usuarios');
            const valor_venda = document.getElementById('valor_venda');
            const metodo_pagamento = document.getElementById('metodo_pagamento');
            const venda = {
                data_venda: new Date().toISOString(), 
                valor_venda: parseFloat(valor_venda.value),
                id_usuarios: parseInt(id_usuarios.value),
                metodo_pagamento: metodo_pagamento.value,
                status_venda: 'pendente'
            };
            const resultado = await window.api.cadastrar(venda); 
            if (resultado) {
                id_usuarios.value = '';
                valor_venda.value = '';
                metodo_pagamento.value = '';
                
                this.mensagem.sucesso("Venda cadastrada com sucesso!");
            } else {
                this.mensagem.erro("Erro ao cadastrar a venda. Verifique os dados.");
            }
        });
    }
}

export default VendaForm;