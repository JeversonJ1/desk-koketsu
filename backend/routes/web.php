<?php

use App\Koketsu\Controles\Web\AuthController;
use App\Koketsu\Controles\Web\DashboardController;

// Login site
$router->get('/login', [AuthController::class, 'login']);
$router->post('/login', [AuthController::class, 'authenticar']);
$router->get('/logout', [AuthController::class, 'logout']);

// Dashboard admin (web, se existir)
$router->get('/admin/dashboard', [DashboardController::class, 'index']);
