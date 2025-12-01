import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

const dbPath = path.join(app.getPath('userData'), 'koketsu.db');
const db = new Database(dbPath, { verbose: console.log });

export function initDatabase() {
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS tbl_vendas (
        id_venda INTEGER PRIMARY KEY AUTOINCREMENT,
        data_venda TEXT NOT NULL,
        valor_venda REAL NOT NULL,
        id_usuarios INTEGER NOT NULL,
        status_venda TEXT DEFAULT 'pendente',
        metodo_pagamento TEXT DEFAULT NULL,
        observacao TEXT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP, 
        excluido_em TEXT DEFAULT NULL,
        FOREIGN KEY (id_usuarios) REFERENCES tbl_usuarios (id_usuarios) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    console.log('Banco de dados inicializado em:', dbPath);
}

export default db;