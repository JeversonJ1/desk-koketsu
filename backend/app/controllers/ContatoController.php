<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Contato;
use App\Koketsu\Core\EmailService;
use App\Koketsu\Core\NotificacaoEmail; 
use App\Koketsu\Database\Database;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\View;

class ContatoController {
    private EmailService $emailService;
    public $contatoModel;
    private NotificacaoEmail $notificacaoEmail;

    public function __construct() {
        $db = Database::getInstance();
        $this->contatoModel = new Contato($db);
        $this->emailService = new EmailService();
        $this->notificacaoEmail = new NotificacaoEmail($this->emailService); 
    }

    public function salvarNovoContato() {
        if (!isset($_POST['email_contato']) || empty($_POST['email_contato'])) {
            Redirect::redirecionarComMensagem("/", "error", "O campo e-mail é obrigatório.");
            return;
        }

        $email = filter_var($_POST['email_contato'], FILTER_SANITIZE_EMAIL);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Redirect::redirecionarComMensagem("/", "error", "Por favor, insira um endereço de e-mail válido.");
            return;
        }

        if ($this->contatoModel->buscarContatoPorEmail($email)) {
            Redirect::redirecionarComMensagem("/", "warning", "Este e-mail já está cadastrado em nossa lista de novidades.");
            return;
        }

        $idNovoContato = $this->contatoModel->inserirNovoContato($email);

        if ($idNovoContato) {
            $this->notificacaoEmail->notificarRecebimento($email, "Obrigado por entrar em contato!");

            Redirect::redirecionarComMensagem("/", "success", "Sua inscrição foi confirmada com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/", "error", "Erro ao processar sua inscrição. Tente novamente mais tarde.");
        }
    }
}