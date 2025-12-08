import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Rotas de Produtos (Estoque)
  listarProdutos: () => ipcRenderer.invoke("produto:listar"),
  criarProduto: (dados) => ipcRenderer.invoke("produto:criar", dados),
  uploadImagem: (filePath) => ipcRenderer.invoke('produto:upload_imagem', filePath),
  buscarProduto: (uuid) => ipcRenderer.invoke("produto:buscar", uuid),
  atualizarProduto: (dados) => ipcRenderer.invoke("produto:atualizar", dados),
  removerProduto: (uuid) => ipcRenderer.invoke("produto:remover", uuid),
  
  // Rotas de Serviços
  listarServicos: () => ipcRenderer.invoke("servico:listar"),
  criarServico: (dados) => ipcRenderer.invoke("servico:adicionar", dados),
  buscarServico: (uuid) => ipcRenderer.invoke("servico:buscar", uuid),
  atualizarServico: (dados) => ipcRenderer.invoke("servico:atualizar", dados),
  removerServico: (uuid) => ipcRenderer.invoke("servico:remover", uuid),

  // Rotas de Usuários (Mantendo o que você já tinha, se necessário)
  listarUsuarios: () => ipcRenderer.invoke("usuario:listar"),
  login: (dados) => ipcRenderer.invoke('usuario:login', dados),
  logout: () => ipcRenderer.invoke('usuario:logout'),
  criarUsuario: (dados) => ipcRenderer.invoke('usuario:cadastrar', dados),
  cadastrar: (dados) => ipcRenderer.invoke('usuario:cadastrar', dados),
  buscarUsuario: (uuid) => ipcRenderer.invoke('usuario:buscar', uuid),
  atualizarUsuario: (dados) => ipcRenderer.invoke('usuario:atualizar', dados),
  removerUsuario: (uuid) => ipcRenderer.invoke('usuario:remover', uuid),
  // Rotas de Vendas (PDV)
  criarVenda: (dados) => ipcRenderer.invoke('venda:criar', dados),
  listarVendas: () => ipcRenderer.invoke('venda:listar'),
  // ... adicione as outras de usuário se ainda usar
});