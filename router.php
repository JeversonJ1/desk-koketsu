<?php
// Router para o servidor PHP embutido.
// Se o arquivo existe no disco, retorna false para que o servidor sirva o arquivo estático.
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$requested = __DIR__ . $uri;

// Segurança: evita acesso a níveis acima do diretório
// Aplica a verificação apenas quando o caminho requisitado resolve para um arquivo
$docRoot = realpath(__DIR__);
$realRequested = realpath($requested);
if ($realRequested !== false && strpos($realRequested, $docRoot) !== 0) {
    http_response_code(403);
    echo "Acesso negado.";
    exit;
}

if ($uri !== '/' && file_exists($requested) && is_file($requested)) {
    return false; // permite que o servidor embutido entregue o arquivo
}

// Caso contrário, encaminha para o front controller (rotas PHP)
require_once __DIR__ . '/backend/Rotas/Rotas.php';
