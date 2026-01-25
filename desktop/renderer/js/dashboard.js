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
    container.innerHTML = '<div style="padding: 20px; text-align: center;"><p class="text-muted" style="margin: 0;">✓ Nenhum alerta de estoque</p></div>';
    return;
  }
  
  container.innerHTML = alertos.slice(0, 6).map(p => {
    const percentual = Math.round((p.estoque / 100) * 100); // Assumir 100 como máximo
    let cor = '#51cf66'; // Verde
    let bg = 'rgba(81, 207, 102, 0.1)';
    
    if (p.estoque < 5) {
      cor = '#ff6b6b'; // Vermelho crítico
      bg = 'rgba(255, 107, 107, 0.1)';
    } else if (p.estoque < 15) {
      cor = '#ffa94d'; // Laranja atenção
      bg = 'rgba(255, 169, 77, 0.1)';
    }
    
    return `
      <div style="padding: 14px; border-bottom: 1px solid #333; background: ${bg}; border-left: 4px solid ${cor};">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div style="font-weight: bold; color: #fff; font-size: 14px;">${p.nome.substring(0, 30)}</div>
          <span style="color: ${cor}; font-weight: bold; font-size: 13px;">${p.estoque} un</span>
        </div>
        <div style="width: 100%; height: 6px; background: #333; border-radius: 3px; overflow: hidden;">
          <div style="width: ${percentual}%; height: 100%; background: ${cor}; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ================================
// ATUALIZAR TOP PRODUTOS
// ================================
function atualizarTopProdutos(produtos) {
  const container = document.getElementById('topEstoque');
  if (!container) return;
  
  // Top 5 produtos por estoque
  const top = [...produtos].sort((a, b) => b.estoque - a.estoque).slice(0, 5);
  
  container.innerHTML = top.map((p, i) => {
    const valorProduto = (p.preco * p.estoque).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const percentualMax = Math.min((p.estoque / 500) * 100, 100);
    
    return `
      <div style="padding: 16px; border-bottom: 1px solid #333; cursor: pointer;" onclick="window.location.href='produtos.html'" onmouseover="this.style.background='rgba(255,216,77,0.05)'" onmouseout="this.style.background='transparent'" style="transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div>
            <div style="color: #ffd84d; font-size: 13px; font-weight: bold; margin-bottom: 4px;">#${i + 1}</div>
            <div style="color: #e0e0e0; font-weight: 600; font-size: 14px;">${p.nome.substring(0, 28)}</div>
          </div>
          <div style="text-align: right;">
            <div style="color: #ffd84d; font-weight: bold; font-size: 14px;">${p.estoque} un</div>
            <div style="color: #888; font-size: 12px;">R$ ${valorProduto}</div>
          </div>
        </div>
        <div style="width: 100%; height: 6px; background: #333; border-radius: 3px; overflow: hidden;">
          <div style="width: ${percentualMax}%; height: 100%; background: linear-gradient(90deg, #ffd84d, #ffbe33); transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }).join('');
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
  const dia = agora.toLocaleDateString('pt-BR');
  
  elem.textContent = `Última atualização: ${dia} às ${horas}:${minutos}`;
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
      btnAtualizar.textContent = 'Atualizando...';
      btnAtualizar.disabled = true;
      atualizarDashboard().then(() => {
        btnAtualizar.textContent = 'Atualizar';
        btnAtualizar.disabled = false;
      });
    });
  }
  
  // Atualizar ao carregar
  atualizarDashboard();
  
  // Recarregar a cada 30 segundos
  setInterval(atualizarDashboard, 30000);
});


