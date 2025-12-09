<header class="w3-container" style="padding-top:22px">
  <h5><b><i class="fa fa-edit"></i> Editar Item de Pedido #<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?></b></h5>
</header>

<div class="w3-container w3-margin-bottom" style="max-width: 600px; margin: auto;">
    
    <div class="w3-card-4 w3-black w3-padding-large w3-margin-top w3-text-white" style="border-radius: 8px;">
        <h3 class="w3-border-bottom w3-padding-small w3-text-yellow" style="font-weight: 400;">
            <i class="fa fa-list-alt"></i> Atualizar Dados
        </h3>
        
        <form action="/backend/itenspedidos/atualizar/<?php echo $itempedido['id_itens_pedidos']; ?>" method="post">
            
            <p>
                <strong>Pedido Associado:</strong> 
                <a href="/backend/pedido/listar/<?= htmlspecialchars($itempedido['id_pedido']) ?>" class="w3-text-teal">
                    #<?php echo $itempedido['id_pedido']; ?>
                </a>
            </p>
             <p>
                <strong>Produto:</strong> 
                <span class="w3-text-light-grey">
                    <?php echo htmlspecialchars($itempedido['nome_produto'] ?? 'ID ' . $itempedido['id_produto']); ?>
                </span>
            </p>

            <p>
                <label for="quantidade"><strong>Quantidade:</strong></label>
                <input class="w3-input w3-border w3-light-grey" type="number" id="quantidade" value="<?php echo $itempedido['quantidade']; ?>" name="quantidade" required min="1" placeholder="Nova quantidade">
            </p>

            <p>
                <label for="preco_unitario"><strong>Preço Unitário (R$):</strong></label>
                <input class="w3-input w3-border w3-light-grey" type="number" step="0.01" id="preco_unitario" value="<?php echo $itempedido['preco_unitario']; ?>" name="preco_unitario" required placeholder="Novo preço">
            </p>

            <div class="w3-section w3-right-align w3-border-top w3-padding-top">
                <button type="submit" class="w3-button w3-round w3-blue w3-hover-dark-grey">
                    <i class="fa fa-save"></i> Salvar Alterações
                </button>
                <a href="/backend/itenspedidos/listar" class="w3-button w3-round w3-light-grey w3-hover-dark-grey w3-margin-left">
                    <i class="fa fa-arrow-left"></i> Voltar
                </a>
            </div>
        </form>
    </div>
</div>

<div style="height: 50px;"></div>