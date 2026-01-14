const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  listarProdutos: () => ipcRenderer.invoke('produtos:listar'),
  criarProduto: (produto) => ipcRenderer.invoke('produtos:criar', produto),
  excluirProduto: (id) => ipcRenderer.invoke('produtos:excluir', id)
});
