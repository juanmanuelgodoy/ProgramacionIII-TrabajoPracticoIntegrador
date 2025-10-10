import express from 'express';
import apicache from 'apicache';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

import SalonesControlador from '../../controladores/salonesControlador.js';


const salonesControlador = new SalonesControlador();

const router = express.Router();
let cache = apicache.middleware

// middleware para etiquetar las respuestas cacheadas
const tagSalones = (req, res, next) => {
    res.apicacheGroup = 'salones'; // todos los GET se agrupan bajo "salones"
    next();
};
router.get('/', cache('5 minutes'), tagSalones, salonesControlador.buscarTodos); 

router.get('/:salon_id', cache('5 minutos'), tagSalones, salonesControlador.buscarPorID);

router.put(
  '/:salon_id',
  [
    check('titulo').optional().notEmpty().withMessage('El título no puede venir vacío.'),
    check('direccion').optional().notEmpty().withMessage('La dirección no puede venir vacía.'),
    check('capacidad').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor o igual a 1.'),
    check('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser un número mayor o igual a 0.'),
    validarCampos
  ],
  salonesControlador.modificar
);


router.post(
    '/', 
    [
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty(), // ver cómo verificar que sea numérico
        check('importe', 'El importe es necesario.').notEmpty(),  // ver cómo verificar que sea numérico
        validarCampos    
    ],
    salonesControlador.crear
);



router.delete('/:salon_id', salonesControlador.eliminar); 


export default router;

