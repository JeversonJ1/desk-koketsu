// ================================
// ESTADO GLOBAL
// ================================
let clientes = [];
let cidades = new Set();
let clienteEditando = null;

let modal, btnNovo, cancelarModal, cancelarModalBtn, salvarCliente;
let gridClientes, searchCliente, filterCidade, limparFiltros, ordenarPor;
let modalTitulo;

// ================================
// INICIALIZAÇÃO
// ================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar elementos do DOM
  modal = document.getElementById('modalCliente');
  btnNovo = document.getElementById('btnNovoCliente');
  cancelarModal = document.getElementById('cancelarModal');
  cancelarModalBtn = document.getElementById('cancelarModalBtn');
  salvarCliente = document.getElementById('salvarCliente');
  gridClientes = document.getElementById('gridClientes');
  searchCliente = document.getElementById('searchCliente');
  filterCidade = document.getElementById('filterCidade');
  limparFiltros = document.getElementById('limparFiltros');
  ordenarPor = document.getElementById('ordenarPor');
  modalTitulo = document.getElementById('modalTitulo');

  // Configurar event listeners
  configurarEventListeners();
  
  // Carregar clientes
  carregarClientes();
  
  // Recarregar quando a aba ficar visível novamente
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      carregarClientes();
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

  // Salvar cliente
  if (salvarCliente) {
    salvarCliente.onclick = salvarClienteHandler;
  }

  // Busca e filtro
  if (searchCliente) {
    searchCliente.oninput = filtrarClientes;
  }
  
  if (filterCidade) {
    filterCidade.onchange = filtrarClientes;
  }

  if (ordenarPor) {
    ordenarPor.onchange = filtrarClientes;
  }

  if (limparFiltros) {
    limparFiltros.onclick = () => {
      searchCliente.value = '';
      filterCidade.value = '';
      ordenarPor.value = 'nome-az';
      filtrarClientes();
    };
  }
}

// ================================
// CARREGAR CLIENTES
// ================================
async function carregarClientes() {
  try {
    clientes = await window.api.listarClientes();
    console.log('Clientes carregados:', clientes);

    // Extrair cidades
    cidades = new Set();
    for (const c of clientes) {
      const cidade = extrairCidade(c.endereco_clientes);
      if (cidade) cidades.add(cidade);
    }
    
    atualizarFilterCidade();
    renderizarClientes(clientes);
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
    gridClientes.innerHTML = '<p class="text-danger col-12">Erro ao carregar clientes. Tentando novamente...</p>';
    setTimeout(carregarClientes, 2000);
  }
}

// ================================
// EXTRAIR CIDADE DO ENDEREÇO
// ================================
function extrairCidade(endereco) {
  if (!endereco) return null;
  const partes = endereco.split('-');
  return partes[partes.length - 1]?.trim() || null;
}

