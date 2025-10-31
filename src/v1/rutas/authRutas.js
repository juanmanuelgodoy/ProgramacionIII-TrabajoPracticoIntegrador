import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import AuthControlador from "../../controladores/authControlador.js";

const router = express.Router();
const ctrl = new AuthControlador();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y emisión de tokens
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener JWT
 *     tags: [Auth]
 *     security: []  # público
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_usuario, contrasenia]
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 format: email
 *                 example: reservas@grupoAX.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado: { type: boolean, example: true }
 *                 token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     usuario_id: { type: integer, example: 1 }
 *                     nombre_usuario: { type: string, example: "reservas@grupoAx.com" }
 *                     tipo_usuario: { type: integer, example: 1 }
 *       400:
 *         description: Error de validación
 */
router.post(
  "/login",
  [
    check("nombre_usuario").isEmail().withMessage("Email inválido."),
    check("contrasenia").isLength({ min: 6 }).withMessage("Contraseña muy corta."),
    validarCampos,
  ],
  ctrl.login
);

export { router };


