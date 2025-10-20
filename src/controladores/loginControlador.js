import { conexion } from "../db/conexion.js";
import bcrypt from "bcryptjs";
import { generarToken } from "../middlewares/auth.js";

export default class LoginControlador {
  login = async (req, res) => {
    try {
      const { nombre_usuario, contrasenia } = req.body;

      const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1";
      const [rows] = await conexion.execute(sql, [nombre_usuario]);
      if (rows.length === 0)
        return res.status(401).json({ mensaje: "Usuario no encontrado" });

      const usuario = rows[0];

      // Si todavía no usás contraseñas encriptadas:
      if (usuario.contrasenia !== contrasenia) {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }

      // Si más adelante las encriptás con bcrypt:
      // const esValido = await bcrypt.compare(contrasenia, usuario.contrasenia);

      const token = generarToken(usuario);

      res.json({
        mensaje: "Login exitoso",
        token,
        usuario: {
          id: usuario.usuario_id,
          nombre: usuario.nombre,
          tipo_usuario: usuario.tipo_usuario,
        },
      });
    } catch (err) {
      console.error("Error en login:", err);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };
}

