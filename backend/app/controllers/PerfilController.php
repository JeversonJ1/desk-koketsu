<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Perfil;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;

class PerfilController {
    public $perfil;
    public $db;
    public function __construct() {
        $this->db = Database::getInstance();
        $this->perfil = new Perfil($this->db);
    }
    // index
    public function index(){
        return $this->perfil->buscarPerfis(null);
    }
    public function viewListarPerfis($pagina = 1){
        $dados = $this->perfil->paginacao((int)$pagina);
        $perfis = $dados['data'] ?? [];
        $total = $dados['total'] ?? 0;
        $total_inativos = $this->perfil->buscarPerfisInativos();
        $total_ativos = $this->perfil->buscarPerfisAtivos();

        View::render('perfil/index', [
            "perfis" => $perfis,
            "total_perfil" => (int)$total,
            "total_inativos" => (int)$total_inativos,
            "total_ativos" => (int)$total_ativos,
            'paginacao' => $dados
        ]);
    }

    public function viewCriarPerfil(){
        View::render("perfil/create");
    }

    public function viewEditarPerfil(int $id){
         $dados = $this->perfil->buscarPerfisPorId($id);
         View::render("perfil/edit", ["perfil" => $dados]);
    }

        public function viewExcluirPerfil(int $id){
                $dados = $this->perfil->buscarPerfisPorId($id);
                View::render("perfil/delete", ["perfil" => $dados]);
            }
    public function salvarPerfil(){
            $telefone = trim($_POST['telefone_perfil'] ?? '');
            $endereco = trim($_POST['endereco_perfil'] ?? '');
            $data_cadastro = trim($_POST['data_cadastro'] ?? date('Y-m-d'));
            $id_usuarios = isset($_POST['id_usuarios']) ? (int)$_POST['id_usuarios'] : 0;

            if ($telefone === '' || $endereco === '' || $id_usuarios <= 0) {
                Redirect::redirecionarComMensagem('/perfil/criar', 'error', 'Preencha todos os campos obrigatórios.');
                return;
            }

            if ($this->perfil->inserirPerfil($telefone, $endereco, $data_cadastro, $id_usuarios)) {
                Redirect::redirecionarComMensagem('/perfil/listar', 'success', 'Perfil criado com sucesso!');
            } else {
                Redirect::redirecionarComMensagem('/perfil/criar', 'error', 'Erro ao criar perfil. Tente novamente.');
            }
    }
    
        public function atualizarPerfil(){
            $id = isset($_POST['id_perfil']) ? (int)$_POST['id_perfil'] : 0;
            $telefone = trim($_POST['telefone_perfil'] ?? '');
            $endereco = trim($_POST['endereco_perfil'] ?? '');
            $data_cadastro = trim($_POST['data_cadastro'] ?? date('Y-m-d'));
            $id_usuarios = isset($_POST['id_usuarios']) ? (int)$_POST['id_usuarios'] : 0;

            if ($id <= 0 || $telefone === '' || $endereco === '' || $id_usuarios <= 0) {
                Redirect::redirecionarComMensagem('/perfil/editar/' . $id, 'error', 'Preencha todos os campos obrigatórios.');
                return;
            }

            if ($this->perfil->atualizarPerfil($id, $telefone, $endereco, $data_cadastro, $id_usuarios)) {
                Redirect::redirecionarComMensagem('/perfil/listar', 'success', 'Perfil atualizado com sucesso!');
            } else {
                Redirect::redirecionarComMensagem('/perfil/editar/' . $id, 'error', 'Erro ao atualizar perfil.');
            }
        }

        public function deletarPerfil(){
            $id = isset($_POST['id_perfil']) ? (int)$_POST['id_perfil'] : 0;
            if ($id <= 0) {
                Redirect::redirecionarComMensagem('/perfil/listar', 'error', 'ID inválido.');
                return;
            }

            if ($this->perfil->deletarPerfil($id)) {
                Redirect::redirecionarComMensagem('/perfil/listar', 'success', 'Perfil inativado com sucesso.');
            } else {
                Redirect::redirecionarComMensagem('/perfil/listar', 'error', 'Erro ao inativar perfil.');
            }
        }
}