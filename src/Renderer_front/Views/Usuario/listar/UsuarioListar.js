import UsuariosView from "../UsuariosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class UsuarioListar {
    constructor() {
        this.view = new UsuariosView();
        this.mensagem = new MensagemDeAlerta();
    }

    async renderizarLista() {
        const dados = await window.api.listarUsuarios();
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
                    const usuario = await window.api.buscarUsuario(idUsuario);
                    const id = document.getElementById("id");
                    const nome = document.getElementById("nome");
                    const idade = document.getElementById("idade");
                    if (usuario) {
                        if (id) id.value = usuario.uuid || usuario.id || '';
                        if (nome) nome.value = usuario.nome || '';
                        if (idade) idade.value = usuario.idade || '';
                        this.view.abrirModal();
                    }
                }

                if (e.target.classList.contains('excluir-user')) {
                    const resultado = await window.api.removerUsuario(idUsuario);
                    if (resultado) {
                        this.mensagem.sucesso("Excluido com sucesso!");
                        setTimeout(async () => {
                            const app = document.getElementById("app");
                            if (app) app.innerHTML = await this.renderizarLista();
                        }, 1500);
                    } else {
                        this.mensagem.erro("Erro ao excluir!");
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

                const resultado = await window.api.atualizarUsuario(usuario);

                if (resultado) {
                    // fechar modal e recarregar lista
                    this.view.fecharModal();
                    this.mensagem.sucesso("Atualizado com sucesso!");
                    setTimeout(async () => {
                        const app = document.getElementById("app");
                        if (app) app.innerHTML = await this.renderizarLista();
                    }, 500);
                } else {
                    this.mensagem.erro("Erro ao atualizar!");
                }
            });
        }
    }
}

export default UsuarioListar;
