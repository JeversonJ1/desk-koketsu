const https = require('https');
const http = require('http');

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/database';
    }

    /**
     * Faz requisição HTTP genérica
     */
    async request(endpoint) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseURL}${endpoint}`;
            
            http.get(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(new Error('Erro ao parsear JSON: ' + error.message));
                    }
                });
            }).on('error', (error) => {
                reject(new Error('Erro na requisição: ' + error.message));
            });
        });
    }

    /**
     * Testa conexão com o banco de dados
     */
    async testarConexao() {
        try {
            const resultado = await this.request('/testar');
            return resultado;
        } catch (error) {
            console.error('Erro ao testar conexão:', error);
            throw error;
        }
    }

    /**
     * Busca todos os produtos
     */
    async getProdutos() {
        try {
            const resultado = await this.request('/produtos');
            return resultado;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    /**
     * Busca todos os clientes
     */
    async getClientes() {
        try {
            const resultado = await this.request('/clientes');
            return resultado;
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
    }

    /**
     * Busca todos os pedidos
     */
    async getPedidos() {
        try {
            const resultado = await this.request('/pedidos');
            return resultado;
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            throw error;
        }
    }

    /**
     * Busca todas as categorias
     */
    async getCategorias() {
        try {
            const resultado = await this.request('/categorias');
            return resultado;
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
    }

    /**
     * Busca dados do dashboard (exemplo combinando várias requisições)
     */
    async getDashboardData() {
        try {
            const [produtos, clientes, pedidos, categorias] = await Promise.all([
                this.getProdutos(),
                this.getClientes(),
                this.getPedidos(),
                this.getCategorias()
            ]);

            return {
                produtos: produtos.dados || [],
                clientes: clientes.dados || [],
                pedidos: pedidos.dados || [],
                categorias: categorias.dados || [],
                totais: {
                    produtos: produtos.total || 0,
                    clientes: clientes.total || 0,
                    pedidos: pedidos.total || 0,
                    categorias: categorias.total || 0
                }
            };
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            throw error;
        }
    }
}

module.exports = new ApiService();
