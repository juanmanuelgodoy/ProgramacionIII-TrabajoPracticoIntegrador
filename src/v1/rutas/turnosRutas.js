import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import TurnosControlador from "../../controladores/turnosControlador.js";

const router = express.Router();
const ctrl = new TurnosControlador();

const HHMM = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: CRUD de turnos
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Listar turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Listado de turnos
 */
router.get("/", autorizarUsuarios([1, 2, 3]), ctrl.buscarTodos);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   get:
 *     summary: Obtener turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema: { type: integer, example: 2 }
 *     responses:
 *       200:
 *         description: Turno encontrado
 */
router.get("/:turno_id", autorizarUsuarios([1, 2, 3]), ctrl.buscarPorId);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear turno (admin/empleado)
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orden, hora_desde, hora_hasta]
 *             properties:
 *               orden: { type: integer, example: 1 }
 *               hora_desde: { type: string, example: "12:00" }
 *               hora_hasta: { type: string, example: "14:00" }
 *     responses:
 *       200:
 *         description: Turno creado
 */
router.post("/",
  autorizarUsuarios([1, 2]),
  [
    check("orden", "El orden debe ser entero >= 1.").isInt({ min: 1 }),
    check("hora_desde", "Formato HH:MM.").matches(HHMM),
    check("hora_hasta", "Formato HH:MM.").matches(HHMM),
    validarCampos
  ],
  ctrl.crear
);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   put:
 *     summary: Actualizar turno (admin/empleado)
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema: { type: integer, example: 2 }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden: { type: integer }
 *               hora_desde: { type: string }
 *               hora_hasta: { type: string }
 *     responses:
 *       200:
 *         description: Turno actualizado
 */
router.put("/:turno_id",
  autorizarUsuarios([1, 2]),
  [
    check("orden").optional().isInt({ min: 1 }),
    check("hora_desde").optional().matches(HHMM),
    check("hora_hasta").optional().matches(HHMM),
    validarCampos
  ],
  ctrl.actualizar
);

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   delete:
 *     summary: Eliminar turno (admin/empleado)
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema: { type: integer, example: 2 }
 *     responses:
 *       200:
 *         description: Turno eliminado
 */
router.delete("/:turno_id", autorizarUsuarios([1, 2]), ctrl.eliminar);

export { router };



