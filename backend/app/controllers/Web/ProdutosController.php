<?php
namespace App\Koketsu\Controles\Web;

use App\Koketsu\Models\Produtos;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use App\Koketsu\Core\FileManager;
use App\Koketsu\Controles\Admin\AdminController;

class ProdutosController extends AdminController{
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

 public function viewListarProduto($pagina = 1) {
    $produto = $this->produtos->categoriasProdu();
    $total = $this->produtos->categoriasProdu();
        if (empty($pagina) || $pagina <= 0) $pagina = 1;
        
        $dados = $this->produtos->paginacao($pagina, 50);
        
        View::render("produtos/index", [
            "produtos" => $dados['data'],
            "produto" => $produto,
            "total" => $total,
            'paginacao' => $dados
        ]);
}

 public function viewCriarProduto(){
 View::render("produtos/create");
}


public function viewExcluirProduto(int $id) {
        $dados = $this->produtos->buscarPorID($id);
        View::render("produtos/delete", ["produtos" => $dados]);
    }

    public function viewAtivarProdutos($id){
         $dados = $this->produtos->buscarPorID($id);
         View::render("produtos/ativar",["produtos" => $dados]);
    }

    public function ativarProduto(){
        $id = (int)$_POST['id_produto'];
        if ($this->produtos->ativarProduto($id)) {
            Redirect::redirecionarComMensagem("/produtos/listar", "success", "Produto ativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/produtos/listar", "error", "Erro ao ativar produto.");
        }
    }

public function atualizarProdutos() {
    $id_produto = (int)$_POST['id_produto'];
    $nome = trim($_POST['nome_produtos'] ?? '');
    $descricao = trim($_POST['descricao_produtos'] ?? '');
    $preco = $_POST['preco_produtos'] ?? null;
    $estoque = $_POST['estoque_produtos'] ?? null;
    $id_categoria = $_POST['id_categoria'] ?? null;
    $imagem = null;

    if ($nome === '') {
        Redirect::redirecionarComMensagem("/produtos/editar/" . $id_produto, "error", "Nome é obrigatório.");
        return;
    }

    if (isset($_FILES['imagem_produtos']) && $_FILES['imagem_produtos']['error'] == 0) {
        try {
            $imagem = $this->gerenciarImagem->salvarArquivo($_FILES['imagem_produtos'], 'produtos');
        } catch (\Exception $e) {
            Redirect::redirecionarComMensagem("/produtos/editar/" . $id_produto, "error", "Erro ao salvar imagem: " . $e->getMessage());
            return;
        }
    }

    $updated = $this->produtos->atualizarProduto($id_produto, $nome, $descricao, $preco, $estoque, $imagem, $id_categoria);
    if ($updated) {
        Redirect::redirecionarComMensagem("/produtos/listar/", "success", "Produto atualizado com sucesso!");
    } else {
        Redirect::redirecionarComMensagem("/produtos/editar/" . $id_produto, "error", "Erro ao atualizar produto!");
    }
}

public function deletarProdutos(){
 $id = (int)$_POST['id_produto'];
        if ($this->produtos->deletarProdutos($id)) {
            Redirect::redirecionarComMensagem("/produtos/listar", "success", "Produto inativado com sucesso!");
        } else {
            Redirect::redirecionarComMensagem("/produtos/listar", "error", "Erro ao inativar produto.");
        }
    }
public function relatorioProduto($id, $data1, $data2){
 View::render("produto/relatorio",
 ["id"=> $id, "data1"=> $data1, "data2"=> $data2]);
}

 public function salvarProduto() {
    $nome = trim($_POST['nome_produtos'] ?? '');
    $descricao = trim($_POST['descricao_produtos'] ?? '');

    if ($nome === '') {
        Redirect::redirecionarComMensagem("/produtos/criar", "error", "Nome é obrigatório.");
        return;
    }

    if (!isset($_FILES['imagem_produtos']) || empty($_FILES['imagem_produtos']['name'])) {
        Redirect::redirecionarComMensagem("/produtos/criar", "error", "A imagem do produto é obrigatória.");
        return;
    }

    try {
        $imagem = $this->gerenciarImagem->salvarArquivo($_FILES['imagem_produtos'], 'produtos');
    } catch (\Exception $e) {
        Redirect::redirecionarComMensagem("/produtos/criar", "error", "Erro ao salvar imagem: " . $e->getMessage());
        return;
    }

    $inserido = $this->produtos->inserirProduto($nome, $descricao, $imagem);
    if ($inserido) {
        Redirect::redirecionarComMensagem("/produtos/listar", "success", "Produtos cadastrado com sucesso!");
    } else {
        Redirect::redirecionarComMensagem("/produtos/criar", "error", "Erro ao cadastrar produtos.");
    }
    }

    public function viewEditarProdutos(int $id) {
        $produtos = $this->produtos->buscarPorID($id);
        if (!$produtos) {
            Redirect::redirecionarComMensagem("/produtos/listar", "error", "Produto não encontrado.");
        }
        
        View::render("produtos/edit", ["produtos" => $produtos]);
    }
}
