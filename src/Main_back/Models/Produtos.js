import db from '../Database/db.js';
import crypto from 'node:crypto';

class Produtos {
  adicionar(produto) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare(`
  INSERT INTO produtos (uuid, nome, tamanho, categoria, codigo_produto, imagem, preco_custo, preco_venda, quantidade)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    // sanitização mínima
    const nome = produto.nome;
    const tamanho = produto.tamanho || null;
    const categoria = produto.categoria || null;
    const codigo_produto = produto.codigo_produto || null;
    const imagem = produto.imagem || null;
    const preco_custo = (produto.preco_custo !== undefined && produto.preco_custo !== null && produto.preco_custo !== '') ? Number(produto.preco_custo) : null;
    const preco_venda = (produto.preco_venda !== undefined && produto.preco_venda !== null && produto.preco_venda !== '') ? Number(produto.preco_venda) : null;
    const quantidade = (produto.quantidade !== undefined && produto.quantidade !== null && produto.quantidade !== '') ? Number(produto.quantidade) : 0;

    const info = stmt.run(
      uuid,
      nome,
      tamanho,
      categoria,
      codigo_produto,
      imagem,
      preco_custo,
      preco_venda,
      quantidade
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