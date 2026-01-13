<?php
namespace App\Koketsu\Controles\Web;

use App\Koketsu\Core\View;
use App\Koketsu\Database\Database;
use App\Koketsu\Models\Usuario;
use App\Koketsu\Controles\Admin\AuthenticatedController;


class DashboardController extends AuthenticatedController{
    public $usuario;
    public $db;
    public function __construct() {
        parent::__construct();
        $this->db = Database::getInstance();
        $this->usuario = new Usuario($this->db);
    }
    public function index(): void{
        $dados = $this->usuario->buscarUsuarios();
        View::render('admin/dashboard/index', [
            'nomeUsuario' => $this->session->get('usuario_nome'),
            'Tipo' => $this->session->get('usuario_tipo'),
            'usuarios' => $dados
        ]);
    }
}
