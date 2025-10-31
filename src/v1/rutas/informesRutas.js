import express from "express";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import InformeReservasControlador from "../../controladores/informeReservasControlador.js";
import InformeClientesControlador from "../../controladores/informeClientesControlador.js";
import InformeServiciosControlador from "../../controladores/informeServiciosControlador.js";
import ReporteReservasControlador from "../../controladores/reporteReservasControlador.js";

const router = express.Router();
const ctrl = new InformeReservasControlador();
const ctrlClientes = new InformeClientesControlador();
const ctrlServicios  = new InformeServiciosControlador();
const ctrlReporte = new ReporteReservasControlador();

/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: Exportes CSV y Reportes PDF
 */

/**
 * @swagger
 * /api/v1/informes/informereservas:
 *   get:
 *     summary: Genera CSV de informe de reservas (agregado por fecha)
 *     tags: [Informes]
 *     parameters:
 *       - in: query
 *         name: desde
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-01" }
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-31" }
 *     responses:
 *       200:
 *         description: CSV generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado: { type: boolean, example: true }
 *                 archivo_url: { type: string, example: "/informes/reservas/informereservas_2025-10-01_a_2025-10-31_20251031142107.csv" }
 */
router.get("/informereservas", autorizarUsuarios([1]), ctrl.generarInformeReservasCSV);

/**
 * @swagger
 * /api/v1/informes/informeclientes:
 *   get:
 *     summary: Genera CSV de informe de clientes (tipo_usuario=3) con cantidad_total de reservas
 *     tags: [Informes]
 *     parameters:
 *       - in: query
 *         name: desde
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-01" }
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-31" }
 *     responses:
 *       200:
 *         description: CSV generado
 */
router.get("/informeclientes", autorizarUsuarios([1]), ctrlClientes.generarInformeClientesCSV);

/**
 * @swagger
 * /api/v1/informes/informeservicios:
 *   get:
 *     summary: Genera CSV de servicios (descripcion, importe, cantidad_reservas)
 *     tags: [Informes]
 *     responses:
 *       200:
 *         description: CSV generado
 */
router.get("/informeservicios", autorizarUsuarios([1]), ctrlServicios.generarInformeServiciosCSV);

/**
 * @swagger
 * /api/v1/informes/reportereservas/pdf:
 *   get:
 *     summary: Genera Reporte de Reservas en PDF (detallado con joins) usando Puppeteer
 *     tags: [Informes]
 *     parameters:
 *       - in: query
 *         name: desde
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-01" }
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema: { type: string, format: date, example: "2025-10-31" }
 *     responses:
 *       200:
 *         description: PDF generado
 */
router.get(
  "/reportereservas/pdf",
  autorizarUsuarios([1]),
  ctrlReporte.generarPDF
);

export { router };




