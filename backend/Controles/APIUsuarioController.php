<?php
namespace App\Koketsu\Controles; 

use App\Koketsu\Database\Database;
use App\Koketsu\Models\Usuario;

class ApiUsuarioController {
    private $usuarioModel;
    private $chaveAPI = "9D67A537A9329E0F1E9D088A1C991F1CC728EA87D3D154B409ED3320EA940303";
    public function __construct() {
        $db = Database::getInstance();
        $this->usuarioModel = new Usuario($db);
    }

    private function buscaChaveAPI(){
        $headers = getallheaders();
        // tornar case-insensitive e robusto
        $auth = null;
        foreach ($headers as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $auth = $v;
                break;
            }
        }
        if (!$auth) return false;
        $parts = explode(' ', $auth);
        if (count($parts) < 2) return false;
        $token = $parts[1];
        return hash_equals($this->chaveAPI, $token);
    }
    public function getUsuarios($pagina=0) {
        if (!$this->buscaChaveAPI()){
            // 401 Unauthorized é mais adequado para chave inválida
            http_response_code(401);
            echo json_encode([
                'status' => 'error', 'message' => 'Chave de API inválida'
            ]);
            exit;
        }
        // condicao ternaria é igual if else
        $registros_por_pagina = $pagina===0 ? 200 : 5;
        $pagina = $pagina===0 ? 1 : (int)$pagina;
       $dados = $this->usuarioModel->paginacaoAPI($pagina,$registros_por_pagina);
       // remover campo de senha dos resultados — iterar por referência
       if (isset($dados['data']) && is_array($dados['data'])){
           foreach ($dados['data'] as &$usuario){
               if (isset($usuario['senha_usuarios'])) unset($usuario['senha_usuarios']);
           }
           unset($usuario);
       }
         header('Content-Type: application/json');
         http_response_code(200);
         echo json_encode([
            'status' => 'success',
            'data' => $dados

         ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
         exit;
    }
    
    
    public function salvarUsuario(){
        header('Content-Type: application/json');
        $usuario = json_decode(file_get_contents('php://input'), true);
        if(empty($usuario) || !is_array($usuario)) {
            echo json_encode(['status' => 'error', 'message' => 'Nenhum usuario salvo']);
        exit;
    }
    // validações mínimas
    if (empty($usuario['nome_usuarios']) || empty($usuario['email_usuarios']) || empty($usuario['senha_usuarios'])){
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Campos obrigatórios ausentes']);
        exit;
    }

    // hashear a senha antes de salvar
    $senhaHash = password_hash($usuario['senha_usuarios'], PASSWORD_DEFAULT);

    $novoUsuarioId = $this->usuarioModel->inserirUsuario(
        $usuario["nome_usuarios"],
         $usuario["email_usuarios"],
          $senhaHash,
          $usuario["nivel_acesso"] ?? 'user'
    );
    if ($novoUsuarioId){
        http_response_code(201);
        echo json_encode([
            'status' => 'success', 'message' => 'Pedido recebido com sucesso!', 'id_usuario' => $novoUsuarioId

        ]);
    }else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 'message' => 'Ocorreu um erro ao processar seu pedido. Tente novamente.'

        ]);
        }
        exit;
    }
    
    
  

}