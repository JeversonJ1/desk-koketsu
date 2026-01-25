// ================================
// ESTADO GLOBAL
// ================================
let produtos = [];
let tamanhosCadastrados = new Set();
let categorias = new Set();
let produtoEditando = null;
let imagemAtual = null;
let tamanhosAtuais = []; // Array para armazenar tamanhos temporários
let produtosComTamanhos = {}; // Armazenar tamanhos por produto

let modal, btnNovo, cancelarModal, cancelarModalBtn, salvarProduto;
let gridProdutos, inputImagem, preview, searchProduto, filterCategoria;
let filterTamanho, filterEstoque, limparFiltros, ordenarPor;
let modalTitulo, btnAdicionarTamanho, listaTamanhos;

// ================================
// INICIALIZAÇÃO
// ================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar elementos do DOM
  modal = document.getElementById('modalProduto');
  btnNovo = document.getElementById('btnNovoProduto');
  cancelarModal = document.getElementById('cancelarModal');
  cancelarModalBtn = document.getElementById('cancelarModalBtn');
  salvarProduto = document.getElementById('salvarProduto');
  gridProdutos = document.getElementById('gridProdutos');
  inputImagem = document.getElementById('imagem');
  preview = document.getElementById('preview');
  searchProduto = document.getElementById('searchProduto');
  filterCategoria = document.getElementById('filterCategoria');
  filterTamanho = document.getElementById('filterTamanho');
  filterEstoque = document.getElementById('filterEstoque');
  limparFiltros = document.getElementById('limparFiltros');
  ordenarPor = document.getElementById('ordenarPor');
  modalTitulo = document.getElementById('modalTitulo');
  btnAdicionarTamanho = document.getElementById('btnAdicionarTamanho');
  listaTamanhos = document.getElementById('listaTamanhos');

  // Configurar event listeners
  configurarEventListeners();
  
  // Carregar produtos
  carregarProdutos();
  
  // Recarregar quando a aba ficar visível novamente
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      carregarProdutos();
    }
  });
});

function configurarEventListeners() {
  // Modal
  if (btnNovo) {
    btnNovo.onclick = () => {
      limparFormulario();
      modal.style.display = 'flex';
    };
  }

  if (cancelarModal) {
    cancelarModal.onclick = () => {
      modal.style.display = 'none';
    };
  }

  if (cancelarModalBtn) {
    cancelarModalBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }

  // Fechar ao clicar fora do modal
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Salvar produto
  if (salvarProduto) {
    salvarProduto.onclick = salvarProdutoHandler;
  }

  // Tamanhos
  if (btnAdicionarTamanho) {
    btnAdicionarTamanho.onclick = adicionarTamanhoHandler;
  }

  // Preview de imagem
  if (inputImagem) {
    inputImagem.onchange = previewImagemHandler;
  }
  
  // Formatação automática de preço
  const precoInput = document.getElementById('preco');
  if (precoInput) {
    precoInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor) {
        valor = (parseInt(valor) / 100).toFixed(2);
        e.target.value = valor.replace('.', ',');
      }
    });
  }

  // Busca e filtro
  if (searchProduto) {
    searchProduto.oninput = filtrarProdutos;
  }
  
  if (filterCategoria) {
    filterCategoria.onchange = filtrarProdutos;
  }

  if (filterTamanho) {
    filterTamanho.onchange = filtrarProdutos;
  }

  if (filterEstoque) {
    filterEstoque.onchange = filtrarProdutos;
  }

  if (ordenarPor) {
    ordenarPor.onchange = filtrarProdutos;
  }

  if (limparFiltros) {
    limparFiltros.onclick = () => {
      searchProduto.value = '';
      filterCategoria.value = '';
      filterTamanho.value = '';
      filterEstoque.value = '';
      ordenarPor.value = 'nome-az';
      filtrarProdutos();
    };
  }
}

// ================================
// CARREGAR PRODUTOS
// ================================
async function carregarProdutos() {
  try {
    produtos = await window.api.listarProdutos();
    console.log('Produtos carregados:', produtos);

    // Extrair categorias e carregar tamanhos
    categorias = new Set();
    tamanhosCadastrados = new Set();
    
    for (const p of produtos) {
      if (p.categoria) categorias.add(p.categoria);
      
      // Carregar tamanhos de cada produto
      try {
        const tamanhos = await window.api.listarTamanhos(p.id);
        produtosComTamanhos[p.id] = tamanhos || [];
        tamanhos.forEach(t => tamanhosCadastrados.add(t.tamanho));
      } catch (err) {
        console.error(`Erro ao carregar tamanhos do produto ${p.id}:`, err);
        produtosComTamanhos[p.id] = [];
      }
    }
    
    atualizarFilterCategoria();
    atualizarFilterTamanho();
    renderizarProdutos(produtos);
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    gridProdutos.innerHTML = '<p class="text-danger col-12">Erro ao carregar produtos. Tentando novamente...</p>';
    // Tentar novamente após 2 segundos
    setTimeout(carregarProdutos, 2000);
  }
}

