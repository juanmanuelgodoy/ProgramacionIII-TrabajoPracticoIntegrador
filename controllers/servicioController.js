const Servicio = require('../models/Servicio');

// Listar todos los servicios (Browse)
const getServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll({ where: { activo: true } });
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un servicio por ID (Read)
const getServicioById = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);
        if (!servicio || !servicio.activo) return res.status(404).json({ message: 'Servicio no encontrado' });
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo servicio (Add)
const createServicio = async (req, res) => {
    try {
        const { descripcion, importe } = req.body;
        const nuevoServicio = await Servicio.create({ descripcion, importe });
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un servicio (Edit)
const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, importe, activo } = req.body;
        const servicio = await Servicio.findByPk(id);
        if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });

        await servicio.update({ descripcion, importe, activo });
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un servicio (Delete, soft delete)
const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);
        if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });

        await servicio.update({ activo: false });
        res.json({ message: 'Servicio eliminado (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio
};
