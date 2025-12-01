import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

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
      preco_custo REAL,
      preco_venda REAL,
      quantidade INTEGER,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      excluido_em DATETIME
    );
  `);
  
  console.log('Banco de dados recriado em:', dbPath);
}

export default db;