import Usuarios from "../db/usuarios.js";

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
  }

  // Login (lo que ya usabas)
  buscar = (nombre_usuario, contrasenia) => {
    return this.usuarios.buscar(nombre_usuario, contrasenia);
  };

  // LISTAR TODOS (ADMIN)
  buscarTodos = () => {
    return this.usuarios.buscarTodos();
  };

  // BUSCAR POR ID (admin/empleado cualquiera; cliente puede restringirse aquí si querés)
  buscarPorId = async (usuario_id, usuarioActual = null) => {
    const u = await this.usuarios.buscarPorId(usuario_id);
    if (!u) return null;

    // Si querés impedir que un cliente vea a otro, descomentá:
    // if (usuarioActual?.tipo_usuario === 3 && Number(usuario_id) !== usuarioActual.usuario_id) return null;

    return u;
  };

  // CREAR (ADMIN)
  crear = (datos) => {
    return this.usuarios.crear(datos);
  };

  // MODIFICAR (ADMIN)
  modificar = async (usuario_id, datos) => {
    const existe = await this.usuarios.buscarPorId(usuario_id);
    if (!existe) return null;
    return this.usuarios.modificar(usuario_id, datos);
  };

  // ELIMINAR (ADMIN) – soft delete
  eliminar = async (usuario_id) => {
    const existe = await this.usuarios.buscarPorId(usuario_id);
    if (!existe) return null;      // 404
    const ok = await this.usuarios.eliminar(usuario_id);
    return ok;                     // true/false
  };
}

