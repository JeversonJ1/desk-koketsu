<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\ItensPedidos;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Controles\Admin\AdminController;

// Assumindo que você usa um AdminController base
class ItensPedidosController extends AdminController { 
    public $itenspedidos;
    public $db;

    public function __construct() {
        parent::__construct();
        $this->db = Database::getInstance();
        $this->itenspedidos = new ItensPedidos($this->db);
    }
    
    // Retorna todos os itens (método de API/uso interno, não renderiza view)
    public function index() {
        return $this->itenspedidos->buscarItensPedidos();
    } 

    /**
     * Exibe detalhes de um único item de pedido.
     */
    public function viewItemPedidoUnico($id) {
        $dados = $this->itenspedidos->buscarItemPedidoPorId($id);
        if ($dados) {
            View::render('itenspedidos/detalhes', ['itempedido' => $dados]); 
        } else {
            Redirect::redirecionarComMensagem("/itenspedidos/listar", "error", "Item de Pedido não encontrado.");
        }
    }

    /**
     * Exibe a lista paginada de itens de pedidos.
     */
    public function viewListarItemPedido($pagina = 1){ 
        $dados = $this->itenspedidos->paginacao($pagina);
        View::render("itenspedidos/index",
            [
                "itenspedidos" => $dados['data'],
                "total_itenspedidos" => $dados['total'], 
                "total_inativos" => 0, // Placeholder
                "Total_ativos" => $dados['total'], // Placeholder
                'paginacao' => $dados
            ]
        );
    }

    /**
     * Exibe o formulário para criar um novo item de pedido.
     */
    public function viewCriarItemPedido() {
        View::render("itenspedidos/create");
    }
    
    /**
     * Salva novo item de pedido.
     */
    public function salvarItemPedido() {
        $id_pedido = $_POST['id_pedido'] ?? null;
        $id_produto = $_POST['id_produto'] ?? null;
        $quantidade = $_POST['quantidade'] ?? null;
        $preco_unitario = $_POST['preco_unitario'] ?? null;
        if (empty($id_pedido) || empty($id_produto) || $quantidade === null || $preco_unitario === null) {
             Redirect::redirecionarComMensagem("/itenspedidos/criar", "error", "Preencha todos os campos obrigatórios.");
             return;
        }

        try {
            $id_pedido = (int)$id_pedido;
            $id_produto = (int)$id_produto;
            $quantidade = (int)str_replace(',', '.', $quantidade);
            $preco_unitario = (float)str_replace(',', '.', $preco_unitario);

            if ($id_pedido <= 0 || $id_produto <= 0 || $quantidade <= 0 || $preco_unitario <= 0) {
                throw new \Exception('Dados inválidos fornecidos para o item.');
            }

            $inserido = $this->itenspedidos->inserirItemPedido($id_pedido, $id_produto, $quantidade, $preco_unitario);

            if ($inserido) {
                Redirect::redirecionarComMensagem("/itenspedidos/listar", "success", "Item de Pedido cadastrado com sucesso!");
                return;
            }

            throw new \Exception('Falha ao inserir item no banco.');

        } catch (\Exception $e) {
            // Se estivermos dentro de uma transação, propaga para que o chamador gerencie o rollback
            try {
                if ($this->db && $this->db->inTransaction()) {
                    throw $e;
                }
            } catch (\Exception $prop) {
                throw $prop;
            }

            // Caso contrário, comunica ao usuário
            Redirect::redirecionarComMensagem("/itenspedidos/criar", "error", "Erro ao cadastrar Item de Pedido: " . $e->getMessage());
        }
    }

    /**
     * Exibe o formulário para editar um item de pedido.
     */
    public function viewEditarItemPedido($id) {
        $item = $this->itenspedidos->buscarItemPedidoPorId($id);
        if ($item) {
            View::render("itenspedidos/edit", ["itempedido" => $item]); 
        } else {
            Redirect::redirecionarComMensagem("/itenspedidos/listar", "error", "Item de Pedido não encontrado.");
        }
    }

    /**
     * Processa a atualização de um item de pedido.
     */
    public function atualizarItensPedidos(int $id) {
        $quantidade = $_POST['quantidade'] ?? null;
        $preco_unitario = $_POST['preco_unitario'] ?? null;
        
        if (empty($quantidade) || empty($preco_unitario)) {
            Redirect::redirecionarComMensagem("/itenspedidos/editar/$id", "error", "Preencha a quantidade e o preço unitário.");
            return;
        }
        try {
            $quantidade = (int)str_replace(',', '.', $quantidade);
            $preco_unitario = (float)str_replace(',', '.', $preco_unitario);

            if ($quantidade <= 0 || $preco_unitario <= 0) {
                Redirect::redirecionarComMensagem("/itenspedidos/editar/$id", "error", "Quantidade e preço devem ser maiores que zero.");
                return;
            }

            $ok = $this->itenspedidos->atualizarItemPedido($id, $quantidade, $preco_unitario);
            if ($ok) {
                Redirect::redirecionarComMensagem("/itenspedidos/listar", "success", "Item de Pedido atualizado com sucesso!");
            } else {
                Redirect::redirecionarComMensagem("/itenspedidos/editar/$id", "error", "Erro ao atualizar Item de Pedido.");
            }

        } catch (\Exception $e) {
            // Se dentro de transação, propaga
            try {
                if ($this->db && $this->db->inTransaction()) {
                    throw $e;
                }
            } catch (\Exception $prop) {
                throw $prop;
            }

            Redirect::redirecionarComMensagem("/itenspedidos/editar/$id", "error", "Erro ao atualizar Item de Pedido: " . $e->getMessage());
        }
    }
    
    // public function excluirItemPedido(int $id) { ... }
}