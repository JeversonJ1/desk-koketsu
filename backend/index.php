<?php
namespace App\Koketsu;
require_once __DIR__ . '/../vendor/autoload.php';

// Carregar variáveis de ambiente
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
    }
}

if (!isset($_SESSION)) {
  session_start();
 }
use App\Koketsu\Rotas\Rotas;
use Bramus\Router\Router;


$router = new Router();
$router->setNamespace('\App\Koketsu\Controles');

// Rotas de banco de dados
$router->get('/api/database/testar', 'DatabaseController@testarConexao');
$router->get('/api/database/produtos', 'DatabaseController@getProdutos');
$router->get('/api/database/clientes', 'DatabaseController@getClientes');
$router->get('/api/database/pedidos', 'DatabaseController@getPedidos');
$router->get('/api/database/categorias', 'DatabaseController@getCategorias');

$router->get('/backend/relatorios', 'RelatoriosController@exibirRelatorios');
$router->get('/backend/register', 'AuthController@register');
$router->get('/admin/relatorios', 'RelatoriosController@index');
$router->post('/backend/pedido/listar', 'PedidosController@pesquisarPedido'); // Rota POST para Busca
$router->get('/backend/pedido/listar', 'PedidosController@viewListarPedido'); 


$rotas = [ 
  "GET" => [
 // o caminho da URL o nome do controlle e o metodo do controle 
   //usuarios
   // o caminho da URL    o nome do controlle e o metodo do controle 
        //usuarios
        "/usuarios/criar" => "UsuarioController@viewCriarUsuarios",
        "/usuarios/listar" => "UsuarioController@viewListarUsuarios",
        "/usuarios/listar/{pagina}" => "UsuarioController@viewListarUsuarios",
        "/usuarios/editar/{id}" => "UsuarioController@viewEditarUsuarios",
        "/usuarios/excluir/{id}" => "UsuarioController@viewExcluirUsuarios",
        "/usuarios/{id}/relatorio/{data1}/{data2}" => "UsuarioController@relatorioUsuario",
        '/register' => 'AuthController@register',
        '/login' => 'AuthController@login',
        '/logout' => 'AuthController@logout',
        '/admin/dashboard' => 'Admin\DashboardController@index',
        '/api/usuarios' => 'APIUsuarioController@getUsuarios',
        '/api/usuarios/{pagina}' => 'APIUsuarioController@getUsuarios',

        //Itens pedidos
        "/itenspedidos" => "ItensPedidosController@index",
        "/itenspedidos/criar" => "ItensPedidosController@viewCriarItemPedido",
        "/itenspedidos/listar" => "ItensPedidosController@viewListarItemPedido",
        "/itenspedidos/listar/{id}" => "ItensPedidosController@viewItemPedidoUnico",
        "/itenspedidos/listar/{pagina}" => "ItensPedidosController@viewlistaritenspedidos",
        "/itenspedidos/editar/{id}" => "ItensPedidosController@viewEditarItemPedido",
        "/itenspedidos/excluir/{id}" => "ItensPedidosController@viewExcluirItemPedido",
        "/itenspedidos/{id}/relatorio/{data1}/{data2}" => "ItensPedidosController@relatorioitenspedidos",
        '/api/itenspedidos' => 'PublicApiController@getItenspedidos',
        '/api/itenspedidos/{pagina}' => 'PublicApiController@getItenspedidos',
        //Pedidos
        "/pedido" => "PedidosController@index",
        "/pedido/criar" => "PedidosController@viewCriarPedidos",
        "/pedido/listar" => "PedidosController@viewListarPedido",
        "/pedido/listar/{id}" => "PedidosController@viewPedidoUnico",
        "/pedido/editar/{id}" => "PedidosController@viewEditarPedido",
        "/pedido/excluir/{id}" => "PedidosController@viewExcluirPedido",
        "/pedido/{id}/relatorio/{data1}/{data2}" => "Pedidos@relatorioPedido",
        '/api/pedidos' => 'PublicApiController@getPedidos',
        '/api/pedidos/{pagina}' => 'PublicApiController@getPedidos',
          
        //Produtos
        "/produto" => "ProdutosController@index",
        "/produto/criar" => "ProdutosController@viewCriarProduto",
        "/produto/listar" => "ProdutosController@viewlistarProduto",
        "/produto/listar/{id}" => "ProdutosController@viewProdutoUnico",
        "/produto/listar/{pagina}" => "ProdutosController@viewlistarProduto",
        "/produto/editar/{id}" => "ProdutosController@viewEditarProdutos",
        "/produto/excluir/{id}" => "ProdutosController@viewExcluirProduto",
        "/produto/{id}/relatorio/{data1}/{data2}" => "ProdutosController@relatorioProduto",
        "/relatorios" => "RelatoriosController@exibirRelatorios",
        '/api/produtos' => 'PublicApiController@getProdutos',
        '/api/produtos/{pagina}' => 'PublicApiController@getProdutos',
        '/api/vitrine'=> 'PublicApiController@getProdutosParaVitrineFormatados'
        

        
        
    ],
    "POST" => [
        //usuarios
        "/usuarios/salvar" => "UsuarioController@salvarUsuario",
       "/usuarios/atualizar/{id}" => "UsuarioController@atualizarUsuario",
       "/usuarios/deletar/{id}" => "UsuarioController@deletarUsuario",
        '/register' => 'AuthController@cadastrarUsuario',
       '/login' => 'AuthController@authenticar',
        '/api/usuarios' => 'APIUsuarioController@getUsuarios',
        '/api/usuarios/{pagina}' => 'APIUsuarioController@getUsuarios',
        //itens pedidos
       "/itenspedidos/salvar" => "ItensPedidosController@salvarItemPedido",
       "/itenspedidos/atualizar/{id}" => "ItensPedidosController@atualizarItemPedido",
       "/itenspedidos/deletar/{id}" => "ItensPedidosController@deletarItemPedido",
       //Pedidos
         "/pedido/salvar" => "PedidosController@salvarPedido",
       "/pedido/atualizar/{id}" => "PedidosController@atualizarPedidos",
       "/pedido/deletar/{id}" => "PedidosController@viewExcluirPedido",
        "/pedido/listar" => "PedidosController@pesquisarPedido",
       //produtos
        "/produto/salvar" => "ProdutosController@salvarProduto",
       "/produto/atualizar/{id}" => "ProdutosController@atualizarProdutos",
       "/produto/deletar/{id}" => "ProdutosController@viewExcluirProduto",
        '/api/produtos' => 'PublicApiController@getProdutos',
    // Post para cadastro
       "/register" => "AuthControll er@cadastrarUsuario", 
      //Contato
      '/contato/salvar' => 'ContatoController@salvarNovoContato',
  ]
 ];



foreach ($rotas as $metodoHttp => $rota){
 foreach ($rota as $uri => $acao){
 $metodoBramus = strtolower($metodoHttp);
 $router->{$metodoBramus}($uri, $acao);
 }
}

$router->set404(function() {
 header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
 echo '404, Rota não Encontrada!';
});

$router->run();
