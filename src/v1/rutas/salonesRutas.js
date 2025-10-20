// src/v1/rutas/salonesRutas.js
import express from 'express';
import apicache from 'apicache';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import { validarJWT, permitirRoles } from '../../middlewares/auth.js';

import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();

let cache = apicache.middleware;

// middleware para etiquetar las respuestas cacheadas
const tagSalones = (req, res, next) => {
  res.apicacheGroup = 'salones'; // todos los GET se agrupan bajo "salones"
  next();
};

/**
 * LISTAR (Cliente, Empleado y Admin)
 * Ponemos auth ANTES del cache para no cachear respuestas no autorizadas.
 */
router.get(
  '/',
  validarJWT,
  permitirRoles(1, 2, 3),
  cache('5 minutes'),
  tagSalones,
  salonesControlador.buscarTodos
);

router.get(
  '/:salon_id',
  validarJWT,
  permitirRoles(1, 2, 3),
  cache('5 minutes'), // <- corregido; antes decía "5 minutos"
  tagSalones,
  salonesControlador.buscarPorID
);

/**
 * CREAR / EDITAR / ELIMINAR (Empleado y Admin)
 */
router.post(
  '/',
  [
    validarJWT,
    permitirRoles(1, 2),
    check('titulo', 'El título es necesario.').notEmpty(),
    check('direccion', 'La dirección es necesaria.').notEmpty(),
    check('capacidad', 'La capacidad es necesaria y debe ser entero ≥ 1.')
      .isInt({ min: 1 })
      .toInt(),
    check('importe', 'El importe es necesario y debe ser número ≥ 0.')
      .isFloat({ min: 0 })
      .toFloat(),
    validarCampos
  ],
  salonesControlador.crear
);

router.put(
  '/:salon_id',
  [
    validarJWT,
    permitirRoles(1, 2),
    check('titulo').optional().notEmpty().withMessage('El título no puede venir vacío.'),
    check('direccion').optional().notEmpty().withMessage('La dirección no puede venir vacía.'),
    check('capacidad').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser entero ≥ 1.').toInt(),
    check('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser número ≥ 0.').toFloat(),
    validarCampos
  ],
  salonesControlador.modificar
);

router.delete(
  '/:salon_id',
  validarJWT,
  permitirRoles(1, 2),
  salonesControlador.eliminar
);

export default router;

