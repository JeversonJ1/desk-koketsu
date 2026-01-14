let vendasChart = null;
let estoqueChart = null;
let ultimaAtualizacao = null;

// ================================
// ATUALIZAR DASHBOARD
// ================================
async function atualizarDashboard() {
  try {
    console.log('=== Atualizando Dashboard ===');
    const inicio = new Date();
    
    // Carregar dados
    const produtos = await window.api.listarProdutos();
    const vendas = await window.api.vendasMes();
    const estoque = await window.api.estoqueDashboard();
    
    // Atualizar timestamp
    ultimaAtualizacao = new Date();
    atualizarTimestamp();
    
    // Atualizar componentes
    atualizarMetricas(produtos, estoque, vendas);
    atualizarAlertas(produtos);
    atualizarTopProdutos(produtos);
    atualizarGraficos(vendas, produtos);
    
    const duracao = new Date() - inicio;
    console.log(`✓ Dashboard atualizado em ${duracao}ms`);
  } catch (erro) {
    console.error('Erro ao atualizar dashboard:', erro);
  }
}

// ================================
// ATUALIZAR TIMESTAMP
// ================================
function atualizarTimestamp() {
  const elem = document.getElementById('ultimaAtualizacao');
  if (!elem) return;
  
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, '0');
  const minutos = agora.getMinutes().toString().padStart(2, '0');
  
  elem.textContent = `Última atualização: ${horas}:${minutos}`;
}

// ================================
// ATUALIZAR MÉTRICAS
// ================================
function atualizarMetricas(produtos, estoque, vendas) {
  try {
    // Total de Produtos
    const totalProdutos = produtos.length;
    document.getElementById('totalProdutos').textContent = totalProdutos;
    
    // Total em Estoque
    const totalEstoque = estoque.reduce((sum, p) => sum + (p.estoque || 0), 0);
    document.getElementById('totalEstoque').textContent = totalEstoque;
    
    // Total de Pedidos
    const totalPedidos = vendas.length;
    document.getElementById('totalPedidos').textContent = totalPedidos;
    
    // Valor em Estoque
    const valorEstoque = produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0);
    document.getElementById('valorEstoque').textContent = 'R$ ' + valorEstoque.toFixed(0);
    
    console.log('✓ Métricas atualizadas');
  } catch (erro) {
    console.error('Erro ao atualizar métricas:', erro);
  }
}

// ================================
// ATUALIZAR ALERTAS DE ESTOQUE BAIXO
// ================================
function atualizarAlertas(produtos) {
  try {
    const container = document.getElementById('alertasEstoque');
    if (!container) return;
    
    // Produtos com estoque < 5
    const alertos = produtos.filter(p => p.estoque < 5).sort((a, b) => a.estoque - b.estoque);
    
    if (alertos.length === 0) {
      container.innerHTML = '<p class="text-muted">✓ Nenhum alerta de estoque</p>';
      return;
    }
    
    container.innerHTML = alertos.map(p => `
      <div class="alert-item">
        <div class="produto-nome">${p.nome}</div>
        <div class="produto-qtd">📦 ${p.estoque} un</div>
      </div>
    `).join('');
    
    console.log(`✓ Alertas atualizados: ${alertos.length}`);
  } catch (erro) {
    console.error('Erro ao atualizar alertas:', erro);
  }
}

// ================================
// TOP 5 PRODUTOS EM ESTOQUE
// ================================
function atualizarTopProdutos(produtos) {
  try {
    const container = document.getElementById('topEstoque');
    if (!container) return;
    
    // Top 5 por estoque
    const top = produtos
      .sort((a, b) => b.estoque - a.estoque)
      .slice(0, 5);
    
    if (top.length === 0) {
      container.innerHTML = '<p class="text-muted">Nenhum produto cadastrado</p>';
      return;
    }
    
    container.innerHTML = top.map(p => `
      <div class="product-item">
        <div class="name">${p.nome}</div>
        <div class="qtd">${p.estoque}</div>
      </div>
    `).join('');
    
    console.log('✓ Top produtos atualizados');
  } catch (erro) {
    console.error('Erro ao atualizar top produtos:', erro);
  }
}

// ================================
// ATUALIZAR GRÁFICOS
// ================================
function atualizarGraficos(vendas, produtos) {
  try {
    // Preparar dados de vendas
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosVendas = Array(12).fill(0);
    
    if (Array.isArray(vendas)) {
      vendas.forEach(v => {
        const mesIndex = parseInt(v.mes) - 1;
        if (mesIndex >= 0 && mesIndex < 12) {
          dadosVendas[mesIndex] = v.total || 0;
        }
      });
    }
    
    // Preparar dados de estoque
    let labelsEstoque = [];
    let dadosEstoque = [];
    let coresEstoque = ['#ffd84d', '#f5c400', '#e0ac00', '#c99700', '#b38600', '#9a7200'];
    
    if (Array.isArray(produtos)) {
      produtos.slice(0, 6).forEach((p, idx) => {
        labelsEstoque.push(p.nome || `Produto ${idx + 1}`);
        dadosEstoque.push(p.estoque || 0);
      });
    }
    
    // Destruir gráficos anteriores
    if (vendasChart) vendasChart.destroy();
    if (estoqueChart) estoqueChart.destroy();
    
    // Gráfico de Vendas
    const vendasCtx = document.getElementById('vendasChart');
    if (vendasCtx) {
      vendasChart = new Chart(vendasCtx, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [{
            label: 'Vendas',
            data: dadosVendas,
            borderColor: '#ffd84d',
            backgroundColor: 'rgba(255, 216, 77, 0.15)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#f5c400',
            pointBorderColor: '#1a1a1a',
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#fff' } },
            tooltip: { backgroundColor: '#111' }
          },
          scales: {
            x: { grid: { color: '#2a2a2a' }, ticks: { color: '#ddd' } },
            y: { grid: { color: '#2a2a2a' }, ticks: { color: '#ddd' } }
          }
        }
      });
    }
    
    // Gráfico de Estoque
    const estoqueCtx = document.getElementById('estoqueChart');
    if (estoqueCtx) {
      estoqueChart = new Chart(estoqueCtx, {
        type: 'doughnut',
        data: {
          labels: labelsEstoque.length > 0 ? labelsEstoque : ['Sem dados'],
          datasets: [{
            label: 'Estoque',
            data: dadosEstoque.length > 0 ? dadosEstoque : [0],
            backgroundColor: coresEstoque.slice(0, labelsEstoque.length),
            borderColor: '#1a1a1a',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 12, padding: 16 } },
            tooltip: { backgroundColor: '#111' }
          },
          cutout: '60%'
        }
      });
    }
    
    console.log('✓ Gráficos atualizados');
  } catch (erro) {
    console.error('Erro ao atualizar gráficos:', erro);
  }
}

// ================================
// EVENT LISTENERS
// ================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard iniciando...');
  
  // Botão atualizar
  const btnAtualizar = document.getElementById('btnAtualizar');
  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', () => {
      btnAtualizar.textContent = '⏳ Atualizando...';
      btnAtualizar.disabled = true;
      atualizarDashboard().then(() => {
        btnAtualizar.textContent = '🔄 Atualizar';
        btnAtualizar.disabled = false;
      });
    });
  }
  
  // Atualizar ao carregar
  atualizarDashboard();
  
  // Recarregar a cada 30 segundos
  setInterval(atualizarDashboard, 30000);
});

