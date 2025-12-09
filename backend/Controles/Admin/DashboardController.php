<?php
namespace App\Koketsu\Controles\Admin;

use App\Koketsu\Core\View;

class DashboardController extends AuthenticatedController{
    public function index(): void{
        View::render('admin/dashboard/index', [
            'nomeUsuario' => $this->session->get('usuario_nome'),
            'Tipo' => $this->session->get('usuario_tipo')
        ]);
    }
}