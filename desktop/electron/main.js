const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../database/db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/pages/login.html'));
}

app.whenReady().then(createWindow);

// =====================
// PRODUTOS
// =====================
ipcMain.handle('produtos:listar', () => {
  return db.prepare('SELECT * FROM produtos').all();
});

ipcMain.handle('produtos:criar', (e, p) => {
  try {
    if (!p.nome || p.preco <= 0 || p.estoque < 0) {
      throw new Error('Dados inválidos: Nome é obrigatório, preço > 0 e estoque >= 0');
    }
    const resultado = db.prepare(`
      INSERT INTO produtos (nome, categoria, preco, estoque, imagem)
      VALUES (?, ?, ?, ?, ?)
    `).run(p.nome, p.categoria, p.preco, p.estoque, p.imagem);
    console.log('Produto criado com ID:', resultado.lastInsertRowid);
    return { sucesso: true, id: resultado.lastInsertRowid };
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    throw erro;
  }
});

ipcMain.handle('produtos:excluir', (e, id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }
    db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
    console.log('Produto excluído:', id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);
    throw erro;
  }
});

ipcMain.handle('produtos:atualizar', (e, p) => {
  try {
    if (!p.id || !p.nome || p.preco <= 0 || p.estoque < 0) {
      throw new Error('Dados inválidos para atualização');
    }
    db.prepare(`
      UPDATE produtos
      SET nome = ?, categoria = ?, preco = ?, estoque = ?, imagem = ?
      WHERE id = ?
    `).run(p.nome, p.categoria, p.preco, p.estoque, p.imagem, p.id);
    console.log('Produto atualizado:', p.id);
    return { sucesso: true };
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
});

// =====================
// PEDIDOS
// =====================
ipcMain.handle('pedidos:produtos', () => {
  return db.prepare('SELECT * FROM produtos').all();
});

ipcMain.handle('pedidos:criar', (e, dados) => {
  const pedido = db.prepare(
    'INSERT INTO pedidos (total) VALUES (?)'
  ).run(dados.total);

  const pedidoId = pedido.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco)
    VALUES (?, ?, ?, ?)
  `);

  const baixaEstoque = db.prepare(`
    UPDATE produtos SET estoque = estoque - ?
    WHERE id = ?
  `);

  dados.itens.forEach(i => {
    insertItem.run(pedidoId, i.id, i.quantidade, i.preco);
    baixaEstoque.run(i.quantidade, i.id);
  });

  return true;
});

// =====================
// DASHBOARD
// =====================
ipcMain.handle('dashboard:vendas-mes', () => {
  return db.prepare(`
    SELECT strftime('%m', data) as mes,
           COUNT(*) as total
    FROM pedidos
    GROUP BY mes
  `).all();
});

ipcMain.handle('dashboard:estoque', () => {
  return db.prepare(`
    SELECT nome, estoque FROM produtos
  `).all();
});
