const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

// Dados iniciais
const dadosPadrão = {
  produtos: [
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
  ],
  clientes: [
    { id_cliente: 1, nome_clientes: 'Ana Silva', email_clientes: 'ana.silva@email.com', telefone_clientes: '11988887777', endereco_clientes: 'Rua das Flores, 123 - São Paulo/SP' },
    { id_cliente: 2, nome_clientes: 'Bruno Costa', email_clientes: 'bruno.costa@email.com', telefone_clientes: '21999996666', endereco_clientes: 'Av. Brasil, 456 - Rio de Janeiro/RJ' },
    { id_cliente: 3, nome_clientes: 'Carla Souza', email_clientes: 'carla.souza@email.com', telefone_clientes: '31988885555', endereco_clientes: 'Rua Goiás, 789 - Belo Horizonte/MG' },
    { id_cliente: 4, nome_clientes: 'Diego Santos', email_clientes: 'diego.santos@email.com', telefone_clientes: '41977774444', endereco_clientes: 'Rua Paraná, 321 - Curitiba/PR' },
    { id_cliente: 5, nome_clientes: 'Eduarda Lima', email_clientes: 'eduarda.lima@email.com', telefone_clientes: '51966663333', endereco_clientes: 'Rua Central, 654 - Porto Alegre/RS' },
    { id_cliente: 6, nome_clientes: 'Fernando Alves', email_clientes: 'fernando.alves@email.com', telefone_clientes: '61955552222', endereco_clientes: 'Rua Brasília, 987 - Brasília/DF' },
    { id_cliente: 7, nome_clientes: 'Gabriela Torres', email_clientes: 'gabriela.torres@email.com', telefone_clientes: '71944441111', endereco_clientes: 'Rua Salvador, 147 - Salvador/BA' },
    { id_cliente: 8, nome_clientes: 'Henrique Rocha', email_clientes: 'henrique.rocha@email.com', telefone_clientes: '81933339999', endereco_clientes: 'Av. Recife, 258 - Recife/PE' },
    { id_cliente: 9, nome_clientes: 'Isabela Martins', email_clientes: 'isabela.martins@email.com', telefone_clientes: '11922228888', endereco_clientes: 'Rua Paulista, 369 - São Paulo/SP' },
    { id_cliente: 10, nome_clientes: 'João Pedro', email_clientes: 'joao.pedro@email.com', telefone_clientes: '21911117777', endereco_clientes: 'Rua Copacabana, 741 - Rio de Janeiro/RJ' },
    { id_cliente: 11, nome_clientes: 'Karen Oliveira', email_clientes: 'karen.oliveira@email.com', telefone_clientes: '31900009999', endereco_clientes: 'Rua Pampulha, 852 - Belo Horizonte/MG' },
    { id_cliente: 12, nome_clientes: 'Lucas Ferreira', email_clientes: 'lucas.ferreira@email.com', telefone_clientes: '41988880000', endereco_clientes: 'Av. Batel, 963 - Curitiba/PR' },
    { id_cliente: 13, nome_clientes: 'Mariana Cunha', email_clientes: 'mariana.cunha@email.com', telefone_clientes: '51977779999', endereco_clientes: 'Rua Ipiranga, 159 - Porto Alegre/RS' },
    { id_cliente: 14, nome_clientes: 'Nicolas Mendes', email_clientes: 'nicolas.mendes@email.com', telefone_clientes: '61966668888', endereco_clientes: 'Av. JK, 357 - Brasília/DF' },
    { id_cliente: 15, nome_clientes: 'Olívia Andrade', email_clientes: 'olivia.andrade@email.com', telefone_clientes: '71955550000', endereco_clientes: 'Rua Barra, 753 - Salvador/BA' },
    { id_cliente: 16, nome_clientes: 'Paulo Ribeiro', email_clientes: 'paulo.ribeiro@email.com', telefone_clientes: '81944443333', endereco_clientes: 'Rua Boa Vista, 951 - Recife/PE' },
    { id_cliente: 17, nome_clientes: 'Rafaela Costa', email_clientes: 'rafaela.costa@email.com', telefone_clientes: '11933334444', endereco_clientes: 'Av. Faria Lima, 147 - São Paulo/SP' },
    { id_cliente: 18, nome_clientes: 'Samuel Nunes', email_clientes: 'samuel.nunes@email.com', telefone_clientes: '21922223333', endereco_clientes: 'Rua Flamengo, 258 - Rio de Janeiro/RJ' },
    { id_cliente: 19, nome_clientes: 'Tatiane Moraes', email_clientes: 'tatiane.moraes@email.com', telefone_clientes: '31911112222', endereco_clientes: 'Rua Savassi, 369 - Belo Horizonte/MG' },
    { id_cliente: 20, nome_clientes: 'Victor Lima', email_clientes: 'victor.lima@email.com', telefone_clientes: '41900001111', endereco_clientes: 'Av. XV de Novembro, 741 - Curitiba/PR' },
  ],
  tamanhos: [
    { id: 1, produto_id: 1, tamanho: 'P', quantidade: 50 },
    { id: 2, produto_id: 1, tamanho: 'M', quantidade: 50 },
    { id: 3, produto_id: 1, tamanho: 'G', quantidade: 50 },
    { id: 4, produto_id: 2, tamanho: 'P', quantidade: 40 },
    { id: 5, produto_id: 2, tamanho: 'M', quantidade: 40 },
    { id: 6, produto_id: 2, tamanho: 'G', quantidade: 40 },
    { id: 7, produto_id: 3, tamanho: '36', quantidade: 27 },
    { id: 8, produto_id: 3, tamanho: '38', quantidade: 27 },
    { id: 9, produto_id: 3, tamanho: '40', quantidade: 26 },
  ],
  pedidos: [],
  itens_pedido: []
};

// Carregar ou criar banco
function carregarDados() {
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  salvarDados(dadosPadrão);
  return dadosPadrão;
}

// Salvar banco
function salvarDados(dados) {
  fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2), 'utf8');
}

module.exports = {
  carregarDados,
  salvarDados,
  dbPath
};
