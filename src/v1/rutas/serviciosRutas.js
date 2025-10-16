import express from "express";
import ServiciosControlador from "../../controladores/serviciosControlador.js";

const controlador = new ServiciosControlador();
const router = express.Router();

router.get("/", controlador.buscarTodos); // GET todos los servicios
router.get("/:servicio_id", controlador.buscarPorId); // GET servicio por ID
router.post("/", controlador.crear); // POST crear nuevo servicio
router.put("/:servicio_id", controlador.editar); // PUT editar servicio existente
router.delete("/:servicio_id", controlador.borrar); // DELETE borrar servicio (soft delete)

export default router;
