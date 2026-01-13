<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Produtos;
use App\Koketsu\Database\Database;
use App\Koketsu\Models\Pedidos;

class PublicApiController {
    private $produtosModel;
    private $pedidosModel;
    public function __construct() {
        $db = Database::getInstance();
        $this->produtosModel = new Produtos($db);
        $this->pedidosModel = new Pedidos($db);
    }
    
  public function getProdutos() {
    
    $dados = $this->produtosModel->buscarProdutosAtivos();
    if (is_array($dados)) {
        foreach ($dados as &$produtos) {
            if (!empty($produtos['imagem_produtos'])) {
                $produtos['caminho_imagem'] = '/backend/upload/' . ltrim($produtos['imagem_produtos'], '/');
            } else {
                $produtos['caminho_imagem'] = null;
            }
            // Remove any sensitive fields just in case
            if (isset($produtos['senha_usuarios'])) {
                unset($produtos['senha_usuarios']);
            }
        }
        unset($produtos);
    }

    header('Content-Type: application/json; charset=utf-8');
    http_response_code(200);
    echo json_encode(['status' => 'success', 'data' => $dados], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
  }

  public function salvarPedido() {
    header('Content-Type: application/json; charset=utf-8');

    $raw = file_get_contents('php://input');
    $carrinho = json_decode($raw, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'JSON inválido no corpo da requisição.']);
        exit;
    }

    if (empty($carrinho) || !is_array($carrinho)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nenhum item recebido no carrinho.']);
        exit;
    }

    try {
        $novoPedidoId = $this->pedidosModel->criarPedido($carrinho);

        if ($novoPedidoId) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Pedido recebido com sucesso!', 'id_pedido' => $novoPedidoId], JSON_UNESCAPED_SLASHES);
            exit;
        }

        throw new \Exception('Falha ao criar pedido.');

    } catch (\Exception $e) {
        error_log('PublicApiController::salvarPedido error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Ocorreu um erro ao processar seu pedido. Tente novamente.']);
        exit;
    }
}
}