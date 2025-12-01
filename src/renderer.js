import './index.css';
import Rotas from './Renderer_front/Services/Rotas.js';

const rotas = new Rotas();

async function navegar() {
    const app = document.getElementById('app');
    
    // 1. Pega o hash da URL e remove o '#'
    let hash = window.location.hash.replace('#', '');

    // 2. Se o hash estiver vazio (início do app), define a rota padrão
    if (!hash) {
        hash = '/produto_listar';
    }

    // 3. CORREÇÃO DE SEGURANÇA: Garante que a rota sempre comece com '/'
    // Isso conserta o erro "is not a function" se o link for apenas "produto_criar"
    if (!hash.startsWith('/')) {
        hash = '/' + hash;
    }

    console.log("Tentando acessar a rota:", hash); // Ajuda a ver o que está acontecendo no console

    // 4. Carrega a página
    try {
        app.innerHTML = await rotas.getPage(hash);
    } catch (error) {
        console.error("Erro crítico na navegação:", error);
    }
}

// Inicia a navegação ao carregar e ao mudar o link
window.addEventListener('DOMContentLoaded', navegar);
window.addEventListener('hashchange', navegar);