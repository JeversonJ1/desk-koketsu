<div class="w3-container">
    <h3 class="w3-text-green">Confirmar Ativação</h3>

    <div class="w3-container w3-card-4 w3-padding">
        <p>Você tem certeza que deseja ativar esse usuario?</p>

        <h3>Usuario: <?= htmlspecialchars($usuario['nome_usuarios']); ?></h3>


        <form action="/backend/usuario/ativar" method="POST" 
        enctype="multipart/form-data" class="w3-container w3-card-4">
            <input type="hidden" name="id_usuarios" value="<?= $usuario['id_usuarios']; ?>">

            <p>
                <button type="submit" class="w3-button w3-green w3-padding">Sim, ativar Usuário</button>
                <a href="/backend/usuario/listar" class="w3-button w3-grey w3-padding">Cancelar</a>
            </p>
        </form>
    </div>
</div>