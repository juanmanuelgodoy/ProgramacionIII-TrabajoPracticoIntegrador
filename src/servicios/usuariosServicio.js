import Usuarios from "../db/usuarios.js";
import NotificacionesService from "./notificacionesServicio.js";
import crypto from "crypto";

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
    this.notificaciones = new NotificacionesService(); // para enviar emails
  }

  // =========================
  // LISTAR TODOS (ADMIN)
  // =========================
  buscarTodos = () => {
    return this.usuarios.buscarTodos();
  };

  // ==========================================================
  // BUSCAR POR ID (admin/empleado cualquiera; cliente opcional)
  // ==========================================================
  buscarPorId = async (usuario_id, usuarioActual = null) => {
    const u = await this.usuarios.buscarPorId(usuario_id);
    if (!u) return null;
    // acá podrías validar contra usuarioActual si querés restringir a clientes
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
    return ok; // true/false
  };

  // =========================
  // GENERAR CONTRASEÑA TEMPORAL (sin TMP, sin cambios de BD)
  // =========================
  emitirContraseniaTemporal = async (usuario_id) => {
    const u = await this.usuarios.buscarPorId(usuario_id);
    if (!u) return false;

    // temporal legible de 10 caracteres
    const temporal = "Prog3DW"

    // guarda SHA2(temporal) en DB
    const ok = await this.usuarios.actualizarContrasenia(usuario_id, temporal);
    if (!ok) return false;

    // envía email con la temporal
    await this.notificaciones.enviarCorreoConContraseniaTemporal({
      destino: u.nombre_usuario, // ajusta si tu campo email se llama distinto
      contraseniaTemporal: temporal,
    });

    return true;
  };

  // =========================
  // CAMBIAR CONTRASEÑA DEFINITIVA (logueado)
  // =========================
  cambiarContraseniaDefinitiva = async (usuario_id, actual, nueva) => {
    if (!actual || !nueva) return false;
    // cambio atómico: valida actual y setea nueva (ambas SHA2 en SQL)
    return this.usuarios.cambiarConContraseniaActual(usuario_id, actual, nueva);
  };

  // =========================
  // LOGIN (usado por AuthControlador) — SIN TMP
  // =========================
  buscar = async (nombre_usuario, contrasenia) => {
    // usa el método que ya tenés en db/usuarios.js (valida SHA2 en SQL)
    const u = await this.usuarios.buscar(nombre_usuario, contrasenia);
    if (!u) return null;

    // compatibilidad con tu front (si mostrás esta bandera)
    u.must_change_password = false;
    return u;
  };
}

