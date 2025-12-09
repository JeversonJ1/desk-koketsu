<?php
use App\Koketsu\Models\Pedidos;
use App\Koketsu\Models\Produtos;
use App\Koketsu\Models\ItensPedidos;

$pedidos = new Pedidos($db);
$produtos = new Produtos($db);
$itenspedidos = new ItensPedidos($db);

//$usuario = new Usuario($db);
$produto->inserirProduto(20);
$resultado = $produto->buscarProdutoPorId("william.reis@emailpro.com");
//$resultado = $usuario->buscarUsuariosInativos("william.reis@emailpro.com");
//$resultado = $usuario->deletarUsuario(20);

// $id = $usuario->inserirUsuario("Arthur felix", "Arthur.f213@emailpro.com", "654321", "cliente", "ativo");
// $resultado = $endereco->inserirEndereco(
//     $id, 
//     '12345678', 
//     'Av.são miguel', 
//     '123', 
//     'Apto 1', 
//     'São miguel',
//     'São Paulo', 
//      "SP");
// if($resultado){
//     echo 'inserido com sucesso';
// }else{
//     echo 'Erro';
// }


