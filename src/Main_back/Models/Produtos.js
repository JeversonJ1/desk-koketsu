import db from '../Database/db.js';
import crypto from 'node:crypto';

class Produtos {
  adicionar(produto) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare(`
  INSERT INTO produtos (uuid, nome, tamanho, categoria, codigo_produto, imagem, preco_custo, preco_venda, quantidade)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      uuid, 
      produto.nome, 
      produto.tamanho, 
  produto.categoria || null,
  produto.codigo_produto || null,
  produto.imagem || null,
      produto.preco_custo, 
      produto.preco_venda, 
      produto.quantidade
    );
    return { id: info.lastInsertRowid, uuid, ...produto };
  }

  listar() {
    const stmt = db.prepare('SELECT * FROM produtos WHERE excluido_em IS NULL');
    return stmt.all();
  }

  buscarPorId(uuid) {
    const stmt = db.prepare('SELECT * FROM produtos WHERE uuid = ? AND excluido_em IS NULL');
    return stmt.get(uuid);
  }

  atualizar(produto) {
    const stmt = db.prepare(`
  UPDATE produtos
  SET nome = ?, tamanho = ?, categoria = ?, codigo_produto = ?, imagem = ?, preco_custo = ?, preco_venda = ?, quantidade = ?
  WHERE uuid = ?
    `);
    const info = stmt.run(
      produto.nome, 
      produto.tamanho, 
  produto.categoria || null,
  produto.codigo_produto || null,
  produto.imagem || null,
      produto.preco_custo, 
      produto.preco_venda, 
      produto.quantidade, 
      produto.uuid
    );
    return info.changes > 0;
  }

  remover(uuid) {
    const stmt = db.prepare('UPDATE produtos SET excluido_em = CURRENT_TIMESTAMP WHERE uuid = ?');
    const info = stmt.run(uuid);
    return info.changes > 0;
  }
}
export default Produtos;