<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Avaliacao;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\Session;

class AvaliacaoController
{
    private $avaliacao;
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->avaliacao = new Avaliacao($this->db);
    }

    // retorna lista (usado por API ou por outros consumidores)
    public function index()
    {
        return $this->avaliacao->buscarAvaliacoes();
    }

    // view para listar avaliações no admin
    public function viewListarAvaliacoes($pagina = 1)
    {
        if (empty($pagina) || $pagina <= 0) {
            $pagina = 1;
        }
        $dados = $this->avaliacao->paginacao((int)$pagina);
        $avaliacoes = $dados['data'] ?? [];
        $total = $dados['total'] ?? 0;
        $total_inativos = $this->avaliacao->buscarAvaliacoesInativos();
        $total_ativos = $this->avaliacao->buscarAvaliacoesAtivos();

        View::render('avaliacao/index', [
            'avaliacoes' => $avaliacoes,
            'total_avaliacoes' => (int)$total,
            'total_inativos' => (int)$total_inativos,
            'total_ativos' => (int)$total_ativos,
            'paginacao' => $dados,
        ]);
    }

    // criar view
    public function viewCriarAvaliacoes()
    {
        View::render('avaliacao/create');
    }

    // salvar avaliação (POST)
    public function salvarAvaliacao()
    {
        $nota = isset($_POST['nota_avaliacoes']) ? (int) $_POST['nota_avaliacoes'] : null;
        $comentario = $_POST['comentario_avaliacoes'] ?? null;
        $id_produto = isset($_POST['id_produto']) ? (int) $_POST['id_produto'] : null;
        if (empty($id_produto) || $nota === null) {
            Redirect::redirecionarComMensagem('/avaliacao/criar', 'error', 'Produto e nota são obrigatórios.');
            return;
        }

        if ($nota < 1 || $nota > 5) {
            Redirect::redirecionarComMensagem('/avaliacao/criar', 'error', 'A nota deve ser entre 1 e 5.');
            return;
        }

        $session = new Session();
        $id_cliente = $session->get('usuario_id') ?? null;
        if (!$id_cliente) {
            Redirect::redirecionarComMensagem('/login', 'error', 'É necessário estar logado para avaliar.');
            return;
        }

        if ($this->avaliacao->inserirAvaliacao($id_produto, $id_cliente, $nota, $comentario)) {
            Redirect::redirecionarComMensagem('/avaliacao/listar', 'success', 'Avaliação salva com sucesso.');
            return;
        }

        Redirect::redirecionarComMensagem('/avaliacao/criar', 'error', 'Erro ao salvar avaliação.');
    }

    // atualizar (POST)
    public function atualizarAvaliacao($id)
    {
        $nota = isset($_POST['nota_avaliacoes']) ? (int) $_POST['nota_avaliacoes'] : null;
        $comentario = $_POST['comentario_avaliacoes'] ?? null;
        if ($nota !== null && ($nota < 1 || $nota > 5)) {
            Redirect::redirecionarComMensagem('/avaliacao/editar/' . $id, 'error', 'A nota deve ser entre 1 e 5.');
            return;
        }

        if ($this->avaliacao->atualizarAvaliacao((int) $id, $nota, $comentario)) {
            Redirect::redirecionarComMensagem('/avaliacao/listar', 'success', 'Avaliação atualizada.');
            return;
        }

        Redirect::redirecionarComMensagem('/avaliacao/editar/' . $id, 'error', 'Erro ao atualizar avaliação.');
    }

    // deletar (POST)
    public function deletarAvaliacao($id)
    {
        if ($this->avaliacao->excluirAvaliacao((int) $id)) {
            Redirect::redirecionarComMensagem('/avaliacao/listar', 'success', 'Avaliação excluída.');
        }
        Redirect::redirecionarComMensagem('/avaliacao/listar', 'error', 'Erro ao excluir avaliação.');
    }

    // view editar
    public function viewEditarAvaliacoes($id)
    {
        try {
            $stmt = $this->db->prepare('SELECT * FROM tbl_avaliacoes WHERE id_avaliacoes = :id AND excluido_em IS NULL');
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $dados = $stmt->fetch(\PDO::FETCH_ASSOC);
            if (!$dados) {
                Redirect::redirecionarComMensagem('/avaliacao/listar', 'error', 'Avaliação não encontrada.');
                return;
            }
            View::render('avaliacao/edit', ['avaliacoes' => $dados]);
        } catch (\Exception $e) {
            error_log('Erro ao buscar avaliação: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/avaliacao/listar', 'error', 'Erro ao buscar avaliação.');
            return;
        }
    }

    // view excluir (confirmação)
    public function viewExcluirAvaliacoes($id)
    {
        try {
            $stmt = $this->db->prepare('SELECT * FROM tbl_avaliacoes WHERE id_avaliacoes = :id AND excluido_em IS NULL');
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $dados = $stmt->fetch(\PDO::FETCH_ASSOC);
            if (!$dados) {
                Redirect::redirecionarComMensagem('/avaliacao/listar', 'error', 'Avaliação não encontrada.');
                return;
            }
            View::render('avaliacao/delete', ['avaliacoes' => $dados]);
        } catch (\Exception $e) {
            error_log('Erro ao buscar avaliação: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/avaliacao/listar', 'error', 'Erro ao buscar avaliação.');
            return;
        }
    }
}