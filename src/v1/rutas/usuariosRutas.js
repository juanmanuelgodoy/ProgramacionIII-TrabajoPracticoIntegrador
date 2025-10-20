import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const controlador = new UsuariosControlador();
const router = express.Router();

router.get('/', controlador.buscarTodos);       // GET todos
router.get('/:usuario_id', controlador.buscarPorId);    // GET por id
router.post('/', controlador.crear);            // POST
router.put('/:usuario_id', controlador.editar);   // PUT
router.delete('/:usuario_id', controlador.borrar);// DELETE

export default router;
