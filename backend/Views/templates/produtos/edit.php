<div class="w3-container w3-margin-top">
    <h2>Editar Produto</h2>

    <?php if (!empty($produtos) && isset($produtos['id_produto'])): ?>
        <form action="/backend/produto/atualizar/<?php echo (int)$produtos['id_produto']; ?>" method="post" class="w3-container w3-card w3-padding w3-black">

            <label for="id_produto">Produto (ID):</label>
            <input class="w3-input w3-margin-bottom" type="number" id="id_produto" name="id_produto"
                value="<?php echo htmlspecialchars($produtos['id_produto'] ?? ''); ?>" required>

            <label for="nome_produtos">Nome:</label>
            <input class="w3-input w3-margin-bottom" type="text" id="nome_produtos" name="nome_produtos"
                value="<?php echo htmlspecialchars($produtos['nome_produtos'] ?? ''); ?>" required>

            <label for="descricao_produtos">Descrição:</label>
            <textarea class="w3-input w3-margin-bottom" id="descricao_produtos" name="descricao_produtos" required><?php echo htmlspecialchars($produtos['descricao_produtos'] ?? ''); ?></textarea>

            <label for="preco_produtos">Preço:</label>
            <input class="w3-input w3-margin-bottom" type="number" step="0.01" id="preco_produtos" name="preco_produtos"
                value="<?php echo htmlspecialchars($produtos['preco_produtos'] ?? ''); ?>" required>

            <label for="estoque_produtos">Estoque:</label>
            <input class="w3-input w3-margin-bottom" type="number" id="estoque_produtos" name="estoque_produtos"
                value="<?php echo htmlspecialchars($produtos['estoque_produtos'] ?? ''); ?>" required>

            <label for="imagem_produtos">Imagem (URL):</label>
            <input class="w3-input w3-margin-bottom" type="text" id="imagem_produtos" name="imagem_produtos"
                value="<?php echo htmlspecialchars($produtos['imagem_produtos'] ?? ''); ?>">



            <button type="submit" class="w3-button w3-yellow w3-round-large">Salvar</button>
        </form>

    <?php else: ?>
        <div class="w3-panel w3-red w3-padding">
            <p><b>Erro:</b> Produto não encontrado.</p>
        </div>
    <?php endif; ?>
</div>
