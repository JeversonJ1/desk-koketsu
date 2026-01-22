const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'koketsu.db');
const sqlPath = path.join(__dirname, 'koketsu.sql');

console.log('🔄 Iniciando restauração do banco de dados...');

// Deletar banco antigo se existir
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✓ Banco de dados antigo removido');
}

const db = new Database(dbPath);

// Dados para inserir
const clientes = [
  { id: 1, nome: 'Ana Silva', email: 'ana.silva@email.com', telefone: '11988887777', endereco: 'Rua das Flores, 123 - São Paulo/SP' },
  { id: 2, nome: 'Bruno Costa', email: 'bruno.costa@email.com', telefone: '21999996666', endereco: 'Av. Brasil, 456 - Rio de Janeiro/RJ' },
  { id: 3, nome: 'Carla Souza', email: 'carla.souza@email.com', telefone: '31988885555', endereco: 'Rua Goiás, 789 - Belo Horizonte/MG' },
  { id: 4, nome: 'Diego Santos', email: 'diego.santos@email.com', telefone: '41977774444', endereco: 'Rua Paraná, 321 - Curitiba/PR' },
  { id: 5, nome: 'Eduarda Lima', email: 'eduarda.lima@email.com', telefone: '51966663333', endereco: 'Rua Central, 654 - Porto Alegre/RS' },
  { id: 6, nome: 'Fernando Alves', email: 'fernando.alves@email.com', telefone: '61955552222', endereco: 'Rua Brasília, 987 - Brasília/DF' },
  { id: 7, nome: 'Gabriela Torres', email: 'gabriela.torres@email.com', telefone: '71944441111', endereco: 'Rua Salvador, 147 - Salvador/BA' },
  { id: 8, nome: 'Henrique Rocha', email: 'henrique.rocha@email.com', telefone: '81933339999', endereco: 'Av. Recife, 258 - Recife/PE' },
  { id: 9, nome: 'Isabela Martins', email: 'isabela.martins@email.com', telefone: '11922228888', endereco: 'Rua Paulista, 369 - São Paulo/SP' },
  { id: 10, nome: 'João Pedro', email: 'joao.pedro@email.com', telefone: '21911117777', endereco: 'Rua Copacabana, 741 - Rio de Janeiro/RJ' },
  { id: 11, nome: 'Karen Oliveira', email: 'karen.oliveira@email.com', telefone: '31900009999', endereco: 'Rua Pampulha, 852 - Belo Horizonte/MG' },
  { id: 12, nome: 'Lucas Ferreira', email: 'lucas.ferreira@email.com', telefone: '41988880000', endereco: 'Av. Batel, 963 - Curitiba/PR' },
  { id: 13, nome: 'Mariana Cunha', email: 'mariana.cunha@email.com', telefone: '51977779999', endereco: 'Rua Ipiranga, 159 - Porto Alegre/RS' },
  { id: 14, nome: 'Nicolas Mendes', email: 'nicolas.mendes@email.com', telefone: '61966668888', endereco: 'Av. JK, 357 - Brasília/DF' },
  { id: 15, nome: 'Olívia Andrade', email: 'olivia.andrade@email.com', telefone: '71955550000', endereco: 'Rua Barra, 753 - Salvador/BA' },
  { id: 16, nome: 'Paulo Ribeiro', email: 'paulo.ribeiro@email.com', telefone: '81944443333', endereco: 'Rua Boa Vista, 951 - Recife/PE' },
  { id: 17, nome: 'Rafaela Costa', email: 'rafaela.costa@email.com', telefone: '11933334444', endereco: 'Av. Faria Lima, 147 - São Paulo/SP' },
  { id: 18, nome: 'Samuel Nunes', email: 'samuel.nunes@email.com', telefone: '21922223333', endereco: 'Rua Flamengo, 258 - Rio de Janeiro/RJ' },
  { id: 19, nome: 'Tatiane Moraes', email: 'tatiane.moraes@email.com', telefone: '31911112222', endereco: 'Rua Savassi, 369 - Belo Horizonte/MG' },
  { id: 20, nome: 'Victor Lima', email: 'victor.lima@email.com', telefone: '41900001111', endereco: 'Av. XV de Novembro, 741 - Curitiba/PR' },
];

