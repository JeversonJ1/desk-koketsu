import Usuarios from '../Models/Usuarios.js';

class UsuarioController {
    constructor() {
        this.usuarioModel = new Usuarios();
    }

    async listar() {
        const dados = await this.usuarioModel.listar();
        return dados;
    }

    async cadastrar(usuario) {
        if (!usuario.nome || !usuario.idade) {
            return false;
        }
        return this.usuarioModel.adicionar(usuario);
    }

    async buscarUsuarioPorId(uuid) {
        const usuario = await this.usuarioModel.buscarporid(uuid);
        return usuario;
    }

    async atualizarusuario(usuario) {
        // Verifica UUID em vez de ID, pois é o que usamos na query do Model agora
        if (!usuario.uuid || !usuario.nome || !usuario.idade) {
            return false;
        }
        
        // Agora chama o método com o nome correto
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