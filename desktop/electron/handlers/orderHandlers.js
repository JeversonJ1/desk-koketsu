const { ipcMain } = require('electron');
const { carregarDados, salvarDados } = require('../../database/db');
const Logger = require('../services/logger');
const Validator = require('../services/validator');

function registerOrderHandlers() {
  ipcMain.handle('pedidos:listar', () => {
    try {
      const dados = carregarDados();
      Logger.log('Pedidos listados');
      return dados.pedidos || [];
    } catch (error) {
      Logger.error('Erro ao listar pedidos', error.message);
      throw error;
    }
  });

  ipcMain.handle('pedidos:criar', (e, pedido) => {
    try {
      // Cliente é opcional - pode ser null para clientes não cadastrados
      if (!Array.isArray(pedido.itens) || pedido.itens.length === 0) {
        throw new Error('Itens são obrigatórios');
      }

      const dados = carregarDados();
      const id = Math.max(...(dados.pedidos || []).map(p => p.id || 0), 0) + 1;
      
      let total = 0;
      pedido.itens.forEach(item => {
        const produto = dados.produtos.find(p => p.id === item.produto_id);
        if (!produto) {
          throw new Error(`Produto ID ${item.produto_id} não encontrado`);
        }
        if (produto.estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${produto.nome}`);
        }
        total += produto.preco * item.quantidade;
      });

      // Atualizar estoque
      pedido.itens.forEach(item => {
        const produto = dados.produtos.find(p => p.id === item.produto_id);
        produto.estoque -= item.quantidade;
      });

      const newOrder = {
        id,
        cliente_id: pedido.cliente_id,
        itens: pedido.itens,
        total: parseFloat(total.toFixed(2)),
        status: 'pendente',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      };

      dados.pedidos = dados.pedidos || [];
      dados.pedidos.push(newOrder);
      salvarDados(dados);
      
      Logger.log(`Pedido criado com sucesso. ID: ${id}`, { total: newOrder.total, itens: newOrder.itens.length });
      return { sucesso: true, id, pedido: newOrder };
    } catch (error) {
      Logger.error('Erro ao criar pedido', error.message);
      throw error;
    }
  });

  ipcMain.handle('pedidos:atualizar', (e, pedido) => {
    try {
      if (!pedido.id) {
        throw new Error('ID do pedido inválido');
      }

      const dados = carregarDados();
      const index = (dados.pedidos || []).findIndex(p => p.id === pedido.id);
      
      if (index === -1) {
        throw new Error('Pedido não encontrado');
      }

      dados.pedidos[index] = {
        ...dados.pedidos[index],
        status: pedido.status || dados.pedidos[index].status,
        atualizadoEm: new Date().toISOString()
      };

      salvarDados(dados);
      Logger.log(`Pedido atualizado. ID: ${pedido.id}`, { novoStatus: dados.pedidos[index].status });
      return { sucesso: true, pedido: dados.pedidos[index] };
    } catch (error) {
      Logger.error('Erro ao atualizar pedido', error.message);
      throw error;
    }
  });

  ipcMain.handle('pedidos:excluir', (e, id) => {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new Error('ID inválido');
      }

      const dados = carregarDados();
      const index = (dados.pedidos || []).findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Pedido não encontrado');
      }

      const pedidoRemovido = dados.pedidos[index];
      dados.pedidos.splice(index, 1);
      salvarDados(dados);
      
      Logger.log(`Pedido excluído. ID: ${id}`, { total: pedidoRemovido.total });
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao excluir pedido', error.message);
      throw error;
    }
  });
}

module.exports = {
  registerOrderHandlers
};
