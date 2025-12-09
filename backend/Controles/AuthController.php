<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Usuario;
use App\Koketsu\Core\Flash;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Validadores\UsuarioValidador;
use App\Koketsu\Core\FileManager;
use App\Koketsu\Core\Session;
use App\Koketsu\Core\NotificacaoEmail;

class AuthController{
    private Usuario $usuarioModel;
    private session $session;
      private $notificacaoEmail;
    public function __construct(){
        $db = database::getInstance();
        $this->usuarioModel = new Usuario($db);
        $this->session = new Session();
          $this->notificacaoEmail = new NotificacaoEmail;
    }
    public function login(): void{
     View::render('auth/login');
    }
    public function register(): void{
        View::render('auth/register');
    }
    public function logout(): void{
        $this->session->destroy();
        Redirect::redirecionarComMensagem('/login', 'success', "Você saiu com segurança");
    }
public function authenticar(): void
{
    // O POST está correto: 'email_usuario' e 'senha_usuario'
    $email = $_POST['email_usuario'] ?? ''; 
    $senha = $_POST['senha_usuario'] ?? ''; 

    if (empty($email) || empty($senha)) {
        Redirect::redirecionarComMensagem('/login', 'error', 'Por favor, preencha E-mail e Senha.');
        return;
    }

    $usuario = $this->usuarioModel->checarCredenciais($email, $senha);

    if ($usuario) {
        session_regenerate_id(true);
        $this->session->set('usuario_id', $usuario['id_usuarios']);
        $this->session->set('usuario_nome', $usuario['nome_usuarios']);
        $this->session->set('usuario_tipo', $usuario['nivel_acesso']); // Se for 'nivel_acesso' como na linha 10 do seu Model

        Redirect::redirecionarPara('/admin/dashboard');

    } else {
        Redirect::redirecionarComMensagem('/login', 'error', 'E-mail ou senha incorretos.');
    }
}



public function cadastrarUsuario(): void {
    
    $erros = UsuarioValidador::validarEntradas($_POST);
    
    if (!empty($erros)){
        Redirect::redirecionarComMensagem('/register', 'erros', implode("<br>", $erros));
        return;
    }
        
    $nome = $_POST['nome_usuarios'] ?? '';
    $email = $_POST['email_usuarios'] ?? '';
    $senha = $_POST['senha_usuarios'] ?? '';
    $senha_confirm = $_POST['senha_confirm'] ?? '';
        
    if ($senha != $senha_confirm){
        Redirect::redirecionarComMensagem('/register', 'erros', 'As senhas não conferem');
        return;
    }
    
    if ($this->usuarioModel->buscarUsuariosPorEmail($email)){
        Redirect::redirecionarComMensagem('/register', 'erros', 'Erro ao cadastrar, este e-mail já está em uso.');
        return;
    }
    
    $novoUsuarioId = $this->usuarioModel->inserirUsuario($nome, $email, $senha, 'cliente', null);
      
    if ($novoUsuarioId){
        $this->notificacaoEmail->boasVindas($email, $nome);
        Redirect::redirecionarComMensagem('/login', 'success', 'Cadastro realizado! Por favor, faça o login');
    }else {
        Redirect::redirecionarComMensagem('/register', 'error', 'Erro no servidor. Tente novamente');
    }
}

        }
 
    