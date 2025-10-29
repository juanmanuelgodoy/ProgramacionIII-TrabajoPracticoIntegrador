import express from "express";
import { check } from "express-validator";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();
const ctrl = new UsuariosControlador();

// ==============================
// LISTAR TODOS (solo admin)
// ==============================
router.get("/", autorizarUsuarios([1]), ctrl.buscarTodos);

// ==============================
// VER DETALLE (admin/empleado/cliente propio)
// ==============================
router.get("/:usuario_id", autorizarUsuarios([1, 2, 3]), ctrl.buscarPorId);

// ==============================
// CREAR (solo admin)
// ==============================
router.post(
  "/",
  autorizarUsuarios([1]),
  [
    check("nombre").notEmpty(),
    check("apellido").notEmpty(),
    check("nombre_usuario").notEmpty(),
    check("contrasenia").isLength({ min: 6 }),
    check("tipo_usuario").isInt({ min: 1, max: 3 }),
    validarCampos,
  ],
  ctrl.crear
);

// ==============================
// MODIFICAR (solo admin)
// ==============================
router.put(
  "/:usuario_id",
  autorizarUsuarios([1]),
  [
    check("nombre").optional().notEmpty(),
    check("apellido").optional().notEmpty(),
    check("nombre_usuario").optional().notEmpty(),
    check("contrasenia").optional().isLength({ min: 6 }),
    check("tipo_usuario").optional().isInt({ min: 1, max: 3 }),
    validarCampos,
  ],
  ctrl.modificar
);

// ==============================
// ELIMINAR (solo admin)
// ==============================
router.delete("/:usuario_id", autorizarUsuarios([1]), ctrl.eliminar);

// ==============================
// REINICIO DE CONTRASEÑA (solo admin)
// ==============================
router.put(
  "/:usuario_id/reiniciar",
  autorizarUsuarios([1]),   // Solo ADMIN puede reiniciar clave
  ctrl.reiniciarContrasenia
);

export { router };

