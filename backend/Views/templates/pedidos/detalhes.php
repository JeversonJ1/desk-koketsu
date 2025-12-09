<header class="w3-container" style="padding-top:22px">
    <h5><b><i class="fa fa-info-circle"></i> Detalhes do Pedido #<?= htmlspecialchars($pedido['id_pedido']) ?></b></h5>
</header>

<div class="w3-container w3-margin-top">
    <a href="/backend/pedido/listar" class="w3-button w3-round w3-light-grey w3-margin-bottom">
        <i class="fa fa-arrow-left"></i> Voltar à Lista
    </a>
</div>

<?php 
// Lógica para cor do status
$status = strtolower($pedido['status_pedido'] ?? 'desconhecido');
$status_classe = 'w3-dark-grey';
if ($status === 'pago' || $status === 'concluido') {
    $status_classe = 'w3-green';
} elseif ($status === 'pendente' || $status === 'em andamento') {
    $status_classe = 'w3-yellow w3-text-black';
} elseif ($status === 'cancelado') {
    $status_classe = 'w3-red';
}
?>

<div class="w3-row-padding w3-margin-bottom">

    <div class="w3-col l6 m6 w3-margin-bottom">
        <div class="w3-container w3-white w3-card-4 w3-padding">
            <h4><i class="fa fa-file-text-o"></i> Informações do Pedido</h4>
            <hr>
            <p><strong>ID do Pedido:</strong> #<?= htmlspecialchars($pedido['id_pedido'] ?? 'N/A') ?></p>
            <p><strong>Data:</strong> <?= date('d/m/Y H:i', strtotime($pedido['data_pedido'] ?? '')) ?></p>
            <p><strong>Criado em:</strong> <?= date('d/m/Y H:i', strtotime($pedido['criado_em'] ?? '')) ?></p>
            <p><strong>Status:</strong> 
                <span class="w3-tag w3-round w3-large <?= $status_classe ?>">
                    <?= ucfirst(htmlspecialchars($pedido['status_pedido'] ?? 'Desconhecido')) ?>
                </span>
            </p>
            <p><strong>Total Pago:</strong> <span class="w3-text-green w3-large w3-bold">R$ <?= number_format($pedido['total_pedido'] ?? 0, 2, ',', '.') ?></span></p>
        </div>
    </div>

    <div class="w3-col l6 m6 w3-margin-bottom">
        <div class="w3-container w3-white w3-card-4 w3-padding">
            <h4><i class="fa fa-user"></i> Informações do Cliente/Perfil</h4>
            <hr>
            <p><strong>ID Perfil:</strong> <?= htmlspecialchars($pedido['id_perfil'] ?? 'N/A') ?></p>
            <p><strong>Nome:</strong> <?= htmlspecialchars($pedido['nome_cliente'] ?? 'Perfil Não Encontrado') ?></p>
            <p><strong>Ações:</strong> 
                <a href="/backend/perfil/editar/<?= htmlspecialchars($pedido['id_perfil']) ?>" class="w3-button w3-small w3-theme w3-round">
                    <i class="fa fa-edit"></i> Ver Perfil
                </a>
            </p>
        </div>
    </div>

</div>

<div class="w3-container w3-margin-bottom">
    <div class="w3-container w3-white w3-card-4 w3-padding">
        <h4><i class="fa fa-shopping-basket"></i> Itens Comprados (<?= count($itens ?? []) ?>)</h4>
        <hr>
        
        <?php if (!empty($itens)): ?>
            <table class="w3-table w3-striped w3-bordered w3-hoverable">
                <thead>
                    <tr class="w3-light-grey">
                        <th>Produto</th>
                        <th>SKU</th>
                        <th class="w3-right-align">Preço Unitário</th>
                        <th class="w3-center">Quantidade</th>
                        <th class="w3-right-align">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $subtotal_geral = 0;
                    foreach ($itens as $item): 
                        $subtotal = $item['quantidade'] * $item['preco_unitario'];
                        $subtotal_geral += $subtotal;
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($item['nome_produto'] ?? 'Produto Desconhecido') ?></td>
                        <td><?= htmlspecialchars($item['sku_produto'] ?? 'N/A') ?></td>
                        <td class="w3-right-align">R$ <?= number_format($item['preco_unitario'] ?? 0, 2, ',', '.') ?></td>
                        <td class="w3-center"><?= htmlspecialchars($item['quantidade'] ?? 0) ?></td>
                        <td class="w3-right-align w3-bold">R$ <?= number_format($subtotal, 2, ',', '.') ?></td>
                    </tr>
                    <?php endforeach; ?>
                    <tr class="w3-light-grey w3-text-bold">
                        <td colspan="4" class="w3-right-align">Total Calculado:</td>
                        <td class="w3-right-align">R$ <?= number_format($subtotal_geral, 2, ',', '.') ?></td>
                    </tr>
                </tbody>
            </table>
        <?php else: ?>
            <p class="w3-text-red"><i class="fa fa-exclamation-triangle"></i> Nenhum item encontrado para este pedido.</p>
        <?php endif; ?>
    </div>
</div>

<div style="height: 100px;"></div>