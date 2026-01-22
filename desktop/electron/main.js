const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { carregarDados, salvarDados } = require('../database/db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/pages/login.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// =====================
// PRODUTOS
// =====================
ipcMain.handle('produtos:listar', () => {
  const dados = carregarDados();
  return dados.produtos;
});

ipcMain.handle('produtos:criar', (e, p) => {
  try {
    if (!p.nome || p.preco <= 0 || p.estoque < 0) {
      throw new Error('Dados inválidos: Nome é obrigatório, preço > 0 e estoque >= 0');
    }
    const dados = carregarDados();
    const id = Math.max(...dados.produtos.map(pr => pr.id), 0) + 1;
    dados.produtos.push({
      id,
      nome: p.nome,
      categoria: p.categoria,
      preco: p.preco,
      estoque: p.estoque,
      imagem: p.imagem
    });
    salvarDados(dados);
    console.log('Produto criado com ID:', id);
    return { sucesso: true, id };
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    throw erro;
  }
});

ipcMain.handle('produtos:excluir', (e, id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }
    const dados = carregarDados();
    dados.produtos = dados.produtos.filter(p => p.id !== id);
    salvarDados(dados);
    console.log('Produto excluído:', id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);
    throw erro;
  }
});

ipcMain.handle('produtos:atualizar', (e, p) => {
  try {
    if (!p.id || !p.nome || p.preco <= 0 || p.estoque < 0) {
      throw new Error('Dados inválidos para atualização');
    }
    const dados = carregarDados();
    const produto = dados.produtos.find(pr => pr.id === p.id);
    if (!produto) throw new Error('Produto não encontrado');
    
    produto.nome = p.nome;
    produto.categoria = p.categoria;
    produto.preco = p.preco;
    produto.estoque = p.estoque;
    produto.imagem = p.imagem;
    
    salvarDados(dados);
    console.log('Produto atualizado:', p.id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
});

// =====================
// TAMANHOS
// =====================
ipcMain.handle('tamanhos:listar', (e, produtoId) => {
  const dados = carregarDados();
  return dados.tamanhos.filter(t => t.produto_id === produtoId);
});

ipcMain.handle('tamanhos:criar', (e, tamanho) => {
  const dados = carregarDados();
  const id = Math.max(...dados.tamanhos.map(t => t.id || 0), 0) + 1;
  dados.tamanhos.push({
    id,
    produto_id: tamanho.produto_id,
    tamanho: tamanho.tamanho,
    quantidade: tamanho.quantidade
  });
  salvarDados(dados);
  return { sucesso: true, id };
});

ipcMain.handle('tamanhos:excluir', (e, id) => {
  const dados = carregarDados();
  dados.tamanhos = dados.tamanhos.filter(t => t.id !== id);
  salvarDados(dados);
  return { sucesso: true };
});

ipcMain.handle('tamanhos:excluir-por-produto', (e, produtoId) => {
  const dados = carregarDados();
  dados.tamanhos = dados.tamanhos.filter(t => t.produto_id !== produtoId);
  salvarDados(dados);
  return { sucesso: true };
});

// =====================
// CLIENTES
// =====================
ipcMain.handle('clientes:listar', () => {
  const dados = carregarDados();
  return dados.clientes.filter(c => !c.excluido_em);
});

ipcMain.handle('clientes:criar', (e, c) => {
  try {
    if (!c.nome_clientes || !c.email_clientes) {
      throw new Error('Nome e Email são obrigatórios');
    }
    const dados = carregarDados();
    const id = Math.max(...dados.clientes.map(cl => cl.id_cliente), 0) + 1;
    dados.clientes.push({
      id_cliente: id,
      nome_clientes: c.nome_clientes,
      email_clientes: c.email_clientes,
      telefone_clientes: c.telefone_clientes || null,
      endereco_clientes: c.endereco_clientes || null,
      data_cadastro: new Date().toISOString(),
      excluido_em: null
    });
    salvarDados(dados);
    console.log('Cliente criado com ID:', id);
    return { sucesso: true, id };
  } catch (erro) {
    console.error('Erro ao criar cliente:', erro);
    throw erro;
  }
});

ipcMain.handle('clientes:atualizar', (e, c) => {
  try {
    if (!c.id || !c.nome_clientes || !c.email_clientes) {
      throw new Error('ID, Nome e Email são obrigatórios');
    }
    const dados = carregarDados();
    const cliente = dados.clientes.find(cl => cl.id_cliente === c.id);
    if (!cliente) throw new Error('Cliente não encontrado');
    
    cliente.nome_clientes = c.nome_clientes;
    cliente.email_clientes = c.email_clientes;
    cliente.telefone_clientes = c.telefone_clientes || null;
    cliente.endereco_clientes = c.endereco_clientes || null;
    cliente.atualizado_em = new Date().toISOString();
    
    salvarDados(dados);
    console.log('Cliente atualizado:', c.id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
    throw erro;
  }
});

ipcMain.handle('clientes:excluir', (e, id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }
    const dados = carregarDados();
    const cliente = dados.clientes.find(cl => cl.id_cliente === id);
    if (!cliente) throw new Error('Cliente não encontrado');
    
    cliente.excluido_em = new Date().toISOString();
    
    salvarDados(dados);
    console.log('Cliente excluído:', id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao excluir cliente:', erro);
    throw erro;
  }
});

// =====================
// PEDIDOS
// =====================
ipcMain.handle('pedidos:produtos', () => {
  const dados = carregarDados();
  return dados.produtos;
});

ipcMain.handle('pedidos:criar', (e, pedidoData) => {
  const dados = carregarDados();
  const id = Math.max(...dados.pedidos.map(p => p.id || 0), 0) + 1;
  
  dados.pedidos.push({
    id,
    total: pedidoData.total,
    data: new Date().toISOString()
  });

  pedidoData.itens.forEach(i => {
    const itemId = Math.max(...dados.itens_pedido.map(it => it.id || 0), 0) + 1;
    dados.itens_pedido.push({
      id: itemId,
      pedido_id: id,
      produto_id: i.produto_id,
      quantidade: i.quantidade,
      preco: i.preco
    });
    
    // Baixar estoque
    const produto = dados.produtos.find(p => p.id === i.produto_id);
    if (produto) {
      produto.estoque -= i.quantidade;
    }
  });

  salvarDados(dados);
  return { sucesso: true, id };
});

// =====================
// DASHBOARD
// =====================
ipcMain.handle('dashboard:obter', () => {
  const dados = carregarDados();
  return {
    totalProdutos: dados.produtos.length,
    estoqueTotal: dados.produtos.reduce((sum, p) => sum + p.estoque, 0),
    totalPedidos: dados.pedidos.length
  };
});

ipcMain.handle('dashboard:vendas-mes', () => {
  const dados = carregarDados();
  return {
    totalVendas: dados.pedidos.length,
    valorTotal: dados.pedidos.reduce((sum, p) => sum + (p.total || 0), 0)
  };
});

ipcMain.handle('dashboard:estoque', () => {
  const dados = carregarDados();
  return {
    totalProdutos: dados.produtos.length,
    totalEstoque: dados.produtos.reduce((sum, p) => sum + p.estoque, 0),
    valorTotal: dados.produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0)
  };
});
// =====================
// CONFIGURAÇÕES
// =====================
ipcMain.handle('config:alterar-credenciais', (e, dados) => {
  try {
    // Validar credenciais atuais (simulado)
    if (dados.loginAtual !== 'admin' || dados.senhaAtual !== 'admin123') {
      throw new Error('Login ou senha atual inválidos');
    }
    
    // Salvar novas credenciais em arquivo de configuração
    const configPath = path.join(__dirname, '../database/config.json');
    const config = {
      login: dados.novoLogin,
      senha: dados.novaSenha,
      dataAtualizacao: new Date().toISOString()
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Credenciais alteradas com sucesso');
    
    return { sucesso: true, mensagem: 'Credenciais alteradas com sucesso' };
  } catch (erro) {
    console.error('Erro ao alterar credenciais:', erro);
    throw erro;
  }
});

ipcMain.handle('config:obter-banners', () => {
  try {
    const bannersPath = path.join(__dirname, '../database/banners.json');
    
    if (!fs.existsSync(bannersPath)) {
      return [];
    }
    
    const conteudo = fs.readFileSync(bannersPath, 'utf8');
    const data = JSON.parse(conteudo);
    return Array.isArray(data) ? data : [];
  } catch (erro) {
    console.error('Erro ao obter banners:', erro);
    return [];
  }
});

ipcMain.handle('config:criar-banner', (e, banner) => {
  try {
    const bannersPath = path.join(__dirname, '../database/banners.json');
    let banners = [];
    
    if (fs.existsSync(bannersPath)) {
      const conteudo = fs.readFileSync(bannersPath, 'utf8');
      banners = JSON.parse(conteudo) || [];
    }
    
    if (!Array.isArray(banners)) {
      banners = [];
    }
    
    banners.push({
      nome: banner.nome,
      imagem: banner.imagem,
      dataCriacao: new Date().toISOString()
    });
    
    fs.writeFileSync(bannersPath, JSON.stringify(banners, null, 2), 'utf8');
    console.log('Banner criado com sucesso');
    
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao criar banner:', erro);
    throw erro;
  }
});

ipcMain.handle('config:atualizar-banner', (e, index, banner) => {
  try {
    const bannersPath = path.join(__dirname, '../database/banners.json');
    let banners = [];
    
    if (fs.existsSync(bannersPath)) {
      const conteudo = fs.readFileSync(bannersPath, 'utf8');
      banners = JSON.parse(conteudo) || [];
    }
    
    if (!Array.isArray(banners) || !banners[index]) {
      throw new Error('Banner não encontrado');
    }
    
    // Atualizar apenas os campos fornecidos
    if (banner.nome) banners[index].nome = banner.nome;
    if (banner.imagem) banners[index].imagem = banner.imagem;
    banners[index].dataAtualizacao = new Date().toISOString();
    
    fs.writeFileSync(bannersPath, JSON.stringify(banners, null, 2), 'utf8');
    console.log('Banner atualizado com sucesso');
    
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao atualizar banner:', erro);
    throw erro;
  }
});

ipcMain.handle('config:excluir-banner', (e, index) => {
  try {
    const bannersPath = path.join(__dirname, '../database/banners.json');
    
    if (!fs.existsSync(bannersPath)) {
      throw new Error('Nenhum banner encontrado');
    }
    
    let banners = JSON.parse(fs.readFileSync(bannersPath, 'utf8')) || [];
    
    if (!Array.isArray(banners) || !banners[index]) {
      throw new Error('Banner não encontrado');
    }
    
    banners.splice(index, 1);
    fs.writeFileSync(bannersPath, JSON.stringify(banners, null, 2), 'utf8');
    console.log('Banner excluído com sucesso');
    
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao excluir banner:', erro);
    throw erro;
  }
});