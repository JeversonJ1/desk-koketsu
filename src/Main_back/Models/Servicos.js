import db from '../Database/db.js';
import crypto from 'node:crypto';

class Servicos {
  adicionar(servico) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO servicos (uuid, nome, preco)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(
      uuid,
      servico.nome,
      servico.preco
    );
    return { id: info.lastInsertRowid, uuid, ...servico };
  }

  listar() {
    const stmt = db.prepare('SELECT * FROM servicos WHERE excluido_em IS NULL');
    return stmt.all();
  }

  buscarPorId(uuid) {
    const stmt = db.prepare('SELECT * FROM servicos WHERE uuid = ? AND excluido_em IS NULL');
    return stmt.get(uuid);
  }

  atualizar(servico) {
    const stmt = db.prepare(`
      UPDATE servicos
      SET nome = ?, preco = ?
      WHERE uuid = ?
    `);
    const info = stmt.run(
      servico.nome,
      servico.preco,
      servico.uuid
    );
    return info.changes > 0;
  }

  remover(uuid) {
    const stmt = db.prepare('UPDATE servicos SET excluido_em = CURRENT_TIMESTAMP WHERE uuid = ?');
    const info = stmt.run(uuid);
    return info.changes > 0;
  }
}

export default Servicos;