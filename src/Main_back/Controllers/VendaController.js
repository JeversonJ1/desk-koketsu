import Vendas from '../Models/Vendas.js';

class VendaController {
  constructor() {
    this.model = new Vendas();
  }

  async criar(venda) {
    if (!venda || !Array.isArray(venda.itens) || venda.itens.length === 0) return { success: false, message: 'Nenhum item na venda' };
    // calcular total se não fornecido
    venda.total = venda.itens.reduce((s, it) => s + (Number(it.preco_unitario || 0) * Number(it.quantidade || 0)), 0);
    return this.model.criar(venda);
  }

  async listar() {
    return this.model.listar();
  }
}

export default VendaController;
