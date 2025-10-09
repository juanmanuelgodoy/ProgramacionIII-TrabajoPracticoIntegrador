import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js'; 

const controlador = new SalonesControlador();
const router = express.Router();

// crear las rutas
router.get('/', controlador.buscarTodos);       // GET todos
router.get('/:id', controlador.buscarPorId);    // GET por id
router.post('/', controlador.crear);            // POST
router.put('/:salon_id', controlador.editar);   // PUT
router.delete('/:salon_id', controlador.borrar);// DELETE

export { router }; 

