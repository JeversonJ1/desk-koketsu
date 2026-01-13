<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\EstoqueMovimentacao;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;

class EstoqueMovimentacaoController {
    public $estoqueMov;
    public $db;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->estoqueMov  = new EstoqueMovimentacao($this->db);
    }

    // endpoint que retorna array (uso interno)
    public function index() {
        return $this->estoqueMov->buscarMovimentacoes();
    }

    // Lista com view
    public function viewListarMovimentacoes($pagina = 1) {
        $dados = $this->estoqueMov->buscarMovimentacoes();
        View::render('estoque_movimentacao/index', ['movimentacoes' => $dados]);
    }

    public function viewCriarMovimentacao() {
        View::render('estoque_movimentacao/create');
    }

    public function salvarMovimentacao() {
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $tipo = trim($_POST['tipo_estoque_movimentacao'] ?? '');
        $quantidade = isset($_POST['quantidade_estoque_movimentacao']) ? (int)$_POST['quantidade_estoque_movimentacao'] : 0;
        $descricao = trim($_POST['descricao_estoque_movimentacao'] ?? '');

        if ($id_produto <= 0 || ($tipo !== 'entrada' && $tipo !== 'saida') || $quantidade <= 0) {
            Redirect::redirecionarComMensagem('/estoque_movimentacao/criar', 'error', 'Dados inválidos para movimentação.');
            return;
        }

        try {
            $id = $this->estoqueMov->inserirMovimentacao($id_produto, $tipo, $quantidade, $descricao);
            if ($id) {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'success', 'Movimentação registrada com sucesso.');
            } else {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/criar', 'error', 'Erro ao registrar movimentação.');
            }
        } catch (\Exception $e) {
            error_log('Erro ao salvar movimentação: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/estoque_movimentacao/criar', 'error', 'Erro ao registrar movimentação.');
        }
    }

    public function viewEditarMovimentacao(int $id) {
        $dados = $this->estoqueMov->buscarPorId($id);
        if (!$dados) {
            Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'error', 'Movimentação não encontrada.');
            return;
        }
        View::render('estoque_movimentacao/edit', ['movimentacao' => $dados]);
    }

    public function atualizarMovimentacao() {
        $id = isset($_POST['id_estoque_movimentacao']) ? (int)$_POST['id_estoque_movimentacao'] : 0;
        $quantidade = isset($_POST['quantidade_estoque_movimentacao']) ? (int)$_POST['quantidade_estoque_movimentacao'] : null;
        $descricao = trim($_POST['descricao_estoque_movimentacao'] ?? '');

        if ($id <= 0) {
            Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'error', 'ID inválido.');
            return;
        }

        try {
            $ok = $this->estoqueMov->atualizarMovimentacao($id, $quantidade, $descricao);
            if ($ok) {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'success', 'Movimentação atualizada com sucesso.');
            } else {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/editar/' . $id, 'error', 'Erro ao atualizar movimentação.');
            }
        } catch (\Exception $e) {
            error_log('Erro ao atualizar movimentação: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/estoque_movimentacao/editar/' . $id, 'error', 'Erro ao atualizar movimentação.');
        }
    }

    public function excluirMovimentacao(int $id) {
        if ($id <= 0) {
            Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'error', 'ID inválido.');
            return;
        }

        try {
            if ($this->estoqueMov->excluirMovimentacao($id)) {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'success', 'Movimentação excluída (soft delete).');
            } else {
                Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'error', 'Erro ao excluir movimentação.');
            }
        } catch (\Exception $e) {
            error_log('Erro ao excluir movimentação: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/estoque_movimentacao/listar', 'error', 'Erro ao excluir movimentação.');
        }
    }
}