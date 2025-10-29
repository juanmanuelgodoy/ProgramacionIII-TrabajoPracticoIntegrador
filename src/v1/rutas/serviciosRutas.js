import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import ServiciosControlador from "../../controladores/serviciosControlador.js";

const router = express.Router();
const ctrl = new ServiciosControlador();

// Lectura: todos los tipos
router.get("/",  autorizarUsuarios([1,2,3]), ctrl.buscarTodos);
router.get("/:servicio_id", autorizarUsuarios([1,2,3]), ctrl.buscarPorId);

// Alta/Modificación/Baja: admin o empleado
router.post("/",
  autorizarUsuarios([1,2]),
  [
    check("descripcion", "La descripción es obligatoria.").notEmpty(),
    check("importe", "El importe debe ser numérico.").isFloat({ gt: 0 }),
    validarCampos
  ],
  ctrl.crear
);

router.put("/:servicio_id",
  autorizarUsuarios([1,2]),
  [
    check("descripcion").optional().notEmpty(),
    check("importe").optional().isFloat({ gt: 0 }),
    validarCampos
  ],
  ctrl.actualizar
);

router.delete("/:servicio_id", autorizarUsuarios([1,2]), ctrl.eliminar);

export { router };


