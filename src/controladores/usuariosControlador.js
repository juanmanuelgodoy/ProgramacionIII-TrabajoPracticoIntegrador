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

  // ==============================
  // REINICIAR CONTRASEÑA (solo admin)
  // ==============================
  reiniciarContrasenia = async (req, res) => {
    try {
      const { usuario_id } = req.params;

      // 1) Reiniciar en DB -> retorna la nueva contraseña (string) o null/false
      const nuevaPass = await this.usuariosServicio.reiniciarContrasenia(usuario_id);

      if (nuevaPass === null) {
        return res.status(404).json({
          estado: false,
          mensaje: "Usuario no encontrado."
        });
      }

      if (nuevaPass === false) {
        return res.status(500).json({
          estado: false,
          mensaje: "No se pudo reiniciar la contraseña."
        });
      }

      // 2) Buscar usuario para obtener nombre y correo (en tu DB es nombre_usuario)
      const usuario = await this.usuariosServicio.buscarPorId(usuario_id, req.user);
      if (!usuario) {
        // Si por algún motivo no vuelve, informamos igual el reinicio
        console.warn("[REINICIO] Contraseña reiniciada pero no se pudo cargar el usuario para enviar email.");
        return res.json({
          estado: true,
          mensaje: "Contraseña reiniciada. (No se pudo enviar email por falta de datos del usuario)."
        });
      }

      // 3) Enviar email (no cortamos el flujo si falla el envío)
      try {
        await this.notificacionesService.enviarCorreoReinicio({
          usuario,       // debe tener nombre, apellido y nombre_usuario
          nuevaPass
        });
      } catch (mailErr) {
        console.error("[REINICIO] Falló envío de email:", mailErr?.message);
        // Respondemos 200 igualmente porque la contraseña sí se reinició
        return res.json({
          estado: true,
          mensaje: "Contraseña reiniciada. (Falló el envío de email)."
        });
      }

      // 4) OK total
      res.json({
        estado: true,
        mensaje: "Contraseña reiniciada. Se envió email al usuario."
      });

    } catch (err) {
      console.log("Error en PUT /usuarios/:usuario_id/reset =>", err?.code, err?.sqlMessage || err?.message);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };
}


