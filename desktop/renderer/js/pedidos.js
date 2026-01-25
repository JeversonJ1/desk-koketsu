// ================================
// VARIÁVEIS GLOBAIS
// ================================
let produtos = [];
let clientes = [];
let carrinho = [];
let pedidosRealizados = [];

// ================================
// CARREGAR CLIENTES
// ================================
async function carregarClientes() {
  try {
    clientes = await window.api.listarClientes();
    const select = document.getElementById('clientePedido');
    
    select.innerHTML = '<option value="">Selecione um cliente...</option>' +
      clientes.map(c => `<option value="${c.id_cliente}">${c.nome_clientes}</option>`).join('');
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  }
}

// ================================
// CARREGAR PRODUTOS
// ================================
async function carregarProdutos(filtro = '') {
  try {
    produtos = await window.api.listarProdutos();
    console.log('Produtos carregados:', produtos.length);
    
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
    container.innerHTML = '<p class="text-muted col-12 text-center py-5">📦 Nenhum produto encontrado</p>';
    return;
  }
  
  container.innerHTML = lista.map(p => `
    <div class="produto-card" style="opacity: ${p.estoque > 0 ? '1' : '0.5'};">
      <img src="${p.imagem || '../assets/produtos/placeholder.png'}" 
           class="produto-imagem" 
           onerror="this.src='../assets/produtos/placeholder.png'"
           alt="${p.nome}">
      <div class="nome">${p.nome}</div>
      <div class="categoria" style="font-size: 11px; color: #888; margin-bottom: 4px;">${p.categoria || 'Sem categoria'}</div>
      <div class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</div>
      <div class="estoque" style="color: ${p.estoque > 10 ? '#51cf66' : p.estoque > 0 ? '#ffa94d' : '#ff6b6b'};">
        ${p.estoque > 0 ? `🟢 ${p.estoque} em estoque` : '🔴 Esgotado'}
      </div>
      ${p.estoque > 0 ? `
        <input type="number" id="qtd-${p.id}" min="1" max="${p.estoque}" value="1" placeholder="Qtd">
        <button class="btn-add" onclick="adicionarCarrinho(${p.id}, '${p.nome.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', ${p.preco}, ${p.estoque})">
          ➕ Adicionar
        </button>
      ` : `
        <button class="btn-add" disabled style="background: #666; cursor: not-allowed;">
          Esgotado
        </button>
      `}
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
      alert('❌ Adicione produtos ao pedido');
      return;
    }
    
    const clienteId = parseInt(document.getElementById('clientePedido').value);
    if (!clienteId) {
      alert('❌ Selecione um cliente');
      return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    // Preparar itens para o pedido
    const itens = carrinho.map(item => ({
      produto_id: item.id,
      quantidade: item.quantidade,
      preco_unitario: item.preco
    }));
    
    console.log('Finalizando pedido...', { clienteId, itens, total });
    
    const resultado = await window.api.criarPedido({
      cliente_id: clienteId,
      itens: itens,
      total: total
    });
    
    // Adicionar ao histórico local
    const cliente = clientes.find(c => c.id_cliente === clienteId);
    pedidosRealizados.unshift({
      id: resultado.id,
      data: new Date().toLocaleString('pt-BR'),
      cliente: cliente ? cliente.nome_clientes : 'Cliente',
      itens: carrinho.length,
      total: total
    });
    
    // Limpar carrinho
    carrinho = [];
    document.getElementById('clientePedido').value = '';
    atualizarCarrinho();
    carregarHistorico();
    carregarProdutos(); // Recarregar para atualizar estoque
    
    alert('✅ Pedido #' + resultado.id + ' realizado com sucesso!\n\nTotal: R$ ' + total.toFixed(2));
  } catch (erro) {
    console.error('Erro ao finalizar pedido:', erro);
    alert('❌ Erro ao finalizar pedido: ' + erro.message);
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
async function carregarHistorico() {
  const container = document.getElementById('historicoPedidos');
  
  try {
    const pedidosDB = await window.api.listarPedidos();
    const clientesDB = await window.api.listarClientes();
    
    // Ordenar por data decrescente e pegar últimos 10
    const ultimosPedidos = pedidosDB
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 10);
    
    if (ultimosPedidos.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">📭 Nenhum pedido realizado</p>';
      return;
    }
    
    container.innerHTML = ultimosPedidos.map(pedido => {
      const cliente = clientesDB.find(c => c.id === pedido.cliente_id);
      const nomeCliente = cliente ? cliente.nome : 'Cliente não encontrado';
      const data = new Date(pedido.data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `
        <div class="pedido-item">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <strong style="color: #fff; font-size: 14px;">Pedido #${pedido.id}</strong>
              <div class="pedido-item-data">📅 ${data}</div>
            </div>
            <span class="badge bg-success" style="font-size: 11px;">✓ Finalizado</span>
          </div>
          <div style="color: #bbb; font-size: 13px; margin-bottom: 6px;">
            👤 ${nomeCliente}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span style="color: #999; font-size: 12px;">
              ${pedido.itens?.length || 0} ${pedido.itens?.length === 1 ? 'item' : 'itens'}
            </span>
            <span class="pedido-item-valor" style="font-size: 16px;">
              R$ ${parseFloat(pedido.total).toFixed(2)}
            </span>
          </div>
        </div>
      `;
    }).join('');
    
  } catch (erro) {
    console.error('Erro ao carregar histórico:', erro);
    container.innerHTML = '<p class="text-danger text-center py-3">❌ Erro ao carregar histórico</p>';
  }
}

// ================================
// INICIALIZAÇÃO
// ================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de pedidos carregando...');
  carregarClientes();
  carregarProdutos();
  carregarHistorico();
});
