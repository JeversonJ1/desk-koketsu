# 🎯 Conexão ao Banco de Dados - Guia de Uso

## ✅ Configuração Completa!

Você já tem tudo configurado para conectar ao banco de dados `koketsu`.

### 📋 Passos para Usar

#### 1. **Importar o Banco no phpMyAdmin** (se ainda não fez)
```
Arquivo: desktop/database/koketsu.sql
```
- Abra: `http://localhost/phpmyadmin`
- Clique em "Importar"
- Selecione o arquivo SQL
- Clique em "Executar"

#### 2. **Verificar as Credenciais** (arquivo `.env`)
```
backend/.env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=koketsu
```

#### 3. **URLs para Testar a Conexão**

```bash
# Testar conexão ao banco
http://localhost/api/database/testar

# Buscar todos os produtos
http://localhost/api/database/produtos

# Buscar todos os clientes
http://localhost/api/database/clientes

# Buscar todos os pedidos
http://localhost/api/database/pedidos

# Buscar categorias
http://localhost/api/database/categorias
```

### 🔧 Estrutura de Arquivos Criados

```
backend/
├── Classes/
│   └── Database.php          (Conexão ao MySQL)
├── Controles/
│   └── DatabaseController.php (Controlador de APIs)
├── .env                      (Credenciais do banco)
└── .env.example              (Exemplo de credenciais)
```

### 📱 Como Usar no Electron

No seu código Electron (JavaScript), faça requisições:

```javascript
// Exemplo com fetch
async function obterProdutos() {
  const response = await fetch('http://localhost/api/database/produtos');
  const dados = await response.json();
  console.log(dados);
}

// Chamar a função
obterProdutos();
```

### 🚀 Próximos Passos

1. ✅ Importar o banco SQL
2. ✅ Testar URLs acima
3. ✅ Integrar com seu Electron
4. ✅ Criar mais endpoints conforme necessário

### 💡 Dicas

- Se der erro 404, certifique-se que o servidor PHP está rodando
- Para executar o servidor PHP: `php -S localhost:8000` (na pasta backend)
- As rotas começam com `/api/database/`
- Todas as respostas são em JSON
