<?php
namespace App\Koketsu\Core;
use App\Koketsu\Core\EmailService;

class NotificacaoEmail{
    private EmailService $emailService;
    public function __construct(){
        $this->emailService =  new EmailService();
    }
 public function esqueciASenha(string $email, string $token): void {
    $assunto = "Redefinação de Senha";
    $mensagem = "Clique no link para redefinir sua senha: ";
    $mensagem .= "https://seusite.com/redefinir-senha?token=" . urlencode($token);
    $this->emailService->send($email, $assunto, $mensagem);
 }
 public function boasVindas(string $email, string $nome): void {
    $assunto = "Bem=vindo ao Koketsu!";
    $mensagem = "<b><h2>Olá " . htmlspecialchars($nome) . "</h2></b>,\n\n";
    $mensagem .= "<p>Obrigado por se registrar no Koketsu. !</p>\n\n";
    $mensagem .= "<p>Atenciosamente, \nEquipe Koketsu</p>";
    $this->emailService->send($email, $assunto, $mensagem);

}
public function notificarRecebimentoContato(string $email, string $nome = "Cliente"): void
{
    $assunto = "Obrigado por fazer parte das novidades da Koketsu!";

    $html = "
        <h2>Olá, {$nome}!</h2>
        <p>Recebemos sua mensagem de contato e gostaríamos de confirmar o recebimento.</p>
        <p>Agora você receberá informações de pré-vendas, novidades e promoções.</p>
        <p>Obrigado por entrar em contato!</p>
        <p>Atenciosamente,<br>A Equipe Koketsu</p>
    ";

    $this->emailService->send($email, $assunto, $html);
}
}