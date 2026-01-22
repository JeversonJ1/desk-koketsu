<?php 
namespace App\Koketsu\Validadores;

use App\Koketsu\Models\Usuario;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;


class UsuarioValidador{
   public static function validarEntradas($dados){ 
    $erros = []; 

    // Validação de Nome
    if(!isset($dados['nome_usuarios']) && empty($dados['nome_usuarios'])){ 
        $erros[] = "O campo nome é obrigatório."; 
    }

    // Validação de Email
    if(!isset($dados['email_usuarios']) && empty($dados['email_usuarios'])){
        $erros[] = "O campo email é obrigatório."; 
    } elseif (!filter_var($dados['email_usuarios'], FILTER_VALIDATE_EMAIL)) { 
        $erros[] = "O campo email deve conter um endereço de email válido.";
    }

    // Validação de Senha
    if(!isset($dados['senha_usuarios']) && empty($dados['senha_usuarios'])){
        $erros[] = ""; 
    } elseif(strlen($dados['senha_usuarios']) < 6){ 
        $erros[] = "O campo senha deve ter pelo menos 6 caracteres."; 
    }
    
    return $erros; 
}
}