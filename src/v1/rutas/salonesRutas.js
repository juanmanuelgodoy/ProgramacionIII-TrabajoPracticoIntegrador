import express from 'express';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import SalonesControlador from '../../controladores/salonesControlador.js';

const router = express.Router();
const cache = apicache.middleware;
const salonesControlador = new SalonesControlador();

// Listado (todos los roles)
router.get(
  '/',
  autorizarUsuarios([1, 2, 3]),
  cache('5 minutes'),
  salonesControlador.buscarTodos
);

router.get(
  '/:salon_id',
  autorizarUsuarios([1, 2, 3]),
  salonesControlador.buscarPorId
);

// Crear (admin/empleado)
router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('titulo', 'El título es necesario.').notEmpty(),
    check('direccion', 'La dirección es necesaria.').notEmpty(),
    check('capacidad', 'La capacidad es necesaria.').isInt({ min: 1 }),
    check('importe', 'El importe es necesario.').isFloat({ gt: 0 }),
    validarCampos,
  ],
  salonesControlador.crear
);

// Modificar (admin/empleado)
router.put(
  '/:salon_id',
  autorizarUsuarios([1, 2]),
  [
    check('titulo').optional().notEmpty(),
    check('direccion').optional().notEmpty(),
    check('capacidad').optional().isInt({ min: 1 }),
    check('importe').optional().isFloat({ gt: 0 }),
    validarCampos,
  ],
  salonesControlador.modificar
);

// Eliminar (admin/empleado) - baja lógica
router.delete(
  '/:salon_id',
  autorizarUsuarios([1, 2]),
  salonesControlador.eliminar
);

export { router };

