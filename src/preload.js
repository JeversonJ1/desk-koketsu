import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld (
    'api', {
},
);

contextBridge.exposeInMainWorld (
    'darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle')
},

)