// src/v1/rutas/reservasRutas.js
import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { validarJWT, permitirRoles } from "../../middlewares/auth.js";
import ReservasControlador from "../../controladores/reservasControlador.js";

const router = Router();
const c = new ReservasControlador();

/**
 * CLIENTE (tipo_usuario = 3)
 * - Crear su reserva (usuario_id se toma del token en el controlador)
 * - Listar SOLO sus reservas
 */
router.post(
  "/",
  [
    validarJWT,
    permitirRoles(3),
    check("fecha_reserva", "La fecha es necesaria.").notEmpty(),
    check("salon_id", "El salón es necesario.").isInt().toInt(),
    check("turno_id", "El turno es necesario.").isInt().toInt(),
    check("servicios", "Faltan los servicios de la reserva.").isArray({ min: 1 }),
    check("servicios.*.servicio_id", "servicio_id es requerido.").isInt().toInt(),
    check("servicios.*.importe", "El importe debe ser numérico.").isFloat(),
    validarCampos,
  ],
  c.crear
);

router.get("/mias", validarJWT, permitirRoles(3), c.listarMias);

/**
 * EMPLEADO (2) o ADMIN (1)
 * - Ver TODAS las reservas
 */
router.get("/", validarJWT, permitirRoles(1, 2), c.buscarTodos);

/**
 * VER POR ID
 * - Todos autenticados (cliente, empleado, admin)
 */
router.get("/:reserva_id", validarJWT, permitirRoles(1, 2, 3), c.buscarPorId);

/**
 * SOLO ADMIN (1)
 * - Actualizar / Eliminar reservas
 */
router.put(
  "/:id",
  [
    validarJWT,
    permitirRoles(1),
    // agregá acá validaciones si tu update lo requiere
    validarCampos,
  ],
  c.actualizar
);

router.delete("/:id", validarJWT, permitirRoles(1), c.eliminar);

export default router;


