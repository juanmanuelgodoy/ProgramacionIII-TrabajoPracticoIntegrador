import Usuarios from "../db/usuariosDb.js";

export default class UsuariosServicio {
    constructor() {
        this.usuarios = new Usuarios();
    }

    // GET: obtener todos los usuarios
    buscarTodos = async () => {
        return this.usuarios.buscarTodos();
    };

    // GET: obtener usuario por ID
    buscarPorId = async (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    };

    // POST: crear nuevo usuario
    crear = async (data) => {
        return this.usuarios.crear(data);
    };

    // PUT: editar usuario
    editar = async (usuario_id, data) => {
        return this.usuarios.editar(usuario_id, data);
    };

    // DELETE: borrar usuario
    borrar = async (usuario_id) => {
        return this.usuarios.borrar(usuario_id);
    };
    
}
