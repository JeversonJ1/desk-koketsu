import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  criarProduto: (dados) => ipcRenderer.invoke("produto:criar", dados),
  listarProdutos: () => ipcRenderer.invoke("produto:listar")
});
