import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasControlador from '../../controladores/reservasControlador.js';

const reservasControlador = new ReservasControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: CRUD de reservas
 */

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Reserva encontrada
 */
router.get('/:reserva_id', autorizarUsuarios([1, 2, 3]), reservasControlador.buscarPorId);

/**
 * @swagger
 * /api/v1/reservas:
 *   get:
 *     summary: Listar reservas (según rol)
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Listado de reservas
 */
router.get('/', autorizarUsuarios([1, 2, 3]), reservasControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/reservas:
 *   post:
 *     summary: Crear una reserva (admin o cliente)
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha_reserva, salon_id, usuario_id, turno_id, servicios]
 *             properties:
 *               fecha_reserva: { type: string, format: date, example: "2025-10-12" }
 *               salon_id: { type: integer, example: 2 }
 *               usuario_id: { type: integer, example: 7 }
 *               turno_id: { type: integer, example: 3 }
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id: { type: integer, example: 4 }
 *                     importe: { type: number, example: 150000 }
 *               tematica: { type: string, example: "Mario Bros" }
 *     responses:
 *       200:
 *         description: Reserva creada
 */
router.post('/', autorizarUsuarios([1, 3]),
  [
    check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
    check('salon_id', 'El salón es necesario.').notEmpty(),
    check('usuario_id', 'El usuario es necesario.').notEmpty(),
    check('turno_id', 'El turno es necesario.').notEmpty(),
    check('servicios', 'Faltan los servicios de la reserva.')
      .notEmpty()
      .isArray(),
    check('servicios.*.importe')
      .isFloat()
      .withMessage('El importe debe ser numérico.'),
    validarCampos
  ],
  reservasControlador.crear);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   put:
 *     summary: Modificar una reserva (solo admin)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva: { type: string, format: date }
 *               salon_id: { type: integer }
 *               usuario_id: { type: integer }
 *               turno_id: { type: integer }
 *               foto_cumpleaniero: { type: string }
 *               tematica: { type: string }
 *               importe_salon: { type: number }
 *               importe_total: { type: number }
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id: { type: integer }
 *                     importe: { type: number }
 *     responses:
 *       200:
 *         description: Reserva modificada
 */
router.put(
  '/:reserva_id',
  autorizarUsuarios([1]),
  [
    check('fecha_reserva').optional().isISO8601().withMessage('fecha_reserva debe ser ISO8601 (YYYY-MM-DD)'),
    check('salon_id').optional().isInt({ min: 1 }),
    check('usuario_id').optional().isInt({ min: 1 }),
    check('turno_id').optional().isInt({ min: 1 }),
    check('foto_cumpleaniero').optional().isString(),
    check('tematica').optional().notEmpty(),
    check('importe_salon').optional().isFloat({ gt: 0 }),
    check('importe_total').optional().isFloat({ gt: 0 }),
    check('servicios').optional().isArray(),
    check('servicios.*.servicio_id').optional().isInt({ min: 1 }),
    check('servicios.*.importe').optional().isFloat({ gt: 0 }),
    validarCampos,
  ],
  reservasControlador.modificar
);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   delete:
 *     summary: Eliminar (baja lógica) una reserva (solo admin)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: Reserva eliminada
 */
router.delete('/:reserva_id', autorizarUsuarios([1]), reservasControlador.eliminar);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}/confirmar:
 *   put:
 *     summary: Confirmar una reserva (admin o empleado)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: Reserva confirmada
 */
router.put('/:reserva_id/confirmar', autorizarUsuarios([1, 2]), reservasControlador.confirmar);

export { router };
