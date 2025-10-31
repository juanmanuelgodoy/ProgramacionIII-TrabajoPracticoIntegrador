import crypto from "crypto";
import Usuarios from "../db/usuarios.js";
import NotificacionesService from "./notificacionesServicio.js";

const TOKEN_MINUTOS = 60; // duración del enlace
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export default class UsuariosServicio {
  constructor() {
    this.usuarios = new Usuarios();
    this.notificaciones = new NotificacionesService(); // para enviar emails
  }

  // =========================
  // Login (lo que ya usabas)
  // =========================
  buscar = (nombre_usuario, contrasenia) => {
    return this.usuarios.buscar(nombre_usuario, contrasenia);
  };

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

    // Si querés bloquear que un cliente vea a otro, descomenta:
    // if (usuarioActual?.tipo_usuario === 3 && Number(usuario_id) !== usuarioActual.usuario_id) return null;

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
    if (!existe) return null; // 404
    const ok = await this.usuarios.eliminar(usuario_id);
    return ok; // true/false
  };

  // ==========================================================
  // AUTENTICADO: generar y enviar link de reinicio para mí
  // ==========================================================
  generarYEnviarLinkReinicioParaUsuario = async (usuario_id) => {
    console.log("[SRV generarYEnviarLink] usuario_id recibido:", usuario_id);
    const usuario = await this.usuarios.buscarPorId(usuario_id);
    console.log("[SRV generarYEnviarLink] usuario encontrado:", usuario?.usuario_id, usuario?.nombre_usuario);
    if (!usuario) {
    console.warn("[SRV generarYEnviarLink] NO existe el usuario_id:", usuario_id);
    return true;
  }

  return this.#generarTokenYEnviar(usuario.usuario_id, usuario.nombre_usuario);
};

  // ===========================================
  // Confirmar cambio de contraseña con token
  // ===========================================
  cambiarContraseniaConToken = async (tokenPlano, nuevaPlano) => {
    if (!tokenPlano || !nuevaPlano) return false;

    const tokenHash = crypto.createHash("sha256").update(tokenPlano).digest();
    const reset = await this.usuarios.buscarResetPorTokenHash(tokenHash);
    if (!reset) return false;

    const ahora = new Date();
    const expira = new Date(reset.expira_en);
    if (reset.usado || expira < ahora) return false;

    const ok = await this.usuarios.actualizarContrasenia(reset.usuario_id, nuevaPlano);
    if (!ok) return false;

    await this.usuarios.marcarResetComoUsado(reset.reset_id);
    return true;
  };

  // ===========================================
  // Privado: genera token, persiste y envía mail
  // ===========================================
#generarTokenYEnviar = async (usuario_id, emailDestino) => {
  console.log("[SRV generarToken] Generando token para:", usuario_id, "destino:", emailDestino);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest();
  const expira = new Date(Date.now() + TOKEN_MINUTOS * 60 * 1000);

  await this.usuarios.invalidarTokensUsuario(usuario_id);
  await this.usuarios.crearResetToken({ usuario_id, token_hash: tokenHash, expira_en: expira });

  const url = `${APP_URL}/reset-password.html?token=${token}`;
  console.log("[SRV generarToken] URL generada:", url);

  try {
    await this.notificaciones.enviarCorreoResetLink({ destino: emailDestino, url, minutos: TOKEN_MINUTOS });
  } catch (e) {
    console.warn("[RESET] Envío de correo falló:", e?.message);
  }
  return true;
};
}
