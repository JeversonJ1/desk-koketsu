<header class="w3-container" style="padding-top:22px">
    <h5><b><i class="fa fa-dashboard"></i> Painel de Controle - Koketsu</b></h5>
</header>

<div class="w3-row-padding w3-margin-bottom">
    <div class="w3-quarter">
        <div class="w3-container w3-theme w3-padding-16">
            <div class="w3-left"><i class="fa fa-tags w3-xxxlarge"></i></div>
            <div class="w3-right">
                <h3>120</h3> </div>
            <div class="w3-clear"></div>
            <h4>Produtos</h4>
        </div>
    </div>
    <div class="w3-quarter">
        <div class="w3-container w3-black w3-padding-16">
            <div class="w3-left"><i class="fa fa-shopping-cart w3-xxxlarge"></i></div>
            <div class="w3-right">
                <h3><?= htmlspecialchars($total_pedidos ?? 0) ?></h3> </div>
            <div class="w3-clear"></div>
            <h4>Pedidos</h4>
        </div>
    </div>
    <div class="w3-quarter">
        <div class="w3-container w3-yellow w3-text-black w3-padding-16">
            <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
            <div class="w3-right">
                <h3>56</h3> </div>
            <div class="w3-clear"></div>
            <h4>Clientes</h4>
        </div>
    </div>
    <div class="w3-quarter">
        <div class="w3-container w3-dark-grey w3-padding-16">
            <div class="w3-left"><i class="fa fa-star w3-xxxlarge"></i></div>
            <div class="w3-right">
                <h3>4.8★</h3> </div>
            <div class="w3-clear"></div>
            <h4>Avaliações</h4>
        </div>
    </div>
</div>

<div class="w3-container">
    <h3><i class="fa fa-list"></i> Listar Pedidos</h3>
    <a href="/backend/pedido/criar" class="w3-button w3-round w3-green w3-margin-bottom">
        <i class="fa fa-plus"></i> Novo Pedido
    </a>
    
    <form action="/backend/pedido/listar" method="POST" class="w3-container w3-padding-small">
        <div class="w3-row-padding" style="margin: 0 -16px;">
            <div class="w3-col l3 m6 s12 w3-padding-small">
                <input 
                    type="text" 
                    name="id_pedido" 
                    class="w3-input w3-border w3-round-large" 
                    placeholder="Buscar por ID do Pedido"
                    value="<?= htmlspecialchars($_POST['id_pedido'] ?? '') ?>">
            </div>
            <div class="w3-col l2 m3 s12 w3-padding-small">
                <button type="submit" class="w3-button w3-round-large w3-black w3-hover-dark-grey w3-block">
                    <i class="fa fa-search"></i> Pesquisar
                </button>
            </div>
          
             <?php  if (isset($_POST['id_pedido'])): ?>
                <div class="w3-col l7 m3 s12 w3-padding-small">
                    <a href="/backend/pedido/listar/" class="w3-button w3-round-large w3-light-grey w3-hover-grey w3-block">
                        Limpar Busca
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </form>
 
</div>

<hr>


