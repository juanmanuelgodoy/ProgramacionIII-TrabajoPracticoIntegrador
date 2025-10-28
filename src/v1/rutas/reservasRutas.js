import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasControlador from '../../controladores/reservasControlador.js';

const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/:reserva_id',  autorizarUsuarios([1,2,3]), reservasControlador.buscarPorId);

router.get('/',  autorizarUsuarios([1,2,3]), reservasControlador.buscarTodos);

router.post('/', autorizarUsuarios([1,3]),
    [
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
        check('salon_id', 'El salón es necesario.').notEmpty(),
        check('usuario_id', 'El usuario es necesario.').notEmpty(), 
        check('turno_id', 'El turno es necesario.').notEmpty(),  
        check('servicios', 'Faltan los servicios de la reserva.')
        .notEmpty()
        .isArray(),
        check('servicios.*.importe')
        .isFloat() 
        .withMessage('El importe debe ser numérico.'),   
        validarCampos
    ],
    reservasControlador.crear);

// Modificar reserva (solo ADMIN = 1)
router.put(
  '/:reserva_id',
  autorizarUsuarios([1]),
  [
    check('fecha_reserva').optional().isISO8601().withMessage('fecha_reserva debe ser ISO8601 (YYYY-MM-DD)'),
    check('salon_id').optional().isInt({ min: 1 }),
    check('usuario_id').optional().isInt({ min: 1 }),
    check('turno_id').optional().isInt({ min: 1 }),
    check('foto_cumpleaniero').optional().isString(),
    check('tematica').optional().notEmpty(),
    check('importe_salon').optional().isFloat({ gt: 0 }),
    check('importe_total').optional().isFloat({ gt: 0 }),

    // Si actualizás servicios, debe venir un array de objetos { servicio_id, importe }
    check('servicios').optional().isArray(),
    check('servicios.*.servicio_id').optional().isInt({ min: 1 }),
    check('servicios.*.importe').optional().isFloat({ gt: 0 }),

    validarCampos,
  ],
  reservasControlador.modificar
);

// Eliminar (solo ADMIN = 1)
router.delete('/:reserva_id', autorizarUsuarios([1]), reservasControlador.eliminar);
// Confirmar (empleado/admin)
router.put('/:reserva_id/confirmar', autorizarUsuarios([1,2]), reservasControlador.confirmar);
export { router };
