import ServicosView from "../ServicosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ServicoForm {
    constructor() {
        this.view = new ServicosView();
        this.mensagem = new MensagemDeAlerta();
    }

    renderizarFormulario() {
        setTimeout(() => this.adicionarEventos(), 100);
        return this.view.renderizarFormulario();
    }

    adicionarEventos() {
        const form = document.getElementById('form-servico');
        if (!form) {
            console.error("Erro: Formulário 'form-servico' não encontrado no HTML!");
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const preco = document.getElementById('preco').value;

            if (!nome || !preco) {
                this.mensagem.erro("Preencha o nome e o preço!");
                return;
            }
            
            const servico = {
                nome: nome,
                preco: Number(preco),
            };

            try {
                // No preload, a função para adicionar é 'criarServico' que chama 'servico:adicionar'
                const res = await window.api.criarServico(servico);

                if (res && res.success) {
                    this.mensagem.sucesso("Serviço cadastrado!");
                    form.reset();
                    
                    setTimeout(() => {
                        window.location.hash = "#/servico_listar";
                    }, 1500);
                } else {
                    const msg = res && res.error ? res.error : 'Erro ao salvar o serviço no banco.';
                    this.mensagem.erro(msg);
                }
            } catch (error) {
                console.error("Erro ao criar serviço:", error);
                this.mensagem.erro("Erro técnico: " + error.message);
            }
        });
    }
}

export default ServicoForm;
