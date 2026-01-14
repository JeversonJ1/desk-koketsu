const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // PRODUTOS
  listarProdutos: () => ipcRenderer.invoke('produtos:listar'),
  criarProduto: (p) => ipcRenderer.invoke('produtos:criar', p),
  excluirProduto: (id) => ipcRenderer.invoke('produtos:excluir', id),
  atualizarProduto: (p) => ipcRenderer.invoke('produtos:atualizar', p),

  // PEDIDOS
  listarProdutosPedido: () => ipcRenderer.invoke('pedidos:produtos'),
  criarPedido: (dados) => ipcRenderer.invoke('pedidos:criar', dados),

  // DASHBOARD
  vendasMes: () => ipcRenderer.invoke('dashboard:vendas-mes'),
  estoqueDashboard: () => ipcRenderer.invoke('dashboard:estoque'),
});
