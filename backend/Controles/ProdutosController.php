<?php
namespace App\Koketsu\Controles;

use App\Koketsu\Models\Produtos;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\FileManager;
use App\Koketsu\Controles\Admin\AdminController;

class ProdutosController extends AdminController {
    public $produtos;
    public $db;
    public $gerenciarImagem;

public function __construct() {
    parent::__construct();
    $this->db = Database::getInstance();
    $this->produtos = new Produtos($this->db);
    $this->gerenciarImagem = new FileManager('upload');
}

  // index
public function index(){
    $this->viewListarProduto();
}  

public function viewProdutoUnico(int $id_produto) {
        
        $produto = $this->produtos->buscarProdutoPorId($id_produto);
        
        if ($produto) {
           
            \App\Koketsu\Core\View::render('produtos/detalhes', [
                'produto' => $produto
            ]);
        } else {
          
            \App\Koketsu\Core\Redirect::redirecionarComMensagem("/produto/listar", "error", "Produto não encontrado.");
        }
    }
    public function viewlistarProduto() {
        $dados = $this->produtos->paginacao();
        $total = $this->produtos->totaldeProdutos();

        // Garante que $total seja número simples
        $total_produtos = is_array($total) ? reset($total) : $total;

        View::render("produtos/index", [
            "produtos" => $dados['data'] ?? [],
            "total_produtos" => $total_produtos ?? 0,
            "total_inativos" => 0,
            "Total_ativos" => 0,
            'paginacao' => $dados
        ]);
    }

    public function viewCriarProduto() {
        View::render("produtos/create");
    }

 public function viewEditarProdutos(int $id) {
        $produtos = $this->produtos->buscarProdutoPorId($id);
        if (!$produtos) {
            Redirect::redirecionarComMensagem("/produto/listar", "error", "Produto não encontrado.");
        }
        
        View::render("produtos/edit", ["produtos" => $produtos]);
    }


  public function atualizarProdutos() {
    $id_produto = (int)($_POST['id_produto'] ?? 0);
    $nome = $_POST['nome_produtos'] ?? '';
    $descricao = $_POST['descricao_produtos'] ?? '';
    $preco = (int)($_POST['preco_produtos'] ?? 0);
     $estoque = $_POST['estoque_produtos'] ?? '';
    $imagem = null;
    if (isset($_FILES['imagem_produtos']) && $_FILES['imagem_produtos']['error'] == 0) {
        $imagem = $this->gerenciarImagem->salvarArquivo($_FILES['imagem_produtos'], 'produtos');
    }

    $id_categoria = $_POST['id_categoria'] ?? null;

    if ($this->produtos->atualizarProduto($id_produto, $nome, $descricao, $preco, $estoque, $imagem, $id_categoria)) {
        Redirect::redirecionarComMensagem("/produto/listar", "success", "Produto atualizado com sucesso!");
    } else {
        Redirect::redirecionarComMensagem("produto/editar/" . $id_produto, "error", "Erro ao atualizar produto!");
    }
}


   public function viewExcluirProduto(int $id) {
     $id = (int)$_POST['id_produto'];
        if ($this->produtos->excluirProduto($id)) {
            Redirect::redirecionarComMensagem("/produto/listar", "success", "Produto inativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/produto/listar", "error", "Erro ao inativar produto.");
        }
    }
  

  public function salvarProduto() {
    $nome_produto = $_POST["nome_produtos"] ?? '';

    if (empty($nome_produto)) {
        Redirect::redirecionarComMensagem("/produto/criar", "error", "Nome do produto é obrigatório.");
        return; 
    }

    $imagem = NULL;
    $descricao = $_POST["descricao_produtos"] ?? '';
    
    $preco_str = $_POST['preco_produtos'] ?? '0';
    $preco = (float)str_replace(',', '.', $preco_str);
    
    $estoque = isset($_POST['estoque_produtos']) ? (int)$_POST['estoque_produtos'] : 0;
    
    $id_categoria = NULL; 

    if ($this->produtos->inserirProduto(
        $nome_produto,
        $descricao,
        $preco,
        $estoque,
        $imagem,
        $id_categoria
    )) {
        Redirect::redirecionarComMensagem("/produto/listar", "success", "Produto cadastrado com sucesso!");
    } else {
        Redirect::redirecionarComMensagem("/produto/criar", "error", "Erro ao cadastrar produto.");
    }
}

    public function relatorioProduto($id, $data1, $data2){
 View::render("produto/relatorio",
 ["id"=> $id, "data1"=> $data1, "data2"=> $data2]);
}
}
