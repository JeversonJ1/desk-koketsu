<header class="w3-container" style="padding-top:22px">
    <h5><b><i class="fa fa-dashboard"></i> Painel de Controle - Koketsu</b></h5>
</header>

<div class="w3-row-padding w3-margin-bottom">
    <div class="w3-quarter">
    <div class="w3-container w3-theme w3-padding-16">
    <div class="w3-left"><i class="fa fa-tags w3-xxxlarge"></i></div>
    <div class="w3-right">
    <h3>120</h3>
    </div>
    <div class="w3-clear"></div>
    <h4>Produtos</h4>
    </div>
    </div>
    <div class="w3-quarter">
    <div class="w3-container w3-black w3-padding-16">
    <div class="w3-left"><i class="fa fa-shopping-cart w3-xxxlarge"></i></div>
    <div class="w3-right">
    <h3>87</h3>
    </div>
    <div class="w3-clear"></div>
    <h4>Pedidos</h4>
    </div>
    </div>
    <div class="w3-quarter">
    <div class="w3-container w3-yellow w3-text-black w3-padding-16">
    <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
    <div class="w3-right">
    <h3>56</h3>
    </div>
    <div class="w3-clear"></div>
    <h4>Clientes</h4>
    </div>
    </div>
    <div class="w3-quarter">
    <div class="w3-container w3-dark-grey w3-padding-16">
    <div class="w3-left"><i class="fa fa-star w3-xxxlarge"></i></div>
    <div class="w3-right">
    <h3>4.8★</h3>
    </div>
    <div class="w3-clear"></div>
    <h4>Avaliações</h4>
    </div>
    </div>
</div>

<div class="w3-container">
    <h3><i class="fa fa-tag"></i> Listar Produtos</h3>
    <a href="/backend/produto/criar" class="w3-button w3-round w3-green w3-margin-bottom">
        <i class="fa fa-plus"></i> Novo Produto
    </a>
</div>

<?php if (isset($produtos) && count($produto) > 0): // Correção: use $produtos ao invés de $produto ?>
    <div class="w3-container w3-responsive">
        <table border ="1" cellpadding="5" cellspacing="0" 
            class="w3-table w3-bordered w3-border w3-hoverable w3-dark-grey w3-text-white">
            <thead>
                <tr class="w3-black"> 
                    <th>ID</th>
                    <th style="width: 80px;">Imagem</th> 
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($produtos as $produto): 
                    // --- LÓGICA DE LIMPEZA PARA EXIBIÇÃO DA IMAGEM ---
                    $imagem_bd = trim($produto['imagem_produtos'] ?? 'default.jpg');
                    $caminho_limpo = str_replace('\\', '/', $imagem_bd); 
                    // Remove prefixos indesejados (como 'produtos/' ou 'img/')
                    $nome_arquivo_puro = preg_replace('/^(img\/|produtos\/)/i', '', $caminho_limpo);
                    $imagem_url = "/backend/upload/" . $nome_arquivo_puro;
                    // -------------------------------------------------
                ?>
                <tr>
                    <td><?= htmlspecialchars($produto['id_produto']) ?></td>
                    
                    <td>
                        <img src="<?= $imagem_url ?>" 
                             alt="<?= htmlspecialchars($produto['nome_produtos']) ?>" 
                             style="width: 100%; max-width: 60px; height: auto;">
                    </td>
                    
                    <td><?= htmlspecialchars($produto['nome_produtos']) ?></td>
                    <td>R$ <?= number_format($produto['preco_produtos'], 2, ',', '.') ?></td>
                    <td>
                        <span class="w3-tag w3-round <?= ((int)$produto['estoque_produtos'] < 10) ? 'w3-red' : 'w3-blue' ?>">
                            <?= htmlspecialchars($produto['estoque_produtos']) ?>
                        </span>
                    </td>
                    <td class="w3-center">
                        <a class="w3-button w3-round w3-small w3-teal w3-hover-dark-grey w3-margin-right"
                           href="/backend/produto/detalhes/<?= htmlspecialchars($produto['id_produto']) ?>" 
                           title="Ver Detalhes">
                           <i class="fa fa-info-circle"></i> Detalhes
                        </a>
                        
                        <a class="w3-button w3-round w3-small w3-blue w3-hover-dark-grey w3-margin-right"
                           href="/backend/produto/editar/<?= htmlspecialchars($produto['id_produto']) ?>"
                           title="Editar Produto">
                           <i class="fa fa-edit"></i> Editar
                        </a>
                        
                        <a class="w3-button w3-round w3-small w3-red w3-hover-dark-grey"
                           href="/backend/produto/excluir/<?= htmlspecialchars($produto['id_produto']) ?>"
                           title="Excluir Produto">
                           <i class="fa fa-trash"></i> Excluir
                        </a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>


    <div class="w3-container w3-padding-16">
        <div class="paginacao-controls" style="display:flex; justify-content:space-between; align-items:center;">
            <div class="page-selector" style="display:flex; align-items:center;">
                <div class="page-nav">
                    <?php if (isset($paginacao['pagina_atual']) && (int)$paginacao['pagina_atual'] > 1): ?>
                        <a href="/backend/produto/listar/<?= (int)$paginacao['pagina_atual'] - 1 ?>">Anterior</a>
                    <?php endif; ?>

                    <span style="margin:0 10px;">
                        Página <?= (int)($paginacao['pagina_atual'] ?? 1) ?> de <?= (int)($paginacao['ultima_pagina'] ?? 1) ?>
                    </span>

                    <?php if (isset($paginacao['pagina_atual'], $paginacao['ultima_pagina']) && (int)$paginacao['pagina_atual'] < (int)$paginacao['ultima_pagina']): ?>
                        <a href="/backend/produto/listar/<?= (int)$paginacao['pagina_atual'] + 1 ?>">Próximo</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
<?php else: ?>
    <div class="w3-container w3-panel w3-pale-yellow w3-border w3-round-large">
        <p>Nenhum produto encontrado. <a href="/backend/produto/criar">Crie um novo produto.</a></p>
    </div>
<?php endif; ?>

<div style="height: 100px;"></div>