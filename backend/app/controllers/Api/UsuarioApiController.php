<?php
namespace App\Koketsu\Controles\Api; 

use App\Koketsu\Database\Database;
use App\Koketsu\Models\Usuario;

class UsuarioApiController{
    private $usuarioModel;
    private $chaveAPI = "9D67A537A9329E0F1E9D088A1C991F1CC728EA87D3D154B409ED3320EA940303";
    public function __construct() {
        $db = Database::getInstance();
        $this->usuarioModel = new Usuario($db);
    }

    private function buscaChaveAPI(){
        $headers = getallheaders(); 
        if (!isset($headers["Authorization"])){
            return false;
        }
        $token = explode(" ",$headers["Authorization"])[1];
        return $token === $this->chaveAPI;
    }
    public function getUsuarios($pagina=0) {
            if (!$this->buscaChaveAPI()){
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 'message' => 'Chave de API inválida'
        ]);
        exit;
        }
        $registros_por_pagina = $pagina===0 ? 200 : 5;
        $pagina = $pagina===0 ? 1 : (int)$pagina;
       $dados = $this->usuarioModel->paginacaoAPI($pagina,$registros_por_pagina);
       if (isset($dados['data']) && is_array($dados['data'])) {
           foreach ($dados['data'] as &$usuario) {
               if (isset($usuario['senha_usuarios'])) {
                   unset($usuario['senha_usuarios']);
               }
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
    $novoUsuarioId = $this->usuarioModel->inserirUsuario(
        $usuario["nome_usuarios"],
         $usuario["email_usuarios"],
          $usuario["senha_usuarios"],
          $usuario["nivel_acesso"]
           
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
