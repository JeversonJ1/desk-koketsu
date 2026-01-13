const modal = document.getElementById('modalProduto');
const btnNovo = document.getElementById('btnNovoProduto');
const cancelar = document.getElementById('cancelarModal');
const salvar = document.getElementById('salvarProduto');
const lista = document.getElementById('listaProdutos');

const inputImagem = document.getElementById('imagem');
const preview = document.getElementById('preview');

btnNovo.onclick = () => modal.style.display = 'flex';
cancelar.onclick = () => modal.style.display = 'none';

inputImagem.onchange = () => {
  const file = inputImagem.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
};

function carregarProdutos() {
  lista.innerHTML = '';
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

  produtos.forEach((p, i) => {
    lista.innerHTML += `
      <tr>
        <td><img src="${p.imagem}" class="thumb"></td>
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>R$ ${p.preco}</td>
        <td>${p.qtd}</td>
        <td>
          <button class="btn btn-gold">Editar</button>
          <button class="btn btn-danger" onclick="excluirProduto(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

salvar.onclick = () => {
  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const preco = document.getElementById('preco').value;
  const qtd = document.getElementById('qtd').value;

  if (!nome || !preco || !qtd) return alert('Preencha todos os campos');

  const reader = new FileReader();
  reader.onload = () => {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    produtos.push({
      nome,
      categoria,
      preco,
      qtd,
      imagem: reader.result || '../assets/produtos/placeholder.png'
    });
    localStorage.setItem('produtos', JSON.stringify(produtos));
    modal.style.display = 'none';
    carregarProdutos();
  };

  if (inputImagem.files[0]) {
    reader.readAsDataURL(inputImagem.files[0]);
  } else {
    reader.onload();
  }
};

function excluirProduto(index) {
  const produtos = JSON.parse(localStorage.getItem('produtos'));
  produtos.splice(index, 1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  carregarProdutos();
}

carregarProdutos();
