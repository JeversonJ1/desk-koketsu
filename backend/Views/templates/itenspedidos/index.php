<header class="w3-container" style="padding-top:22px">
     <h5><b><i class="fa fa-shopping-basket"></i> Itens de Pedidos</b></h5>
</header>

<div class="w3-row-padding w3-margin-bottom">
         <div class="w3-quarter">
        <div class="w3-container w3-theme w3-padding-16">
         <div class="w3-left"><i class="fa fa-tags w3-xxxlarge"></i></div>
         <div class="w3-right"><h3>120</h3></div>
         <div class="w3-clear"></div>
         <h4>Produtos</h4>
        </div>
     </div>
     <div class="w3-quarter">
        <div class="w3-container w3-black w3-padding-16">
         <div class="w3-left"><i class="fa fa-shopping-cart w3-xxxlarge"></i></div>
         <div class="w3-right"><h3><?= $total_itenspedidos ?? 'N/A' ?></h3></div>
         <div class="w3-clear"></div>
         <h4>Total de Itens</h4>
        </div>
     </div>
     <div class="w3-quarter">
        <div class="w3-container w3-yellow w3-text-black w3-padding-16">
         <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
         <div class="w3-right"><h3>56</h3></div>
         <div class="w3-clear"></div>
         <h4>Clientes</h4>
        </div>
     </div>
     <div class="w3-quarter">
        <div class="w3-container w3-dark-grey w3-padding-16">
         <div class="w3-left"><i class="fa fa-star w3-xxxlarge"></i></div>
         <div class="w3-right"><h3>4.8★</h3></div>
         <div class="w3-clear"></div>
         <h4>Avaliações</h4>
        </div>
     </div>
</div>

<div class="w3-container w3-margin-bottom">
    <h3><i class="fa fa-list-ul"></i> Lista de Itens de Pedidos</h3>
    <a href="/backend/itenspedidos/criar" class="w3-button w3-round w3-green w3-margin-bottom">
        <i class="fa fa-plus"></i> Novo Item
    </a>
</div>

<div class="w3-container w3-responsive">
    <?php if (isset($itenspedidos) && count($itenspedidos) > 0): ?>
    
    <table class="w3-table w3-bordered w3-border w3-hoverable w3-black w3-text-white">
        <thead>
            <tr class="w3-dark-grey">
                <th>ID Item</th>
                <th>ID Pedido</th>
                <th>Produto</th> 
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th class="w3-right-align">Subtotal</th>
                <th class="w3-center">Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($itenspedidos as $itempedido): 
                $subtotal = $itempedido['quantidade'] * $itempedido['preco_unitario'];
            ?>
            <tr>
                <td><?= htmlspecialchars($itempedido['id_itens_pedidos']) ?></td>
                <td>
                    <a href="/backend/pedido/listar/<?= htmlspecialchars($itempedido['id_pedido']) ?>" class="w3-text-teal">
                        <?= htmlspecialchars($itempedido['id_pedido']) ?>
                    </a>
                </td>
                <td>
                    <?= htmlspecialchars($itempedido['nome_produto'] ?? 'ID ' . $itempedido['id_produto']) ?>
                </td>
                <td><?= htmlspecialchars($itempedido['quantidade']) ?></td>
                <td>R$ <?= number_format($itempedido['preco_unitario'], 2, ',', '.') ?></td>
                <td class="w3-right-align w3-text-yellow">R$ <?= number_format($subtotal, 2, ',', '.') ?></td>
                <td class="w3-center" style="white-space: nowrap;">
                    <a class="w3-button w3-round w3-small w3-teal w3-hover-dark-grey w3-margin-right"
                       href="/backend/itenspedidos/listar/<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?>" 
                       title="Ver Detalhes do Item">
                       <i class="fa fa-info-circle"></i>
                    </a>
                    <a class="w3-button w3-round w3-small w3-blue w3-hover-dark-grey w3-margin-right"
                       href="/backend/itenspedidos/editar/<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?>"
                       title="Editar Item">
                       <i class="fa fa-edit"></i>
                    </a>
                    <a class="w3-button w3-round w3-small w3-red w3-hover-dark-grey"
                       href="/backend/itenspedidos/excluir/<?= htmlspecialchars($itempedido['id_itens_pedidos']) ?>"
                       title="Excluir Item">
                       <i class="fa fa-trash"></i>
                    </a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    
    <div class="paginacao-controls w3-padding-16" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="page-nav w3-text-white">
          <?php if ($paginacao['pagina_atual'] > 1): ?>
             <a href="/backend/itenspedidos/listar/<?= $paginacao['pagina_atual'] - 1 ?>" class="w3-button w3-dark-grey w3-round w3-small w3-margin-right">Anterior</a>
          <?php endif; ?>
          <span>Página <?= $paginacao['pagina_atual'] ?> de <?= $paginacao['ultima_pagina'] ?></span>
          <?php if ($paginacao['pagina_atual'] < $paginacao['ultima_pagina']): ?>
             <a href="/backend/itenspedidos/listar/<?= $paginacao['pagina_atual'] + 1 ?>" class="w3-button w3-dark-grey w3-round w3-small w3-margin-left">Próximo</a>
          <?php endif; ?>
        </div>
    </div>
    
    <?php else: ?>
        <div class="w3-panel w3-pale-yellow w3-border w3-round-large w3-text-black">
            <p>Nenhum item de pedido encontrado.</p>
        </div>
    <?php endif; ?>
</div>

<div style="height: 50px;"></div>