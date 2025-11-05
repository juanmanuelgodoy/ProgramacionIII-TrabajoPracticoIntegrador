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


// ======================================================
  // POST /usuarios/reinicio/solicitar-mi-link
  // (El usuario logueado solicita recibir una contraseña temporal)
  // ======================================================
  solicitarReinicioParaMi = async (req, res) => {
    try {
      const usuarioId = req.user?.uid;

      await this.usuariosServicio.emitirContraseniaTemporal(usuarioId);

      return res.json({
        estado: true,
        mensaje: "Si tu correo está registrado, recibirás una contraseña temporal.",
      });
    } catch (error) {
      console.error("[solicitarReinicioParaMi] ERROR:", error?.message);
      return res.status(500).json({
        estado: false,
        mensaje: "Error procesando la solicitud.",
      });
    }
  };

  // ======================================================
  // PUT /usuarios/cambiar-contrasenia
  // (El usuario logueado cambia su contraseña)
  // ======================================================
cambiarContraseniaDefinitiva = async (req, res) => {
  try {
    const usuarioId = req.user?.uid ?? req.user?.usuario_id;
    const { actual_contrasenia, nueva_contrasenia } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ estado:false, mensaje:"No autenticado" });
    }

    const ok = await this.usuariosServicio.cambiarContraseniaDefinitiva(
      usuarioId,
      actual_contrasenia,
      nueva_contrasenia
    );

    if (!ok) {
      return res.status(400).json({
        estado: false,
        mensaje: "Contraseña actual incorrecta o no se pudo actualizar.",
      });
    }

    return res.json({ estado: true, mensaje: "Contraseña actualizada correctamente." });
  } catch (e) {
    console.error("[cambiarContrasenia] ERROR:", e?.message);
    return res.status(500).json({ estado: false, mensaje: "Error interno." });
  }
};
}


