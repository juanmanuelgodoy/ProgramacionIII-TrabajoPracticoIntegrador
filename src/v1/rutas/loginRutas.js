import { Router } from "express";
import LoginControlador from "../../controladores/authControlador.js";

const controlador = new LoginControlador();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth (Legacy)
 *   description: Alias de login (si se usa)
 */

/**
 * @swagger
 * /api/v1/login/login:
 *   post:
 *     summary: (Alias) Iniciar sesión y obtener JWT
 *     tags: [Auth (Legacy)]
 *     security: []  # público
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_usuario, contrasenia]
 *             properties:
 *               nombre_usuario: { type: string, format: email, example: "reservas@grupoAX.com" }
 *               contrasenia: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Login correcto
 */
router.post("/login", controlador.login);

export default router;
