// ===== CONFIG GLOBAL DARK =====
Chart.defaults.color = "#eaeaea";
Chart.defaults.font.family = "Segoe UI";
Chart.defaults.borderColor = "#333";

// ===== GRÁFICO VENDAS =====
const ctxVendas = document.getElementById("vendasMes");

new Chart(ctxVendas, {
  type: "bar",
  data: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [{
      label: "Vendas",
      data: [12, 19, 9, 22, 15, 18],
      backgroundColor: "#f1c40f",
      borderRadius: 6
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// ===== GRÁFICO ESTOQUE =====
const ctxEstoque = document.getElementById("estoqueProdutos");

new Chart(ctxEstoque, {
  type: "bar",
  data: {
    labels: ["Camisetas", "Calças", "Tênis", "Bonés"],
    datasets: [{
      label: "Quantidade",
      data: [40, 25, 15, 10],
      backgroundColor: "#f1c40f",
      borderRadius: 6
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
