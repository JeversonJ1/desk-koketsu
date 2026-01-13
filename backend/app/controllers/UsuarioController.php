<?php
namespace App\Koketsu\Controles;


use App\Koketsu\Controles\Admin\AdminController;
use App\Koketsu\Models\Usuario;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\FileManager;
use App\Koketsu\Validadores\UsuarioValidador;
use App\Koketsu\Controles\Admin\AuthenticatedController;

class UsuarioController extends AdminController{
    public $usuario;
    public $db;
    public $gerenciarImagem;
    public function __construct() {
        parent::__construct();
        $this->db = Database::getInstance();
        $this->usuario = new Usuario($this->db);
        $this->gerenciarImagem = new FileManager('upload');
    }
    // index

    public function viewListarUsuarios($pagina = 1){
        $dados = $this->usuario->paginacao($pagina);
        $total_admin = $this->usuario->buscarUsuariosAdmin();
        $total = $this->usuario->totalDeUsuarios();
        $total_inativos = $this->usuario->buscarUsuariosInativos();
        $total_ativos = $this->usuario->buscarUsuariosAtivos();
        View::render('usuario/index', 
            [
                "usuarios" => $dados['data'],
                "total_admin" => $total_admin,
                "total_usuarios" => $total,
                "total_inativos" => $total_inativos,
                "total_ativos" => $total_ativos,
                'paginacao' => $dados
            ] 
        );
    }

    public function viewCriarUsuarios(){
        View::render("usuario/create");
    }

    public function viewEditarUsuarios(int $id){
        $dados = $this->usuario->buscarPorID($id);
       View::render("usuario/edit", ["usuario" => $dados]);
    }

    public function viewExcluirUsuarios($id){
         $dados = $this->usuario->buscarPorID($id);
         View::render("usuario/delete",["usuario" => $dados]);
    }

    public function viewAtivarUsuarios($id){
         $dados = $this->usuario->buscarPorID($id);
         View::render("usuario/ativar",["usuario" => $dados]);
    }

    public function relatorioUsuario($id, $data1, $data2){
    View::render("usuario/relatorios",
         ["id" => $id, "data1" => $data1, "data2" => $data2]
     );
    }
    public function salvarUsuario(){
        $erros = UsuarioValidador::ValidarEntradas($_POST);
        if(!empty($erros)){
            Redirect::redirecionarComMensagem("/usuario/criar", "error", implode("<br>", $erros));
            return;
        }

        $nome = trim($_POST['nome_usuarios'] ?? '');
        $email = trim($_POST['email_usuarios'] ?? '');
        $senha = $_POST['senha_usuarios'] ?? '';
        $senha_confirm = $_POST['senha_confirm'] ?? null;
        $nivel = $_POST['nivel_acesso'] ?? 'usuario';

        if ($senha !== $senha_confirm) {
            Redirect::redirecionarComMensagem('/usuario/criar', 'error', 'As senhas não conferem.');
            return;
        }

        // Verifica se e-mail já está em uso
        $existentes = $this->usuario->buscarUsuariosPorEmail($email);
        if (is_array($existentes) && count($existentes) > 0) {
            Redirect::redirecionarComMensagem('/usuario/criar', 'error', 'Este e-mail já está cadastrado.');
            return;
        }

        if($this->usuario->inserirUsuario($nome, $email, $senha, $nivel)){
            Redirect::redirecionarComMensagem("/usuario/listar", "success", "Usuário criado com sucesso!");
        }else{
            Redirect::redirecionarComMensagem("/usuario/criar", "error", "Erro ao criar usuário. Tente novamente.");
        }
    }
    public function viewEditarUsuario(int $id) {
        $usuario = $this->usuario->buscarPorID($id);
        if (!$usuario) {
            Redirect::redirecionarComMensagem("/usuario/listar", "error", "Usuario não encontrado.");
        }
        
        View::render("usuario/edit", ["usuario" => $usuario]);
    }

       public function atualizarUsuario(){
            $id = (int)($_POST['id_usuarios'] ?? 0);
            $nome = trim($_POST['nome_usuarios'] ?? '');
            $email = trim($_POST['email_usuarios'] ?? '');
            $senha = $_POST['senha_usuarios'] ?? null;
            $tipo = $_POST['nivel_acesso'] ?? 'usuario';

            if ($nome === '' || $email === '') {
                Redirect::redirecionarComMensagem("/usuario/editar/" . $id, "error", "Nome e e-mail são obrigatórios.");
                return;
            }

            // Verifica se o e-mail pertence a outro usuário
            $existentes = $this->usuario->buscarUsuariosPorEmail($email);
            if (is_array($existentes) && count($existentes) > 0) {
                $primeiro = $existentes[0];
                if ((int)$primeiro['id_usuarios'] !== $id) {
                    Redirect::redirecionarComMensagem("/usuario/editar/" . $id, "error", "Este e-mail já pertence a outro usuário.");
                    return;
                }
            }

            if (empty($senha)) {
                // Atualiza sem alterar a senha
                $ok = $this->usuario->atualizarUsuarioSemSenha($id, $nome, $email, $tipo);
            } else {
                $ok = $this->usuario->atualizarUsuario($id, $nome, $email, $senha, $tipo);
            }

            if ($ok) {
                Redirect::redirecionarComMensagem("/usuario/listar", "success", "Usuário atualizado com sucesso!");
            } else {
                Redirect::redirecionarComMensagem("/usuario/editar/" . $id, "error", "Erro ao atualizar usuário.");
            }
    }
    public function ativarUsuario(){
        $id = (int)$_POST['id_usuarios'];
        if ($this->usuario->ativarUsuario($id)) {
            Redirect::redirecionarComMensagem("/usuario/listar", "success", "Usuario ativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/usuario/listar", "error", "Erro ao ativar usuario.");
        }
    }
    
    public function deletarUsuario(){
        $id = (int)$_POST['id_usuarios'];
        if ($this->usuario->deletarUsuario($id)) {
            Redirect::redirecionarComMensagem("/usuario/listar", "success", "Usuario inativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/usuario/listar", "error", "Erro ao inativar usuario.");
        }
    }
    
}
