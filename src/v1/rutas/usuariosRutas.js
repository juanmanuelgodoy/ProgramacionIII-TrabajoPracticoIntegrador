import express from "express";
import { check } from "express-validator";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();
const ctrl = new UsuariosControlador();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y flujo de reinicio de contraseña
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Listar usuarios (solo admin)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Listado de usuarios
 */
router.get("/", autorizarUsuarios([1]), ctrl.buscarTodos);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   get:
 *     summary: Ver detalle de usuario (admin/empleado/cliente propio)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema: { type: integer, example: 7 }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get("/:usuario_id", autorizarUsuarios([1, 2, 3]), ctrl.buscarPorId);

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear usuario (solo admin)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario]
 *             properties:
 *               nombre: { type: string, example: "María" }
 *               apellido: { type: string, example: "Pérez" }
 *               nombre_usuario: { type: string, example: "maria@correo.com" }
 *               contrasenia: { type: string, example: "123456" }
 *               tipo_usuario: { type: integer, example: 3 }
 *     responses:
 *       200:
 *         description: Usuario creado
 */
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

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   put:
 *     summary: Modificar usuario (solo admin)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema: { type: integer, example: 7 }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               apellido: { type: string }
 *               nombre_usuario: { type: string }
 *               contrasenia: { type: string }
 *               tipo_usuario: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario modificado
 */
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

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema: { type: integer, example: 7 }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/:usuario_id", autorizarUsuarios([1]), ctrl.eliminar);

/**
 * @swagger
 * /api/v1/usuarios/reinicio/solicitar-mi-link:
 *   post:
 *     summary: Solicitar link de reinicio (usuario autenticado)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Email enviado si el flujo está habilitado
 */
router.post(
  "/reinicio/solicitar-mi-link",
  autorizarUsuarios([1, 2, 3]),
  ctrl.solicitarReinicioParaMi
);

/**
 * @swagger
 * /api/v1/usuarios/reinicio/confirmar:
 *   post:
 *     summary: Confirmar reinicio con token (público)
 *     tags: [Usuarios]
 *     security: []  # público
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, nueva_contrasenia]
 *             properties:
 *               token: { type: string, example: "eyJhbGciOi..." }
 *               nueva_contrasenia: { type: string, example: "nueva123" }
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.post(
  "/reinicio/confirmar",
  [
    check("token").notEmpty().withMessage("Falta token."),
    check("nueva_contrasenia")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres."),
    validarCampos,
  ],
  ctrl.confirmarReinicio
);

export { router };


