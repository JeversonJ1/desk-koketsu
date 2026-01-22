import express from 'express';
import ProdutoController from './Controllers/ProdutoController.js';
import ServicoController from './Controllers/ServicoController.js';
import UsuarioController from './Controllers/UsuarioController.js';
import VendaController from './Controllers/VendaController.js';

// API local para modo offline
export function startApi(port = process.env.API_PORT || 3000) {
  const app = express();
  app.use(express.json());

  const produtoCtrl = new ProdutoController();
  const servicoCtrl = new ServicoController();
  const usuarioCtrl = new UsuarioController();
  const vendaCtrl = new VendaController();

  app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

  // Produtos
  app.get('/api/produtos', async (req, res) => {
    const dados = await produtoCtrl.listar();
    res.json(dados);
  });
  app.post('/api/produtos', async (req, res) => {
    const resultado = await produtoCtrl.cadastrar(req.body);
    res.json(resultado);
  });
  app.get('/api/produtos/:uuid', async (req, res) => {
    const dado = await produtoCtrl.buscar(req.params.uuid);
    res.json(dado);
  });
  app.put('/api/produtos/:uuid', async (req, res) => {
    const resultado = await produtoCtrl.atualizar(req.body);
    res.json(resultado);
  });
  app.delete('/api/produtos/:uuid', async (req, res) => {
    const resultado = await produtoCtrl.remover(req.params.uuid);
    res.json({ success: resultado });
  });

  // Serviços
  app.get('/api/servicos', async (req, res) => res.json(await servicoCtrl.listar()));
  app.post('/api/servicos', async (req, res) => res.json(await servicoCtrl.adicionar(req.body)));
  app.get('/api/servicos/:uuid', async (req, res) => res.json(await servicoCtrl.buscar(req.params.uuid)));
  app.put('/api/servicos/:uuid', async (req, res) => res.json(await servicoCtrl.atualizar(req.body)));
  app.delete('/api/servicos/:uuid', async (req, res) => res.json({ success: await servicoCtrl.remover(req.params.uuid) }));

  // Usuários
  app.post('/api/usuarios/login', async (req, res) => {
    const resultado = await usuarioCtrl.login(req.body);
    res.json(resultado);
  });
  app.post('/api/usuarios', async (req, res) => res.json(await usuarioCtrl.cadastrar(req.body)));
  app.get('/api/usuarios', async (req, res) => res.json(await usuarioCtrl.listar()));
  app.get('/api/usuarios/:uuid', async (req, res) => res.json(await usuarioCtrl.buscarUsuarioPorId(req.params.uuid)));
  app.put('/api/usuarios/:uuid', async (req, res) => res.json(await usuarioCtrl.atualizarusuario(req.body)));
  app.delete('/api/usuarios/:uuid', async (req, res) => res.json({ success: await usuarioCtrl.removerUsuario(req.params.uuid) }));

  // Vendas
  app.post('/api/vendas', async (req, res) => res.json(await vendaCtrl.criar(req.body)));
  app.get('/api/vendas', async (req, res) => res.json(await vendaCtrl.listar()));

  // criar server mas capturar erros como EADDRINUSE para evitar crash no processo
  const server = app.listen(port, () => {
    console.log(`API local iniciada em http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Porta ${port} já está em uso (EADDRINUSE). Tente outra porta ou pare o processo que a está usando.`);
    } else {
      console.error('Erro no servidor da API local:', err);
    }
  });

  // método utilitário para encerrar o server se necessário
  server.safeClose = function () {
    try {
      server.close();
    } catch (e) {
      // ignore
    }
  };

  // retorna o server para possibilidade de fechamento nos testes
  return server;
}

export default startApi;
