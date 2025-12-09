<?php

namespace App\Koketsu\Models;
use PDO;

class Produtos {
  private $id_produto;
  private $nome_produtos;
  private $descricao_produtos;
  private $preco_produtos;
  private $estoque_produtos;
  private $imagem_produtos;
  private $id_categoria;
  private $criado_em;
  private $atualizado_em;
  private $excluido_em;
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  // Buscar todos os produtos ativos
  function buscarProdutos() {
    $sql = "SELECT * FROM tbl_produtos WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

function buscarProdutoPorId($id) {
    
    
    $sql = "SELECT 
                id_produto, 
                nome_produtos AS nome_produto, 
                preco_produtos AS preco_produto, 
                descricao_produtos AS descricao_produto, 
                criado_em 
            FROM tbl_produtos 
            WHERE id_produto = :id_produto AND excluido_em IS NULL";
            
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id_produto', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function buscarProdutosAtivos() {
    $sql = "SELECT 
                id_produto,
                nome_produtos,
                descricao_produtos,
                preco_produtos,
                estoque_produtos,
                imagem_produtos,
                id_categoria,
                criado_em,
                atualizado_em
            FROM tbl_produtos
            WHERE excluido_em IS NULL";

    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function buscarProdutosAtivosComCategoria() {
    $sql = "SELECT 
                p.*, 
                c.nome_categorias as nome_categoria
      
            FROM tbl_produtos p 
            JOIN tbl_categorias c ON p.id_categoria = c.id_categorias
            WHERE p.excluido_em IS NULL AND p.estoque_produtos > 0
            ORDER BY c.nome_categorias, p.id_produto DESC";

    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


public function paginacao(int $pagina = 1, int $por_pagina = 50): array{
        $totalQuery = "SELECT COUNT(*) FROM `tbl_produtos`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_produtos` LIMIT :limit OFFSET :offset";
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

    public function paginacaoAPI(int $pagina = 1, int $por_pagina = 50): array{
        $totalQuery = "SELECT COUNT(*) FROM `tbl_produtos`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_produtos` LIMIT :limit OFFSET :offset";
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

    function totalDeProdutos() {
    $sql = "SELECT COUNT(*) AS total FROM tbl_produtos";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_COLUMN);
}
  // Inserir novo produto
  function inserirProduto($nome, $descricao, $preco, $estoque, $imagem, $id_categoria) {
    $sql = "INSERT INTO tbl_produtos 
            (nome_produtos, descricao_produtos, preco_produtos, estoque_produtos, imagem_produtos, id_categoria, criado_em)
            VALUES (:nome, :descricao, :preco, :estoque, :imagem, :id_categoria, NOW())";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':preco', $preco);
    $stmt->bindParam(':estoque', $estoque);
    $stmt->bindParam(':imagem', $imagem);
    $stmt->bindParam(':id_categoria', $id_categoria);
    if($stmt->execute()) {
      return $this->db->lastInsertId();
    } else {
      return false;
    }
  }

  // Atualizar produto existente
  function atualizarProduto($id_produto, $nome, $descricao, $preco, $estoque, $imagem, $id_categoria) {
    $dataatual = date('Y-m-d H:i:s');
    $sql = "UPDATE tbl_produtos SET 
            nome_produtos = :nome,
            descricao_produtos = :descricao,
            preco_produtos = :preco,
            estoque_produtos = :estoque,
            imagem_produtos = :imagem,
            id_categoria = :id_categoria,
            atualizado_em = :atualizado_em
            WHERE id_produto = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':preco', $preco);
    $stmt->bindParam(':estoque', $estoque);
    $stmt->bindParam(':imagem', $imagem);
    $stmt->bindParam(':id_categoria', $id_categoria);
    $stmt->bindParam(':atualizado_em', $dataatual);
    $stmt->bindParam(':id', $id_produto);
    if($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // Excluir (soft delete) produto
  function excluirProduto($id_produto) {
    $dataatual = date('Y-m-d H:i:s');
    $sql = "UPDATE tbl_produtos SET excluido_em = :excluido_em 
            WHERE id_produto = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':excluido_em', $dataatual);
    $stmt->bindParam(':id', $id_produto);
    return $stmt->execute();
  }

    /**
     * Retorna a contagem de produtos por categoria.
     * Resultado: array de ['id_categoria' => int|null, 'nome_categoria' => string|null, 'total' => int]
     */
    public function contarProdutosPorCategoria() {
      $sql = "SELECT c.id_categorias AS id_categoria, c.nome_categorias AS nome_categoria, COUNT(p.id_produto) AS total
          FROM tbl_produtos p
          LEFT JOIN tbl_categorias c ON p.id_categoria = c.id_categorias
          WHERE p.excluido_em IS NULL
          GROUP BY c.id_categorias, c.nome_categorias
          ORDER BY total DESC";
      $stmt = $this->db->prepare($sql);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}