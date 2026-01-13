
<?php   
use App\Koketsu\Controles\Api\AuthApiController;
require __DIR__ . '/../routes/web.php';
require __DIR__ . '/../routes/api.php';
require __DIR__ . '/../bootstrap/app.php';

if ($uri === '/api/login' && $method === 'POST') {
    AuthApiController::login();
    exit;
}
