import db from '../Database/db.js';
import crypto from 'node:crypto'; // Importação explicita para Node.js

class Usuarios {
  constructor() {
  }

  adicionar(usuario) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare(`
  INSERT INTO usuarios (uuid, nome, idade, senha, role)
  VALUES (?, ?, ?, ?, ?)
    `);
    try {
      const info = stmt.run(
        uuid,
        usuario.nome,
        usuario.idade || null,
        usuario.senha || null,
        usuario.role || 'vendedor'
      );
  // Retorna o objeto criado com indicação de sucesso, sem expor a senha
  const user = Object.assign({}, usuario);
  if (user.senha) delete user.senha;
  return { success: true, id: info.lastInsertRowid, uuid, ...user };
    } catch (err) {
      console.error('Usuarios.adicionar -> erro ao inserir usuario', err);
      return { success: false, error: String(err) };
    }
  }

  async listar() {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE excluido_em IS NULL');
  const rows = stmt.all();
  // Remover campo senha dos retornos
  return rows.map(r => { const copy = Object.assign({}, r); if (copy.senha) delete copy.senha; return copy; });
  }

  async buscarporid(uuid) {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE uuid = ? AND excluido_em IS NULL');
  const r = stmt.get(uuid);
  if (!r) return null;
  if (r.senha) delete r.senha;
  return r;
  }

  async buscarPorNome(nome) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE lower(nome) = lower(?) AND excluido_em IS NULL');
  const r = stmt.get(nome);
  if (!r) return null;
  if (r.senha) delete r.senha;
  return r;
  }

  // Renomeado de 'atualizarusuario' para 'atualizar' para bater com o Controller
  // Alterado WHERE id para WHERE uuid para consistência
  async atualizar(usuarioAtualizado) {
    const stmt = db.prepare(`
      UPDATE usuarios
      SET nome = ?, 
      idade = ?,
      senha = COALESCE(?, senha),
      role = COALESCE(?, role),
      atualizado_em = CURRENT_TIMESTAMP,
      sync_status = 0
      WHERE uuid = ?
    `);
    
    const info = stmt.run(
      usuarioAtualizado.nome,
      usuarioAtualizado.idade ?? null,
      usuarioAtualizado.senha ?? null,
      usuarioAtualizado.role ?? null,
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