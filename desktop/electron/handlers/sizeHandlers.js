const { ipcMain } = require('electron');
const { carregarDados, salvarDados } = require('../../database/db');
const Logger = require('../services/logger');

function registerSizeHandlers() {
  ipcMain.handle('tamanhos:listar', (e, produtoId) => {
    try {
      const dados = carregarDados();
      const tamanhos = (dados.tamanhos || []).filter(t => t.produto_id === produtoId);
      Logger.log(`Tamanhos listados para produto ${produtoId}`);
      return tamanhos;
    } catch (error) {
      Logger.error('Erro ao listar tamanhos', error.message);
      throw error;
    }
  });

  ipcMain.handle('tamanhos:criar', (e, tamanho) => {
    try {
      const dados = carregarDados();
      dados.tamanhos = dados.tamanhos || [];
      const id = Math.max(...dados.tamanhos.map(t => t.id || 0), 0) + 1;
      
      const novoTamanho = {
        id,
        produto_id: tamanho.produto_id,
        tamanho: tamanho.tamanho,
        quantidade: parseInt(tamanho.quantidade) || 0
      };

      dados.tamanhos.push(novoTamanho);
      salvarDados(dados);
      
      Logger.log(`Tamanho criado. ID: ${id}, Produto: ${tamanho.produto_id}`);
      return { sucesso: true, id, tamanho: novoTamanho };
    } catch (error) {
      Logger.error('Erro ao criar tamanho', error.message);
      throw error;
    }
  });

  ipcMain.handle('tamanhos:excluir', (e, id) => {
    try {
      const dados = carregarDados();
      dados.tamanhos = dados.tamanhos || [];
      
      const index = dados.tamanhos.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Tamanho não encontrado');
      }

      dados.tamanhos.splice(index, 1);
      salvarDados(dados);
      
      Logger.log(`Tamanho excluído. ID: ${id}`);
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao excluir tamanho', error.message);
      throw error;
    }
  });

  ipcMain.handle('tamanhos:excluir-por-produto', (e, produtoId) => {
    try {
      const dados = carregarDados();
      dados.tamanhos = dados.tamanhos || [];
      
      const quantidade = dados.tamanhos.filter(t => t.produto_id === produtoId).length;
      dados.tamanhos = dados.tamanhos.filter(t => t.produto_id !== produtoId);
      salvarDados(dados);
      
      Logger.log(`${quantidade} tamanhos excluídos do produto ${produtoId}`);
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao excluir tamanhos por produto', error.message);
      throw error;
    }
  });
}

module.exports = {
  registerSizeHandlers
};
