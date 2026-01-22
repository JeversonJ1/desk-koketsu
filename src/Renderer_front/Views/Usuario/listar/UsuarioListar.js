import UsuariosView from "../UsuariosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class UsuarioListar {
    constructor() {
        this.view = new UsuariosView();
        this.mensagem = new MensagemDeAlerta();
    }

    async renderizarLista() {
        const res = await window.api.listarUsuarios();
        const dados = res && res.success ? (Array.isArray(res.data) ? res.data : []) : [];
        console.log('dados na usuario lista', dados);
        setTimeout(() => {
            this.adicionarEventos();
        }, 0);
        return this.view.renderizarLista(dados);
    }

    adicionarEventos() {
        const btnfechar = document.getElementById("fechar");
        if (btnfechar) btnfechar.addEventListener('click', () => {
            this.view.fecharModal();
        });

        const container = document.getElementById('container');
        if (container) {
            container.addEventListener('click', async (e) => {
                const idUsuario = e.target.getAttribute('data-id');
                console.log(e);
                if (e.target.classList.contains('editar-user')) {
                    console.log('editar usuario id:', idUsuario);
                    const res = await window.api.buscarUsuario(idUsuario);
                    const usuario = res && res.success && res.data ? res.data : null;
                    const id = document.getElementById("id");
                    const nome = document.getElementById("nome");
                    const idade = document.getElementById("idade");
                    if (usuario) {
                        if (id) id.value = usuario.uuid || usuario.id || '';
                        if (nome) nome.value = usuario.nome || '';
                        if (idade) idade.value = usuario.idade || '';
                        this.view.abrirModal();
                    } else {
                        this.mensagem.erro('Usuário não encontrado.');
                    }
                }

                if (e.target.classList.contains('excluir-user')) {
                    const payload = { uuid: idUsuario, actor: (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; } })() };
                    const res = await window.api.removerUsuario(payload);
                    if (res && res.success) {
                        this.mensagem.sucesso("Excluido com sucesso!");
                        setTimeout(async () => {
                            const app = document.getElementById("app");
                            if (app) app.innerHTML = await this.renderizarLista();
                        }, 1500);
                    } else {
                        if (res && res.error === 'permission') {
                            this.mensagem.erro('Ação negada: permissões insuficientes.');
                        } else {
                            const msg = res && res.error ? res.error : 'Erro ao excluir!';
                            this.mensagem.erro(msg);
                        }
                    }
                }

                if (e.target.classList.contains("close")) {
                    this.view.fecharModal();
                }
            });
        }

        const formulario = document.getElementById('form-formulario');
        if (formulario) {
            formulario.addEventListener('submit', async (event) => {
                event.preventDefault();
                const id = document.getElementById('id');
                const nome = document.getElementById('nome');
                const idade = document.getElementById('idade');
                const senha = document.getElementById('senha');
                const role = document.getElementById('role');
                const usuario = {
                    uuid: id ? id.value : undefined,
                    nome: nome ? nome.value : undefined,
                    idade: idade && idade.value ? Number(idade.value) : null,
                    senha: senha && senha.value ? senha.value : undefined,
                    role: role && role.value ? role.value : undefined,
                };

                // incluir actor (usuário que está solicitando a alteração) para validação no main
                usuario.actor = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; } })();

                const res = await window.api.atualizarUsuario(usuario);
                if (res && res.success) {
                    // fechar modal e recarregar lista
                    this.view.fecharModal();
                    this.mensagem.sucesso("Atualizado com sucesso!");
                    setTimeout(async () => {
                        const app = document.getElementById("app");
                        if (app) app.innerHTML = await this.renderizarLista();
                    }, 500);
                } else {
                    if (res && res.error === 'permission') {
                        this.mensagem.erro('Ação negada: permissões insuficientes.');
                    } else {
                        const msg = res && res.error ? res.error : 'Erro ao atualizar!';
                        this.mensagem.erro(msg);
                    }
                }
            });
        }
    }
}

export default UsuarioListar;
