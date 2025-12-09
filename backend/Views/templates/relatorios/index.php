<?php 
// Esta view espera as seguintes variáveis:
// $vendas_mensais, $status_contagem, $top_produtos, 
// $vendas_por_categoria, $ticket_medio_mensal, $contagem_produtos_categoria
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Relatórios - Koketsu</title>
    <!-- Inclua aqui o seu CSS de admin, se houver -->
    <style>
        body { font-family: sans-serif; background-color: #f4f7f6; }
        .container-relatorios { max-width: 1200px; margin: 20px auto; padding: 20px; }
        .card { background: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); margin-bottom: 20px; padding: 20px; }
        h1, h2 { color: #333; }
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .chart-container { height: 350px; }
        .list-group-item { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .list-group-item:last-child { border-bottom: none; }
    </style>
    <!-- Inclui Chart.js para gráficos -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <!-- Inclui Moment.js para manipulação de datas no Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@1.0.0/dist/chartjs-adapter-moment.min.js"></script>
    
</head>
<body>
    <div class="container-relatorios">
        <h1>Dashboard de Relatórios</h1>

        <!-- MENSAGEM DE ERRO/SUCESSO DO Redirect -->
        <?php if (isset($data['error'])): ?>
            <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <?= htmlspecialchars($data['error']) ?>
            </div>
        <?php endif; ?>

        <!-- DADOS ESTATÍSTICOS RÁPIDOS (Pode ser adicionado futuramente) -->
        <div class="grid-cards">
            <div class="card">
                <h2>Total de Pedidos</h2>
                <p style="font-size: 2em; color: #007bff;"><?= array_sum(array_column($status_contagem, 'contagem')) ?? 0 ?></p>
            </div>
            <div class="card">
                <h2>Vendas no Último Mês</h2>
                <?php 
                    // Garantir que $vendas_mensais é um array não vazio antes de usar end()
                    if (is_array($vendas_mensais) && !empty($vendas_mensais)) {
                        $ultimo_mes = end($vendas_mensais);
                    } else {
                        $ultimo_mes = null;
                    }

                    // Ler total_vendas de forma segura tanto para arrays quanto para objetos
                    if (is_array($ultimo_mes)) {
                        $total_mes = isset($ultimo_mes['total_vendas']) ? $ultimo_mes['total_vendas'] : 0;
                    } elseif (is_object($ultimo_mes)) {
                        $total_mes = isset($ultimo_mes->total_vendas) ? $ultimo_mes->total_vendas : 0;
                    } else {
                        $total_mes = 0;
                    }
                ?>
                <p style="font-size: 2em; color: #28a745;">R$ <?= number_format($total_mes, 2, ',', '.') ?></p>
            </div>
            <!-- NOVO DADO: TICKET MÉDIO DO ÚLTIMO MÊS -->
            <div class="card">
                <h2>Ticket Médio (Último)</h2>
                <?php 
                    // Garantir que $ticket_medio_mensal é um array não vazio antes de usar end()
                    if (is_array($ticket_medio_mensal) && !empty($ticket_medio_mensal)) {
                        $ultimo_ticket = end($ticket_medio_mensal);
                    } elseif (is_object($ticket_medio_mensal) && !empty((array)$ticket_medio_mensal)) {
                        // Se for um objeto, converter para array para pegar o último elemento
                        $arr_ticket = (array)$ticket_medio_mensal;
                        $ultimo_ticket = end($arr_ticket);
                    } else {
                        $ultimo_ticket = null;
                    }

                    // Ler ticket_medio de forma segura tanto para arrays quanto para objetos
                    if (is_array($ultimo_ticket)) {
                        $ticket_medio = isset($ultimo_ticket['ticket_medio']) ? $ultimo_ticket['ticket_medio'] : 0;
                    } elseif (is_object($ultimo_ticket)) {
                        $ticket_medio = isset($ultimo_ticket->ticket_medio) ? $ultimo_ticket->ticket_medio : 0;
                    } else {
                        $ticket_medio = 0;
                    }
                ?>
                <p style="font-size: 2em; color: #ffc107;">R$ <?= number_format($ticket_medio, 2, ',', '.') ?></p>
            </div>
        </div>

        <!-- GRÁFICOS DE LINHA -->
        <div class="grid-cards" style="grid-template-columns: 1fr;">
            <!-- GRÁFICO 1: Vendas Mensais -->
            <div class="card">
                <h2>Vendas Totais por Mês (Últimos 12 Meses)</h2>
                <div class="chart-container"><canvas id="vendasMensaisChart"></canvas></div>
            </div>

            <!-- GRÁFICO 5 (NOVO): Ticket Médio Mensal -->
            <div class="card">
                <h2>Ticket Médio Mensal (R$)</h2>
                <div class="chart-container"><canvas id="ticketMedioChart"></canvas></div>
            </div>
        </div>

        <!-- GRÁFICOS DE BARRAS/PIZZA E LISTAS -->
        <div class="grid-cards" style="grid-template-columns: 1fr 1fr;">
            <!-- GRÁFICO 2: Status de Pedidos (Doughnut) -->
            <div class="card">
                <h2>Contagem de Pedidos por Status</h2>
                <div class="chart-container" style="height: 300px;"><canvas id="statusChart"></canvas></div>
            </div>
            
            <!-- DADO 3: Top 5 Produtos Vendidos (Lista) -->
            <div class="card">
                <h2>Top 5 Produtos Mais Vendidos</h2>
                <ul class="list-group">
                    <?php if (!empty($top_produtos)): ?>
                        <?php foreach ($top_produtos as $produto): ?>
                            <li class="list-group-item">
                                <span><?= htmlspecialchars($produto['nome_produto']) ?></span>
                                <strong><?= htmlspecialchars($produto['total_vendido']) ?> Unidades</strong>
                            </li>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>Nenhum produto vendido no período.</p>
                    <?php endif; ?>
                </ul>
            </div>
            
            <!-- GRÁFICO 6: Produtos por Categoria (Barra/Doughnut) -->
            <div class="card">
                <h2>Contagem de Produtos por Categoria</h2>
                <div class="chart-container" style="height: 300px;"><canvas id="produtosPorCategoriaChart"></canvas></div>
            </div>
            
            <!-- GRÁFICO 4: Vendas por Categoria (Barras Empilhadas) -->
            <div class="card">
                <h2>Faturamento por Categoria (Últimos 12 Meses)</h2>
                <div class="chart-container"><canvas id="vendasPorCategoriaChart"></canvas></div>
            </div>

        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // ===========================================
            // FUNÇÕES DE PREPARAÇÃO DE DADOS
            // ===========================================

            // Função para preparar dados de linha/barra (data e valor)
            function prepareLineData(data, dateKey, valueKey) {
                return data.map(item => ({
                    x: item[dateKey], // Mês
                    y: parseFloat(item[valueKey]) // Valor
                }));
            }

            // Função para formatar o mês no eixo X (Ex: Jan/25)
            const formatMonth = (value) => {
                return moment(value).format('MMM/YY');
            };

            // ===========================================
            // DADOS PHP PARA JAVASCRIPT
            // ===========================================
            const vendasMensais = <?= json_encode($vendas_mensais) ?>;
            const statusContagem = <?= json_encode($status_contagem) ?>;
            const vendasPorCategoria = <?= json_encode($vendas_por_categoria) ?>;
            const ticketMedioMensal = <?= json_encode($ticket_medio_mensal) ?>;
            const contagemProdutosCategoria = <?= json_encode($contagem_produtos_categoria) ?>;


            // ===========================================
            // GRÁFICO 1: VENDAS MENSAIS (LINHA)
            // ===========================================
            const vendasData = prepareLineData(vendasMensais, 'mes', 'total_vendas');
            const vendasConfig = {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Vendas Totais (R$)',
                        data: vendasData,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: '#007bff',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: { unit: 'month' },
                            title: { display: true, text: 'Mês' },
                            ticks: { callback: formatMonth }
                        },
                        y: {
                            title: { display: true, text: 'Faturamento (R$)' },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: { callbacks: { label: (context) => `R$ ${context.parsed.y.toFixed(2).replace('.', ',')}` } }
                    }
                }
            };
            new Chart(document.getElementById('vendasMensaisChart'), vendasConfig);


            // ===========================================
            // GRÁFICO 5: TICKET MÉDIO MENSAL (LINHA)
            // ===========================================
            const ticketData = prepareLineData(ticketMedioMensal, 'mes', 'ticket_medio');
            const ticketConfig = {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Ticket Médio (R$)',
                        data: ticketData,
                        backgroundColor: 'rgba(255, 193, 7, 0.5)',
                        borderColor: '#ffc107',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: { unit: 'month' },
                            title: { display: true, text: 'Mês' },
                            ticks: { callback: formatMonth }
                        },
                        y: {
                            title: { display: true, text: 'Ticket Médio (R$)' },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: { callbacks: { label: (context) => `R$ ${context.parsed.y.toFixed(2).replace('.', ',')}` } }
                    }
                }
            };
            new Chart(document.getElementById('ticketMedioChart'), ticketConfig);


            // ===========================================
            // GRÁFICO 2: STATUS DE PEDIDOS (DOUGHNUT)
            // ===========================================
            const statusLabels = statusContagem.map(item => item.status_pedido);
            const statusValues = statusContagem.map(item => item.contagem);
            const statusConfig = {
                type: 'doughnut',
                data: {
                    labels: statusLabels,
                    datasets: [{
                        data: statusValues,
                        backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6c757d'], // Cores para PAGO, NOVO, ENVIADO, CANCELADO, etc.
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    }
                }
            };
            new Chart(document.getElementById('statusChart'), statusConfig);


            // ===========================================
            // GRÁFICO 6: PRODUTOS POR CATEGORIA (BARRA)
            // ===========================================
            const prodCatLabels = contagemProdutosCategoria.map(item => item.nome_categoria);
            const prodCatValues = contagemProdutosCategoria.map(item => item.contagem);
            const prodCatConfig = {
                type: 'bar',
                data: {
                    labels: prodCatLabels,
                    datasets: [{
                        label: 'Qtd. de Produtos',
                        data: prodCatValues,
                        backgroundColor: 'rgba(23, 162, 184, 0.7)',
                        borderColor: '#17a2b8',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            };
            new Chart(document.getElementById('produtosPorCategoriaChart'), prodCatConfig);


            // ===========================================
            // GRÁFICO 4: VENDAS POR CATEGORIA (BARRAS EMPILHADAS)
            // ===========================================
            
            // 1. Encontrar todos os meses e categorias únicas
            const allMonths = [...new Set(vendasPorCategoria.map(item => item.mes))].sort();
            const allCategories = [...new Set(vendasPorCategoria.map(item => item.categoria))];
            
            // 2. Definir cores
            const categoryColors = {
                // Pode adicionar cores fixas para suas categorias principais
                "Acessórios": "rgba(75, 192, 192, 0.8)",
                "Camisetas": "rgba(255, 99, 132, 0.8)",
                "Calças": "rgba(54, 162, 235, 0.8)",
                "Calçados": "rgba(255, 159, 64, 0.8)",
                // Função simples para cores randômicas
                randomColor: function() {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    return `rgba(${r}, ${g}, ${b}, 0.8)`;
                }
            };
            
            // 3. Criar os datasets
            const datasets = allCategories.map(category => {
                const data = allMonths.map(month => {
                    const item = vendasPorCategoria.find(v => v.mes === month && v.categoria === category);
                    return {
                        x: month, 
                        y: parseFloat(item?.faturamento || 0)
                    };
                });

                return {
                    label: category,
                    data: data,
                    backgroundColor: categoryColors[category] || categoryColors.randomColor(),
                    stack: 'Stack 1' // Empilha todas as barras
                };
            });

            const vendasCategoriaConfig = {
                type: 'bar',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            type: 'time',
                            time: { unit: 'month' },
                            title: { display: true, text: 'Mês' },
                            ticks: { callback: formatMonth }
                        },
                        y: {
                            stacked: true,
                            title: { display: true, text: 'Faturamento (R$)' },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: { 
                            mode: 'index', 
                            intersect: false,
                            callbacks: { label: (context) => `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2).replace('.', ',')}` } 
                        }
                    }
                }
            };
            new Chart(document.getElementById('vendasPorCategoriaChart'), vendasCategoriaConfig);

        });
    </script>
</body>
</html>
