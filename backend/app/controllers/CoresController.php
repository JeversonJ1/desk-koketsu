<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Cor;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\FileManager;

class CoresController {
    public $cores;
    public $db;
    public $gerenciarImagem;
    public function __construct() {
        $this->db = Database::getInstance();
        $this->cores = new Cor($this->db);
        $this->gerenciarImagem = new FileManager('upload');
    }
    // index
    public function index(){
        $resultado = $this->cores->buscarCores();
        return $resultado;
    }
     public function viewListarCores($pagina = 1){
        $dados = $this->cores->paginacao((int)$pagina);
        $cores = $dados['data'] ?? [];
        $total = $dados['total'] ?? 0;
        $total_inativos = $this->cores->buscarCoresInativos();
        $total_ativos = $this->cores->buscarCoresAtivos();

        View::render('cores/index', [
            "cores" => $cores,
            "total_cores" => (int)$total,
            "total_inativos" => (int)$total_inativos,
            "total_ativos" => (int)$total_ativos,
            'paginacao' => $dados
        ]);
    }

    public function viewCriarCor(){
        View::render("cores/create");
    }

    public function viewEditarCor(int $id){
        $dados = $this->cores->buscarCoresPorIdProduto($id);
        $cor = [];
        if (is_array($dados) && count($dados) > 0) {
            $cor = $dados[0];
        }
        View::render("cores/edit", ["cor" => $cor]);
    }

        public function viewExcluirCor(int $id){
            View::render("cores/delete", ["id_cores" => $id]);
        }

        public function relatorioCores($id, $data1, $data2){
         View::render("cores/relatorio",
                     ["id" => $id, "data1" => $data1, "data2" => $data2]
            );
        }

    public function salvarCor(){
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $cor_nome = trim($_POST['cor_cores'] ?? '');
        $quantidade = isset($_POST['quantidade_cores']) ? (int)$_POST['quantidade_cores'] : 0;

        if ($id_produto <= 0 || $cor_nome === '' || $quantidade < 0) {
            Redirect::redirecionarComMensagem("/cor/criar", "error", "Preencha corretamente os campos obrigatórios.");
            return;
        }

        if ($this->cores->inserirCor($id_produto, $cor_nome, $quantidade, "Ativo")){
            Redirect::redirecionarComMensagem("/cor/listar", "success", "Cor criada com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/cor/criar", "error", "Erro ao criar cor. Tente novamente.");
        }
    }
    public function atualizarCor($id){
        $id = (int)$id;
        $id_produto = isset($_POST['id_produto']) ? (int)$_POST['id_produto'] : 0;
        $cor_nome = trim($_POST['cor_cores'] ?? '');
        $quantidade = isset($_POST['quantidade_cores']) ? (int)$_POST['quantidade_cores'] : 0;
        $status = $_POST['status_cores'] ?? "Ativo";

        if ($id <= 0 || $id_produto <= 0 || $cor_nome === '' || $quantidade < 0) {
            Redirect::redirecionarComMensagem("/cor/editar/" . $id, "error", "Dados inválidos.");
            return;
        }

        if($this->cores->atualizarCor($id, $id_produto, $cor_nome, $quantidade, $status)){
            Redirect::redirecionarComMensagem("/cor/listar/1", "success", "Cor atualizada com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/cor/editar/" . $id, "error", "Erro ao atualizar cor.");
        }
    }
    
    public function deletarCor($id){
        $id = (int)$id;
        if ($id <= 0) {
            Redirect::redirecionarComMensagem("/cor/listar/1", "error", "ID inválido.");
            return;
        }

        if($this->cores->deletarCor($id)){
            Redirect::redirecionarComMensagem("/cor/listar/1", "success", "Cor excluída com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/cor/listar/1", "error", "Erro ao excluir cor.");
        }
    }  
}