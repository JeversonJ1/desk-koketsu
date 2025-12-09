<?php
namespace App\Koketsu\Models;
use PDO;
use PDOException;

class ItensPedidos {
    private $id_itens_pedidos;
    private $id_pedido;
    private $id_produto;
    private $quantidade;
    private $preco_unitario;
    private $criado_em;
    private $atualizado_em;
    private $excluido_em;
    private $db;

    // Constante para mapear o nome da coluna do banco para o nome da variável na View
    const NOME_PRODUTO_COL = 'nome_produtos'; 

    public function __construct($db) {
        $this->db = $db;
    }
    
    // SQL base com JOIN para reutilização (puxa o nome do produto)
    private function getBaseSql() {
        return "SELECT 
                    i.*, 
                    p." . self::NOME_PRODUTO_COL . " AS nome_produto 
                FROM tbl_itens_pedidos i
                LEFT JOIN tbl_produtos p ON i.id_produto = p.id_produto";
    }

    /**
     * Busca um item de pedido por ID com o nome do produto.
     */
    function buscarItemPedidoPorId($id) {
        $sql = $this->getBaseSql() . " WHERE i.id_itens_pedidos = :id_itens_pedidos AND i.excluido_em IS NULL"; 
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id_itens_pedidos', $id); 
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Busca todos os itens de pedidos (com JOIN para listagem).
     */
    function buscarItensPedidos() {
        $sql = $this->getBaseSql() . " WHERE i.excluido_em IS NULL ORDER BY i.id_itens_pedidos DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
   public function buscarItensPedidosAtivos() {
    $sql = "SELECT * FROM tbl_itens_pedidos WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function buscarItensPorPedido($id_pedido)
{
    
    $sql = "SELECT
        tbl_itens_pedidos.*,
        tbl_produtos.nome_produtos                
    FROM tbl_itens_pedidos
    JOIN tbl_produtos ON tbl_itens_pedidos.id_produto = tbl_produtos.id_produto
    WHERE tbl_itens_pedidos.id_pedido = :id_pedido";
    
    // O restante do código de execução (PDO)
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':id_pedido', $id_pedido, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC); 
}
    public function buscarTop5ProdutosVendidos()
    {
        $sql = "
            SELECT
                p.nome_produtos AS nome_produto, 
                SUM(ip.quantidade) AS total_vendido
            FROM tbl_itens_pedidos ip
            JOIN tbl_produtos p ON ip.id_produto = p.id_produto
            GROUP BY p.nome_produtos
            ORDER BY total_vendido DESC
            LIMIT 5
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
   
function inserirItemPedido($id_pedido, $id_produto, $quantidade, $preco_unitario) {
        $sql = "INSERT INTO tbl_itens_pedidos 
                (id_pedido, id_produto, quantidade, preco_unitario, criado_em)
                VALUES (:id_pedido, :id_produto, :quantidade, :preco_unitario, NOW())";
                
        try {
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(':id_pedido', $id_pedido);
            $stmt->bindParam(':id_produto', $id_produto);
            $stmt->bindParam(':quantidade', $quantidade);
            $stmt->bindParam(':preco_unitario', $preco_unitario);

            if($stmt->execute()) {
                return $this->db->lastInsertId();
            } else {
                return false;
            }
        } catch (\PDOException $e) { 
            return false;
        }
    }

    
    function atualizarItemPedido($id_itens_pedidos, $quantidade, $preco_unitario) {
        $dataatual = date('Y-m-d H:i:s');
        $sql = "UPDATE tbl_itens_pedidos SET 
        quantidade = :quantidade,
        preco_unitario = :preco_unitario,
        atualizado_em = :atualizado_em
        WHERE id_itens_pedidos = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':quantidade', $quantidade);
        $stmt->bindParam(':preco_unitario', $preco_unitario);
        $stmt->bindParam(':atualizado_em', $dataatual);
        $stmt->bindParam(':id', $id_itens_pedidos);
        return $stmt->execute();
    }
    
    /**
     * Paginação
     */
    public function paginacao(int $pagina = 1, int $por_pagina = 30): array{
        $totalQuery = "SELECT COUNT(*) FROM `tbl_itens_pedidos` WHERE excluido_em IS NULL";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        
        // Paginacao com o JOIN
        $dataQuery = $this->getBaseSql() . " WHERE i.excluido_em IS NULL 
                      ORDER BY i.id_itens_pedidos DESC LIMIT :limit OFFSET :offset";
        
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
        $totalQuery = "SELECT COUNT(*) FROM `tbl_itens_pedidos`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_itens_pedidos` LIMIT :limit OFFSET :offset";
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

   
    /**
     * Contar total de itens de pedidos
     */
    function totalDeItensPedidos() {
        $sql = "SELECT COUNT(*) AS total FROM tbl_itens_pedidos WHERE excluido_em IS NULL";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_COLUMN);
    }

    /**
     * Excluir (soft delete) item de pedido
     */
    function excluirItemPedido($id_itens_pedidos) {
        $dataatual = date('Y-m-d H:i:s');
        $sql = "UPDATE tbl_itens_pedidos SET excluido_em = :excluido_em 
        WHERE id_itens_pedidos = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':excluido_em', $dataatual);
        $stmt->bindParam(':id', $id_itens_pedidos);
        return $stmt->execute();
    }
}