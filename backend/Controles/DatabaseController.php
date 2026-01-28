<?php

namespace App\Koketsu\Controles;

use App\Koketsu\Classes\Database;

class DatabaseController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function testarConexao()
    {
        $resultado = $this->db->testar();
        header('Content-Type: application/json');
        echo json_encode($resultado);
    }

    public function getProdutos()
    {
        try {
            $sql = "SELECT * FROM tbl_produtos LIMIT 20";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $produtos = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'sucesso',
                'dados' => $produtos,
                'total' => count($produtos)
            ]);
        } catch (\Exception $e) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'erro',
                'mensagem' => $e->getMessage()
            ]);
        }
    }

    public function getClientes()
    {
        try {
            $sql = "SELECT * FROM tbl_clientes LIMIT 20";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $clientes = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'sucesso',
                'dados' => $clientes,
                'total' => count($clientes)
            ]);
        } catch (\Exception $e) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'erro',
                'mensagem' => $e->getMessage()
            ]);
        }
    }

    public function getPedidos()
    {
        try {
            $sql = "SELECT p.*, c.nome_clientes FROM tbl_pedidos p 
                    LEFT JOIN tbl_clientes c ON p.id_cliente = c.id_cliente 
                    LIMIT 20";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $pedidos = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'sucesso',
                'dados' => $pedidos,
                'total' => count($pedidos)
            ]);
        } catch (\Exception $e) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'erro',
                'mensagem' => $e->getMessage()
            ]);
        }
    }

    public function getCategorias()
    {
        try {
            $sql = "SELECT * FROM tbl_categorias";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $categorias = $stmt->fetchAll();

            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'sucesso',
                'dados' => $categorias,
                'total' => count($categorias)
            ]);
        } catch (\Exception $e) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'erro',
                'mensagem' => $e->getMessage()
            ]);
        }
    }
}
