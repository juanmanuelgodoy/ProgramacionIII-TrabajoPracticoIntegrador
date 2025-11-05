import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn("[VALIDAR] errores:", errors.array());
    return res.status(400).json({
      estado: false,
      mensaje: "Solicitud incorrecta.",
      errores: errors.array(),
    });
  }
  next();
};

