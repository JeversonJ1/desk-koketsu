// ================================
// VARIÁVEIS GLOBAIS
// ================================
let produtos = [];
let carrinho = [];
let pedidosRealizados = [];

// ================================
// CARREGAR PRODUTOS
// ================================
async function carregarProdutos(filtro = '') {
  try {
    produtos = await window.api.listarProdutosPedido();
    
    // Filtrar por busca
    const produtosFiltrados = filtro 
      ? produtos.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
      : produtos;
    
    renderizarProdutos(produtosFiltrados);
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
  }
}

// ================================
// RENDERIZAR PRODUTOS
// ================================
function renderizarProdutos(lista) {
  const container = document.getElementById('listaProdutos');
  
  if (lista.length === 0) {
    container.innerHTML = '<p class="text-muted col-12">Nenhum produto encontrado</p>';
    return;
  }
  
  container.innerHTML = lista.map(p => `
    <div class="produto-card">
      <img src="${p.imagem || '../assets/produtos/placeholder.png'}" 
           class="produto-imagem" 
           onerror="this.src='../assets/produtos/placeholder.png'">
      <div class="nome">${p.nome}</div>
      <div class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</div>
      <div class="estoque">Estoque: ${p.estoque}</div>
      <input type="number" id="qtd-${p.id}" min="1" max="${p.estoque}" value="1" placeholder="Qtd">
      <button class="btn-add" onclick="adicionarCarrinho(${p.id}, '${p.nome}', ${p.preco}, ${p.estoque})">
        Adicionar
      </button>
    </div>
  `).join('');
}

// ================================
// ADICIONAR AO CARRINHO
// ================================
function adicionarCarrinho(id, nome, preco, estoqueDisponivel) {
  try {
    const input = document.getElementById(`qtd-${id}`);
    const quantidade = parseInt(input.value);
    
    if (!quantidade || quantidade < 1) {
      alert('Digite uma quantidade válida');
      return;
    }
    
    if (quantidade > estoqueDisponivel) {
      alert(`Estoque disponível: ${estoqueDisponivel}`);
      return;
    }
    
    // Verificar se já está no carrinho
    const existente = carrinho.find(item => item.id === id);
    
    if (existente) {
      const novaQtd = existente.quantidade + quantidade;
      if (novaQtd > estoqueDisponivel) {
        alert(`Máximo disponível: ${estoqueDisponivel}`);
        return;
      }
      existente.quantidade = novaQtd;
    } else {
      carrinho.push({ id, nome, preco, quantidade });
    }
    
    input.value = '1'; // Resetar input
    atualizarCarrinho();
    console.log('✓ Produto adicionado ao carrinho');
  } catch (erro) {
    console.error('Erro ao adicionar:', erro);
  }
}

// ================================
// ATUALIZAR EXIBIÇÃO CARRINHO
// ================================
function atualizarCarrinho() {
  const container = document.getElementById('carrinhoItems');
  const totalItens = document.getElementById('totalItens');
  const subtotal = document.getElementById('subtotal');
  const totalPedido = document.getElementById('totalPedido');
  
  if (carrinho.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-5">Nenhum item adicionado</p>';
    totalItens.textContent = '0';
    subtotal.textContent = 'R$ 0.00';
    totalPedido.textContent = 'R$ 0.00';
    return;
  }
  
  // Renderizar itens
  container.innerHTML = carrinho.map(item => `
    <div class="carrinho-item">
      <div class="carrinho-item-info">
        <div class="carrinho-item-nome">${item.nome}</div>
        <div class="carrinho-item-preco">R$ ${parseFloat(item.preco).toFixed(2)} × ${item.quantidade}</div>
      </div>
      <input type="number" class="carrinho-item-qtd" value="${item.quantidade}" 
        onchange="atualizarQuantidade(${item.id}, this.value)">
      <button class="carrinho-item-remover" onclick="removerCarrinho(${item.id})">❌</button>
    </div>
  `).join('');
  
  // Calcular totais
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const qtdTotal = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  
  totalItens.textContent = qtdTotal;
  subtotal.textContent = 'R$ ' + total.toFixed(2);
  totalPedido.textContent = 'R$ ' + total.toFixed(2);
}

// ================================
// ATUALIZAR QUANTIDADE
// ================================
function atualizarQuantidade(id, novaQtd) {
  novaQtd = parseInt(novaQtd);
  
  if (novaQtd < 1) {
    removerCarrinho(id);
    return;
  }
  
  const item = carrinho.find(i => i.id === id);
  if (item) {
    const produtoOriginal = produtos.find(p => p.id === id);
    if (novaQtd > produtoOriginal.estoque) {
      alert(`Máximo disponível: ${produtoOriginal.estoque}`);
      atualizarCarrinho();
      return;
    }
    item.quantidade = novaQtd;
    atualizarCarrinho();
  }
}

// ================================
// REMOVER DO CARRINHO
// ================================
function removerCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}

// ================================
// FINALIZAR PEDIDO
// ================================
document.getElementById('btnFinalizar').addEventListener('click', async () => {
  try {
    if (carrinho.length === 0) {
      alert('Adicione produtos ao pedido');
      return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    console.log('Finalizando pedido...');
    await window.api.criarPedido({
      itens: carrinho,
      total: total
    });
    
    // Adicionar ao histórico local
    pedidosRealizados.unshift({
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      itens: carrinho.length,
      total: total
    });
    
    // Limpar carrinho
    carrinho = [];
    atualizarCarrinho();
    carregarHistorico();
    
    alert('✓ Pedido realizado com sucesso!');
  } catch (erro) {
    console.error('Erro ao finalizar pedido:', erro);
    alert('Erro ao finalizar pedido: ' + erro.message);
  }
});

// ================================
// BOTÕES AUXILIARES
// ================================
document.getElementById('btnLimparCarrinho').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('Carrinho vazio');
    return;
  }
  if (confirm('Deseja limpar o carrinho?')) {
    carrinho = [];
    atualizarCarrinho();
  }
});

document.getElementById('btnCancelar').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('Carrinho já está vazio');
    return;
  }
  if (confirm('Deseja cancelar este pedido?')) {
    carrinho = [];
    atualizarCarrinho();
  }
});

// ================================
// BUSCA DE PRODUTOS
// ================================
document.getElementById('searchProduto').addEventListener('input', (e) => {
  carregarProdutos(e.target.value);
});

// ================================
// HISTÓRICO DE PEDIDOS
// ================================
function carregarHistorico() {
  const container = document.getElementById('historicoPedidos');
  
  if (pedidosRealizados.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-3">Nenhum pedido realizado</p>';
    return;
  }
  
  container.innerHTML = pedidosRealizados.slice(0, 5).map(pedido => `
    <div class="pedido-item">
      <div class="pedido-item-data">${pedido.data}</div>
      <div><strong>${pedido.itens} itens</strong></div>
      <div class="pedido-item-valor">${pedido.total.toFixed(2)}</div>
    </div>
  `).join('');
}

// ================================
// INICIALIZAÇÃO
// ================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de pedidos carregando...');
  carregarProdutos();
  carregarHistorico();
});

