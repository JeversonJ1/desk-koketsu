let vendasChart = null;
let estoqueChart = null;

// ================================
// ATUALIZAR DASHBOARD
// ================================
async function atualizarDashboard() {
  try {
    console.log('=== Atualizando Dashboard ===');
    
    // Carregar dados
    const dados = await window.api.obterDashboard();
    const produtos = await window.api.listarProdutos();
    
    // Atualizar cards principais
    const elemProdutos = document.getElementById('totalProdutos');
    const elemEstoque = document.getElementById('totalEstoque');
    const elemPedidos = document.getElementById('totalPedidos');
    const elemValor = document.getElementById('valorEstoque');
    
    if (elemProdutos) elemProdutos.textContent = dados.totalProdutos || 0;
    if (elemEstoque) elemEstoque.textContent = dados.estoqueTotal || 0;
    if (elemPedidos) elemPedidos.textContent = dados.totalPedidos || 0;
    if (elemValor) {
      const valorTotal = produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0);
      elemValor.textContent = 'R$ ' + valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    
    // Atualizar alertas de estoque baixo
    atualizarAlertas(produtos);
    
    // Atualizar top produtos
    atualizarTopProdutos(produtos);
    
    // Atualizar gráficos
    atualizarGraficos(produtos);
    
    // Atualizar timestamp
    atualizarTimestamp();
    
    console.log('✓ Dashboard atualizado com sucesso');
  } catch (erro) {
    console.error('Erro ao atualizar dashboard:', erro);
  }
}

// ================================
// ATUALIZAR ALERTAS DE ESTOQUE BAIXO
// ================================
function atualizarAlertas(produtos) {
  const container = document.getElementById('alertasEstoque');
  if (!container) return;
  
  // Produtos com estoque < 20
  const alertos = produtos.filter(p => p.estoque < 20).sort((a, b) => a.estoque - b.estoque);
  
  if (alertos.length === 0) {
    container.innerHTML = '<p class="text-muted">✓ Nenhum alerta de estoque</p>';
    return;
  }
  
  container.innerHTML = alertos.map(p => `
    <div class="alert-item" style="padding: 10px; border-bottom: 1px solid #333;">
      <div style="font-weight: bold; color: #ffc107;">${p.nome.substring(0, 30)}</div>
      <div style="color: #ff6b6b; font-size: 12px;">📦 ${p.estoque} unidades</div>
    </div>
  `).join('');
}

// ================================
// ATUALIZAR TOP PRODUTOS
// ================================
function atualizarTopProdutos(produtos) {
  const container = document.getElementById('topEstoque');
  if (!container) return;
  
  // Top 5 produtos por estoque
  const top = [...produtos].sort((a, b) => b.estoque - a.estoque).slice(0, 5);
  
  container.innerHTML = top.map((p, i) => `
    <div style="padding: 12px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;">
      <div style="color: #fff; font-weight: 500;">
        <strong style="color: #ffc107; font-size: 16px;">${i + 1}º</strong> <span style="color: #e0e0e0;">${p.nome.substring(0, 25)}</span>
      </div>
      <div style="color: #ffc107; font-weight: bold; font-size: 14px;">${p.estoque} un</div>
    </div>
  `).join('');
}

// ================================
// ATUALIZAR GRÁFICOS
// ================================
function atualizarGraficos(produtos) {
  atualizarGraficoVendas();
  atualizarGraficoEstoque(produtos);
}

// ================================
// GRÁFICO DE VENDAS
// ================================
function atualizarGraficoVendas() {
  const canvas = document.getElementById('vendasChart');
  if (!canvas) return;
  
  // Dados fictícios para últimos 7 dias
  const labels = [];
  const valores = [];
  
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    labels.push(data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    valores.push(Math.floor(Math.random() * 5000) + 1000);
  }
  
  if (vendasChart) {
    vendasChart.data.labels = labels;
    vendasChart.data.datasets[0].data = valores;
    vendasChart.update();
    return;
  }
  
  const ctx = canvas.getContext('2d');
  vendasChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vendas (R$)',
        data: valores,
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffc107',
        pointBorderColor: '#fff',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          labels: { color: '#fff' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#444' },
          ticks: { color: '#fff' }
        },
        x: {
          grid: { color: '#444' },
          ticks: { color: '#fff' }
        }
      }
    }
  });
}

// ================================
// GRÁFICO DE ESTOQUE
// ================================
function atualizarGraficoEstoque(produtos) {
  const canvas = document.getElementById('estoqueChart');
  if (!canvas) return;
  
  // Top 5 produtos por estoque
  const top = [...produtos].sort((a, b) => b.estoque - a.estoque).slice(0, 5);
  
  const labels = top.map(p => p.nome.substring(0, 15));
  const valores = top.map(p => p.estoque);
  
  if (estoqueChart) {
    estoqueChart.data.labels = labels;
    estoqueChart.data.datasets[0].data = valores;
    estoqueChart.update();
    return;
  }
  
  const ctx = canvas.getContext('2d');
  estoqueChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: [
          '#ffc107',
          '#17a2b8',
          '#28a745',
          '#dc3545',
          '#6f42c1'
        ],
        borderColor: '#1a1a1a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          position: 'bottom',
          labels: { 
            color: '#fff',
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  });
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
        btnAtualizar.textContent = '🔄 ATUALIZAR';
        btnAtualizar.disabled = false;
      });
    });
  }
  
  // Atualizar ao carregar
  atualizarDashboard();
  
  // Recarregar a cada 30 segundos
  setInterval(atualizarDashboard, 30000);
});


