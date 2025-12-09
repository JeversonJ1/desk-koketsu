<?php
namespace App\Koketsu\Models;
use PDO;

class Usuario {
  private $id_usuarios;
  private $nome_usuarios;
  private $email_usuarios;
  private $senha_usuarios;
  private $nivel_acesso;
  private $criado_em;
  private $atualizado_em;
  private $excluido_em;
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  // Buscar todos os usuários
  function buscarUsuarios(){
    $sql = "SELECT * FROM tbl_usuarios WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  function totalDeUsuarios() {
    $sql = "SELECT COUNT(*) AS total FROM tbl_usuarios";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}

function buscarUsuariosAtivos() {
    $sql = "SELECT COUNT(*) AS total_ativos FROM tbl_usuarios WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}

function buscarUsuariosAdmin() {
    $sql = "SELECT COUNT(*) AS total_admin FROM tbl_usuarios WHERE nivel_acesso = 'admin' ";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}

 function buscarUsuariosInativos(){
   $sql = "SELECT COUNT(*) AS total_inativos FROM tbl_usuarios WHERE excluido_em IS NOT NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}

  public function paginacao(int $pagina = 1, int $porPagina = 50){
        $offset = ($pagina - 1) * $porPagina;
        $sql = "SELECT id_usuarios,nome_usuarios,email_usuarios,nivel_acesso,excluido_em FROM tbl_usuarios 
                LIMIT :offset, :porPagina";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindParam(':porPagina', $porPagina, PDO::PARAM_INT);
        $stmt->execute();
        $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $totalStmt = $this->db->query("SELECT COUNT(*) FROM tbl_usuarios");
        $total = $totalStmt->fetchColumn();
        $totalPaginas = ceil($total / $porPagina);

        return [
            'data' => $dados,
            'total' => (int) $total,
            'por_pagina' => (int) $porPagina,
            'pagina_atual' => (int) $pagina,
            'total_paginas' => (int) $totalPaginas
        ];
    }
 public function paginacaoAPI(int $pagina = 1, int $por_pagina = 10): array{
        $totalQuery = "SELECT COUNT(*) FROM `tbl_usuarios`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_usuarios` LIMIT :limit OFFSET :offset";
        $dataStmt = $this->db->prepare($dataQuery);
        $dataStmt->bindValue(':limit', $por_pagina, PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $dataStmt->execute();
        $dados = $dataStmt->fetchAll(PDO::FETCH_ASSOC);
        $lastPage = ceil($total_de_registros / $por_pagina);
 
        return [
            'data' => $dados,
        ];
    }
 

  // Buscar usuários por email
 public function buscarUsuariosPorEmail($email){ 
    $sql = "SELECT * FROM tbl_usuarios WHERE email_usuarios = :email AND excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    return $resultado;
}
   function buscarUsuariosPorId($id){
   $sql = "SELECT * FROM tbl_usuarios where id_usuarios = :id_usuarios and excluido_em IS NULL";
   $stmt = $this->db->prepare($sql);
   $stmt->bindParam(':id_usuarios', $id);
   $stmt->execute();
   return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function buscarUsuariosPorEmailInativos($email){
   $sql = "SELECT * FROM tbl_usuarios where email_usuarios = :email and excluido_em IS NOT NULL";
   $stmt = $this->db->prepare($sql);
   $stmt->bindParam(':email', $email);
   $stmt->execute();
   return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

  // Inserir novo usuário
  function inserirUsuario(string $nome, string $email, string $senha, string $nivel){
    $senha = password_hash($senha, PASSWORD_DEFAULT);
    $sql = "INSERT INTO tbl_usuarios 
(nome_usuarios, email_usuarios, senha_usuarios, nivel_acesso, excluido_em, criado_em)
VALUES (:nome, :email, :senha, :nivel, 'ativo', NOW())";

    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':senha', $senha);
    $stmt->bindParam(':nivel', $nivel);

    if($stmt->execute()){
        return $this->db->lastInsertId();
    } else {
        return false;
    }
  }

  public function buscarPorID($id){
        $sql = "SELECT * FROM tbl_usuarios WHERE id_usuarios = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

  function atualizarUsuario($id, $nome, $email, $senha, $nivel){
    $senha = password_hash($senha, PASSWORD_DEFAULT);
    $dataatual = date('Y-m-d H:i:s');
    $sql = "UPDATE tbl_usuarios SET 
              nome_usuarios = :nome,
              email_usuarios = :email,
              senha_usuarios = :senha,
              nivel_acesso = :nivel,
              atualizado_em = :atual
            WHERE id_usuarios = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':senha', $senha);
    $stmt->bindParam(':nivel', $nivel);
    $stmt->bindParam(':atual', $dataatual);

    if($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // Excluir usuário (soft delete)
  function deletarUsuario(int $id){
        $agora = date("Y-m-d h:m:s");
        $coluna = $this->buscarPorID($id);
        //ternario
        $coluna = $coluna['excluido_em'] != NULL ? NULL : $agora;
       
        $sql = "UPDATE tbl_usuarios SET excluido_em = :excluido_em WHERE id_usuarios = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':excluido_em', $coluna);
        return $stmt->execute();
    }

    public function ativarUsuario(int $id) {
    $coluna = NULL; 
    $sql = "UPDATE tbl_usuarios SET excluido_em = :excluido_em WHERE id_usuarios = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':excluido_em', $coluna, PDO::PARAM_NULL); 
    
    return $stmt->execute();
}

  public function checarCredenciais(string $email, string $senha) {
    $usuario = $this->buscarUsuariosPorEmail($email);
    
    if (count($usuario) !== 1){
        return false;
    }
    
    $usuario = $usuario[0];
    if (password_verify($senha, $usuario['senha_usuarios'])){ 
        return $usuario; // Retorna o array que contém as chaves PLURAIS
    }
    
    return false;
}

}