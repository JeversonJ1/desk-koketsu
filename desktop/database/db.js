const Database = require('better-sqlite3');
const path = require('path');

// caminho do banco
const dbPath = path.join(__dirname, 'koketsu.db');

// conexão
const db = new Database(dbPath);

// inicialização (caso esteja vazio)
db.exec(`
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  categoria TEXT,
  preco REAL,
  estoque INTEGER,
  imagem TEXT
);
`);

module.exports = db;
