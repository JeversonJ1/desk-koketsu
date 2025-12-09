<?php
use App\Koketsu\Core\Flash;
use App\Koketsu\Core\Session;
?>

<!DOCTYPE html>
<html>
<head>
<title>Koketsu | Loja de Roupas</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/5/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>

/* ======= RESET GERAL ======= */
html, body {
  margin: 0;
  padding: 0;
  background-color: #111111 !important; /* tom preto padrão */
  color: #f5f5f5 !important;
  font-family: "Segoe UI", sans-serif;
}

/* ======= TOPO ======= */
.w3-top, .w3-bar.w3-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffcc00 !important; /* amarelo padrão */
  color: #000 !important;
  z-index: 1000;
  height: 60px;
  line-height: 60px;
}

/* ====== MENU LATERAL ====== */
.w3-sidebar {
  background-color: #111 !important;
  color: #f5f5f5 !important;
  width: 260px !important;
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh !important;
  overflow-y: auto;
  padding-top: 60px;
  border-right: 1px solid #222;
}

.w3-sidebar a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff !important;
  background-color: transparent !important;
  padding: 12px 20px !important;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.25s ease-in-out;
  margin: 4px 12px;
}

.w3-sidebar a:hover {
  background-color: #ffcc00 !important;
  color: #000 !important;
  transform: translateX(4px);
  box-shadow: 0 0 8px #ffcc00aa;
}

/* Ícones do menu */
.w3-sidebar a i {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

/* ====== BOTÃO SAIR ====== */
.logout-btn {
  display: inline-block;
  background-color: #e74c3c !important;
  color: #fff !important;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #ff6b5a !important;
  color: #fff !important;
  text-decoration: none;
  box-shadow: 0 0 10px #ff6b5a66;
}

/* ====== CONTEÚDO ====== */
.w3-main {
  margin-left: 260px !important;
  margin-top: 60px !important;
  padding: 30px !important;
  background-color: #111 !important;
  color: #f5f5f5 !important;
  min-height: 100vh;
  transition: all 0.3s ease-in-out;
}


/* ======= BOTÕES ======= */
button, .w3-button {
  background-color: #ffcc00 !important;
  color: #000 !important;
  border: none !important;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover, .w3-button:hover {
  background-color: #ffd633 !important;
}

/* ======= CARDS / CONTAINERS ======= */
.w3-card, .w3-white, .w3-light-grey {
  background-color: #1a1a1a !important;
  color: #f5f5f5 !important;
  border: 1px solid #222 !important;
}

/* ======= INPUTS ======= */
input, select, textarea {
  background-color: #222 !important;
  color: #fff !important;
  border: 1px solid #555 !important;
  border-radius: 4px;
  padding: 8px;
}

input::placeholder {
  color: #aaa !important;
}

/* ======= FOOTER ======= */
footer {
  background-color: #111111 !important;
  color: #aaa !important;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  border-top: 1px solid #222;
  position: fixed;
  bottom: 0;
  left: 260px; /* alinhado com a sidebar */
  width: calc(100% - 260px);
}

/* ======= SCROLLBAR (opcional) ======= */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #333;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}



</style>
</head>
<body class="w3-light-grey">

  <?php
    $session = new Session();
    if($session->has('usuario_id')):
  ?>

<!-- Top container -->
<div class="w3-bar w3-top w3-theme w3-large" style="z-index:4">
  <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-black" onclick="w3_open();"><i class="fa fa-bars"></i>  Menu</button>
  <span class="w3-bar-item w3-right"><b>KOKETSU</b></span>
</div>

<!-- Sidebar/menu -->
<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:300px;" id="mySidebar"><br>
  <div class="w3-container w3-row">
    <div class="w3-col s4">
      <img src="https://www.w3schools.com/w3images/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">
    </div>
    <div class="w3-col s8 w3-bar">
      <span>Bem-vindo, <strong>Admin</strong></span><br>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-envelope"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-user"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
    </div>
  </div>
  <hr>
  <div class="w3-container">
    <h5>Painel Koketsu</h5>
  </div>
  <div class="w3-bar-block">
    <a href="/backend/admin/dashboard" button w3-padding w3-theme"><i class="fa fa-home fa-fw"></i>  Início</a>
    <a href="/backend/produto/listar" class="w3-bar-item w3-button w3-padding"><i class="fa fa-tags fa-fw"></i>  Produtos</a>
    <a href="/backend/pedido/listar" class="w3-bar-item w3-button w3-padding"><i class="fa fa-shopping-cart fa-fw"></i>  Pedidos</a>
    <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-users fa-fw"></i>  Clientes</a>
    
    <?php if ($session->get('usuario_tipo') == 'admin'){ ?>
    <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-star fa-fw"></i>  Avaliações</a>
    <a href="/backend/relatorios" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bar-chart fa-fw"></i>  Relatórios</a>
    <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-cog fa-fw"></i>  Configurações</a><br><br>
     <?php } ?>
  </div>
</nav>

<!-- Overlay -->
<div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" id="myOverlay"></div>
<div class="w3-main" style="margin-left:300px;margin-top:50px; padding:20px;">


    <?php
    endif;
$mensagem = Flash::get();
if(isset($mensagem)){
foreach($mensagem as $key => $value){
    if($key == "type"){
        $tipo = $value == "success" ? "alert-success" : "alert-danger";
    echo "<div class='alert $tipo' role='alert'>";
    }else{
        echo $value;
        echo "</div>";
    }
}
}

?>