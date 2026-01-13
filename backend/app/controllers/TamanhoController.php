<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Controles\Admin\AdminController;
use App\Koketsu\Models\Tamanho;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;


class TamanhoController extends AdminController {
    public $tamanho;
    public $db;
    public function __construct() {
        parent::__construct();
        $this->db = Database::getInstance();
        $this->tamanho = new Tamanho($this->db);
    }
    // index
     public function viewListarTamanhos($pagina = 1){
        $dados = $this->tamanho->paginacao((int)$pagina);
        $tamanhos = $dados['data'] ?? [];
        $total = $dados['total'] ?? 0;
        $total_inativos = $this->tamanho->buscarTamanhosInativos();
        $total_ativos = $this->tamanho->buscarTamanhosAtivos();

        View::render('tamanho/index', [
            "tamanhos" => $tamanhos,
            "total_tamanhos" => (int)$total,
            "total_inativos" => (int)$total_inativos,
            "total_ativos" => (int)$total_ativos,
            'paginacao' => $dados
        ]);
    }

    public function viewCriarTamanho(){
        View::render("tamanho/create");
    }

    public function viewEditarTamanho(int $id){
        $dados = $this->tamanho->buscarPorID($id);
       View::render("tamanho/edit", ["tamanho" => $dados]);
    }

    public function viewExcluirTamanho($id){
         $dados = $this->tamanho->buscarPorID($id);
         View::render("tamanho/delete",["tamanho" => $dados]);
    }
    public function salvarTamanho(){
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $tamanho = trim($_POST['tamanho_tamanhos'] ?? '');
        $quantidade = isset($_POST['quantidade_tamanhos']) ? (int)$_POST['quantidade_tamanhos'] : 0;

        if ($id_produto <= 0 || $tamanho === '' || $quantidade < 0) {
            Redirect::redirecionarComMensagem("/tamanho/criar", "error", "Preencha corretamente os campos obrigatórios.");
            return;
        }

        if ($this->tamanho->inserirTamanho($id_produto, $tamanho, $quantidade)) {
            Redirect::redirecionarComMensagem("/tamanho/listar", "success", "Tamanho criado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/tamanho/criar", "error", "Erro ao criar tamanho. Tente novamente.");
        }
    }
    public function atualizarTamanho(){
        $id = isset($_POST['id_tamanhos']) ? (int)$_POST['id_tamanhos'] : 0;
        $id_produtos = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $tamanho = trim($_POST['tamanho_tamanhos'] ?? '');
        $quantidade = isset($_POST['quantidade_tamanhos']) ? (int)$_POST['quantidade_tamanhos'] : 0;

        if ($id <= 0 || $id_produtos <= 0 || $tamanho === '' || $quantidade < 0) {
            Redirect::redirecionarComMensagem("/tamanho/editar/" . $id, "error", "Preencha corretamente os campos obrigatórios.");
            return;
        }

        if ($this->tamanho->atualizarTamanho($id, $id_produtos, $tamanho, $quantidade)) {
            Redirect::redirecionarComMensagem("/tamanho/listar", "success", "Tamanho atualizado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/tamanho/editar/" . $id, "error", "Erro ao atualizar tamanho.");
        }
    }
    public function deletarTamanho(){
        $id = isset($_POST['id_tamanhos']) ? (int)$_POST['id_tamanhos'] : 0;

        if ($id <= 0) {
            Redirect::redirecionarComMensagem("/tamanho/listar", "error", "ID inválido.");
            return;
        }

        if ($this->tamanho->deletarTamanho($id)) {
            Redirect::redirecionarComMensagem("/tamanho/listar", "success", "Tamanho inativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/tamanho/listar", "error", "Erro ao inativar tamanho.");
        }
    }
}