// ================================
// RENDERIZAR GRID DE PRODUTOS
// ================================
function renderizarProdutos(lista) {
  if (!lista || lista.length === 0) {
    gridProdutos.innerHTML = '<p class="text-muted col-12 text-center py-5">Nenhum produto encontrado</p>';
    return;
  }

  const html = lista.map(p => {
    const tamanhos = produtosComTamanhos[p.id] || [];
    const tamanhosBadges = tamanhos.length > 0 
      ? tamanhos.map(t => `<span class="tamanho-badge">${t.tamanho}</span>`).join('')
      : '<span class="tamanho-sem-dados">Sem tamanhos</span>';
    
    const imagemSrc = p.imagem || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="16">Sem imagem</text></svg>';
    
    return `
    <div class="card-estoque-produto">
      <div class="imagem-container">
        <img src="${imagemSrc}" 
             alt="${p.nome}">
        <div class="badge-estoque ${p.estoque > 10 ? 'badge-ok' : p.estoque > 0 ? 'badge-warning' : 'badge-critical'}">
          ${p.estoque} un
        </div>
      </div>
      <div class="info-produto">
        <h5>${p.nome}</h5>
        <p class="categoria">${p.categoria || 'Sem categoria'}</p>
        <div class="tamanhos-disponiveis">
          ${tamanhosBadges}
        </div>
        <div class="preco-info">
          <span class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</span>
        </div>
      </div>
      <div class="acoes-produto">
        <button class="btn btn-sm btn-gold" onclick="editarProduto(${p.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${p.id}, '${p.nome}')">Excluir</button>
      </div>
    </div>
  `;
  }).join('');

  gridProdutos.innerHTML = html;
}

