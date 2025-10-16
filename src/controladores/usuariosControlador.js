import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador {
    constructor() {
        this.usuariosServicio = new UsuariosServicio();
    }

    // GET /api/v1/usuarios
    buscarTodos = async (req, res) => {
        try {
            const usuarios = await this.usuariosServicio.buscarTodos();
            res.json({ estado: true, datos: usuarios });
        } catch (err) {
            console.log("Error con GET /usuarios", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // GET /api/v1/usuarios/:id
    buscarPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await this.usuariosServicio.buscarPorId(id);
            if (!usuario)
                return res.status(404).json({ estado: false, mensaje: "El usuario no existe." });
            res.json({ estado: true, datos: usuario });
        } catch (err) {
            console.log("Error con GET /usuarios/:id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // POST /api/v1/usuarios
    crear = async (req, res) => {
        try {
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;
            if (!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }
            const nuevo = await this.usuariosServicio.crear({
                nombre,
                apellido,
                nombre_usuario,
                contrasenia,
                tipo_usuario,
            });
            res.status(201).json({ estado: true, mensaje: "Usuario creado.", datos: nuevo });
        } catch (err) {
            console.log("Error con POST /usuarios", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // PUT /api/v1/usuarios/:usuario_id
    editar = async (req, res) => {
        try {
            const { usuario_id } = req.params;
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;
            if (!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }
            const actualizado = await this.usuariosServicio.editar(usuario_id, {
                nombre,
                apellido,
                nombre_usuario,
                contrasenia,
                tipo_usuario,
            });
            if (!actualizado)
                return res.status(404).json({ estado: false, mensaje: "El usuario no existe." });
            res.json({ estado: true, mensaje: "Usuario actualizado.", datos: actualizado });
        } catch (err) {
            console.log("Error con PUT /usuarios/:usuario_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // DELETE /api/v1/usuarios/:usuario_id
    borrar = async (req, res) => {
        try {
            const { usuario_id } = req.params;
            const ok = await this.usuariosServicio.borrar(usuario_id);
            if (!ok)
                return res.status(404).json({ estado: false, mensaje: "El usuario no existe." });
            res.json({ estado: true, mensaje: "Usuario eliminado." });
        } catch (err) {
            console.log("Error con DELETE /usuarios/:usuario_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };
}
