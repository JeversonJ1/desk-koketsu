const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, 'koketsu.db')
);

// PRODUTOS
db.prepare(`
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  categoria TEXT,
  preco REAL,
  estoque INTEGER,
  imagem TEXT
)
`).run();

// PEDIDOS
db.prepare(`
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total REAL,
  data TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// ITENS DO PEDIDO
db.prepare(`
CREATE TABLE IF NOT EXISTS itens_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER,
  produto_id INTEGER,
  quantidade INTEGER,
  preco REAL
)
`).run();

module.exports = db;
