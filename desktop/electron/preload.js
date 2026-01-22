const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
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
  
  // DASHBOARD
  obterDashboard: () => ipcRenderer.invoke('dashboard:obter'),
  
  // CONFIGURAÇÕES
  alterarCredenciais: (dados) => ipcRenderer.invoke('config:alterar-credenciais', dados),
  obterBanners: () => ipcRenderer.invoke('config:obter-banners'),
  criarBanner: (banner) => ipcRenderer.invoke('config:criar-banner', banner),
  atualizarBanner: (index, banner) => ipcRenderer.invoke('config:atualizar-banner', index, banner),
  excluirBanner: (index) => ipcRenderer.invoke('config:excluir-banner', index)
});

