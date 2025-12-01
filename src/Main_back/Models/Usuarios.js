import db from '../Database/db.js';
import crypto from 'node:crypto'; // Importação explicita para Node.js

class Usuarios {
  constructor() {
  }

  adicionar(usuario) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO usuarios (uuid, nome, idade)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(
      uuid,
      usuario.nome,
      usuario.idade
    );
    // Retorna o objeto criado ou o ID inserido
    return { id: info.lastInsertRowid, uuid, ...usuario };
  }

  async listar() {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE excluido_em IS NULL');
    return stmt.all();
  }

  async buscarporid(uuid) {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE uuid = ? AND excluido_em IS NULL');
    return stmt.get(uuid);
  }

  // Renomeado de 'atualizarusuario' para 'atualizar' para bater com o Controller
  // Alterado WHERE id para WHERE uuid para consistência
  async atualizar(usuarioAtualizado) {
    const stmt = db.prepare(`
      UPDATE usuarios
      SET nome = ?, 
      idade = ?,
      atualizado_em = CURRENT_TIMESTAMP,
      sync_status = 0
      WHERE uuid = ?
    `);
    
    const info = stmt.run(
      usuarioAtualizado.nome,
      usuarioAtualizado.idade,
      usuarioAtualizado.uuid 
    );
    return info.changes;
  }

  remover(usuario) {
    const stmt = db.prepare(`
      UPDATE usuarios
      SET excluido_em = CURRENT_TIMESTAMP,
      sync_status = 0
      WHERE uuid = ?
    `);
    const info = stmt.run(usuario.uuid);
    return info.changes > 0;
  }
}
export default Usuarios;