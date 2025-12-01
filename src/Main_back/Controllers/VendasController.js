import Vendas from "../Models/Vendas.js";

class VendasController{
    constructor() {
        this.vendaModel = new Vendas();
    }

    async listar() {
            const dados = await this.vendaModel.listar();
            console.log('Dados das vendas no controller:', dados);
            return dados;
    }

    async cadastrar(venda) {
        if (!venda.valor_venda || !venda.id_usuarios) {
            console.error("Erro: Valor da venda e ID do usuário são obrigatórios.");
            return false;
        }

        try {
            const novaVenda = await this.vendaModel.adicionar(venda);
            return novaVenda;
        } catch (error) {
            console.error('Erro ao cadastrar venda:', error);
            return false;
        }
    }
     
    async buscarVendaPorId(id) {
        if (!id) {
            console.error("Erro: ID da venda é obrigatório.");
            return null;
        }
        
        try {
            return this.vendaModel.buscarPorId(id);
        } catch (error) {
            console.error(`Erro ao buscar venda ${id}:`, error);
            return null;
        }
    } 

    async atualizarVenda(venda) {
        if (!venda.id_venda || !venda.status_venda) {
            console.error("Erro: ID da venda e Status são obrigatórios para a atualização.");
            return false;
        }

        try {
            const vendaExistente = await this.vendaModel.buscarPorId(venda.id_venda);
            if (!vendaExistente) {
                console.error(`Venda com ID ${venda.id_venda} não encontrada.`);
                return false;
            }

            const resultado = await this.vendaModel.atualizar(venda);
            return resultado;
        } catch (error) {
            console.error('Erro ao atualizar venda:', error);
            return false;
        }
    }

    async removerVenda(id_venda) {
        if (!id_venda) {
            console.error("Erro: ID da venda é obrigatório para remoção.");
            return false;
        }

        try {
            const vendaExistente = await this.vendaModel.buscarPorId(id_venda);
            if (!vendaExistente) {
                console.error(`Venda com ID ${id_venda} não encontrada.`);
                return false;
            }
            const resultado = await this.vendaModel.remover(vendaExistente);
            return resultado;
        } catch (error) {
            console.error('Erro ao remover venda:', error);
            return false;
        }
    }
}

export default VendasController;