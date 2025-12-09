<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Produtos;
use App\Koketsu\Database\Database;
use App\Koketsu\Models\Pedidos;
use App\Koketsu\Models\ItensPedidos;

class PublicApiController {
    private $produtosModel;
    private $pedidosModel;
    private $itenspedidosModel;
     private $chaveAPI = "9D67A537A9329E0F1E9D088A1C991F1CC728EA87D3D154B409ED3320EA940303";
    public function __construct() {
        $db = Database::getInstance();
        $this->produtosModel = new Produtos($db);
        $this->pedidosModel = new Pedidos($db);
        $this->itenspedidosModel = new ItensPedidos($db);
    }
      private function buscaChaveAPI(){
        $headers = getallheaders(); 
        if (!isset($headers["Authorization"])){
            return false;
        }
        $token = explode(" ",$headers["Authorization"])[1];
        return $token === $this->chaveAPI;
    }
  public function getProdutos($pagina=0) {
       if (!$this->buscaChaveAPI()){
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 'message' => 'Chave de API invalida'
        ]);
        exit;
        }
      $registros_por_pagina = $pagina===0 ? 200 : 5;
        $pagina = $pagina===0 ? 1 : (int)$pagina;
       $dados = $this->produtosModel->paginacaoAPI($pagina,$registros_por_pagina);
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $dados
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
    }
  
    public function getPedidos($pagina=0) {
    if (!$this->buscaChaveAPI()){
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 'message' => 'Chave de API invalida'
        ]);
        exit;
        }
    
     $registros_por_pagina = $pagina===0 ? 200 : 5;
        $pagina = $pagina===0 ? 1 : (int)$pagina;
       $dados = $this->pedidosModel->paginacaoAPI($pagina,$registros_por_pagina);
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $dados
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
    }

      public function getItenspedidos($pagina=0) {
       if (!$this->buscaChaveAPI()){
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 'message' => 'Chave de API invalida'
        ]);
        exit;
        }
      $registros_por_pagina = $pagina===0 ? 200 : 5;
        $pagina = $pagina===0 ? 1 : (int)$pagina;
       $dados = $this->itenspedidosModel->paginacaoAPI($pagina,$registros_por_pagina);
       // & NO FOREAch anexa a mudança nos dados reais do array
         unset($itenspedidos);
         header('Content-Type: application/json');
         http_response_code(200);
         echo json_encode([
            'status' => 'success',
            'data' => $dados

         ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
         exit;
    }

  public function salvarPedido() {
    header('Content-Type: application/json');
    $carrinho = json_decode(file_get_contents('php://input'), true);
    if (empty($carrinho) || !is_array($carrinho)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Nenhum item recebido no carrinho.'
        ]);
        exit;
    }

    $nome = isset($carrinho['nome']) ? $carrinho['nome'] : null;
    $email = isset($carrinho['email']) ? $carrinho['email'] : null;
    $telefone = isset($carrinho['telefone']) ? $carrinho['telefone'] : null;
    $itens = isset($carrinho['itens']) ? $carrinho['itens'] : (isset($carrinho['items']) ? $carrinho['items'] : null);

 
    if (!$nome || !$email || !$telefone || empty($itens) || !is_array($itens)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Dados do pedido incompletos. É necessário nome, email, telefone e itens.'
        ]);
        exit;
    }

    $novoPedidoId = $this->pedidosModel->inserirPedido($nome, $email, $telefone, $itens);

    if ($novoPedidoId) {
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Pedido recebido com sucesso!',
            'id_pedido' => $novoPedidoId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Ocorreu um erro ao processar seu pedido. Tente novamente.'
        ]);
    }
    exit;
}
public function getProdutosParaVitrineFormatados() {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *'); 

    try {
        // CORREÇÃO DA CONEXÃO: Se o $this->db falhar, use o método estático para obter a conexão
        $db = $this->db ?? \App\Koketsu\Database\Database::getInstance();
        $produtosModel = new \App\Koketsu\Models\Produtos($db);
        
        $produtos_db = $produtosModel->buscarProdutosAtivosComCategoria();
        
        $categorias_organizadas = $this->formatarProdutosParaCarrossel($produtos_db);

        echo json_encode(array_values($categorias_organizadas), JSON_UNESCAPED_UNICODE);

    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Erro de Banco de Dados: " . $e->getMessage()]);
    }
}


private function formatarProdutosParaCarrossel(array $produtos_db): array {
    $categorias_organizadas = [];
    $imagem_padrao = "img/default.png"; 

    foreach ($produtos_db as $produto) {
        $nome_categoria = $produto['nome_categoria'] ?? 'OUTROS';
        $tag_categoria = ''; // Vazio ou defina aqui se precisar de tags específicas

        if (!isset($categorias_organizadas[$nome_categoria])) {
            $categorias_organizadas[$nome_categoria] = [
                'categoria' => $nome_categoria,
                'tag' => $tag_categoria, 
                'itens' => []
            ];
        }

       
        $nome_imagem_bd = trim($produto['imagem_produtos'] ?? '');
        $caminho_imagem = $imagem_padrao; 
        
        if (!empty($nome_imagem_bd) && $nome_imagem_bd !== 'NULL') {
            
            $caminho_limpo = str_replace('\\', '/', $nome_imagem_bd);
            
         
            $caminho_limpo = preg_replace('/^(img\/|produtos\/)/i', '', $caminho_limpo);
            
          
            if (!empty($caminho_limpo)) {
                $caminho_imagem = "img/" . $caminho_limpo;
            }
        } 
      

        $preco = (float)str_replace(',', '.', $produto['preco_produtos']); 
        $parcelas = $preco / 6;

        $categorias_organizadas[$nome_categoria]['itens'][] = [
            'id' => $produto['id_produto'],
            'nome' => $produto['nome_produtos'], 
            'preco' => $preco,
            'img' => $caminho_imagem, 
            'alt' => $produto['descricao_produtos'],
            'parcelas' => $parcelas,
        
        ];
    }

    return $categorias_organizadas;
}
}