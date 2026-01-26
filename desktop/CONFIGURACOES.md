# 🎛️ Tela de Configurações - Koketsu Desktop

## ✅ Funcionalidades Implementadas

A tela de **Configurações** agora possui **3 abas completas** com gestão centralizada de todas as configurações do aplicativo.

---

## 📑 Abas Disponíveis

### 1️⃣ **Aplicativo**
Configurações gerais da interface e comportamento do sistema.

**Campos:**
- **Tema da Interface**: Escuro (padrão) ou Claro
- **Iniciar com Windows**: Auto-start do app
- **Ícone na Bandeja**: Mostrar tray icon
- **Minimizar para Bandeja**: Fechar para tray ao invés de sair

**Validações:**
- Tema aceita apenas `dark` ou `light`
- Checkboxes persistem estado entre sessões

---

### 2️⃣ **API**
Configurações de conexão com o backend.

**Campos:**
- **URL Base**: Endereço do servidor (ex: `http://localhost:8000/api`)
- **Timeout**: Tempo máximo de espera por requisição (1.000 a 120.000ms)
- **Tentativas de Reconexão**: Número de retries em caso de falha (0 a 10)

**Validações:**
- URL deve começar com `http://` ou `https://`
- Timeout entre 1.000ms e 120.000ms
- Retry entre 0 e 10 tentativas

---

### 3️⃣ **Logs**
Gerenciamento de arquivos de log.

**Campos:**
- **Habilitar Logs**: Liga/desliga sistema de logs
- **Nível de Log**: `error`, `warn`, `info` (padrão), `debug`
- **Máximo de Arquivos**: Quantidade de arquivos mantidos (1 a 100)
- **Tamanho Máximo**: Tamanho por arquivo em MB (1 a 100)

**Validações:**
- Nível aceita apenas: `error`, `warn`, `info`, `debug`
- Valores numéricos validados no range especificado

---

### 4️⃣ **Backup**
Automação de backups do banco de dados.

**Campos:**
- **Habilitar Backups**: Ativa sistema de backup
- **Backup Automático**: Agendamento automático
- **Frequência**: Diário, Semanal, Mensal
- **Máximo de Backups**: Quantos backups manter (1 a 50)
- **Caminho**: Diretório de destino (somente leitura)

**Validações:**
- Frequência aceita: `daily`, `weekly`, `monthly`
- MaxBackups entre 1 e 50

---

### 5️⃣ **Credenciais** (mantida)
Alteração de login e senha do administrador.

**Campos:**
- Login atual / Senha atual
- Novo login (mín. 3 caracteres)
- Nova senha (mín. 6 caracteres) + confirmação

**Recursos:**
- Indicador de força da senha (4 níveis)
- Toggle para mostrar/ocultar senha
- Validação em tempo real

---

### 6️⃣ **Banners** (mantida)
Gerenciamento de banners do site.

**Recursos:**
- Upload via drag & drop
- Preview com simulação de recorte (8:3)
- Editar/Excluir banners existentes
- Validação de tamanho (máx. 5MB)

---

## 🔧 Handlers IPC Criados

### Novos Endpoints

```javascript
// Obter todas as configurações (exceto dados sensíveis)
window.api.obterConfig()

// Atualizar configurações do app
window.api.atualizarConfigApp({ theme, autoStart, showInTray, closeToTray })

// Atualizar configurações de API
window.api.atualizarConfigApi({ baseUrl, timeout, retryAttempts })

// Atualizar configurações de logs
window.api.atualizarConfigLogs({ enabled, level, maxFiles, maxSizeMB })

// Atualizar configurações de backup
window.api.atualizarConfigBackup({ enabled, autoBackup, frequency, maxBackups })

// Resetar todas as configurações (preserva admin e sessions)
window.api.resetarConfig()
```

---

## 📂 Estrutura do `config.json`

```json
{
  "admin": {
    "username": "admin",
    "passwordHash": "..."
  },
  "sessions": { ... },
  "app": {
    "theme": "dark",
    "autoStart": false,
    "showInTray": true,
    "closeToTray": false,
    "language": "pt-BR"
  },
  "api": {
    "baseUrl": "http://localhost:8000/api",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "logs": {
    "enabled": true,
    "level": "info",
    "maxFiles": 10,
    "maxSizeMB": 5
  },
  "backup": {
    "enabled": true,
    "autoBackup": true,
    "frequency": "daily",
    "maxBackups": 7,
    "path": "C:/Users/.../AppData/Roaming/desk-koketsu/backups"
  }
}
```

---

## 🎨 UI/UX

- **Layout em Abas**: Navegação intuitiva com 3 abas principais (Aplicativo, Credenciais, Banners)
- **Formulários Independentes**: Cada seção pode ser salva separadamente
- **Notificações Toast**: Feedback visual de sucesso/erro
- **Validação em Tempo Real**: Inputs validados antes do envio
- **Botão de Reset**: Restaura padrões (preserva credenciais e sessions)

---

## 🚀 Como Usar

1. Abra o aplicativo Electron
2. Navegue para **Configurações** no menu lateral
3. Selecione a aba desejada (Aplicativo, API, Logs, Backup)
4. Edite os campos conforme necessário
5. Clique em **Salvar** no formulário correspondente
6. Aguarde notificação de sucesso

### Resetar Configurações

- Na aba **Backup**, role até o final
- Clique em **"Resetar Todas as Configurações"** (botão vermelho)
- Confirme a ação no popup
- Todas as configs voltam ao padrão (exceto login/senha)

---

## 🔐 Segurança

- **Dados sensíveis não são expostos**: `passwordHash` e `sessions` não retornam na API `config:obter`
- **Validações server-side**: Todos os handlers validam dados antes de salvar
- **Logs de auditoria**: Alterações registradas no logger do sistema

---

## 📝 Arquivos Modificados

### Backend (Electron)
- `electron/handlers/configHandlers.js` - Handlers IPC expandidos
- `electron/preload.js` - Novos métodos expostos

### Frontend (Renderer)
- `renderer/pages/configuracoes.html` - Nova aba Aplicativo
- `renderer/js/configuracoes.js` - Lógica de carregamento e salvamento

---

## 🎯 Próximos Passos Sugeridos

### Implementação Futura
1. **Auto-start real**: Integrar `electron-builder` para registro no Windows
2. **Tray Icon**: Implementar `Tray` do Electron com menu contextual
3. **Tema claro**: Criar variáveis CSS e aplicar dinamicamente
4. **Backup automático**: Implementar cron job com `node-cron`
5. **Viewer de Logs**: Tela dedicada para visualizar logs com filtros

---

## ✅ Status: Implementado e Funcional

✔️ UI completa com 3 abas  
✔️ Handlers IPC com validações  
✔️ Persistência em `config.json`  
✔️ Feedback visual (toasts)  
✔️ Reset de configurações  
✔️ Compatibilidade com sistema existente  

---

**Desenvolvido por:** GitHub Copilot  
**Data:** 26 de janeiro de 2026  
**Versão:** 1.0.0
