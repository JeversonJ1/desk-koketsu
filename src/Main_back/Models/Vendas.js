import db from '../Database/db.js';
import crypto from 'node:crypto';

class Vendas {
  criar(venda) {
    const uuid = crypto.randomUUID();
    const stmt = db.prepare('INSERT INTO vendas (uuid, total) VALUES (?, ?)');
    const info = stmt.run(uuid, venda.total || 0);
    const vendaId = info.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO venda_itens (venda_id, produto_uuid, nome, quantidade, preco_unitario, total_item) VALUES (?, ?, ?, ?, ?, ?)');
    const updateProduto = db.prepare('UPDATE produtos SET quantidade = quantidade - ? WHERE uuid = ?');
    for (const item of venda.itens || []) {
      insertItem.run(vendaId, item.uuid, item.nome, item.quantidade, item.preco_unitario, item.total_item);
      // decrementar estoque (não abaixo de zero)
      updateProduto.run(item.quantidade, item.uuid);
    }
    return { success: true, id: vendaId, uuid };
  }

  listar() {
    const vendas = db.prepare('SELECT * FROM vendas ORDER BY criado_em DESC').all();
    // buscar itens para cada venda
    const itensStmt = db.prepare('SELECT * FROM venda_itens WHERE venda_id = ?');
    return vendas.map(v => ({ ...v, itens: itensStmt.all(v.id) }));
  }
}

export default Vendas;