const produtos = [
  { id: 1, nome: 'Camiseta Básica Branca', categoria: 'CAMISETA', preco: 39.90, estoque: 150, imagem: null },
  { id: 2, nome: 'Camiseta Preta Slim', categoria: 'CAMISETA', preco: 49.90, estoque: 120, imagem: null },
  { id: 3, nome: 'Calça Jeans Azul', categoria: 'CALÇA', preco: 119.90, estoque: 80, imagem: null },
  { id: 4, nome: 'Calça Sarja Bege', categoria: 'CALÇA', preco: 139.90, estoque: 60, imagem: null },
  { id: 5, nome: 'Bermuda Jeans', categoria: 'BERMUDA', preco: 89.90, estoque: 100, imagem: null },
  { id: 6, nome: 'Bermuda Moletom', categoria: 'BERMUDA', preco: 69.90, estoque: 70, imagem: null },
  { id: 7, nome: 'Jaqueta Jeans', categoria: 'JAQUETA', preco: 179.90, estoque: 50, imagem: null },
  { id: 8, nome: 'Jaqueta Couro', categoria: 'JAQUETA', preco: 229.90, estoque: 40, imagem: null },
  { id: 9, nome: 'Moletom Canguru', categoria: 'MOLETOM', preco: 149.90, estoque: 90, imagem: null },
  { id: 10, nome: 'Moletom Zíper', categoria: 'MOLETOM', preco: 159.90, estoque: 85, imagem: null },
  { id: 11, nome: 'Vestido Floral', categoria: 'VESTIDO', preco: 119.90, estoque: 70, imagem: null },
  { id: 12, nome: 'Vestido Social Preto', categoria: 'VESTIDO', preco: 199.90, estoque: 40, imagem: null },
  { id: 13, nome: 'Camisa Social Branca', categoria: 'CAMISA', preco: 99.90, estoque: 55, imagem: null },
  { id: 14, nome: 'Camisa Social Azul', categoria: 'CAMISA', preco: 99.90, estoque: 50, imagem: null },
  { id: 15, nome: 'Short Jeans Feminino', categoria: 'SHORT', preco: 79.90, estoque: 60, imagem: null },
  { id: 16, nome: 'Short Esportivo', categoria: 'SHORT', preco: 59.90, estoque: 75, imagem: null },
  { id: 17, nome: 'Polo Branca', categoria: 'POLO', preco: 79.90, estoque: 100, imagem: null },
  { id: 18, nome: 'Polo Azul', categoria: 'POLO', preco: 79.90, estoque: 95, imagem: null },
  { id: 19, nome: 'Macacão Preto', categoria: 'MACACÃO', preco: 169.90, estoque: 45, imagem: null },
  { id: 20, nome: 'Macacão Estampado', categoria: 'MACACÃO', preco: 179.90, estoque: 35, imagem: null },
];

const tamanhos = [
  { produto_id: 1, tamanho: 'P', quantidade: 50 },
  { produto_id: 1, tamanho: 'M', quantidade: 50 },
  { produto_id: 1, tamanho: 'G', quantidade: 50 },
  { produto_id: 2, tamanho: 'P', quantidade: 40 },
  { produto_id: 2, tamanho: 'M', quantidade: 40 },
  { produto_id: 2, tamanho: 'G', quantidade: 40 },
  { produto_id: 3, tamanho: '36', quantidade: 27 },
  { produto_id: 3, tamanho: '38', quantidade: 27 },
  { produto_id: 3, tamanho: '40', quantidade: 26 },
];

try {
  // Criar tabelas
  console.log('📋 Criando tabelas...');

  db.prepare(`
    CREATE TABLE tbl_clientes (
      id_cliente INTEGER PRIMARY KEY,
      nome_clientes TEXT NOT NULL,
      email_clientes TEXT NOT NULL,
      telefone_clientes TEXT,
      endereco_clientes TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      criado_em DATETIME,
      atualizado_em DATETIME,
      excluido_em DATETIME
    )
  `).run();

  db.prepare(`
    CREATE TABLE produtos (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      categoria TEXT,
      preco REAL NOT NULL,
      estoque INTEGER NOT NULL,
      imagem TEXT
    )
  `).run();

  db.prepare(`
    CREATE TABLE tamanhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      tamanho TEXT NOT NULL,
      quantidade INTEGER DEFAULT 0,
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL,
      data TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      produto_id INTEGER,
      quantidade INTEGER,
      preco REAL
    )
  `).run();

  // Inserir dados
  console.log('📥 Inserindo clientes...');
  const insertCliente = db.prepare(`
    INSERT INTO tbl_clientes (id_cliente, nome_clientes, email_clientes, telefone_clientes, endereco_clientes, data_cadastro)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  for (const cliente of clientes) {
    insertCliente.run(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.endereco);
  }
  console.log(`✓ ${clientes.length} clientes inseridos`);

  console.log('📥 Inserindo produtos...');
  const insertProduto = db.prepare(`
    INSERT INTO produtos (id, nome, categoria, preco, estoque, imagem)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const produto of produtos) {
    insertProduto.run(produto.id, produto.nome, produto.categoria, produto.preco, produto.estoque, produto.imagem);
  }
  console.log(`✓ ${produtos.length} produtos inseridos`);

  console.log('📥 Inserindo tamanhos...');
  const insertTamanho = db.prepare(`
    INSERT INTO tamanhos (produto_id, tamanho, quantidade)
    VALUES (?, ?, ?)
  `);

  for (const tamanho of tamanhos) {
    insertTamanho.run(tamanho.produto_id, tamanho.tamanho, tamanho.quantidade);
  }
  console.log(`✓ ${tamanhos.length} tamanhos inseridos`);

  console.log('\n✅ Banco de dados restaurado com sucesso!');
  process.exit(0);

} catch (err) {
  console.error('❌ Erro ao restaurar banco de dados:', err.message);
  process.exit(1);
}
