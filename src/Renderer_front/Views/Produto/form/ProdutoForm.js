import ProdutosView from "../ProdutosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ProdutoForm {
    constructor() {
        this.view = new ProdutosView();
        this.mensagem = new MensagemDeAlerta();
    }

    renderizarFormulario() {
        // O setTimeout garante que o HTML já foi desenhado na tela antes de tentar buscar o ID
        setTimeout(() => {
            this.adicionarEventos();
        }, 100); // Aumentei levemente para garantir
        return this.view.renderizarFormulario();
    }

    adicionarEventos() {
        const form = document.getElementById('form-produto');
        
        // Verificação de segurança
        if (!form) {
            console.error("Erro: Formulário 'form-produto' não encontrado no HTML!");
            return;
        }

        console.log("Evento de submit anexado ao formulário com sucesso.");

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede a página de recarregar
            console.log("Botão clicado! Iniciando cadastro...");

            const nome = document.getElementById('nome').value;
            const quantidade = document.getElementById('quantidade').value;

            // Validação simples
            if (!nome || !quantidade) {
                this.mensagem.erro("Preencha o nome e a quantidade!");
                return;
            }
            
            const produto = {
                nome: nome,
                tamanho: document.getElementById('tamanho').value,
                quantidade: Number(quantidade), // Garante que é número
                preco_custo: Number(document.getElementById('preco_custo').value),
                preco_venda: Number(document.getElementById('preco_venda').value)
            };

            console.log("Enviando produto:", produto);

            try {
                const res = await window.api.criarProduto(produto);
                console.log("Resposta do banco:", res);

                if (res) {
                    this.mensagem.sucesso("Produto cadastrado!");
                    form.reset();
                    
                    // --- REDIRECIONAMENTO ---
                    // Volta para a lista automaticamente após 1.5 segundos
                    setTimeout(() => {
                        window.location.hash = "#/produto_listar";
                    }, 1500);
                } else {
                    this.mensagem.erro("Erro ao salvar no banco.");
                }
            } catch (error) {
                console.error("Erro fatal ao criar produto:", error);
                this.mensagem.erro("Erro técnico: " + error.message);
            }
        });
    }
}
export default ProdutoForm;