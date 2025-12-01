import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld (
 
'api',{
  listar: () => ipcRenderer.invoke('vendas:listar'),
  cadastrar: (vendaData) => ipcRenderer.invoke('vendas:cadastrar', vendaData),
  atualizarVenda: (venda) => ipcRenderer.invoke("vendas:editar", venda),
  removerVenda: (uuid) => ipcRenderer.invoke("vendas:removervenda", uuid),
}
)
contextBridge.exposeInMainWorld (
    'darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle')
},

)

