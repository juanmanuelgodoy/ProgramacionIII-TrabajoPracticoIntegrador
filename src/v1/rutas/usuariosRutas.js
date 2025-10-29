import express from "express";
import { check } from "express-validator";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();
const ctrl = new UsuariosControlador();

// Listado completo: solo admin
router.get("/", autorizarUsuarios([1]), ctrl.buscarTodos);

// Ver detalle: admin/empleado cualquiera; cliente propio (lo resuelve el servicio)
router.get("/:usuario_id", autorizarUsuarios([1,2,3]), ctrl.buscarPorId);

// Crear (ADMIN)
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

// Modificar (ADMIN)
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

// Eliminar (ADMIN) – soft delete
router.delete("/:usuario_id", autorizarUsuarios([1]), ctrl.eliminar);

export { router };
