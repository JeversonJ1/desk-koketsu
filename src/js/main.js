console.log("Vite carregado com sucesso!");
import './style.css'

document.querySelector("#btnSalvar").addEventListener("click", async () => {
  const nome = document.querySelector("#nome").value;
  const quantidade = Number(document.querySelector("#quantidade").value);
  const preco = Number(document.querySelector("#preco").value);

  await window.api.criarProduto({ nome, quantidade, preco });
  alert("Produto cadastrado!");
});

async function carregarProdutos() {
  const produtos = await window.api.listarProdutos();
  console.table(produtos);
}

carregarProdutos();
