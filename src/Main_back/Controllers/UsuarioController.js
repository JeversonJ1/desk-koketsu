import Usuarios from '../Models/Usuarios.js';
import bcrypt from 'bcryptjs';

class UsuarioController {
    constructor() {
        this.usuarioModel = new Usuarios();
    }

    async listar() {
        const dados = await this.usuarioModel.listar();
        return dados;
    }

    async cadastrar(usuario) {
        // mínimo: nome obrigatório. idade pode ser opcional.
        if (!usuario || !usuario.nome) {
            console.log('usuario:cadastrar -> validação falhou, payload:', usuario);
            return false;
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
            return resultado;
        } catch (err) {
            console.error('usuario:cadastrar -> erro ao cadastrar', err);
            return false;
        }
    }

    async buscarUsuarioPorId(uuid) {
        const usuario = await this.usuarioModel.buscarporid(uuid);
        return usuario;
    }

    async login({ nome, senha }) {
        if (!nome || !senha) return { success: false, message: 'Nome e senha são obrigatórios' };
        const usuario = await this.usuarioModel.buscarPorNome(nome);
        if (!usuario) return { success: false, message: 'Usuário não encontrado' };
        // comparar hash
        const match = usuario.senha ? bcrypt.compareSync(senha, usuario.senha) : false;
        if (!match) return { success: false, message: 'Senha inválida' };
        // remover senha antes de retornar
        const { senha: _s, ...rest } = usuario;
        return { success: true, user: rest };
    }

    async atualizarusuario(usuario) {
        // Verifica UUID e pelo menos um campo para atualizar
        if (!usuario || !usuario.uuid) return false;
        // se senha foi passada, hash
        if (usuario.senha) {
            usuario.senha = bcrypt.hashSync(String(usuario.senha), 8);
        }
        const resultado = await this.usuarioModel.atualizar(usuario);
        return resultado > 0;
    }

    async removerUsuario(uuid) {
        const usuarioExistente = await this.usuarioModel.buscarporid(uuid);
        if (!usuarioExistente) {
            return false;
        }

        const resultado = this.usuarioModel.remover(usuarioExistente);
        return resultado;
    }
}
export default UsuarioController;