import express from "express";
import TurnosControlador from "../../controladores/turnosControlador.js";

const controlador = new TurnosControlador();
const router = express.Router();

router.get("/", controlador.buscarTodos); // GET todos
router.get("/:turno_id", controlador.buscarPorId); // GET por ID
router.post("/", controlador.crear); // POST crear
router.put("/:turno_id", controlador.editar); // PUT editar
router.delete("/:turno_id", controlador.borrar); // DELETE borrar (soft delete)

export default router;