// ================================
// RENDERIZAR GRID DE CLIENTES
// ================================
function renderizarClientes(lista) {
  if (!lista || lista.length === 0) {
    gridClientes.innerHTML = '<p class="text-muted col-12 text-center py-5">Nenhum cliente encontrado</p>';
    return;
  }

  const html = lista.map(c => {
    const cidade = extrairCidade(c.endereco_clientes) || 'Sem cidade';
    const dataCadastro = new Date(c.data_cadastro).toLocaleDateString('pt-BR');
    
    return `
    <div class="cliente-card">
      <div class="cliente-info">
        <div class="cliente-dados">
          <div class="cliente-nome">👤 ${c.nome_clientes}</div>
          <div class="cliente-detalhes">
            <span title="${c.email_clientes}">📧 ${c.email_clientes.substring(0, 20)}${c.email_clientes.length > 20 ? '...' : ''}</span>
            ${c.telefone_clientes ? `<span>📱 ${c.telefone_clientes}</span>` : ''}
            <span>📍 ${cidade}</span>
            <span>📅 ${dataCadastro}</span>
          </div>
        </div>
        <div class="cliente-acoes">
          <button class="btn btn-sm btn-gold" onclick="editarCliente(${c.id_cliente})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${c.id_cliente}, '${c.nome_clientes}')">Excluir</button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  gridClientes.innerHTML = html;
}

// ================================
// EDITAR CLIENTE (Global para onclick)
// ================================
window.editarCliente = async function(id) {
  const cliente = clientes.find(c => c.id_cliente === id);
  if (!cliente) return;

  clienteEditando = id;

  document.getElementById('nome').value = cliente.nome_clientes;
  document.getElementById('email').value = cliente.email_clientes;
  document.getElementById('telefone').value = cliente.telefone_clientes || '';
  document.getElementById('endereco').value = cliente.endereco_clientes || '';

  modalTitulo.textContent = '✏️ Editar Cliente';
  modal.style.display = 'flex';
  document.getElementById('nome').focus();
}

// ================================
// SALVAR CLIENTE
// ================================
async function salvarClienteHandler() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !email) {
    alert('❌ Preencha pelo menos Nome e Email');
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('❌ Email inválido');
    return;
  }

  try {
    salvarCliente.disabled = true;
    salvarCliente.textContent = '⏳ Salvando...';

    const dados = {
      nome_clientes: nome,
      email_clientes: email,
      telefone_clientes: telefone,
      endereco_clientes: endereco
    };

    if (clienteEditando) {
      await window.api.atualizarCliente({ id: clienteEditando, ...dados });
      console.log('Cliente atualizado:', clienteEditando);
    } else {
      await window.api.criarCliente(dados);
      console.log('Novo cliente criado');
    }

    alert('✅ Cliente salvo com sucesso!');
    limparFormulario();
    modal.style.display = 'none';
    carregarClientes();
  } catch (err) {
    console.error('Erro ao salvar cliente:', err);
    alert('❌ Erro ao salvar cliente: ' + err.message);
  } finally {
    salvarCliente.disabled = false;
    salvarCliente.textContent = '💾 Salvar Cliente';
  }
}

// ================================
// CONFIRMAR EXCLUSÃO (Global para onclick)
// ================================
window.confirmarExclusao = function(id, nome) {
  if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
    excluirCliente(id);
  }
}

// ================================
// EXCLUIR CLIENTE
// ================================
async function excluirCliente(id) {
  try {
    await window.api.excluirCliente(id);
    console.log('Cliente excluído:', id);
    alert('✅ Cliente excluído com sucesso!');
    carregarClientes();
  } catch (err) {
    console.error('Erro ao excluir cliente:', err);
    alert('❌ Erro ao excluir: ' + err.message);
  }
}

// ================================
// LIMPAR FORMULÁRIO
// ================================
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('telefone').value = '';
  document.getElementById('endereco').value = '';
  clienteEditando = null;
  modalTitulo.textContent = 'Novo Cliente';
}

// ================================
// ATUALIZAR FILTRO DE CIDADES
// ================================
function atualizarFilterCidade() {
  const opcoes = Array.from(cidades).sort();
  
  opcoes.forEach(cidade => {
    if (!filterCidade.querySelector(`option[value="${cidade}"]`)) {
      const opt = document.createElement('option');
      opt.value = cidade;
      opt.textContent = cidade;
      filterCidade.appendChild(opt);
    }
  });
}

// ================================
// BUSCA E FILTRO
// ================================
function filtrarClientes() {
  const termo = searchCliente.value.toLowerCase();
  const cidade = filterCidade.value;
  const sortValue = ordenarPor.value || 'nome-az';

  const filtrados = clientes.filter(c => {
    const matchNome = c.nome_clientes.toLowerCase().includes(termo) || 
                      c.email_clientes.toLowerCase().includes(termo);
    
    let matchCidade = true;
    if (cidade) {
      const cidadeCliente = extrairCidade(c.endereco_clientes);
      matchCidade = cidadeCliente === cidade;
    }
    
    return matchNome && matchCidade;
  });

  // Aplicar ordenação
  switch(sortValue) {
    case 'nome-az':
      filtrados.sort((a, b) => a.nome_clientes.localeCompare(b.nome_clientes, 'pt-BR'));
      break;
    case 'nome-za':
      filtrados.sort((a, b) => b.nome_clientes.localeCompare(a.nome_clientes, 'pt-BR'));
      break;
    case 'data-recente':
      filtrados.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro));
      break;
    case 'data-antigo':
      filtrados.sort((a, b) => new Date(a.data_cadastro) - new Date(b.data_cadastro));
      break;
  }

  renderizarClientes(filtrados);
}
