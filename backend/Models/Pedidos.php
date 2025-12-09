<?php
namespace App\Koketsu\Models;
use PDO;
use PDOException;

class Pedidos {
      private $id_pedido;
      private $id_perfil;
      private $id_usuarios;
      private $data_pedido;
      private $total_pedido;
      private $status_pedido;
      private $criado_em;
      private $atualizado_em;
      private $excluido_em;
      private $db;

      public function __construct($db) {
           $this->db = $db;
      }

    // Buscar todos os pedidos ativos
    function buscarPedidos() {
        $sql = "SELECT * FROM tbl_pedidos WHERE excluido_em IS NULL"; // Corrigido SELECT * FROM tbl_pedidos
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function buscarPedidosAtivos() {
    $sql = "SELECT * FROM tbl_pedidos WHERE excluido_em IS NULL";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    // Buscar pedido por ID
    public function buscarPedidoPorId(int $id) {
    
        $sql = "SELECT tbl_pedidos.*, tbl_perfil.endereco_perfil, tbl_usuarios.nome_usuarios AS nome_cliente
                FROM tbl_pedidos
                LEFT JOIN tbl_perfil ON tbl_pedidos.id_perfil = tbl_perfil.id_perfil
                LEFT JOIN tbl_usuarios ON tbl_perfil.id_usuarios = tbl_usuarios.id_usuarios
                WHERE tbl_pedidos.id_pedido = :id_pedido AND tbl_pedidos.excluido_em IS NULL";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id_pedido', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC); 
    }
    
    // Contar todos os pedidos
    public function contarTodosPedidos()
    {
        $sql = "SELECT COUNT(id_pedido) FROM tbl_pedidos";
        $stmt = $this->db->query($sql);
        return $stmt->fetchColumn();
    }

    // Buscar pedidos de um perfil específico
    function buscarPedidosPorCliente($id_perfil) {
        $sql = "SELECT * FROM tbl_pedidos 
                WHERE id_perfil = :id_perfil AND excluido_em IS NULL";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id_perfil', $id_perfil);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Buscar vendas mensais
    public function buscarVendasMensais()
        {
            // Atenção: A coluna SUM(data_pedido) estava incorreta e foi alterada para SUM(total_pedido)
            $sql = "
                SELECT
                    DATE_FORMAT(data_pedido, '%Y-%m-01') AS mes,
                    SUM(total_pedido) AS total_vendas
                FROM tbl_pedidos
                WHERE data_pedido >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                AND status_pedido IN ('pago', 'enviado', 'concluido')
                GROUP BY mes
                ORDER BY mes ASC
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        /**
         * Busca a contagem de pedidos para cada status.
         * @return array
         */
        public function contarPedidosPorStatus()
        {
            $sql = "
                SELECT
                    status_pedido,
                    COUNT(id_pedido) AS contagem
                FROM tbl_pedidos
                WHERE excluido_em IS NULL
                GROUP BY status_pedido
                ORDER BY contagem DESC
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        /**
         * Busca o faturamento (receita) mensal por categoria.
         * @return array
         */
        public function buscarVendasMensaisPorCategoria()
        {
            $sql = "
                SELECT
                    DATE_FORMAT(p.data_pedido, '%Y-%m-01') AS mes,
                    c.nome_categorias AS categoria,
                    SUM(ip.quantidade * ip.preco_unitario) AS faturamento
                FROM tbl_pedidos p
                
                JOIN tbl_itens_pedidos ip ON p.id_pedido = ip.id_pedido
                JOIN tbl_produtos prod ON ip.id_produto = prod.id_produto
                JOIN tbl_categorias c ON prod.id_categoria = c.id_categorias
                
                WHERE p.data_pedido >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                AND p.status_pedido IN ('pago', 'enviado', 'concluido')
                GROUP BY mes, c.nome_categorias
                ORDER BY mes ASC, faturamento DESC
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        /**
         * Calcula o Ticket Médio (Total Vendido / Total de Pedidos) mensalmente.
         * Foi corrigido o uso de AVG(total_pedido) no lugar de AVG(data_pedido)
         * @return array
         */
        public function calcularTicketMedioMensal()
        {
            $sql = "
                SELECT
                    DATE_FORMAT(data_pedido, '%Y-%m-01') AS mes,
                    AVG(total_pedido) AS ticket_medio
                FROM tbl_pedidos
                WHERE data_pedido >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                AND status_pedido IN ('pago', 'enviado', 'concluido')
                GROUP BY mes
                ORDER BY mes ASC
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    
    // Função de paginação
    public function paginacao(int $pagina = 1, int $por_pagina = 100): array{

    $totalQuery = "SELECT COUNT(*) FROM `tbl_pedidos` WHERE excluido_em IS NULL";
    $totalStmt = $this->db->query($totalQuery);
    $total_de_registros = $totalStmt->fetchColumn();

    $offset = ($pagina - 1) * $por_pagina;
    $dataQuery = "SELECT 
        tbl_pedidos.*, 
        tbl_perfil.endereco_perfil, 
        tbl_usuarios.nome_usuarios AS nome_cliente 
    FROM tbl_pedidos 
    LEFT JOIN tbl_perfil ON tbl_pedidos.id_perfil = tbl_perfil.id_perfil
    LEFT JOIN tbl_usuarios ON tbl_perfil.id_usuarios = tbl_usuarios.id_usuarios
    WHERE tbl_pedidos.excluido_em IS NULL 
    LIMIT :limit OFFSET :offset";

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
        $totalQuery = "SELECT COUNT(*) FROM `tbl_pedidos`";
        $totalStmt = $this->db->query($totalQuery);
        $total_de_registros = $totalStmt->fetchColumn();
        $offset = ($pagina - 1) * $por_pagina;
        $dataQuery = "SELECT * FROM `tbl_pedidos` LIMIT :limit OFFSET :offset";
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
 
    
    // Inserir novo pedido
    function inserirPedido($id_perfil, $data_pedido, $total_pedido, $status_pedido) { 
        
        $sql = "INSERT INTO tbl_pedidos
        (id_perfil, data_pedido, total_pedido, status_pedido, criado_em) 
        VALUES (:id_perfil, :data_pedido, :total_pedido, :status_pedido, NOW())"; 

        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':id_perfil', $id_perfil, PDO::PARAM_INT);
        $stmt->bindParam(':data_pedido', $data_pedido);
        $stmt->bindParam(':total_pedido', $total_pedido);
        $stmt->bindParam(':status_pedido', $status_pedido);
        
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        } else {
            error_log("Erro ao inserir pedido: " . json_encode($stmt->errorInfo()));
            return false;
        }
    }

    // Contar total de pedidos ativos (usado para o cabeçalho/dashboard)
    function totalDePedidos() {
        $sql = "SELECT COUNT(*) FROM `tbl_pedidos` WHERE excluido_em IS NULL";
        
        $stmt = $this->db->query($sql);
        
        return $stmt->fetchColumn(); 
    }

    // Atualizar pedido
    public function atualizarPedido($id_pedido, $total_pedido, $data_pedido, $status_pedido, $imagem = null)
    {
        $dataatual = date('Y-m-d H:i:s');

        // SQL Base
        $sql = "UPDATE tbl_pedidos SET 
                    total_pedido = :total_pedido,
                    data_pedido = :data_pedido,
                    status_pedido = :status_pedido,
                    atualizado_em = :atualizado_em";

        // Se tiver imagem, adiciona ao SQL
        if (!empty($imagem)) {
            $sql .= ", imagem_pedidos = :imagem";
        }

        $sql .= " WHERE id_pedido = :id_pedido";

        $stmt = $this->db->prepare($sql);

        // Bind obrigatório
        $stmt->bindParam(':total_pedido', $total_pedido);
        $stmt->bindParam(':data_pedido', $data_pedido);
        $stmt->bindParam(':status_pedido', $status_pedido);
        $stmt->bindParam(':atualizado_em', $dataatual);
        $stmt->bindParam(':id_pedido', $id_pedido, PDO::PARAM_INT);

        // Bind opcional da imagem
        if (!empty($imagem)) {
            $stmt->bindParam(':imagem', $imagem);
        }

        // Execução
        if ($stmt->execute()) {
            return true;
        }

        // Log de erro para debug
        error_log("Erro ao atualizar pedido: " . json_encode($stmt->errorInfo()));
        return false;
    }

    // Excluir pedido (Soft Delete)
    public function excluirPedido(int $id_pedido) {
        try {
            $dataatual = date('Y-m-d H:i:s');
            $sql = "UPDATE tbl_pedidos SET excluido_em = :excluido_em 
                    WHERE id_pedido = :id_pedido"; 
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':excluido_em', $dataatual);
            $stmt->bindParam(':id_pedido', $id_pedido, PDO::PARAM_INT); 
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro no Soft Delete do Pedido #{$id_pedido}: " . $e->getMessage());
            return false;
        }
    }
    
}