<?php

namespace App\Koketsu\Controles;

use App\Koketsu\Controles\Admin\AdminController;
use App\Koketsu\Database\Database;
use App\Koketsu\Core\View;
use App\Koketsu\Core\Redirect;
use Exception;

// Importa todas as Models necessárias
use App\Koketsu\Models\Pedidos;
use App\Koketsu\Models\Produtos;
use App\Koketsu\Models\ItensPedidos;
use App\Koketsu\Models\Categoria;

class RelatoriosController extends AdminController
{
    private $db;
    // REMOVIDOS TODOS OS TYPE HINTS DE PROPRIEDADES para evitar problemas de autoloading
    private $pedidosModel;
    private $produtosModel;
    private $itensPedidosModel;
    private $categoriasModel; 

    public function __construct()
    {
        // Chama o construtor da classe pai (AdminController)
        parent::__construct(); 
        
        $this->db = Database::getInstance();
        
        // Instancia as Models com a conexão do banco
        $this->pedidosModel = new Pedidos($this->db);
        $this->produtosModel = new Produtos($this->db);
        $this->itensPedidosModel = new ItensPedidos($this->db);
        $this->categoriasModel = new Categoria($this->db); // Instanciação é feita aqui
    }

    /**
     * Exibe o dashboard de relatórios com todos os dados.
     */
    public function exibirRelatorios()
    {
        try {
            // DADO 1: Vendas Mensais (Model Pedidos)
            $vendas_mensais = $this->pedidosModel->buscarVendasMensais();

            // DADO 2: Status de Pedidos (Model Pedidos)
            $status_contagem = $this->pedidosModel->contarPedidosPorStatus();

            // DADO 3: Top 5 Produtos Vendidos (Model ItensPedidos)
            $top_produtos = $this->itensPedidosModel->buscarTop5ProdutosVendidos();
            
            // DADO 4: Faturamento Mensal por Categoria (Model Pedidos)
            $vendas_por_categoria = $this->pedidosModel->buscarVendasMensaisPorCategoria();
            
            // DADO 5: Ticket Médio Mensal (Model Pedidos)
            $ticket_medio_mensal = $this->pedidosModel->calcularTicketMedioMensal();
            
            // DADO 6: Contagem de Produtos por Categoria (Model Produtos)
            $contagem_produtos_categoria = $this->produtosModel->contarProdutosPorCategoria();


            // Renderiza a View, passando TODOS os dados
            View::render('relatorios/index', [
                'vendas_mensais' => $vendas_mensais,
                'status_contagem' => $status_contagem,
                'top_produtos' => $top_produtos,
                'vendas_por_categoria' => $vendas_por_categoria,
                'ticket_medio_mensal' => $ticket_medio_mensal,
                'contagem_produtos_categoria' => $contagem_produtos_categoria
            ]);

        } catch (Exception $e) {
            // Em caso de erro, registra no log e redireciona com mensagem de erro
            error_log("Erro fatal ao gerar relatórios: " . $e->getMessage());
            
            $erro_msg = 'Não foi possível carregar os dados de relatório: ' . $e->getMessage();
            
            Redirect::redirecionarComMensagem(
                '/admin/dashboard', 
                'error', 
                $erro_msg
            );
            exit(); 
        }
    }
}