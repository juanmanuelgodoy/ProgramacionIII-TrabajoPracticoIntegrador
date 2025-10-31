import UsuariosServicio from "../servicios/usuariosServicio.js";
import NotificacionesService from "../servicios/notificacionesServicio.js";

export default class UsuariosControlador {
  constructor() {
    this.usuariosServicio = new UsuariosServicio();
    this.notificacionesService = new NotificacionesService();
  }

  // ==============================
  // LISTAR TODOS (solo admin)
  // ==============================
  buscarTodos = async (req, res) => {
    try {
      const datos = await this.usuariosServicio.buscarTodos();
      res.json({ estado: true, datos });
    } catch (err) {
      console.log("Error en GET /usuarios", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // ==============================
  // BUSCAR POR ID (admin, empleado o cliente propio)
  // ==============================
  buscarPorId = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const usuario = await this.usuariosServicio.buscarPorId(usuario_id, req.user);

      if (!usuario) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Usuario no encontrado." });
      }

      res.json({ estado: true, usuario });
    } catch (err) {
      console.log("Error en GET /usuarios/:usuario_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // ==============================
  // CREAR USUARIO (solo admin)
  // ==============================
  crear = async (req, res) => {
    try {
      const nuevo = await this.usuariosServicio.crear(req.body);

      if (!nuevo) {
        return res
          .status(400)
          .json({ estado: false, mensaje: "No se pudo crear el usuario." });
      }

      res.json({ estado: true, mensaje: "¡Usuario creado!", usuario: nuevo });
    } catch (err) {
      console.log("Error en POST /usuarios", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // ==============================
  // MODIFICAR USUARIO (solo admin)
  // ==============================
  modificar = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const datos = req.body;

      const modificado = await this.usuariosServicio.modificar(usuario_id, datos);

      if (!modificado) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Usuario no encontrado para ser modificado." });
      }

      res.json({
        estado: true,
        mensaje: "¡Usuario modificado!",
        usuario: modificado,
      });
    } catch (err) {
      console.log("Error en PUT /usuarios/:usuario_id =>", err?.code, err?.sqlMessage);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // ==============================
  // ELIMINAR USUARIO (solo admin)
  // ==============================
  eliminar = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const ok = await this.usuariosServicio.eliminar(usuario_id);

      if (ok === null) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Usuario no encontrado." });
      }

      if (!ok) {
        return res
          .status(500)
          .json({ estado: false, mensaje: "No se pudo eliminar el usuario." });
      }

      res.json({ estado: true, mensaje: "¡Usuario eliminado!" });
    } catch (err) {
      console.log("Error en DELETE /usuarios/:usuario_id =>", err?.code, err?.sqlMessage);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };


  // POST /usuarios/reinicio/solicitar-mi-link  (autenticado)
  solicitarReinicioParaMi = async (req, res) => {
    try {
      const usuarioId = req.user?.uid;
      console.log("[CTRL reinicio/solicitar-mi-link] uid en JWT:", usuarioId, "tipo:", req.user?.tipo_usuario);
      await this.usuariosServicio.generarYEnviarLinkReinicioParaUsuario(usuarioId);
      return res.json({
        estado: true,
        mensaje:
          "Si tu correo está configurado, vas a recibir un enlace para restablecer la contraseña.",
      });
    } catch (err) {
      console.error("[reinicio/solicitar-mi-link] ERROR:", err?.message);
      return res
        .status(500)
        .json({ estado: false, mensaje: "Error procesando la solicitud." });
    }
  };

  // POST /usuarios/reinicio/confirmar  (público)
  confirmarReinicio = async (req, res) => {
    try {
      const { token, nueva_contrasenia } = req.body;
      const ok = await this.usuariosServicio.cambiarContraseniaConToken(
        token,
        nueva_contrasenia
      );
      if (!ok) {
        return res.status(400).json({
          estado: false,
          mensaje: "Token inválido, vencido o ya utilizado.",
        });
      }
      return res.json({
        estado: true,
        mensaje: "Tu contraseña fue actualizada correctamente.",
      });
    } catch (err) {
      console.error("[reinicio/confirmar] ERROR:", err?.message);
      return res
        .status(500)
        .json({ estado: false, mensaje: "Error procesando el cambio." });
    }
  };
}


