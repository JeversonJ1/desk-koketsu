<div class="w3-container">
    <h3 class="w3-text-red">Confirmar Inativação</h3>

    <div class="w3-container w3-card-4 w3-padding">
        <p>Você tem certeza que deseja inativar (excluir) esse pedido?</p>

        <h3>Usuario: <?= htmlspecialchars($pedidos['id_pedido']); ?></h3>

        <p>Esta ação não pode ser desfeita facilmente e o usuário deixará de aparecer no site público.</p>

        <form action="/backend/pedido/deletar" method="POST" 
        enctype="multipart/form-data" class="w3-container w3-card-4">
            <input type="hidden" name="id_pedido" value="<?= $usuario['id_pedido']; ?>">

            <p>
                <button type="submit" class="w3-button w3-red w3-padding">Sim, Inativar Usuário</button>
                <a href="/backend/pedido/listar" class="w3-button w3-grey w3-padding">Cancelar</a>
            </p>
        </form>
    </div>
</div>