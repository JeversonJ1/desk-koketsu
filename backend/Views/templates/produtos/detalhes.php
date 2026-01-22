<?php 
// Arquivo: views/templates/produtos/detalhes.php

if (empty($produto)): ?>
    <div class="w3-panel w3-red w3-round-large w3-margin-top w3-margin-bottom" style="margin: 20px;">
        <h3><i class="fa fa-times-circle"></i> Erro!</h3>
        <p>Produto não encontrado ou ID inválido. Verifique a URL.</p>
    </div>
<?php else: ?>

<header class="w3-container" style="padding-top:22px">
 <h5><b><i class="fa fa-tag"></i> Detalhes do Produto</b></h5>
</header>

<div class="w3-container w3-margin-bottom" style="max-width: 800px; margin: auto;">
    <h2 class="w3-border-bottom w3-padding-16 w3-text-white" style="font-weight: 500;">
        <?= htmlspecialchars($produto['nome_produto'] ?? 'Produto ID ' . $produto['id_produto']) ?>
    </h2>

    <div class="w3-card-4 w3-black w3-padding-large w3-margin-top w3-text-white" style="border-radius: 8px;">
        
        <h3 class="w3-border-bottom w3-padding-small w3-text-yellow" style="font-weight: 400;"><i class="fa fa-info-circle"></i> Informações Básicas</h3>
        
        <div class="w3-row-padding">
            
            <div class="w3-half">
                <p><strong>ID do Produto:</strong> <span class="w3-text-light-grey"><?= htmlspecialchars($produto['id_produto']) ?></span></p>
                <p><strong>Estoque Atual:</strong> <span class="w3-tag w3-teal w3-round-large"><?= htmlspecialchars($produto['estoque_produtos'] ?? 0) ?> UN</span></p>
            </div>

            <div class="w3-half w3-right-align">
                <p class="w3-xxlarge w3-text-yellow" style="font-weight: 600; margin-bottom: 5px;">
                    R$ <?= number_format($produto['preco_produto'] ?? 0, 2, ',', '.') ?>
                </p>
                <p class="w3-text-grey">Preço de Venda</p>
            </div>
        </div>
        
        <div class="w3-row-padding w3-margin-top w3-border-top w3-padding-top">
             <div class="w3-half">
                <p><strong>Categoria (ID):</strong> <span class="w3-text-light-grey"><?= htmlspecialchars($produto['id_categoria'] ?? 'N/A') ?></span></p>
            </div>
            <div class="w3-half w3-right-align">
                <p class="w3-small w3-text-grey">Criado em: <?= htmlspecialchars($produto['criado_em'] ?? 'N/A') ?></p>
                <p class="w3-small w3-text-grey">Atualizado em: <?= htmlspecialchars($produto['atualizado_em'] ?? 'Nunca') ?></p>
            </div>
        </div>

        <div class="w3-section w3-border-top w3-padding-small w3-margin-top">
            <h4 class="w3-text-yellow" style="margin-top: 10px;">Descrição Detalhada</h4>
            <div class="w3-panel w3-dark-grey w3-padding w3-round" style="min-height: 100px;">
                <p style="white-space: pre-wrap; margin: 0;"><?= htmlspecialchars($produto['descricao_produto'] ?? 'Sem descrição detalhada.') ?></p>
            </div>
        </div>

        <div class="w3-section w3-right-align w3-border-top w3-padding-top">
            <a href="/backend/produto/editar/<?= htmlspecialchars($produto['id_produto']) ?>"
               class="w3-button w3-round w3-blue w3-hover-dark-grey w3-margin-right">
                <i class="fa fa-edit"></i> Editar Produto
            </a>
            <a href="/backend/produto/listar"
               class="w3-button w3-round w3-light-grey w3-hover-dark-grey">
                <i class="fa fa-arrow-left"></i> Voltar à Lista
            </a>
        </div>
    </div>
</div>

<div style="height: 50px;"></div>

<?php endif; ?>