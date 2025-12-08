import Servicos from '../Models/Servicos.js';

class ServicoController {
    constructor() {
        this.servicoModel = new Servicos();
    }

    async listar() {
        return this.servicoModel.listar();
    }

    async adicionar(servico) {
        // Validação simples
        if (!servico.nome || !servico.preco) return false;
        return this.servicoModel.adicionar(servico);
    }

    async buscar(uuid) {
        return this.servicoModel.buscarPorId(uuid);
    }

    async atualizar(servico) {
        if (!servico.uuid) return false;
        return this.servicoModel.atualizar(servico);
    }

    async remover(uuid) {
        return this.servicoModel.remover(uuid);
    }
}

export default ServicoController;