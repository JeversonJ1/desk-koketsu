import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import bcrypt from 'bcryptjs';

// Pode manter o nome que você preferir aqui
const dbPath = path.join(app.getPath('userData'), 'loja_estoque_final.db');
const db = new Database(dbPath, { verbose: console.log });

export function initDatabase() {
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT,
      nome TEXT NOT NULL,
      idade INTEGER,
      senha TEXT,
      role TEXT DEFAULT 'vendedor',
      sync_status INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME,
      excluido_em DATETIME
    );
  `);

  // Agora ele vai recriar a tabela com TODAS as colunas certas
  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT,
      nome TEXT NOT NULL,
  tamanho TEXT,
  categoria TEXT,
  codigo_produto TEXT,
  imagem TEXT,
  preco_custo REAL,
  preco_venda REAL,
  quantidade INTEGER,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      excluido_em DATETIME
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT,
      nome TEXT NOT NULL,
      preco REAL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      excluido_em DATETIME
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT,
      total REAL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS venda_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER,
      produto_uuid TEXT,
      nome TEXT,
      quantidade INTEGER,
      preco_unitario REAL,
      total_item REAL
    );
  `);
  
  console.log('Banco de dados recriado em:', dbPath);
  // garantir colunas novas (caso tabela antiga exista sem senha/role)
  const cols = db.prepare("PRAGMA table_info('usuarios')").all();
  const colNames = cols.map(c => c.name);
  if (!colNames.includes('senha')) {
    db.exec("ALTER TABLE usuarios ADD COLUMN senha TEXT;");
  }
  if (!colNames.includes('role')) {
    db.exec("ALTER TABLE usuarios ADD COLUMN role TEXT DEFAULT 'vendedor';");
  }

  // garantir colunas novas na tabela produtos (compatibilidade)
  const prodCols = db.prepare("PRAGMA table_info('produtos')").all();
  const prodColNames = prodCols.map(c => c.name);
  if (!prodColNames.includes('categoria')) {
    db.exec("ALTER TABLE produtos ADD COLUMN categoria TEXT;");
  }
  if (!prodColNames.includes('codigo_produto')) {
    db.exec("ALTER TABLE produtos ADD COLUMN codigo_produto TEXT;");
  }
  if (!prodColNames.includes('imagem')) {
    db.exec("ALTER TABLE produtos ADD COLUMN imagem TEXT;");
  }

  // criar usuário admin padrão se não existir
  const count = db.prepare('SELECT COUNT(*) as c FROM usuarios').get();
  if (count && count.c === 0) {
    const senhaHash = bcrypt.hashSync('admin', 8);
    const uuid = require('crypto').randomUUID();
    // Inserir apenas colunas existentes
    const insertCols = ['uuid', 'nome', 'idade'];
    const insertVals = [uuid, 'admin', 30];
    if (colNames.includes('senha')) {
      insertCols.push('senha');
      insertVals.push(senhaHash);
    }
    if (colNames.includes('role')) {
      insertCols.push('role');
      insertVals.push('admin');
    }
    const placeholders = insertCols.map(() => '?').join(', ');
    const stmt = db.prepare(`INSERT INTO usuarios (${insertCols.join(', ')}) VALUES (${placeholders})`);
    stmt.run(...insertVals);
    console.log('Usuário admin criado com usuário: admin e senha: admin');
  }
}

export default db;