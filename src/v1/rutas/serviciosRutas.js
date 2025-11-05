import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import ServiciosControlador from "../../controladores/serviciosControlador.js";

const router = express.Router();
const ctrl = new ServiciosControlador();

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: CRUD de servicios
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   get:
 *     summary: Listar servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Listado de servicios
 */
router.get("/", autorizarUsuarios([1, 2, 3]), ctrl.buscarTodos);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     summary: Obtener servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema: { type: integer, example: 3 }
 *     responses:
 *       200:
 *         description: Servicio encontrado
 */
router.get("/:servicio_id", autorizarUsuarios([1, 2, 3]), ctrl.buscarPorId);

/**
 * @swagger
 * /api/v1/servicios:
 *   post:
 *     summary: Crear servicio (admin/empleado)
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion, importe]
 *             properties:
 *               descripcion: { type: string, example: "Cotillón completo" }
 *               importe: { type: number, example: 75000 }
 *     responses:
 *       200:
 *         description: Servicio creado
 */
router.post("/",
  autorizarUsuarios([1, 2]),
  [
    check("descripcion", "La descripción es obligatoria.").notEmpty(),
    check("importe", "El importe debe ser numérico.").isFloat({ gt: 0 }),
    validarCampos
  ],
  ctrl.crear
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     summary: Actualizar servicio (admin/empleado)
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema: { type: integer, example: 3 }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion: { type: string }
 *               importe: { type: number }
 *     responses:
 *       200:
 *         description: Servicio actualizado
 */
router.put("/:servicio_id",
  autorizarUsuarios([1, 2]),
  [
    check("descripcion").optional().notEmpty(),
    check("importe").optional().isFloat({ gt: 0 }),
    validarCampos
  ],
  ctrl.actualizar
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     summary: Eliminar servicio (admin/empleado)
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema: { type: integer, example: 3 }
 *     responses:
 *       200:
 *         description: Servicio eliminado
 */
router.delete("/:servicio_id", autorizarUsuarios([1, 2]), ctrl.eliminar);

export { router };


