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
            const categoria = document.getElementById('categoria') ? document.getElementById('categoria').value : '';
            const codigo_produto = document.getElementById('codigo_produto') ? document.getElementById('codigo_produto').value : '';
            const fileInput = document.getElementById('imagem_produto');

            // Validação simples
            if (!nome || !quantidade) {
                this.mensagem.erro("Preencha o nome e a quantidade!");
                return;
            }
            
            const produto = {
                nome: nome,
                tamanho: document.getElementById('tamanho').value,
                categoria: categoria,
                codigo_produto: codigo_produto,
                quantidade: Number(quantidade), // Garante que é número
                preco_custo: Number(document.getElementById('preco_custo').value),
                preco_venda: Number(document.getElementById('preco_venda').value)
            };

            // Se houver arquivo selecionado, solicitar upload ao main via preload
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const filePath = fileInput.files[0].path;
                const savedName = await window.api.uploadImagem(filePath);
                if (savedName) produto.imagem = savedName;
            }

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