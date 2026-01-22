<div class="w3-row-padding w3-margin-bottom">
    <div class="w3-quarter">
      <div class="w3-container w3-orange w3-padding-16">
        <div class="w3-left"><i class="fa fa-shield w3-xxxlarge"></i></div>
        <div class="w3-right">
          <h3><?php echo $total_admin; ?></h3>
        </div>
        <div class="w3-clear"></div>
        <h4>Admins</h4>
      </div>
    </div>
    <div class="w3-quarter">
      <div class="w3-container w3-amber w3-padding-16">
        <div class="w3-left"><i class="fa fa-signal w3-xxxlarge"></i></div>
        <div class="w3-right">
          <h3><?php echo $total_ativos; ?></h3>
        </div>
        <div class="w3-clear"></div>
        <h4>Ativos</h4>
      </div>
    </div>
    <div class="w3-quarter">
      <div class="w3-container w3-blue w3-padding-16">
        <div class="w3-left"><i class="fa fa-exclamation-triangle w3-xxxlarge"></i></div>
        <div class="w3-right">
          <h3><?php echo $total_inativos; ?></h3>
        </div>
        <div class="w3-clear"></div>
        <h4>Inativos</h4>
      </div>
    </div>
    <div class="w3-quarter">
      <div class="w3-container w3-teal w3-text-white w3-padding-16">
        <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
        <div class="w3-right">
          <h3><?php echo $total_usuarios; ?></h3>
        </div>
        <div class="w3-clear"></div>
        <h4>Total de Usuarios</h4>
      </div>
    </div>
  </div>

<style>
  #usuarios tbody td {
    min-height: 150px; 
    padding: 20px 10px !important; 
    vertical-align: middle; 
    
    /* Mantém o texto maior para leitura */
    font-size: 1.15em; /* Reduzido levemente para 1.05em */
    line-height: 1.4; 
}
.w3-button {
    /* Padding reduzido para um tamanho mais confortável */
    padding: 8px 12px !important; 
    /* Tamanho da fonte dos botões reduzido para evitar que pareçam gigantes */
    font-size: 0.95em !important; 
    font-weight: bold; 
    margin: 4px 0; 
    min-width: 80px; /* Largura mínima um pouco menor */
    border-radius: 4px; /* Adiciona um pequeno arredondamento se o w3.css não tiver */
}

/* Ajuste das Tags de Status (Ativo/Inativo) para manter a proporção */
.w3-tag {
    font-size: 0.85em !important; 
    padding: 3px 7px !important;
}

    .w3-striped > tbody > tr.w3-pale-red,
    .w3-striped > tbody > tr.w3-pale-red:nth-child(even),
    .w3-striped > tbody > tr.w3-pale-red:nth-child(odd) 
    {
        background-color: #ffdddd !important; 
        color: #000 !important;
    }
    .w3-striped > tbody > tr.w3-pale-red {
        background-color: #5b0000 !important;
        color: white !important;
    }
</style>
<div class="w3-container">
    <h3>Gerenciar Usuários</h3>

    <header class="w3-container" style="padding-top:10px">
        <h5><b><i class="fa fa-dashboard"></i> Painel de Controle - Koketsu</b></h5>
    </header>

    <a href="/backend/usuario/criar" class="w3-button w3-yellow w3-margin-bottom w3-round-medium">Adicionar Novo Usuário</a>

    <main>
        <table id="usuarios" class="w3-table w3-striped  ">
            <thead>
                <tr class="w3-light-grey"> 
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Editar</th>
                    <th>Alterar</th>
            </thead>
            <tbody>
                <?php foreach ($usuarios as $usuario): ?>
                <?php $is_inativo = !empty($usuario['excluido_em']);?>
                
                <tr class="<?= $is_inativo ? 'w3-pale-red' : '' ?>"> 
                    <td><?= htmlspecialchars($usuario['id_usuarios']) ?></td>
                    <td><?= htmlspecialchars($usuario['nome_usuarios']) ?></td>
                    <td><?= htmlspecialchars($usuario['email_usuarios']) ?></td>
                    <td><?= htmlspecialchars($usuario['nivel_acesso']) ?></td>
                    
                    <td>
                        <?php if ($is_inativo): ?>
                            <span class="w3-button w3-red w3-small w3-round-medium">Inativo</span>
                        <?php else: ?>
                            <span class="w3-button w3-green w3-small w3-round-medium">Ativo</span>
                        <?php endif; ?>
                    </td>
                    
                    <td>
                        <a href="/backend/usuario/editar/<?= htmlspecialchars($usuario['id_usuarios']) ?>"
                           class="w3-button w3-small w3-blue w3-round-medium">Editar</a>
                    </td>
                    
                    <td>
                        <?php if ($is_inativo): ?>
                            <a href="/backend/usuario/ativar/<?= htmlspecialchars($usuario['id_usuarios']) ?>"
                               class="w3-button w3-small  w3-green w3-round-medium">Ativar</a>
                        <?php else: ?>
                            <a href="/backend/usuario/excluir/<?= htmlspecialchars($usuario['id_usuarios']) ?>"
                               class="w3-button w3-small  w3-red w3-round-medium">Inativar</a>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</div>