// ================================
// EDITAR PRODUTO (Global para onclick)
// ================================
window.editarProduto = async function(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  produtoEditando = id;
  imagemAtual = produto.imagem;

  document.getElementById('nome').value = produto.nome;
  document.getElementById('categoria').value = produto.categoria || '';
  document.getElementById('preco').value = produto.preco;
  document.getElementById('qtd').value = produto.estoque;

  if (produto.imagem) {
    preview.src = produto.imagem;
    preview.style.display = 'block';
    const placeholder = document.getElementById('uploadPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
  } else {
    preview.style.display = 'none';
    const placeholder = document.getElementById('uploadPlaceholder');
    if (placeholder) placeholder.style.display = 'block';
  }

  // Carregar tamanhos do produto
  try {
    tamanhosAtuais = await window.api.listarTamanhos(id);
    renderizarTamanhos();
  } catch (err) {
    console.error('Erro ao carregar tamanhos:', err);
    tamanhosAtuais = [];
  }

  inputImagem.value = '';
  modalTitulo.textContent = 'Editar Produto';
  modal.style.display = 'flex';
}

// ================================
// SALVAR PRODUTO
// ================================
async function salvarProdutoHandler() {
  const nome = document.getElementById('nome').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const precoBruto = document.getElementById('preco').value.trim();
  const preco = parseFloat(precoBruto.replace(/\./g, '').replace(',', '.'));
  const qtd = parseInt(document.getElementById('qtd').value);

  if (!nome || preco <= 0 || qtd < 0 || isNaN(preco) || isNaN(qtd)) {
    alert('❌ Preencha os campos obrigatórios corretamente');
    return;
  }

  try {
    salvarProduto.disabled = true;
    salvarProduto.textContent = '⏳ Salvando...';

    const dados = {
      nome,
      categoria,
      preco,
      estoque: qtd,
      imagem: imagemAtual
    };

    let produtoId;
    if (produtoEditando) {
      await window.api.atualizarProduto({ id: produtoEditando, ...dados });
      produtoId = produtoEditando;
      console.log('Produto atualizado:', produtoEditando);
    } else {
      const resultado = await window.api.criarProduto(dados);
      produtoId = resultado.id;
      console.log('Novo produto criado com ID:', produtoId);
    }

    // Salvar tamanhos
    if (produtoEditando) {
      // Excluir tamanhos antigos ao editar
      await window.api.excluirTamanhosPorProduto(produtoId);
    }

    // Adicionar novos tamanhos
    for (const tamanho of tamanhosAtuais) {
      await window.api.criarTamanho({
        produto_id: produtoId,
        tamanho: tamanho.tamanho,
        quantidade: tamanho.quantidade
      });
    }

    alert('✅ Produto salvo com sucesso!');
    limparFormulario();
    modal.style.display = 'none';
    carregarProdutos();
  } catch (err) {
    console.error('Erro ao salvar produto:', err);
    alert('❌ Erro ao salvar produto: ' + err.message);
  } finally {
    salvarProduto.disabled = false;
    salvarProduto.textContent = 'Salvar Produto';
  }
}

// ================================
// GERENCIAR TAMANHOS
// ================================
function adicionarTamanhoHandler() {
  const tamanho = document.getElementById('novoTamanho').value.trim().toUpperCase();
  const quantidade = parseInt(document.getElementById('novaQuantidade').value);

  if (!tamanho || isNaN(quantidade) || quantidade < 0) {
    alert('❌ Preencha o tamanho e quantidade corretamente');
    return;
  }

  // Verificar se o tamanho já foi adicionado
  if (tamanhosAtuais.some(t => t.tamanho === tamanho)) {
    alert('⚠️ Este tamanho já foi adicionado');
    return;
  }

  tamanhosAtuais.push({ tamanho, quantidade });
  renderizarTamanhos();

  // Limpar campos
  document.getElementById('novoTamanho').value = '';
  document.getElementById('novaQuantidade').value = '';
}

function renderizarTamanhos() {
  if (tamanhosAtuais.length === 0) {
    listaTamanhos.innerHTML = '<div style="text-align: center; padding: 20px; color: #666; font-size: 13px;"><svg width="40" height="40" style="opacity: 0.3; margin-bottom: 8px;" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg><br>Nenhum tamanho adicionado ainda</div>';
    return;
  }

  const html = tamanhosAtuais.map((t, index) => `
    <div class="d-flex justify-content-between align-items-center mb-2 p-3" style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 8px; border: 1px solid #3a3a3a; color: #fff; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" onmouseover="this.style.borderColor='#ffd84d'; this.style.transform='translateX(4px)';" onmouseout="this.style.borderColor='#3a3a3a'; this.style.transform='translateX(0)';">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: #ffd84d; color: #000; width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; box-shadow: 0 2px 6px rgba(255,216,77,0.4);">${t.tamanho}</div>
        <div>
          <div style="font-size: 13px; color: #fff; font-weight: 500;">${t.quantidade} unidade${t.quantidade !== 1 ? 's' : ''}</div>
          <div style="font-size: 11px; color: #888;">em estoque</div>
        </div>
      </div>
      <button type="button" class="btn btn-sm" onclick="removerTamanho(${index})" style="background: #ff4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(255,68,68,0.3);" onmouseover="this.style.background='#ff0000'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='#ff4444'; this.style.transform='scale(1)';">✕</button>
    </div>
  `).join('');

  listaTamanhos.innerHTML = html;
}

// Tornar função global para onclick
window.removerTamanho = function(index) {
  tamanhosAtuais.splice(index, 1);
  renderizarTamanhos();
}

// ================================
// CONFIRMAR EXCLUSÃO (Global para onclick)
// ================================
window.confirmarExclusao = function(id, nome) {
  if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
    excluirProduto(id);
  }
}

// ================================
// EXCLUIR PRODUTO
// ================================
async function excluirProduto(id) {
  try {
    await window.api.excluirProduto(id);
    console.log('Produto excluído:', id);
    alert('✅ Produto excluído com sucesso!');
    carregarProdutos();
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    alert('❌ Erro ao excluir: ' + err.message);
  }
}

