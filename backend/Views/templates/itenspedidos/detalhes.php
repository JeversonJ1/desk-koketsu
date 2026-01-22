<?php 
// Arquivo: views/templates/itenspedidos/detalhes.php

if (empty($itempedido)): ?>
    <div class="w3-panel w3-red w3-round-large w3-margin-top w3-margin-bottom" style="margin: 20px;">
        <h3><i class="fa fa-times-circle"></i> Erro!</h3>
        <p>Item de Pedido não encontrado ou ID inválido. Verifique a URL.</p>
    </div>
<?php else: 

    $subtotal = $itempedido['quantidade'] * $itempedido['preco_unitario'];
?>

<header class="w3-container" style="padding-top:22px">
  <h5><b><i class="fa fa-info-circle"></i> Detalhes do Item de Pedido</b></h5>
</header>

<div class="w3-container w3-margin-bottom" style="max-width: 700px; margin: auto;">
    <h2 class="w3-border-bottom w3-padding-16 w3-text-white" style="font-weight: 500;">
        Item #<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?>
    </h2>

    <div class="w3-card-4 w3-black w3-padding-large w3-margin-bottom w3-text-white" style="border-radius: 8px;">
        
        <h3 class="w3-border-bottom w3-padding-small w3-text-yellow" style="font-weight: 400;"><i class="fa fa-cube"></i> Produto</h3>
        
        <div class="w3-row-padding">
            <div class="w3-half">
                <p><strong>Nome do Produto:</strong> <span class="w3-text-light-grey"><?= htmlspecialchars($itempedido['nome_produto'] ?? 'ID ' . $itempedido['id_produto']) ?></span></p>
                <p><strong>ID do Pedido:</strong> 
                    <a href="/backend/pedido/listar/<?= htmlspecialchars($itempedido['id_pedido']) ?>" class="w3-text-teal">
                        #<?= htmlspecialchars($itempedido['id_pedido']) ?>
                    </a>
                </p>
            </div>
            
            <div class="w3-half w3-right-align">
                <p><strong>Quantidade:</strong> <span class="w3-tag w3-teal w3-round-large"><?= htmlspecialchars($itempedido['quantidade']) ?></span></p>
                <p><strong>Preço Unitário:</strong> <span class="w3-text-yellow">R$ <?= number_format($itempedido['preco_unitario'], 2, ',', '.') ?></span></p>
            </div>
        </div>

        <div class="w3-section w3-center w3-border-top w3-padding-top w3-margin-top">
            <p class="w3-large">Subtotal deste Item</p>
            <p class="w3-xxlarge w3-text-yellow" style="font-weight: 600;">
                R$ <?= number_format($subtotal, 2, ',', '.') ?>
            </p>
        </div>

        <div class="w3-section w3-right-align w3-small w3-text-grey w3-border-top w3-padding-top">
            Criado em: <?= htmlspecialchars($itempedido['criado_em'] ?? 'N/A') ?> | Última atualização: <?= htmlspecialchars($itempedido['atualizado_em'] ?? 'Nunca') ?>
        </div>
        
        <div class="w3-section w3-right-align">
            <a href="/backend/itenspedidos/editar/<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?>"
               class="w3-button w3-round w3-blue w3-hover-dark-grey w3-margin-right">
                <i class="fa fa-edit"></i> Editar Item
            </a>
            <a href="/backend/itenspedidos/listar"
               class="w3-button w3-round w3-light-grey w3-hover-dark-grey">
                <i class="fa fa-arrow-left"></i> Voltar à Lista
            </a>
        </div>
    </div>
</div>

<div style="height: 50px;"></div>

<?php endif; ?>