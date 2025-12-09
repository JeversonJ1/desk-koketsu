<div>Sou o create de Produtos</div>
<form action="/backend/produto/salvar" method="post"> 
    <label for="nome_produtos">Nome:</label>
    <input type="text" id="nome_produtos" name="nome_produtos" required>
    <br>

    <label for="descricao_produtos">Descrição:</label>
    <textarea id="descricao_produtos" name="descricao_produtos"></textarea> <br>

    <label for="preco_produtos">Preço:</label>
    <input type="number" step="0.01" id="preco_produtos" name="preco_produtos" required>
    <br>

    <label for="estoque_produtos">Estoque:</label>
    <input type="number" id="estoque_produtos" name="estoque_produtos" required>
    <br>
    
    <button type="submit">Salvar</button>
</form>