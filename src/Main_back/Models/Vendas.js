import db from '../Database/db.js';
class Vendas{
    constructor() {
        
    }
adicionar(venda) {
        const stmt = db.prepare(`
            INSERT INTO tbl_vendas (
                data_venda, 
                valor_venda, 
                id_usuarios, 
                status_venda, 
                metodo_pagamento, 
                observacao
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            venda.data_venda || new Date().toISOString(),
            venda.valor_venda,
            venda.id_usuarios,
            venda.status_venda || 'pendente',
            venda.metodo_pagamento || null,
            venda.observacao || null
        );
        return info.lastInsertRowid;
    }

    async listar() {
        const stmt = db.prepare(`SELECT * FROM tbl_vendas WHERE excluido_em IS NULL`);
        return stmt.all();
    }

    async buscarPorId(id_venda) {
        const stmt = db.prepare(`SELECT * FROM tbl_vendas WHERE id_venda = ? AND excluido_em IS NULL`);
        return stmt.get(id_venda);
    }
    
    async atualizar(vendaAtualizada) {
        const stmt = db.prepare(`
            UPDATE tbl_vendas 
            SET 
                valor_venda = ?, 
                status_venda = ?, 
                metodo_pagamento = ?,
                observacao = ?,
                atualizado_em = CURRENT_TIMESTAMP
                WHERE id_venda = ?
        `);
        
        const info = stmt.run(
            vendaAtualizada.valor_venda,
            vendaAtualizada.status_venda,
            vendaAtualizada.metodo_pagamento,
            vendaAtualizada.observacao,
            vendaAtualizada.id_venda
        );
        
        return info.changes;
    }
    
    async remover(venda) {
        const stmt = db.prepare(`
            UPDATE tbl_vendas 
            SET excluido_em = CURRENT_TIMESTAMP 
            WHERE id_venda = ?
        `);
        const info = stmt.run(venda.id_venda);
        
        return info.changes > 0;
    }
}

export default Vendas;