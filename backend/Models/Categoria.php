<?php
namespace App\Koketsu\Models;
use PDO;

class Categoria {
  private $id_categorias;
  private $nome_categorias;
  private $descricao_categorias;
  private $criado_em;
  private $atualizado_em;
  private $excluido_em;
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  // Método para buscar todas as categorias não excluídas
  function buscarCategorias() {
    $sql = "SELECT * FROM tbl_categorias WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  function totalDeCategorias() {
    $sql = "SELECT COUNT(*) AS total FROM tbl_categorias";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}

function buscarCategoriasAtivos() {
    $sql = "SELECT COUNT(*) AS total_ativos FROM tbl_categorias WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}
function buscarCategoriasInativos() {
    $sql = "SELECT COUNT(*) AS total_inativos FROM tbl_categorias WHERE excluido_em IS NOT NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}
  public function paginacao(int $pagina = 1, int $por_pagina = 10): array{
        $totalQuery = "SELECT COUNT(*) FROM `tbl_categorias`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_categorias` LIMIT :limit OFFSET :offset";
        $dataStmt = $this->db->prepare($dataQuery);
        $dataStmt->bindValue(':limit', $por_pagina, PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $dataStmt->execute();
        $dados = $dataStmt->fetchAll(PDO::FETCH_ASSOC);
        $lastPage = ceil($total_de_registros / $por_pagina);
 
        return [
            'data' => $dados,
            'total' => (int) $total_de_registros,
            'por_pagina' => (int) $por_pagina,
            'pagina_atual' => (int) $pagina,
            'ultima_pagina' => (int) $lastPage,
            'de' => $offset + 1,
            'para' => $offset + count($dados)
        ];
    }

  // Método para buscar uma categoria por ID
  function buscarCategoriaPorId($id) {
    $sql = "SELECT * FROM tbl_categorias WHERE id_categorias = :id AND excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // Método para inserir uma nova categoria
  function inserirCategoria($nome, $descricao) {
    $sql = "INSERT INTO tbl_categorias (nome_categorias, descricao_categorias) 
            VALUES (:nome, :descricao)";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':descricao', $descricao);
    if($stmt->execute()) {
      return $this->db->lastInsertId();
    } else {
      return false;
    }
  }

  // Método para atualizar uma categoria existente
  function atualizarCategoria($id, $nome, $descricao) {
    $dataAtual = date('Y-m-d H:i:s');
    $sql = "UPDATE tbl_categorias SET 
            nome_categorias = :nome, 
            descricao_categorias = :descricao, 
            atualizado_em = :atualizado 
            WHERE id_categorias = :id AND excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':atualizado', $dataAtual);
    if($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // Método para excluir (soft delete) uma categoria
  function deletarCategoria($id) {
    $dataAtual = date('Y-m-d H:i:s');
    $sql = "UPDATE tbl_categorias SET excluido_em = :excluido WHERE id_categorias = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':excluido', $dataAtual);
    return $stmt->execute();
  }
}