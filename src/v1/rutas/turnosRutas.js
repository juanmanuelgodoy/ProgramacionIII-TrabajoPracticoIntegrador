import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import TurnosControlador from "../../controladores/turnosControlador.js";

const router = express.Router();
const ctrl = new TurnosControlador();

// Lectura
router.get("/",  autorizarUsuarios([1,2,3]), ctrl.buscarTodos);
router.get("/:turno_id", autorizarUsuarios([1,2,3]), ctrl.buscarPorId);

// ABM (admin o empleado)
const HHMM = /^\d{2}:\d{2}(:\d{2})?$/;

router.post("/",
  autorizarUsuarios([1,2]),
  [
    check("orden", "El orden debe ser entero >= 1.").isInt({ min: 1 }),
    check("hora_desde", "Formato HH:MM.").matches(HHMM),
    check("hora_hasta", "Formato HH:MM.").matches(HHMM),
    validarCampos
  ],
  ctrl.crear
);

router.put("/:turno_id",
  autorizarUsuarios([1,2]),
  [
    check("orden").optional().isInt({ min: 1 }),
    check("hora_desde").optional().matches(HHMM),
    check("hora_hasta").optional().matches(HHMM),
    validarCampos
  ],
  ctrl.actualizar
);

router.delete("/:turno_id", autorizarUsuarios([1,2]), ctrl.eliminar);

export { router };


