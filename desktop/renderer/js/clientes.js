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
  
  // Formatação automática de campos
  configurarFormatacao();

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
// FORMATAÇÃO DE CAMPOS
// ================================
function configurarFormatacao() {
  // Telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
      }
      e.target.value = valor;
    });
  }
  
  // CPF/CNPJ
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor.length <= 11) {
        // CPF: 000.000.000-00
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      } else {
        // CNPJ: 00.000.000/0000-00
        valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
      }
      e.target.value = valor;
    });
    
    cpfInput.addEventListener('blur', () => {
      const cpfErro = document.getElementById('cpfErro');
      if (cpfInput.value && !validarCPFCNPJ(cpfInput.value)) {
        cpfErro.style.display = 'block';
        cpfInput.style.borderColor = '#dc3545';
      } else {
        cpfErro.style.display = 'none';
        cpfInput.style.borderColor = '#333';
      }
    });
  }
  
  // CEP
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = valor;
    });
    
    cepInput.addEventListener('blur', () => {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length === 8) {
        buscarCEP(cep);
      }
    });
  }
  
  // Email
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailErro = document.getElementById('emailErro');
      if (emailInput.value && !validarEmail(emailInput.value)) {
        emailErro.style.display = 'block';
        emailInput.style.borderColor = '#dc3545';
      } else {
        emailErro.style.display = 'none';
        emailInput.style.borderColor = '#333';
      }
    });
  }
}

// ================================
// VALIDAÇÕES
// ================================
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validarCPFCNPJ(valor) {
  const numeros = valor.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return validarCPF(numeros);
  } else if (numeros.length === 14) {
    return validarCNPJ(numeros);
  }
  return false;
}

function validarCPF(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto === 10 || resto === 11 ? 0 : resto;
  
  if (digito1 !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto === 10 || resto === 11 ? 0 : resto;
  
  return digito2 === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0)) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado == digitos.charAt(1);
}

// ================================
// BUSCAR CEP
// ================================
async function buscarCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (!data.erro) {
      document.getElementById('endereco').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      
      // Focar no campo número
      document.getElementById('numero').focus();
    }
  } catch (err) {
    console.log('Erro ao buscar CEP:', err);
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
  const cpf = document.getElementById('cpf').value.trim();
  const dataNascimento = document.getElementById('dataNascimento').value;
  const cep = document.getElementById('cep').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();

  // Validações
  if (!nome || !email) {
    alert('❌ Preencha pelo menos Nome e Email');
    return;
  }

  if (!validarEmail(email)) {
    alert('❌ Email inválido');
    return;
  }
  
  if (cpf && !validarCPFCNPJ(cpf)) {
    alert('❌ CPF/CNPJ inválido');
    return;
  }

  try {
    salvarCliente.disabled = true;
    salvarCliente.textContent = '⏳ Salvando...';

    // Montar endereço completo
    const enderecoCompleto = [
      endereco,
      numero ? `nº ${numero}` : '',
      bairro,
      cidade
    ].filter(Boolean).join(', ');

    const dados = {
      nome_clientes: nome,
      email_clientes: email,
      telefone_clientes: telefone,
      endereco_clientes: enderecoCompleto || endereco,
      cpf_clientes: cpf,
      data_nascimento: dataNascimento,
      cep_clientes: cep,
      cidade_clientes: cidade,
      observacoes_clientes: observacoes
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
  document.getElementById('cpf').value = '';
  document.getElementById('dataNascimento').value = '';
  document.getElementById('cep').value = '';
  document.getElementById('endereco').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('cidade').value = '';
  document.getElementById('observacoes').value = '';
  
  // Limpar mensagens de erro
  document.getElementById('emailErro').style.display = 'none';
  document.getElementById('cpfErro').style.display = 'none';
  document.getElementById('email').style.borderColor = '#333';
  document.getElementById('cpf').style.borderColor = '#333';
  
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