// ================================
// PREVIEW DE IMAGEM
// ================================
function previewImagemHandler() {
  const file = inputImagem.files[0];
  if (!file) return;
  
  // Validar tipo de arquivo
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!tiposPermitidos.includes(file.type)) {
    alert('❌ Tipo de arquivo inválido! Use JPG, PNG ou WebP');
    inputImagem.value = '';
    return;
  }
  
  // Validar tamanho (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ Imagem muito grande! Tamanho máximo: 5MB');
    inputImagem.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagemAtual = e.target.result;
    preview.src = imagemAtual;
    preview.style.display = 'block';
    const placeholder = document.getElementById('uploadPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ================================
// LIMPAR FORMULÁRIO
// ================================
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('preco').value = '';
  document.getElementById('qtd').value = '';
  document.getElementById('novoTamanho').value = '';
  document.getElementById('novaQuantidade').value = '';
  inputImagem.value = '';
  preview.style.display = 'none';
  const placeholder = document.getElementById('uploadPlaceholder');
  if (placeholder) placeholder.style.display = 'block';
  produtoEditando = null;
  imagemAtual = null;
  tamanhosAtuais = [];
  renderizarTamanhos();
  modalTitulo.textContent = 'Novo Produto';
}

// ================================
// ================================
// ATUALIZAR FILTRO DE CATEGORIAS
// ================================
function atualizarFilterCategoria() {
  const select = document.getElementById('filterCategoria');
  
  // Limpar opções antigas (mantendo apenas "Todas as categorias")
  while (select.options.length > 1) {
    select.remove(1);
  }
  
  // Contar quantos produtos tem cada categoria
  const categoriasComProdutos = new Set();
  produtos.forEach(p => {
    if (p.categoria) categoriasComProdutos.add(p.categoria);
  });
  
  // Adicionar apenas categorias que têm produtos
  const opcoes = Array.from(categoriasComProdutos).sort();
  opcoes.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

// ================================
// ATUALIZAR FILTRO DE TAMANHOS
// ================================
function atualizarFilterTamanho() {
  const select = document.getElementById('filterTamanho');
  const opcoes = Array.from(tamanhosCadastrados).sort();
  
  opcoes.forEach(tamanho => {
    if (!select.querySelector(`option[value="${tamanho}"]`)) {
      const opt = document.createElement('option');
      opt.value = tamanho;
      opt.textContent = tamanho;
      select.appendChild(opt);
    }
  });
}

// ================================
// BUSCA E FILTRO
// ================================
function filtrarProdutos() {
  const termo = searchProduto.value.toLowerCase();
  const categoria = filterCategoria.value;
  const tamanho = filterTamanho.value;
  const estoqueFilter = filterEstoque.value;
  const sortValue = ordenarPor.value || 'nome-az';

  const filtrados = produtos.filter(p => {
    // Filtro por nome/categoria
    const matchNome = p.nome.toLowerCase().includes(termo) || 
                      (p.categoria && p.categoria.toLowerCase().includes(termo));
    const matchCategoria = !categoria || p.categoria === categoria;
    
    // Filtro por tamanho
    let matchTamanho = true;
    if (tamanho) {
      const tamanhosProduto = produtosComTamanhos[p.id] || [];
      matchTamanho = tamanhosProduto.some(t => t.tamanho === tamanho);
    }
    
    // Filtro por estoque
    let matchEstoque = true;
    if (estoqueFilter) {
      if (estoqueFilter === 'em-falta') {
        matchEstoque = p.estoque === 0;
      } else if (estoqueFilter === 'baixo') {
        matchEstoque = p.estoque > 0 && p.estoque <= 10;
      } else if (estoqueFilter === 'medio') {
        matchEstoque = p.estoque > 10 && p.estoque <= 30;
      } else if (estoqueFilter === 'alto') {
        matchEstoque = p.estoque > 30;
      }
    }
    
    return matchNome && matchCategoria && matchTamanho && matchEstoque;
  });

  // Aplicar ordenação
  switch(sortValue) {
    case 'nome-az':
      filtrados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      break;
    case 'nome-za':
      filtrados.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
      break;
    case 'preco-menor':
      filtrados.sort((a, b) => a.preco - b.preco);
      break;
    case 'preco-maior':
      filtrados.sort((a, b) => b.preco - a.preco);
      break;
    case 'estoque-menor':
      filtrados.sort((a, b) => a.estoque - b.estoque);
      break;
    case 'estoque-maior':
      filtrados.sort((a, b) => b.estoque - a.estoque);
      break;
  }

  renderizarProdutos(filtrados);
}

// ================================
// ATUALIZAR RESUMO
// ================================
function atualizarResumo() {
  document.getElementById('totalProdutos').textContent = produtos.length;
  document.getElementById('totalEstoque').textContent = 
    produtos.reduce((sum, p) => sum + (p.estoque || 0), 0);
  document.getElementById('valorTotal').textContent = 
    'R$ ' + produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0).toFixed(2);
}
