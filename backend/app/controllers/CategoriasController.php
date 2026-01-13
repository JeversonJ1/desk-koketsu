<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Categoria;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;

class CategoriasController {
    public $categoria;
    public $db;
    public function __construct() {
        $this->db = Database::getInstance();
        $this->categoria = new Categoria($this->db);
    }
    // index
    public function index(){
        $resultado = $this->categoria->buscarCategorias();
        return $resultado;
    }
     public function viewListarCategoria($pagina = 1){
        $dados = $this->categoria->paginacao((int)$pagina);
        $categorias = $dados['data'] ?? [];
        $total = $dados['total'] ?? 0;
        $total_inativos = $this->categoria->buscarCategoriasInativos();
        $total_ativos = $this->categoria->buscarCategoriasAtivos();

        View::render('categoria/index', [
            "categorias" => $categorias,
            "total_categorias" => (int)$total,
            "total_inativos" => (int)$total_inativos,
            "total_ativos" => (int)$total_ativos,
            'paginacao' => $dados
        ]);
    }

    public function viewCriarCategoria(){
        View::render("categoria/create");
    }

    public function viewEditarCategoria(int $id){
         $dados = $this->categoria->buscarCategoriaPorId($id);
         View::render("categoria/edit", ["categoria" => $dados]);
    }


        public function viewExcluirCategoria(int $id){
            $dados = $this->categoria->buscarCategoriaPorId($id);
            View::render("categoria/delete", ["categoria" => $dados]);
        }

        public function relatorioCategoria($id, $data1, $data2){
         View::render("categoria/relatorio",
                     ["id" => $id, "data1" => $data1, "data2" => $data2]
            );
        }

    public function salvarCategoria(){
        $nome = trim($_POST['nome_categorias'] ?? '');
        $descricao = trim($_POST['descricao_categorias'] ?? '');

        if ($nome === '') {
            Redirect::redirecionarComMensagem('/categoria/criar', 'error', 'O nome da categoria é obrigatório.');
            return;
        }

        if ($this->categoria->inserirCategoria($nome, $descricao, 'Ativo')){
            Redirect::redirecionarComMensagem('/categoria/listar', 'success', 'Categoria criada com sucesso!');
        } else {
            Redirect::redirecionarComMensagem('/categoria/criar', 'error', 'Erro ao criar categoria. Tente novamente.');
        }
    }
    public function atualizarCategoria($id){
        $id = (int)$id;
        $nome = trim($_POST['nome_categorias'] ?? '');
        $descricao = trim($_POST['descricao_categorias'] ?? '');
        $status = $_POST['status_categorias'] ?? 'Ativo';

        if ($id <= 0 || $nome === '') {
            Redirect::redirecionarComMensagem('/categoria/editar/' . $id, 'error', 'Dados inválidos.');
            return;
        }

        if ($this->categoria->atualizarCategoria($id, $nome, $descricao, $status)) {
            Redirect::redirecionarComMensagem('/categoria/listar/1', 'success', 'Categoria atualizada com sucesso!');
        } else {
            Redirect::redirecionarComMensagem('/categoria/editar/' . $id, 'error', 'Erro ao atualizar categoria.');
        }
    }
    
    public function deletarCategoria($id){
        $id = (int)$id;
        if ($id <= 0) {
            Redirect::redirecionarComMensagem('/categoria/listar/1', 'error', 'ID inválido.');
            return;
        }

        if ($this->categoria->deletarCategoria($id)) {
            Redirect::redirecionarComMensagem('/categoria/listar/1', 'success', 'Categoria excluída com sucesso!');
        } else {
            Redirect::redirecionarComMensagem('/categoria/listar/1', 'error', 'Erro ao excluir categoria.');
        }
    }   

}