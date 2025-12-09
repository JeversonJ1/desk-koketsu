<div class="w3-container">
  <h3>Editando Usuario: <?= htmlspecialchars($usuario['nome_usuarios']); ?></h3>
  <form action="/backend/usuario/atualizar" method="post"
   enctype="multipart/form-data" class="w3-container w3-card-4">
   <input type="text" id="id_usuarios" name="id_usuarios" value="<?php echo $usuario['id_usuarios']; ?>" hidden>
   <label for="nome">Nome:</label>
   <input type="text" id="nome_usuarios" name="nome_usuarios" value="<?php echo $usuario['nome_usuarios']; ?>" required>
   <br>
   <label for="email">Email:</label>
   <input type="email" id="email_usuarios" name="email_usuarios" value="<?php echo $usuario['email_usuarios']; ?>" required>
   <br>
   <label for="senha">Senha:</label>
   <input type="password" id="senha_usuarios" name="senha_usuarios" value="" required>
   <br>
   <label for="tipo">Tipo:</label>
   <select id="nivel_acesso" name="nivel_acesso" value="<?php echo $usuario['nivel_acesso'] ?>" required>
   <option value="vendedor">Vendedor</option>
   <option value="admin" >Admin</option>
   </select><br>
    <p>
        <button type="submit" class="w3-button w3-blue">Salvar Alterações</button>
        <a href="/backend/usuario/listar" class="w3-button w3-grey">Cancelar</a>
        </p>
   </form>
   </div>