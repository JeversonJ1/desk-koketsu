#!/usr/bin/env node

/**
 * 🚀 GUIA RÁPIDO DE INÍCIO - KOKETSU DESKTOP REFATORADO
 * 
 * Este arquivo contém instruções passo-a-passo para começar
 * com o projeto refatorado.
 */

console.clear();
console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         🚀 KOKETSU DESKTOP - GUIA RÁPIDO DE INÍCIO         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

⚡ INÍCIO RÁPIDO (2 minutos):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Abra o terminal na pasta 'desktop':
    cd desktop

2️⃣  Instale dependências (primeira vez):
    npm install

3️⃣  Inicie a aplicação:
    npm start

4️⃣  Faça login:
    Usuário: admin
    Senha:   admin123

5️⃣  Explorar:
    • Dashboard: Estatísticas
    • Produtos: CRUD com validação
    • Clientes: Gerenciamento
    • Pedidos: Criar e acompanhar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 DOCUMENTAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivo                 | Descrição
────────────────────────┼──────────────────────────────────
README_REFATORACAO.md   | 🔴 COMECE AQUI! Visão completa
ESTRUTURA.md            | Diagrama do projeto
MELHORIAS.md            | Detalhes de cada melhoria
TESTES.md               | Como testar tudo
CHANGELOG.md            | Histórico de mudanças

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 CREDENCIAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuário:  admin
Senha:    admin123

⚠️  MUDE PARA PRODUÇÃO!

Localização: electron/services/authService.js (linha 21)

const defaultConfig = {
  admin: {
    username: 'admin',
    passwordHash: hashPassword('admin123'),  ← MUDE AQUI
  }
};

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ESTRUTURA PRINCIPAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

electron/
  ├── main.js                 ← Inicializa tudo
  ├── preload.js              ← Bridge seguro
  ├── services/               ← Lógica compartilhada
  │   ├── logger.js           ← Logs profissionais
  │   ├── authService.js      ← Autenticação
  │   └── validator.js        ← Validação
  └── handlers/               ← IPC handlers
      ├── authHandlers.js     ← Login/Logout
      ├── productHandlers.js  ← Produtos
      ├── clientHandlers.js   ← Clientes
      └── orderHandlers.js    ← Pedidos

renderer/
  └── pages/
      ├── login.html          ← Página de login
      ├── dashboard.html      ← Dashboard
      ├── produtos.html       ← Gestão de produtos
      ├── clientes.html       ← Gestão de clientes
      └── pedidos.html        ← Gestão de pedidos

storage/
  └── logs/                   ← Arquivos de log
      └── app-2024-01-24.log  ← Logs do dia

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SUAS PRIMEIRAS TAREFAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CRÍTICO (HOJE):
  • Leia README_REFATORACAO.md
  • Teste o login
  • Verifique os logs
  • Mude a senha padrão

✓ IMPORTANTE (ESTA SEMANA):
  • Teste todos os CRUDs
  • Implemente backup automático
  • Adicione 2FA (opcional)
  • Configure variáveis de ambiente

✓ FUTURO:
  • Integrar SQLite
  • API REST
  • Aplicativo mobile
  • Sincronização nuvem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 COMANDOS ÚTEIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Desenvolver
npm start                    # Inicia com DevTools

# Desenvolvimento com variável de ambiente
NODE_ENV=development npm start

# Produção
NODE_ENV=production npm start

# Limpar logs antigos
rm storage/logs/*.log

# Ver logs em tempo real
Get-Content storage/logs/app-*.log -Tail 10 -Wait

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐛 TROUBLESHOOTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problema: "Module not found: electron"
Solução:  npm install

Problema: "sessionId is required"
Solução:  Faça login novamente

Problema: "Dados inválidos"
Solução:  Verifique os dados enviados
          Veja os logs em storage/logs/

Problema: "Port 5173 already in use"
Solução:  Feche outras instâncias
          Ou use outra porta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DADOS DE TESTE INCLUSOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Produtos:  20 produtos com categoria e preço
Clientes:  20 clientes com contato
Pedidos:   Estrutura pronta para criar

Todos os dados são inicializados em database/data.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ DIFERENCIAIS IMPLEMENTADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Autenticação com hash SHA256
✓ Sessões com expiração automática
✓ Validação em 3 camadas
✓ Logs profissionais separados por dia
✓ DevTools apenas em desenvolvimento
✓ Context Isolation habilitada
✓ Node Integration desabilitada
✓ Arquitetura 100% modular
✓ Documentação completa
✓ Exemplos práticos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 LEARNING PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Entenda a autenticação:
   electron/services/authService.js

2. Veja como validar:
   electron/services/validator.js

3. Estude um handler:
   electron/handlers/productHandlers.js

4. Implemente uma nova rota:
   Copie productHandlers.js e adapte

5. Teste no renderer:
   renderer/js/produtos.js (exemplo)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CHECKLIST PRÉ-PRODUÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Alterar senha padrão
[ ] Configurar variáveis de ambiente
[ ] Desabilitar DevTools
[ ] Implementar backup automático
[ ] Testar com 100+ registros
[ ] Revisar logs
[ ] Documentar alterações
[ ] Treinar usuários
[ ] Planejar suporte
[ ] Preparar rollback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 SUPORTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dúvida sobre:          Arquivo:
─────────────────────  ──────────────────────
Autenticação           MELHORIAS.md → Segurança
Validação              MELHORIAS.md → Validação
Logs                   MELHORIAS.md → Logging
Estrutura              ESTRUTURA.md
Como testar            TESTES.md
Detalhes gerais        README_REFATORACAO.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 TUDO PRONTO!

Seu projeto agora é PROFISSIONAL, SEGURO e MANTÍVEL.

Desenvolvido em: 24 de janeiro de 2026
Status: ✅ Pronto para uso
Versão: 1.0.0

Boa sorte com seu desenvolvimento! 🚀

`);
