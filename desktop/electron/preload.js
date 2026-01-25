const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // AUTENTICAÇÃO
  login: (username, password) => ipcRenderer.invoke('auth:login', username, password),
  logout: (sessionId) => ipcRenderer.invoke('auth:logout', sessionId),
  validateSession: (sessionId) => ipcRenderer.invoke('auth:validate', sessionId),
  changePassword: (sessionId, oldPassword, newPassword) => 
    ipcRenderer.invoke('auth:changePassword', sessionId, oldPassword, newPassword),

  // PRODUTOS
  listarProdutos: () => ipcRenderer.invoke('produtos:listar'),
  criarProduto: (p) => ipcRenderer.invoke('produtos:criar', p),
  excluirProduto: (id) => ipcRenderer.invoke('produtos:excluir', id),
  atualizarProduto: (dados) => ipcRenderer.invoke('produtos:atualizar', dados),

  // TAMANHOS
  listarTamanhos: (produtoId) => ipcRenderer.invoke('tamanhos:listar', produtoId),
  criarTamanho: (tamanho) => ipcRenderer.invoke('tamanhos:criar', tamanho),
  excluirTamanho: (id) => ipcRenderer.invoke('tamanhos:excluir', id),
  excluirTamanhosPorProduto: (produtoId) => ipcRenderer.invoke('tamanhos:excluir-por-produto', produtoId),

  // CLIENTES
  listarClientes: () => ipcRenderer.invoke('clientes:listar'),
  criarCliente: (c) => ipcRenderer.invoke('clientes:criar', c),
  atualizarCliente: (dados) => ipcRenderer.invoke('clientes:atualizar', dados),
  excluirCliente: (id) => ipcRenderer.invoke('clientes:excluir', id),

  // PEDIDOS
  listarPedidos: () => ipcRenderer.invoke('pedidos:listar'),
  criarPedido: (pedido) => ipcRenderer.invoke('pedidos:criar', pedido),
  atualizarPedido: (pedido) => ipcRenderer.invoke('pedidos:atualizar', pedido),
  excluirPedido: (id) => ipcRenderer.invoke('pedidos:excluir', id),

  // DASHBOARD
  obterDashboard: () => ipcRenderer.invoke('dashboard:obter'),
  vendasMes: () => ipcRenderer.invoke('dashboard:vendas-mes'),
  estoqueDashboard: () => ipcRenderer.invoke('dashboard:estoque'),

  // BANNERS
  obterBanners: () => ipcRenderer.invoke('banners:obter'),
  criarBanner: (banner) => ipcRenderer.invoke('banners:criar', banner),
  atualizarBanner: (index, dados) => ipcRenderer.invoke('banners:atualizar', index, dados),
  excluirBanner: (index) => ipcRenderer.invoke('banners:excluir', index),

  // CONFIGURAÇÕES
  alterarCredenciais: (dados) => ipcRenderer.invoke('config:alterar-credenciais', dados)
});
