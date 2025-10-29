import Usuarios from "../db/usuarios.js";
import NotificacionesService from "./notificacionesServicio.js";

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
    this.notificaciones = new NotificacionesService(); // para enviar email de reinicio
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

    // Para impedir que un cliente vea a otro, descomentar:
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

  // =========================================================
  // REINICIAR CONTRASEÑA (solo ADMIN) -> Prog3DW + email
  // =========================================================
  reiniciarContrasenia = async (usuario_id) => {
    // 1) Verifico que exista
    const usuario = await this.usuarios.buscarPorId(usuario_id);
    if (!usuario) return null; // 404

    // 2) Actualizo la contraseña a "Prog3DW" (hash/transformación en DB si aplica)
    const nuevaPass = "Prog3DW";
    const ok = await this.usuarios.reiniciarContrasenia(usuario_id, nuevaPass);
    if (!ok) return false;

    // 3) Envío email al usuario con la contraseña temporal
    try {
      await this.notificaciones.enviarCorreoReinicio({
        usuario,
        nuevaPass, // <-- clave correcta que espera NotificacionesService
      });
    } catch (e) {
      console.log(
        "[RESET] Advertencia: no se pudo enviar email de reinicio.",
        e?.message
      );
    }

    // 4) Devolver la contraseña nueva (para que el controlador la tenga disponible)
    return nuevaPass;
  };
}

