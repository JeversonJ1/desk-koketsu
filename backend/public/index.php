
<?php
// Front controller mínimo para desenvolvimento com servidor embutido
// Carrega autoload do Composer
require __DIR__ . '/../../vendor/autoload.php';

use App\Koketsu\Controles\Api\AuthApiController;

// URI e método da requisição
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// Router simples compatível com os arquivos de rotas existentes
$router = new class {
    public $routes = ["GET" => [], "POST" => []];
    public function get($path, $handler) { $this->routes['GET'][$path] = $handler; }
    public function post($path, $handler) { $this->routes['POST'][$path] = $handler; }
    public function dispatch($uri, $method) {
        $routes = $this->routes[$method] ?? [];
        if (isset($routes[$uri])) {
            $h = $routes[$uri];
            if (is_array($h) && class_exists($h[0])) {
                $ctrl = new $h[0]();
                return call_user_func([$ctrl, $h[1]]);
            } elseif (is_callable($h)) {
                return call_user_func($h);
            }
        }
        // 404 simples
        http_response_code(404);
        echo "Not Found";
        return null;
    }
};

// Carrega rotas e biblioteca de rotas
require __DIR__ . '/../routes/web.php';
require __DIR__ . '/../routes/api.php';

// Rota de API de login especial (se existir)
if ($uri === '/api/login' && $method === 'POST') {
    AuthApiController::login();
    exit;
}

// Dispara a rota registrada
try {
    $router->dispatch($uri, $method);
} catch (Throwable $e) {
    // Fallback simples: se rota /login falhar por causa de classes ausentes, servir a página estática do desktop
    if ($uri === '/login' || $uri === '/') {
        $fallback = __DIR__ . '/../../desktop/renderer/pages/login.html';
        if (file_exists($fallback)) {
            header('Content-Type: text/html; charset=UTF-8');
            echo file_get_contents($fallback);
            exit;
        }
    }
    http_response_code(500);
    echo "Internal Server Error";
}
