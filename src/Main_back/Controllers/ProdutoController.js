import Produtos from '../Models/Produtos.js';

class ProdutoController {
    constructor() {
        this.model = new Produtos();
    }

    async listar() {
        return this.model.listar();
    }

    async cadastrar(produto) {
        // Validação simples
        if (!produto.nome || !produto.quantidade) return false;
        return this.model.adicionar(produto);
    }

    async buscar(uuid) {
        return this.model.buscarPorId(uuid);
    }

    async atualizar(produto) {
        if (!produto.uuid) return false;
        return this.model.atualizar(produto);
    }

    async remover(uuid) {
        return this.model.remover(uuid);
    }
}
export default ProdutoController;