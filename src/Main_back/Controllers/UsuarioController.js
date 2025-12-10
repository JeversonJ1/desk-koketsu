import { createRequire } from 'node:module';
import path from 'node:path';
import bcrypt from 'bcryptjs';

class UsuarioController {
    // permite injetar um model fake para testes
    constructor(model) {
        if (model) {
            this.usuarioModel = model;
        } else {
            // carregar o model só quando necessário (evita carregar módulos nativos em testes)
            const require = createRequire(import.meta.url);
            let Usuarios;
            try {
                // tentativa padrão (funciona em dev e quando os paths são preservados)
                Usuarios = require('../Models/Usuarios.js').default;
            } catch (err) {
                // fallback: ao rodar a build o arquivo bundlado pode alterar o __filename/baseURI,
                // então tentamos carregar pelo caminho absoluto do projeto para garantir.
                const alt = path.join(process.cwd(), 'src', 'Main_back', 'Models', 'Usuarios.js');
                Usuarios = require(alt).default;
            }
            this.usuarioModel = new Usuarios();
        }
    }

    async listar() {
        try {
            const dados = await this.usuarioModel.listar();
            return { success: true, data: dados };
        } catch (err) {
            console.error('UsuarioController.listar -> erro', err);
            return { success: false, error: String(err) };
        }
    }

    async cadastrar(usuario) {
        // mínimo: nome obrigatório. idade pode ser opcional.
        if (!usuario || !usuario.nome) {
            console.log('usuario:cadastrar -> validação falhou, payload:', usuario);
            return { success: false, error: 'Nome é obrigatório' };
        }
        try {
            // hash da senha se fornecida
            if (usuario.senha) {
                usuario.senha = bcrypt.hashSync(String(usuario.senha), 8);
            }
            usuario.role = usuario.role || 'vendedor';
            console.log('usuario:cadastrar -> recebendo:', { nome: usuario.nome, idade: usuario.idade, role: usuario.role });
            const resultado = this.usuarioModel.adicionar(usuario);
            console.log('usuario:cadastrar -> resultado model:', resultado);
            if (resultado && resultado.success) return { success: true, data: resultado };
            return { success: false, error: resultado && resultado.error ? resultado.error : 'Erro ao cadastrar' };
        } catch (err) {
            console.error('usuario:cadastrar -> erro ao cadastrar', err);
            return { success: false, error: String(err) };
        }
    }

    async buscarUsuarioPorId(uuid) {
        try {
            const usuario = await this.usuarioModel.buscarporid(uuid);
            if (!usuario) return { success: false, error: 'Usuário não encontrado' };
            return { success: true, data: usuario };
        } catch (err) {
            console.error('UsuarioController.buscarUsuarioPorId -> erro', err);
            return { success: false, error: String(err) };
        }
    }

    async login({ nome, senha }) {
        if (!nome || !senha) return { success: false, error: 'Nome e senha são obrigatórios' };
        try {
            const usuario = await this.usuarioModel.buscarPorNome(nome);
            if (!usuario) return { success: false, error: 'Usuário não encontrado' };
            // comparar hash (model deve retornar senha para comparação)
            const match = usuario.senha ? bcrypt.compareSync(senha, usuario.senha) : false;
            if (!match) return { success: false, error: 'Senha inválida' };
            // remover senha antes de retornar ao cliente
            const { senha: _s, ...rest } = usuario;
            return { success: true, data: { user: rest } };
        } catch (err) {
            console.error('UsuarioController.login -> erro', err);
            return { success: false, error: String(err) };
        }
    }

    async atualizarusuario(usuario) {
        // Verifica UUID e pelo menos um campo para atualizar
        if (!usuario || !usuario.uuid) return { success: false, error: 'UUID é obrigatório' };
        try {
            // se senha foi passada, hash
            if (usuario.senha) {
                usuario.senha = bcrypt.hashSync(String(usuario.senha), 8);
            }
            const resultado = await this.usuarioModel.atualizar(usuario);
            if (resultado > 0) return { success: true, data: { changed: resultado } };
            return { success: false, error: 'Nenhuma alteração foi realizada' };
        } catch (err) {
            console.error('UsuarioController.atualizarusuario -> erro', err);
            return { success: false, error: String(err) };
        }
    }

    async removerUsuario(uuid) {
        try {
            const usuarioExistente = await this.usuarioModel.buscarporid(uuid);
            if (!usuarioExistente) return { success: false, error: 'Usuário não encontrado' };
            const resultado = this.usuarioModel.remover(usuarioExistente);
            if (resultado) return { success: true };
            return { success: false, error: 'Erro ao remover usuário' };
        } catch (err) {
            console.error('UsuarioController.removerUsuario -> erro', err);
            return { success: false, error: String(err) };
        }
    }
}
export default UsuarioController;