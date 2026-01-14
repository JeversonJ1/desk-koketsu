// ================================
// ESTADO GLOBAL
// ================================
let produtos = [];
let categorias = new Set();
let produtoEditando = null;
let imagemAtual = null;

const modal = document.getElementById('modalProduto');
const btnNovo = document.getElementById('btnNovoProduto');
const cancelarModal = document.getElementById('cancelarModal');
const cancelarModalBtn = document.getElementById('cancelarModalBtn');
const salvarProduto = document.getElementById('salvarProduto');
const gridProdutos = document.getElementById('gridProdutos');
const inputImagem = document.getElementById('imagem');
const preview = document.getElementById('preview');
const searchProduto = document.getElementById('searchProduto');
const filterCategoria = document.getElementById('filterCategoria');
const modalTitulo = document.getElementById('modalTitulo');

// ================================
// CARREGAR PRODUTOS
// ================================
async function carregarProdutos() {
  try {
    produtos = await window.api.listarProdutos();
    console.log('Produtos carregados:', produtos);

    // Extrair categorias
    categorias = new Set();
    produtos.forEach(p => {
      if (p.categoria) categorias.add(p.categoria);
    });
    atualizarFilterCategoria();
    renderizarProdutos(produtos);
    atualizarResumo();
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    gridProdutos.innerHTML = '<p class="text-danger col-12">Erro ao carregar produtos</p>';
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

  const html = lista.map(p => `
    <div class="card-estoque-produto">
      <div class="imagem-container">
        <img src="${p.imagem || '../assets/produtos/placeholder.png'}" 
             alt="${p.nome}"
             onerror="this.src='../assets/produtos/placeholder.png'">
        <div class="badge-estoque ${p.estoque > 10 ? 'badge-ok' : p.estoque > 0 ? 'badge-warning' : 'badge-critical'}">
          ${p.estoque} un
        </div>
      </div>
      <div class="info-produto">
        <h5>${p.nome}</h5>
        <p class="categoria">${p.categoria || 'Sem categoria'}</p>
        <div class="preco-info">
          <span class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</span>
        </div>
      </div>
      <div class="acoes-produto">
        <button class="btn btn-sm btn-gold" onclick="editarProduto(${p.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${p.id}, '${p.nome}')">Excluir</button>
      </div>
    </div>
  `).join('');

  gridProdutos.innerHTML = html;
}

// ================================
// EDITAR PRODUTO
// ================================
function editarProduto(id) {
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
  } else {
    preview.style.display = 'none';
  }

  inputImagem.value = '';
  modalTitulo.textContent = 'Editar Produto';
  modal.style.display = 'flex';
}

// ================================
// SALVAR PRODUTO
// ================================
salvarProduto.onclick = async () => {
  const nome = document.getElementById('nome').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const qtd = parseInt(document.getElementById('qtd').value);

  if (!nome || preco < 0 || qtd < 0 || isNaN(preco) || isNaN(qtd)) {
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

    if (produtoEditando) {
      await window.api.atualizarProduto(produtoEditando, dados);
      console.log('Produto atualizado:', produtoEditando);
    } else {
      await window.api.criarProduto(dados);
      console.log('Novo produto criado');
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
};

// ================================
// CONFIRMAR EXCLUSÃO
// ================================
function confirmarExclusao(id, nome) {
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
inputImagem.onchange = () => {
  const file = inputImagem.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagemAtual = e.target.result;
    preview.src = imagemAtual;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

// ================================
// LIMPAR FORMULÁRIO
// ================================
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('preco').value = '';
  document.getElementById('qtd').value = '';
  inputImagem.value = '';
  preview.style.display = 'none';
  produtoEditando = null;
  imagemAtual = null;
  modalTitulo.textContent = 'Novo Produto';
}

// ================================
// FECHAR MODAL
// ================================
btnNovo.onclick = () => {
  limparFormulario();
  modal.style.display = 'flex';
};

cancelarModal.onclick = () => {
  modal.style.display = 'none';
};

cancelarModalBtn.onclick = () => {
  modal.style.display = 'none';
};

// Fechar ao clicar fora do modal
window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

// ================================
// ATUALIZAR FILTRO DE CATEGORIAS
// ================================
function atualizarFilterCategoria() {
  const select = document.getElementById('filterCategoria');
  const opcoes = Array.from(categorias).sort();
  
  opcoes.forEach(cat => {
    if (!select.querySelector(`option[value="${cat}"]`)) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
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

  const filtrados = produtos.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(termo) || 
                      (p.categoria && p.categoria.toLowerCase().includes(termo));
    const matchCategoria = !categoria || p.categoria === categoria;
    return matchNome && matchCategoria;
  });

  renderizarProdutos(filtrados);
}

searchProduto.oninput = filtrarProdutos;
filterCategoria.onchange = filtrarProdutos;

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

// ================================
// INICIALIZAR
// ================================
carregarProdutos();
