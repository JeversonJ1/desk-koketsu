import './index.css';
import Rotas from './Renderer_front/Services/Rotas.js';

const rotas = new Rotas();

async function navegar() {
    const app = document.getElementById('app');
    
    // 1. Pega o hash da URL e remove o '#'
        if (!app) {
            console.error("Elemento #app não encontrado no DOM. Impossível renderizar a rota.");
            return;
        }
        let hash = window.location.hash.replace('#', '');

    // 2. Se o hash estiver vazio (início do app), define a rota padrão
    if (!hash) {
        // se não está logado, redireciona para login
        const sess = localStorage.getItem('user');
        if (!sess) {
            hash = '/login';
        } else {
            hash = '/produto_listar';
        }
    }

    // se já estamos sem sessão e tentou acessar outra rota, forçar /login
    const sess = localStorage.getItem('user');
    if (!sess && hash !== '/login') {
        hash = '/login';
    }

    // 3. CORREÇÃO DE SEGURANÇA: Garante que a rota sempre comece com '/'
    // Isso conserta o erro "is not a function" se o link for apenas "produto_criar"
    if (!hash.startsWith('/')) {
        hash = '/' + hash;
    }

    console.log("Tentando acessar a rota:", hash); // Ajuda a ver o que está acontecendo no console

    // 4. Carrega a página
        try {
            const html = await rotas.getPage(hash);
            app.innerHTML = html;
        } catch (Erro) {
            console.error('Erro ao carregar a página', Erro);
            app.innerHTML = `<h2>Erro ao carregar a página</h2><pre>${Erro.message}</pre>`;
    }
}

// Inicia a navegação ao carregar e ao mudar o link
window.addEventListener('DOMContentLoaded', navegar);
window.addEventListener('hashchange', navegar);