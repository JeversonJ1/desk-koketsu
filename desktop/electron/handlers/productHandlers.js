const { ipcMain } = require('electron');
const { carregarDados, salvarDados } = require('../../database/db');
const Validator = require('../services/validator');
const Logger = require('../services/logger');

function registerProductHandlers() {
  ipcMain.handle('produtos:listar', () => {
    try {
      const dados = carregarDados();
      Logger.log('Produtos listados');
      return dados.produtos;
    } catch (error) {
      Logger.error('Erro ao listar produtos', error.message);
      throw error;
    }
  });

  ipcMain.handle('produtos:criar', (e, produto) => {
    try {
      const validation = Validator.validateProduct(produto);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const dados = carregarDados();
      const id = Math.max(...dados.produtos.map(p => p.id || 0), 0) + 1;
      
      const newProduct = {
        id,
        nome: produto.nome.trim(),
        categoria: produto.categoria?.trim() || '',
        preco: parseFloat(produto.preco),
        estoque: parseInt(produto.estoque),
        imagem: produto.imagem || null,
        criadoEm: new Date().toISOString()
      };

      dados.produtos.push(newProduct);
      salvarDados(dados);
      
      Logger.log(`Produto criado com sucesso. ID: ${id}`, { nome: newProduct.nome });
      return { sucesso: true, id, produto: newProduct };
    } catch (error) {
      Logger.error('Erro ao criar produto', error.message);
      throw error;
    }
  });

  ipcMain.handle('produtos:atualizar', (e, produto) => {
    try {
      if (!Validator._validate('id', produto.id)) {
        throw new Error('ID do produto inválido');
      }

      const validation = Validator.validateProduct(produto);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const dados = carregarDados();
      const index = dados.produtos.findIndex(p => p.id === produto.id);
      
      if (index === -1) {
        throw new Error('Produto não encontrado');
      }

      dados.produtos[index] = {
        ...dados.produtos[index],
        nome: produto.nome.trim(),
        categoria: produto.categoria?.trim() || '',
        preco: parseFloat(produto.preco),
        estoque: parseInt(produto.estoque),
        imagem: produto.imagem || null,
        atualizadoEm: new Date().toISOString()
      };

      salvarDados(dados);
      Logger.log(`Produto atualizado. ID: ${produto.id}`, { nome: dados.produtos[index].nome });
      return { sucesso: true, produto: dados.produtos[index] };
    } catch (error) {
      Logger.error('Erro ao atualizar produto', error.message);
      throw error;
    }
  });

  ipcMain.handle('produtos:excluir', (e, id) => {
    try {
      if (!Validator._validate('id', id)) {
        throw new Error('ID inválido');
      }

      const dados = carregarDados();
      const index = dados.produtos.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Produto não encontrado');
      }

      const produtoRemovido = dados.produtos[index];
      dados.produtos.splice(index, 1);
      salvarDados(dados);
      
      Logger.log(`Produto excluído. ID: ${id}`, { nome: produtoRemovido.nome });
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao excluir produto', error.message);
      throw error;
    }
  });
}

module.exports = {
  registerProductHandlers
};
