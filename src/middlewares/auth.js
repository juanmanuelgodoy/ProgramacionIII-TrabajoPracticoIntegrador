import jwt from "jsonwebtoken";

export const generarToken = (usuario) => {
  return jwt.sign(
    {
      uid: usuario.usuario_id,
      tipo_usuario: usuario.tipo_usuario, // 1=admin, 2=empleado, 3=cliente
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

export const validarJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no encontrado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { uid, tipo_usuario }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.tipo_usuario)) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }
    next();
  };
};

