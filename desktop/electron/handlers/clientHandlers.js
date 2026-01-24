const { ipcMain } = require('electron');
const { carregarDados, salvarDados } = require('../../database/db');
const Validator = require('../services/validator');
const Logger = require('../services/logger');

function registerClientHandlers() {
  ipcMain.handle('clientes:listar', () => {
    try {
      const dados = carregarDados();
      Logger.log('Clientes listados');
      return dados.clientes;
    } catch (error) {
      Logger.error('Erro ao listar clientes', error.message);
      throw error;
    }
  });

  ipcMain.handle('clientes:criar', (e, cliente) => {
    try {
      const validation = Validator.validateClient(cliente);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const dados = carregarDados();
      const id = Math.max(...dados.clientes.map(c => c.id_cliente || 0), 0) + 1;
      
      const newClient = {
        id_cliente: id,
        nome_clientes: cliente.nome_clientes.trim(),
        email_clientes: cliente.email_clientes.toLowerCase().trim(),
        telefone_clientes: cliente.telefone_clientes.trim(),
        endereco_clientes: cliente.endereco_clientes.trim(),
        criadoEm: new Date().toISOString()
      };

      dados.clientes.push(newClient);
      salvarDados(dados);
      
      Logger.log(`Cliente criado com sucesso. ID: ${id}`, { nome: newClient.nome_clientes });
      return { sucesso: true, id, cliente: newClient };
    } catch (error) {
      Logger.error('Erro ao criar cliente', error.message);
      throw error;
    }
  });

  ipcMain.handle('clientes:atualizar', (e, cliente) => {
    try {
      if (!Validator._validate('id', cliente.id_cliente)) {
        throw new Error('ID do cliente inválido');
      }

      const validation = Validator.validateClient(cliente);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const dados = carregarDados();
      const index = dados.clientes.findIndex(c => c.id_cliente === cliente.id_cliente);
      
      if (index === -1) {
        throw new Error('Cliente não encontrado');
      }

      dados.clientes[index] = {
        ...dados.clientes[index],
        nome_clientes: cliente.nome_clientes.trim(),
        email_clientes: cliente.email_clientes.toLowerCase().trim(),
        telefone_clientes: cliente.telefone_clientes.trim(),
        endereco_clientes: cliente.endereco_clientes.trim(),
        atualizadoEm: new Date().toISOString()
      };

      salvarDados(dados);
      Logger.log(`Cliente atualizado. ID: ${cliente.id_cliente}`);
      return { sucesso: true, cliente: dados.clientes[index] };
    } catch (error) {
      Logger.error('Erro ao atualizar cliente', error.message);
      throw error;
    }
  });

  ipcMain.handle('clientes:excluir', (e, id) => {
    try {
      if (!Validator._validate('id', id)) {
        throw new Error('ID inválido');
      }

      const dados = carregarDados();
      const index = dados.clientes.findIndex(c => c.id_cliente === id);
      
      if (index === -1) {
        throw new Error('Cliente não encontrado');
      }

      const clienteRemovido = dados.clientes[index];
      dados.clientes.splice(index, 1);
      salvarDados(dados);
      
      Logger.log(`Cliente excluído. ID: ${id}`, { nome: clienteRemovido.nome_clientes });
      return { sucesso: true };
    } catch (error) {
      Logger.error('Erro ao excluir cliente', error.message);
      throw error;
    }
  });
}

module.exports = {
  registerClientHandlers
};
