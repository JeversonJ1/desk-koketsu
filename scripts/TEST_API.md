# Teste rápido da API local

Este script PowerShell executa um conjunto básico de requisições às rotas REST expostas pela API local (arquivo `src/Main_back/api.js`).

Requisitos
- Windows PowerShell (pwsh) ou PowerShell integrado
- API local rodando (padrão porta 3000). Se a API estiver em outra porta, passe `-Port`.

Como usar

1. Abra um terminal PowerShell na pasta do projeto (onde está `scripts/test_api.ps1`).
2. Execute:

```powershell
pwsh ./scripts/test_api.ps1
```

ou, se quiser testar em outra porta:

```powershell
pwsh ./scripts/test_api.ps1 -Port 4000
```

O script:
- chama `/api/health`
- lista `/api/produtos`, cria um produto, busca, atualiza e deleta o produto criado
- lista `/api/servicos`, cria/busca/atualiza/deleta
- lista `/api/usuarios`
- tenta criar uma venda simples em `/api/vendas`

Notas
- O script usa `Invoke-RestMethod` e imprime o JSON de resposta. Se algum endpoint estiver inativo ou a porta estiver ocupada, você verá uma mensagem de erro.
- Se o backend principal do desktop estiver usando IPC (Electron) e não o servidor HTTP, primeiro certifique-se que `startApi` está rodando (o `main` do Electron inicia `startApi`).

Se quiser, eu adapto este script para rodar testes via IPC (chamando o processo Electron) ou para gerar um relatório de falhas em arquivo CSV/JSON.
