<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Imagem;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\FileManager;

class ImagemController {
    public $imagem;
    public $db;
    public $fileManager;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->imagem  = new Imagem($this->db);
        $this->fileManager = new FileManager('upload');
    }

    // Retorna array de imagens (uso interno/API)
    public function index() {
        return $this->imagem->buscarImagens();
    }

    // Lista com view
    public function viewListarImagens($pagina = 1) {
        $dados = $this->imagem->buscarImagens();
        View::render('imagem/index', ['imagens' => $dados]);
    }

    public function viewCriarImagem() {
        View::render('imagem/create');
    }

    public function salvarImagem() {
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $id_cor = isset($_POST['id_cor']) ? (int)$_POST['id_cor'] : null;
        $id_tamanho = isset($_POST['id_tamanho']) ? (int)$_POST['id_tamanho'] : null;
        $descricao = trim($_POST['descricao_imagem'] ?? '');

        if ($id_produto <= 0) {
            Redirect::redirecionarComMensagem('/imagem/criar', 'error', 'Produto inválido.');
            return;
        }

        if (empty($_FILES['imagem_file']) || !is_array($_FILES['imagem_file'])) {
            Redirect::redirecionarComMensagem('/imagem/criar', 'error', 'Nenhuma imagem enviada.');
            return;
        }

        try {
            $caminhoRelativo = $this->fileManager->salvarArquivo($_FILES['imagem_file'], 'img/produtos', ['image/jpeg', 'image/png', 'image/webp'], 2 * 1024 * 1024);

            $insertId = $this->imagem->inserirImagem($id_produto, $id_cor, $id_tamanho, $caminhoRelativo, $descricao);

            if ($insertId) {
                Redirect::redirecionarComMensagem('/imagem/listar', 'success', 'Imagem cadastrada com sucesso.');
                return;
            }

            // se falhar ao inserir no banco, tenta remover arquivo
            $this->fileManager->delete($caminhoRelativo);
            Redirect::redirecionarComMensagem('/imagem/criar', 'error', 'Erro ao salvar imagem no banco.');

        } catch (\Exception $e) {
            error_log('Erro ao salvar imagem: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/imagem/criar', 'error', 'Erro ao salvar imagem: ' . $e->getMessage());
        }
    }

    public function viewEditarImagem(int $id) {
        $dados = $this->imagem->buscarPorId($id);
        if (!$dados) {
            Redirect::redirecionarComMensagem('/imagem/listar', 'error', 'Imagem não encontrada.');
            return;
        }
        View::render('imagem/edit', ['imagem' => $dados]);
    }

    public function atualizarImagem() {
        $id = isset($_POST['id_imagem']) ? (int)$_POST['id_imagem'] : 0;
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $id_cor = isset($_POST['id_cor']) ? (int)$_POST['id_cor'] : null;
        $id_tamanho = isset($_POST['id_tamanho']) ? (int)$_POST['id_tamanho'] : null;
        $descricao = trim($_POST['descricao_imagem'] ?? '');

        if ($id <= 0 || $id_produto <= 0) {
            Redirect::redirecionarComMensagem('/imagem/editar/' . $id, 'error', 'Dados inválidos.');
            return;
        }

        $dadosExistentes = $this->imagem->buscarPorId($id);
        $caminhoRelativo = $dadosExistentes['caminho_imagem'] ?? null;

        try {
            if (!empty($_FILES['imagem_file']) && is_array($_FILES['imagem_file']) && $_FILES['imagem_file']['error'] === UPLOAD_ERR_OK) {
                // salva novo arquivo e remove antigo
                $novoCaminho = $this->fileManager->salvarArquivo($_FILES['imagem_file'], 'img/produtos', ['image/jpeg', 'image/png', 'image/webp'], 2 * 1024 * 1024);
                // tenta deletar antigo
                $this->fileManager->delete($caminhoRelativo);
                $caminhoRelativo = $novoCaminho;
            }

            if ($this->imagem->atualizarImagem($id, $id_produto, $id_cor, $id_tamanho, $caminhoRelativo, $descricao)) {
                Redirect::redirecionarComMensagem('/imagem/listar', 'success', 'Imagem atualizada com sucesso.');
            } else {
                Redirect::redirecionarComMensagem('/imagem/editar/' . $id, 'error', 'Erro ao atualizar imagem.');
            }

        } catch (\Exception $e) {
            error_log('Erro ao atualizar imagem: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/imagem/editar/' . $id, 'error', 'Erro ao atualizar imagem: ' . $e->getMessage());
        }
    }

    public function excluirImagem(int $id) {
        $dados = $this->imagem->buscarPorId($id);
        if (!$dados) {
            Redirect::redirecionarComMensagem('/imagem/listar', 'error', 'Imagem não encontrada.');
            return;
        }

        try {
            if ($this->imagem->excluirImagem($id)) {
                // remove arquivo físico
                $this->fileManager->delete($dados['caminho_imagem'] ?? null);
                Redirect::redirecionarComMensagem('/imagem/listar', 'success', 'Imagem excluída com sucesso.');
            } else {
                Redirect::redirecionarComMensagem('/imagem/listar', 'error', 'Erro ao excluir imagem.');
            }
        } catch (\Exception $e) {
            error_log('Erro ao excluir imagem: ' . $e->getMessage());
            Redirect::redirecionarComMensagem('/imagem/listar', 'error', 'Erro ao excluir imagem: ' . $e->getMessage());
        }
    }
}