import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Rotas de Produtos (Estoque)
  listarProdutos: () => ipcRenderer.invoke("produto:listar"),
  criarProduto: (dados) => ipcRenderer.invoke("produto:criar", dados),
  buscarProduto: (uuid) => ipcRenderer.invoke("produto:buscar", uuid),
  atualizarProduto: (dados) => ipcRenderer.invoke("produto:atualizar", dados),
  removerProduto: (uuid) => ipcRenderer.invoke("produto:remover", uuid),
  
  // Rotas de Usuários (Mantendo o que você já tinha, se necessário)
  listarUsuarios: () => ipcRenderer.invoke("usuario:listar"),
  // ... adicione as outras de usuário se ainda usar
});