import Produtos from '../Models/Produtos.js';
import fs from 'node:fs';
import path from 'node:path';

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
        // buscar produto para localizar imagem
        const produto = await this.model.buscarPorId(uuid);
        if (produto && produto.imagem) {
            try {
                // imagem pode ser caminho absoluto
                if (fs.existsSync(produto.imagem)) {
                    fs.unlinkSync(produto.imagem);
                } else {
                    // talvez esteja guardado apenas o nome em assets
                    const altPath = path.join(process.cwd(), 'assets', 'imagens', path.basename(produto.imagem));
                    if (fs.existsSync(altPath)) fs.unlinkSync(altPath);
                }
            } catch (err) {
                console.error('ProdutoController.remover -> erro ao apagar imagem', err);
            }
        }
        return this.model.remover(uuid);
    }
}
export default ProdutoController;