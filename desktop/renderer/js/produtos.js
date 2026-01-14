const modal = document.getElementById('modalProduto');
const btnNovo = document.getElementById('btnNovoProduto');
const cancelar = document.getElementById('cancelarModal');
const salvar = document.getElementById('salvarProduto');
const lista = document.getElementById('listaProdutos');

const inputImagem = document.getElementById('imagem');
const preview = document.getElementById('preview');

// abrir / fechar modal
btnNovo.onclick = () => modal.style.display = 'flex';
cancelar.onclick = () => modal.style.display = 'none';

// preview da imagem
inputImagem.onchange = () => {
  const file = inputImagem.files[0];
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
};

// 🔥 LISTAR PRODUTOS (SQLite)
async function carregarProdutos() {
  lista.innerHTML = '';

  const produtos = await window.api.listarProdutos();

  produtos.forEach(p => {
    lista.innerHTML += `
      <tr>
        <td>
          <img src="${p.imagem || '../assets/produtos/placeholder.png'}" class="thumb">
        </td>
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>
          <button class="btn btn-danger" onclick="excluirProduto(${p.id})">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

// 💾 SALVAR PRODUTO (SQLite)
salvar.onclick = () => {
  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const preco = document.getElementById('preco').value;
  const estoque = document.getElementById('qtd').value;

  if (!nome || !preco || !estoque) {
    alert('Preencha todos os campos');
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    await window.api.criarProduto({
      nome,
      categoria,
      preco: Number(preco),
      estoque: Number(estoque),
      imagem: reader.result || '../assets/produtos/placeholder.png'
    });

    modal.style.display = 'none';
    limparFormulario();
    carregarProdutos();
  };

  if (inputImagem.files[0]) {
    reader.readAsDataURL(inputImagem.files[0]);
  } else {
    reader.onload();
  }
};

// ❌ EXCLUIR PRODUTO
async function excluirProduto(id) {
  if (!confirm('Deseja realmente excluir este produto?')) return;

  await window.api.excluirProduto(id);
  carregarProdutos();
}

// 🧹 LIMPAR FORMULÁRIO
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('preco').value = '';
  document.getElementById('qtd').value = '';
  preview.style.display = 'none';
  inputImagem.value = '';
}

// inicialização
carregarProdutos();
