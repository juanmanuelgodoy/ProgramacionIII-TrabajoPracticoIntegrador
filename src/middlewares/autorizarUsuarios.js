import passport from "passport";

export default function autorizarUsuarios(perfilesPermitidos = []) {
  return [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      console.log("perfilesPermitidos (raw):", perfilesPermitidos);
      const permitidosNum = perfilesPermitidos.map(r => Number(r)).filter(r => !Number.isNaN(r));
      console.log("perfilesPermitidos (num):", permitidosNum);

      const usuario = req.user;
      if (!usuario) {
        console.log("autorizarUsuarios: req.user está vacío -> 401");
        return res.status(401).json({ estado: false, mensaje: "No autenticado." });
      }

      console.log("req.user (payload JWT):", usuario);
      const rol = Number(usuario.tipo_usuario);
      console.log("rol del token (num):", rol);

      if (!permitidosNum.includes(rol)) {
        console.log("autorizarUsuarios: rol NO permitido -> 403");
        return res.status(403).json({ estado: false, mensaje: "Acceso denegado." });
      }

      next();
    },
  ];
}


