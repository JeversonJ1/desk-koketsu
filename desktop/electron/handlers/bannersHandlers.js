const { ipcMain } = require('electron');
const { carregarDados, salvarDados } = require('../../database/db');
const Logger = require('../services/logger');

function registerBannersHandlers() {
  // Obter todos os banners
  ipcMain.handle('banners:obter', () => {
    try {
      const dados = carregarDados();
      const banners = dados.banners || [];
      Logger.log(`Banners carregados: ${banners.length}`);
      return banners;
    } catch (error) {
      Logger.error('Erro ao obter banners', error.message);
      throw error;
    }
  });

  // Criar novo banner
  ipcMain.handle('banners:criar', (event, banner) => {
    try {
      const dados = carregarDados();
      
      if (!dados.banners) {
        dados.banners = [];
      }

      const novoBanner = {
        id: dados.banners.length > 0 ? Math.max(...dados.banners.map(b => b.id || 0)) + 1 : 1,
        nome: banner.nome,
        imagem: banner.imagem,
        dataCriacao: new Date().toISOString(),
        ativo: true
      };

      dados.banners.push(novoBanner);
      salvarDados(dados);
      
      Logger.log(`Banner criado: ${novoBanner.nome} (ID: ${novoBanner.id})`);
      return novoBanner;
    } catch (error) {
      Logger.error('Erro ao criar banner', error.message);
      throw error;
    }
  });

  // Atualizar banner existente
  ipcMain.handle('banners:atualizar', (event, index, dadosAtualizados) => {
    try {
      const dados = carregarDados();
      
      if (!dados.banners || !dados.banners[index]) {
        throw new Error('Banner não encontrado');
      }

      const bannerAtual = dados.banners[index];
      
      dados.banners[index] = {
        ...bannerAtual,
        nome: dadosAtualizados.nome || bannerAtual.nome,
        imagem: dadosAtualizados.imagem || bannerAtual.imagem,
        dataAtualizacao: new Date().toISOString()
      };

      salvarDados(dados);
      
      Logger.log(`Banner atualizado no índice ${index}: ${dados.banners[index].nome}`);
      return dados.banners[index];
    } catch (error) {
      Logger.error('Erro ao atualizar banner', error.message);
      throw error;
    }
  });

  // Excluir banner
  ipcMain.handle('banners:excluir', (event, index) => {
    try {
      const dados = carregarDados();
      
      if (!dados.banners || !dados.banners[index]) {
        throw new Error('Banner não encontrado');
      }

      const bannerExcluido = dados.banners[index];
      dados.banners.splice(index, 1);
      salvarDados(dados);
      
      Logger.log(`Banner excluído: ${bannerExcluido.nome} (índice: ${index})`);
      return { success: true, banner: bannerExcluido };
    } catch (error) {
      Logger.error('Erro ao excluir banner', error.message);
      throw error;
    }
  });

  Logger.log('Handlers de banners registrados');
}

module.exports = { registerBannersHandlers };
