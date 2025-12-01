import './index.css';
import Rotas from "./Renderer_front/Services/Rotas.js";
import Configuracao from './Renderer_front/Services/Configuracao.js';

const config = new Configuracao();
 await config.modoEscuro();
 
const rota_mapeada = new Rotas();

async function navegarPara(rota) {
  console.log(rota);
  const html = await rota_mapeada.getPage(rota);
  document.querySelector('#app').innerHTML = html;
}
window.addEventListener('hashchange', async () => {
  const rota = window.location.hash.replace('#', '/');
  await navegarPara(rota);
});

navegarPara('/listar_menu');
