import express from "express";
import HtmlControlador from "../../controladores/htmlControlador.js";

const router = express.Router();
const ctrl = new HtmlControlador();

/**
 * @swagger
 * tags:
 *   name: HTML
 *   description: Endpoints públicos para páginas HTML
 */

/**
 * @swagger
 * /api/v1/html/reset-password.html:
 *   get:
 *     summary: Entrega el HTML de restablecimiento de contraseña
 *     tags: [HTML]
 *     security: []  # público
 *     responses:
 *       200:
 *         description: HTML entregado
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get("/reset-password.html", ctrl.mostrarResetPassword);

export { router };

