const { ipcMain } = require('electron');
const { carregarDados } = require('../../database/db');
const Logger = require('../services/logger');

function registerDashboardHandlers() {
  ipcMain.handle('dashboard:obter', () => {
    try {
      const dados = carregarDados();
      const dashboard = {
        totalProdutos: dados.produtos ? dados.produtos.length : 0,
        estoqueTotal: dados.produtos ? dados.produtos.reduce((sum, p) => sum + (p.estoque || 0), 0) : 0,
        totalPedidos: dados.pedidos ? dados.pedidos.length : 0,
        valorEstoque: dados.produtos ? dados.produtos.reduce((sum, p) => sum + ((p.preco || 0) * (p.estoque || 0)), 0) : 0
      };
      
      Logger.log('Dashboard carregado');
      return dashboard;
    } catch (error) {
      Logger.error('Erro ao obter dashboard', error.message);
      throw error;
    }
  });

  ipcMain.handle('dashboard:vendas-mes', () => {
    try {
      const dados = carregarDados();
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const pedidosMes = (dados.pedidos || []).filter(p => {
        const dataPedido = new Date(p.data || p.criadoEm);
        return dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual;
      });

      const resultado = {
        totalVendas: pedidosMes.length,
        valorTotal: pedidosMes.reduce((sum, p) => sum + (p.total || 0), 0)
      };
      
      Logger.log('Vendas do mês calculadas');
      return resultado;
    } catch (error) {
      Logger.error('Erro ao obter vendas do mês', error.message);
      throw error;
    }
  });

  ipcMain.handle('dashboard:estoque', () => {
    try {
      const dados = carregarDados();
      const resultado = {
        totalProdutos: dados.produtos ? dados.produtos.length : 0,
        totalEstoque: dados.produtos ? dados.produtos.reduce((sum, p) => sum + (p.estoque || 0), 0) : 0,
        valorTotal: dados.produtos ? dados.produtos.reduce((sum, p) => sum + ((p.preco || 0) * (p.estoque || 0)), 0) : 0
      };
      
      Logger.log('Estoque calculado');
      return resultado;
    } catch (error) {
      Logger.error('Erro ao obter estoque', error.message);
      throw error;
    }
  });
}

module.exports = {
  registerDashboardHandlers
};
