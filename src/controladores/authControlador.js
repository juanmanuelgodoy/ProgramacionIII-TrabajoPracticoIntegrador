import UsuariosServicio from "../servicios/usuariosServicio.js";
import jwt from "jsonwebtoken";

export default class AuthControlador {
  constructor() {
    this.usuariosServicio = new UsuariosServicio();
  }

  login = async (req, res) => {
    try {
      const { nombre_usuario, contrasenia } = req.body;
      const usuario = await this.usuariosServicio.buscar(nombre_usuario, contrasenia);
      if (!usuario) {
        return res.status(401).json({ estado: false, mensaje: "Credenciales inválidas." });
      }

      const token = jwt.sign(
        { uid: usuario.usuario_id, tipo_usuario: usuario.tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      // Devolvés el usuario tal cual (incluye must_change_password si viene de DB)
      return res.json({ estado: true, token, usuario });
    } catch (err) {
      console.error("[AUTH] ERROR:", err?.message);
      return res.status(500).json({ estado: false, mensaje: "Error interno." });
    }
  };
}
