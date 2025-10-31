import express from 'express';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import SalonesControlador from '../../controladores/salonesControlador.js';

const router = express.Router();
const cache = apicache.middleware;
const salonesControlador = new SalonesControlador();

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: CRUD de salones
 */

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     summary: Listar salones
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Listado de salones
 */
router.get(
  '/',
  autorizarUsuarios([1, 2, 3]),
  cache('5 minutes'),
  salonesControlador.buscarTodos
);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   get:
 *     summary: Obtener salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Salón encontrado
 */
router.get(
  '/:salon_id',
  autorizarUsuarios([1, 2, 3]),
  salonesControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     summary: Crear salón (admin/empleado)
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, direccion, capacidad, importe]
 *             properties:
 *               titulo: { type: string, example: "Fiestaleza Kids - Sucursal Centro" }
 *               direccion: { type: string, example: "San Martín 123" }
 *               capacidad: { type: integer, example: 40 }
 *               importe: { type: number, example: 250000 }
 *     responses:
 *       200:
 *         description: Salón creado
 */
router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('titulo', 'El título es necesario.').notEmpty(),
    check('direccion', 'La dirección es necesaria.').notEmpty(),
    check('capacidad', 'La capacidad es necesaria.').isInt({ min: 1 }),
    check('importe', 'El importe es necesario.').isFloat({ gt: 0 }),
    validarCampos,
  ],
  salonesControlador.crear
);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   put:
 *     summary: Modificar salón (admin/empleado)
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               direccion: { type: string }
 *               capacidad: { type: integer }
 *               importe: { type: number }
 *     responses:
 *       200:
 *         description: Salón modificado
 */
router.put(
  '/:salon_id',
  autorizarUsuarios([1, 2]),
  [
    check('titulo').optional().notEmpty(),
    check('direccion').optional().notEmpty(),
    check('capacidad').optional().isInt({ min: 1 }),
    check('importe').optional().isFloat({ gt: 0 }),
    validarCampos,
  ],
  salonesControlador.modificar
);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   delete:
 *     summary: Eliminar salón (baja lógica) (admin/empleado)
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Salón eliminado
 */
router.delete(
  '/:salon_id',
  autorizarUsuarios([1, 2]),
  salonesControlador.eliminar
);

export { router };


