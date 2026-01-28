// Exemplo de uso da API no Electron
// Use este código em seus arquivos JavaScript do renderer

// ========================================
// EXEMPLO 1: Buscar e exibir produtos
// ========================================
async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:8000/api/database/produtos');
        const resultado = await response.json();
        
        if (resultado.status === 'sucesso') {
            console.log('Produtos encontrados:', resultado.total);
            console.log('Dados:', resultado.dados);
            
            // Exemplo: exibir em uma tabela
            const tbody = document.querySelector('#tabela-produtos tbody');
            tbody.innerHTML = '';
            
            resultado.dados.forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.id_produto}</td>
                    <td>${produto.nome_produtos}</td>
                    <td>${produto.descricao_produtos}</td>
                    <td>R$ ${parseFloat(produto.preco_produtos).toFixed(2)}</td>
                    <td>${produto.estoque_produtos}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos!');
    }
}

// ========================================
// EXEMPLO 2: Buscar e exibir clientes
// ========================================
async function carregarClientes() {
    try {
        const response = await fetch('http://localhost:8000/api/database/clientes');
        const resultado = await response.json();
        
        if (resultado.status === 'sucesso') {
            console.log('Clientes encontrados:', resultado.total);
            
            // Criar cards de clientes
            const container = document.querySelector('#lista-clientes');
            container.innerHTML = '';
            
            resultado.dados.forEach(cliente => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${cliente.nome_clientes}</h5>
                        <p class="card-text">
                            <strong>Email:</strong> ${cliente.email_clientes}<br>
                            <strong>Telefone:</strong> ${cliente.telefone_clientes}<br>
                            <strong>Endereço:</strong> ${cliente.endereco_clientes}
                        </p>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

// ========================================
// EXEMPLO 3: Dashboard com totais
// ========================================
async function carregarDashboard() {
    try {
        // Buscar todas as APIs em paralelo
        const [produtos, clientes, pedidos, categorias] = await Promise.all([
            fetch('http://localhost:8000/api/database/produtos').then(r => r.json()),
            fetch('http://localhost:8000/api/database/clientes').then(r => r.json()),
            fetch('http://localhost:8000/api/database/pedidos').then(r => r.json()),
            fetch('http://localhost:8000/api/database/categorias').then(r => r.json())
        ]);

        // Exibir totais
        document.querySelector('#total-produtos').textContent = produtos.total || 0;
        document.querySelector('#total-clientes').textContent = clientes.total || 0;
        document.querySelector('#total-pedidos').textContent = pedidos.total || 0;
        document.querySelector('#total-categorias').textContent = categorias.total || 0;

        console.log('Dashboard carregado com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao conectar com o servidor!');
    }
}

// ========================================
// EXEMPLO 4: Teste de conexão
// ========================================
async function testarConexao() {
    try {
        const response = await fetch('http://localhost:8000/api/database/testar');
        const resultado = await response.json();
        
        if (resultado.status === 'sucesso') {
            console.log('✅ Conectado ao banco!');
            console.log(resultado.mensagem);
            return true;
        } else {
            console.error('❌ Erro na conexão:', resultado.mensagem);
            return false;
        }
    } catch (error) {
        console.error('❌ Servidor offline:', error);
        return false;
    }
}

// ========================================
// EXEMPLO 5: Buscar pedidos com detalhes
// ========================================
async function carregarPedidos() {
    try {
        const response = await fetch('http://localhost:8000/api/database/pedidos');
        const resultado = await response.json();
        
        if (resultado.status === 'sucesso') {
            const tbody = document.querySelector('#tabela-pedidos tbody');
            tbody.innerHTML = '';
            
            resultado.dados.forEach(pedido => {
                const tr = document.createElement('tr');
                const statusClass = pedido.status_pedidos === 'Concluído' ? 'success' : 
                                   pedido.status_pedidos === 'Pendente' ? 'warning' : 'info';
                
                tr.innerHTML = `
                    <td>${pedido.id_pedido}</td>
                    <td>${pedido.nome_clientes || 'Cliente Desconhecido'}</td>
                    <td>R$ ${parseFloat(pedido.total_pedidos).toFixed(2)}</td>
                    <td><span class="badge bg-${statusClass}">${pedido.status_pedidos}</span></td>
                    <td>${new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página carregada, testando conexão...');
    
    const conectado = await testarConexao();
    
    if (conectado) {
        // Carregar dados iniciais
        carregarDashboard();
        carregarProdutos();
        carregarClientes();
        carregarPedidos();
    } else {
        alert('Não foi possível conectar ao servidor! Verifique se o PHP está rodando.');
    }
});
