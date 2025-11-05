import Usuarios from "../db/usuarios.js";
import NotificacionesService from "./notificacionesServicio.js";

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
    this.notificaciones = new NotificacionesService(); 
  }

  // =========================
  // LISTAR TODOS (ADMIN)
  // =========================
  buscarTodos = () => {
    return this.usuarios.buscarTodos();
  };

  // ==========================================================
  // BUSCAR POR ID (admin/empleado)
  // ==========================================================
  buscarPorId = async (usuario_id, usuarioActual = null) => {
    const u = await this.usuarios.buscarPorId(usuario_id);
    if (!u) return null;
    
    return u;
  };

  // =========================
  // CREAR (ADMIN)
  // =========================
  crear = (datos) => {
    return this.usuarios.crear(datos);
  };

  // =========================
  // MODIFICAR (ADMIN)
  // =========================
  modificar = async (usuario_id, datos) => {
    const existe = await this.usuarios.buscarPorId(usuario_id);
    if (!existe) return null;
    return this.usuarios.modificar(usuario_id, datos);
  };

  // =========================
  // ELIMINAR (ADMIN) – soft delete
  // =========================
  eliminar = async (usuario_id) => {
    const existe = await this.usuarios.buscarPorId(usuario_id);
    if (!existe) return null;
    const ok = await this.usuarios.eliminar(usuario_id);
    return ok; 
  };

  // =========================
  // GENERAR CONTRASEÑA TEMPORAL
  // =========================
  emitirContraseniaTemporal = async (usuario_id) => {
    const u = await this.usuarios.buscarPorId(usuario_id);
    if (!u) return false;

    // temporal legible de 10 caracteres
    const temporal = "Prog3DW"

    const ok = await this.usuarios.actualizarContrasenia(usuario_id, temporal);
    if (!ok) return false;

    await this.notificaciones.enviarCorreoConContraseniaTemporal({
      destino: u.nombre_usuario, 
      contraseniaTemporal: temporal,
    });

    return true;
  };

  // =========================
  // CAMBIAR CONTRASEÑA DEFINITIVA (logueado)
  // =========================
  cambiarContraseniaDefinitiva = async (usuario_id, actual, nueva) => {
    if (!actual || !nueva) return false;

    return this.usuarios.cambiarConContraseniaActual(usuario_id, actual, nueva);
  };

  // =========================
  // LOGIN (usado por AuthControlador)
  // =========================
  buscar = async (nombre_usuario, contrasenia) => {

    const u = await this.usuarios.buscar(nombre_usuario, contrasenia);
    if (!u) return null;

    u.must_change_password = false;
    return u;
  };
}

