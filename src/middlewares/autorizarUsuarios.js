import passport from "passport";

/**
 * 1=admin, 2=empleado, 3=cliente
 * Usa JWT para autenticar y luego verifica el rol.
 */
export default function autorizarUsuarios(perfilesPermitidos = []) {
  return [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      const usuario = req.user;
      if (!usuario) {
        return res.status(401).json({ estado: false, mensaje: "No autenticado." });
      }
      if (!perfilesPermitidos.includes(usuario.tipo_usuario)) {
        return res.status(403).json({ estado: false, mensaje: "Acceso denegado." });
      }
      next();
    },
  ];
}