<?php if (isset($pedidos) && is_array($pedidos) && count($pedidos) > 0): ?>
    <div class="w3-container w3-responsive">
        <table class="w3-table w3-bordered w3-border w3-hoverable w3-dark-grey w3-text-white">
            <thead>
                <tr class="w3-black">
                    <th>ID</th>
                    <th>Cliente/Perfil</th> <th>Data</th>
                    <th>Endereço</th> 
                    <th>Total</th>
                    <th>Itens</th> <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($pedidos as $pedido): 
                    $status = strtolower($pedido['status_pedido']);
                    $status_classe = 'w3-dark-grey';
                    if ($status === 'pago' || $status === 'enviado' || $status === 'concluido') {
                        $status_classe = 'w3-green';
                    } elseif ($status === 'pendente' || $status === 'em processamento') {
                        $status_classe = 'w3-yellow w3-text-black';
                    } elseif ($status === 'cancelado') {
                        $status_classe = 'w3-red';
                    }
                ?>
                <tr>
                    <td><?= htmlspecialchars($pedido['id_pedido']) ?></td>
                    <td><?= htmlspecialchars($pedido['nome_cliente'] ?? 'N/A') ?></td> 
                    
                    <td><?= date('d/m/Y H:i', strtotime($pedido['data_pedido'])) ?></td> 
                    
                    <td><?= htmlspecialchars($pedido['endereco_perfil'] ?? 'N/A') ?></td> 
                    <td>R$ <?= number_format($pedido['total_pedido'], 2, ',', '.') ?></td>
                    
                    <td><?= htmlspecialchars($pedido['total_itens'] ?? 0) ?></td> 
                    
                    <td>
                        <span class="w3-tag w3-round <?= $status_classe ?>">
                            <?= ucfirst(htmlspecialchars($pedido['status_pedido'])) ?>
                        </span>
                    </td>
                    <td class="w3-center">
                        <a class="w3-button w3-round w3-small w3-teal w3-hover-dark-grey w3-margin-right"
                            href="/backend/pedido/detalhes/<?= htmlspecialchars($pedido['id_pedido']) ?>" 
                            title="Ver Detalhes do Pedido">
                            <i class="fa fa-info-circle"></i> Detalhes
                        </a>
                        <a class="w3-button w3-round w3-small w3-blue w3-hover-dark-grey w3-margin-right"
                            href="/backend/pedido/editar/<?= htmlspecialchars($pedido['id_pedido']) ?>"
                            title="Editar Pedido">
                            <i class="fa fa-edit"></i> Editar
                        </a>
                        <a class="w3-button w3-round w3-small w3-red w3-hover-dark-grey"
                            href="/backend/pedido/excluir/<?= htmlspecialchars($pedido['id_pedido']) ?>"
                            title="Excluir Pedido">
                            <i class="fa fa-trash"></i> Excluir
                        </a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    
    <?php if (empty($_POST['id_pedido']) && isset($paginacao)): ?>
        <div class="w3-container w3-padding-16">
            <div class="paginacao-controls" style="display:flex; justify-content:space-between; align-items:center;">
                <div class="page-selector" style="display:flex; align-items:center;">
                    <div class="page-nav">
                        <?php if (($paginacao['pagina_atual'] ?? 1) > 1): ?>
                            <a class="w3-button w3-round w3-light-grey w3-hover-dark-grey" href="/backend/pedido/listar/<?= $paginacao['pagina_atual'] - 1 ?>">« Anterior</a>
                        <?php endif; ?>
                        <span style="margin:0 10px;">Página <?= $paginacao['pagina_atual'] ?? 1 ?> de <?= $paginacao['ultima_pagina'] ?? 1 ?></span>
                        <?php if (($paginacao['pagina_atual'] ?? 1) < ($paginacao['ultima_pagina'] ?? 1)): ?>
                            <a class="w3-button w3-round w3-light-grey w3-hover-dark-grey" href="/backend/pedido/listar/<?= $paginacao['pagina_atual'] + 1 ?>">Próximo »</a>
                        <?php endif; ?>
                    </div>
                </div>
                <small class="w3-text-grey">
                    Exibindo <?= $paginacao['de'] ?? 0 ?> a <?= $paginacao['para'] ?? 0 ?> de <?= $paginacao['total'] ?? 0 ?> pedidos.
                </small>
            </div>
        </div>
    <?php endif; ?>

<?php else: ?>
    <div class="w3-container w3-panel w3-pale-yellow w3-border w3-round-large">
        <p>
            Nenhum pedido encontrado. 
            <?php if (isset($_POST['id_pedido'])): ?>
                Tente uma nova busca ou <a href="/backend/pedido/listar">limpe o filtro.</a>
            <?php else: ?>
                <a href="/backend/pedido/criar">Crie um novo pedido.</a>
            <?php endif; ?>
        </p>
    </div>
<?php endif; ?>

<div style="height: 100px;"></div>