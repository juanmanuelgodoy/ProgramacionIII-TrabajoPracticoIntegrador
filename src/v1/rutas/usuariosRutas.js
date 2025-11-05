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




// ======================================================
// Reinicio: contraseña temporal → usuario logueado
// POST /usuarios/reinicio/solicitar-mi-link
// ======================================================


/**
 * @swagger
 * /api/usuarios/reinicio/solicitar-mi-link:
 *   post:
 *     summary: Solicitar envío de una contraseña temporal
 *     description: |
 *       El usuario autenticado solicita recibir una **contraseña temporal** por email.  
 *       La contraseña temporal permite ingresar al sistema y luego debe cambiarse desde el perfil.
 *
 *     tags:
 *       - Usuarios
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Contraseña temporal enviada (si el correo está asociado al usuario).
 *         content:
 *           application/json:
 *             example:
 *               estado: true
 *               mensaje: "Si tu correo está registrado, recibirás una contraseña temporal."
 *
 *       401:
 *         description: Token inválido o expirado.
 *         content:
 *           application/json:
 *             example:
 *               estado: false
 *               mensaje: "No autorizado."
 *
 *       500:
 *         description: Error del servidor.
 *         content:
 *           application/json:
 *             example:
 *               estado: false
 *               mensaje: "Error procesando la solicitud."
 */

router.post(
  "/reinicio/solicitar-mi-link",
  autorizarUsuarios([1, 2, 3]),
  ctrl.solicitarReinicioParaMi
);

// ======================================================
// Cambio de contraseña definitiva
// PUT /usuarios/cambiar-contrasenia
// ======================================================

/**
 * @swagger
 * /api/usuarios/cambiar-contrasenia:
 *   put:
 *     summary: Cambiar contraseña definitiva
 *     description: |
 *       Permite a un usuario **logueado** cambiar su contraseña.  
 *       - Debe indicar la contraseña actual.  
 *       - La nueva contraseña debe tener al menos **6 caracteres**.  
 *       - Funciona tanto si previamente entró con una temporal como con una normal.
 *
 *     tags:
 *       - Usuarios
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actual_contrasenia
 *               - nueva_contrasenia
 *             properties:
 *               actual_contrasenia:
 *                 type: string
 *                 description: Contraseña actual del usuario.
 *                 example: "MiClaveActual123"
 *               nueva_contrasenia:
 *                 type: string
 *                 description: Nueva contraseña (mínimo 6 caracteres).
 *                 example: "MiClaveNueva456"
 *
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente.
 *         content:
 *           application/json:
 *             example:
 *               estado: true
 *               mensaje: "Contraseña actualizada correctamente."
 *
 *       400:
 *         description: Contraseña actual incorrecta o nueva contraseña inválida.
 *         content:
 *           application/json:
 *             examples:
 *               claveActualIncorrecta:
 *                 summary: Contraseña actual incorrecta
 *                 value:
 *                   estado: false
 *                   mensaje: "No se pudo actualizar. Verificá tu contraseña actual o si estás usando una temporal."
 *               claveNuevaMuyCorta:
 *                 summary: Nueva contraseña muy corta
 *                 value:
 *                   estado: false
 *                   mensaje: "La contraseña debe tener al menos 6 caracteres."
 *
 *       401:
 *         description: Token inválido o faltante.
 *         content:
 *           application/json:
 *             example:
 *               estado: false
 *               mensaje: "No autorizado."
 *
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               estado: false
 *               mensaje: "Error interno."
 */

router.put(
  "/cambiar-contrasenia",
  autorizarUsuarios([1, 2, 3]),
  [
    check("actual_contrasenia").notEmpty().withMessage("Falta actual_contrasenia"),
    check("nueva_contrasenia")
      .isLength({ min: 6 })
      .withMessage("La nueva_contrasenia debe tener al menos 6 caracteres"),
    validarCampos,
  ],
  ctrl.cambiarContraseniaDefinitiva
);

export { router };


