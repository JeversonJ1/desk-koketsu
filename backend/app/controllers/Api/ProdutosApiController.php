<?php
namespace App\Koketsu\Controles\Api;

use App\Koketsu\Database\Database;
use App\Koketsu\Models\Produtos;

class ProdutosApiController{
    private $produtos;

    public function __construct(){
        $db = Database::getInstance();
        $this->produtos = new Produtos($db);
    }

    public function listar($pagina = 1){
        header('Content-Type: application/json; charset=UTF-8');
        $pagina = (int)$pagina > 0 ? (int)$pagina : 1;
        $dados = [];
        if (method_exists($this->produtos, 'paginacao')) {
            $dados = $this->produtos->paginacao($pagina, 50);
        }
        echo json_encode([
            'status' => 'success',
            'data' => $dados
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
