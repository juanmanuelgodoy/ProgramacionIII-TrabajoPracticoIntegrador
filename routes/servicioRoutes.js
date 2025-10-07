const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Rutas para Servicios
router.get('/', servicioController.getServicios);          // Browse
router.get('/:id', servicioController.getServicioById);   // Read
router.post('/', servicioController.createServicio);      // Add
router.put('/:id', servicioController.updateServicio);    // Edit
router.delete('/:id', servicioController.deleteServicio); // Delete (soft delete)

module.exports = router;
