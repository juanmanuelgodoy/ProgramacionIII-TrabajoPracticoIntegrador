import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {
    constructor() {
        this.serviciosServicio = new ServiciosServicio();
    }

    // GET /api/v1/servicios
    buscarTodos = async (req, res) => {
        try {
            const servicios = await this.serviciosServicio.buscarTodos();
            res.json({ estado: true, datos: servicios });
        } catch (err) {
            console.log("Error con GET /servicios", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // GET /api/v1/servicios/:servicio_id
    buscarPorId = async (req, res) => {
        try {
            const { servicio_id } = req.params;
            const servicio = await this.serviciosServicio.buscarPorId(servicio_id);
            if (!servicio) return res.status(404).json({ estado: false, mensaje: "El servicio no existe." });
            res.json({ estado: true, datos: servicio });
        } catch (err) {
            console.log("Error con GET /servicios/:id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // POST /api/v1/servicios
    crear = async (req, res) => {
        try {
            const { descripcion, importe } = req.body;
            if (!descripcion || !importe) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }
            const nuevo = await this.serviciosServicio.crear({ descripcion, importe });
            res.status(201).json({ estado: true, mensaje: "Servicio creado.", datos: nuevo });
        } catch (err) {
            console.log("Error con POST /servicios", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // PUT /api/v1/servicios/:servicio_id
    editar = async (req, res) => {
        try {
            const { servicio_id } = req.params;
            const { descripcion, importe } = req.body;
            if (!descripcion || !importe) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }

            const actualizado = await this.serviciosServicio.editar(servicio_id, { 
                descripcion, importe });
            if (!actualizado) return res.status(404).json({ estado: false, mensaje: "El servicio no existe." });

            res.json({ estado: true, mensaje: "Servicio actualizado.", datos: actualizado });
        } catch (err) {
            console.log("Error con PUT /servicios/:servicio_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // DELETE /api/v1/servicios/:servicio_id
    borrar = async (req, res) => {
        try {
            const { servicio_id } = req.params;
            const ok = await this.serviciosServicio.borrar(servicio_id);
            if (!ok) return res.status(404).json({ estado: false, mensaje: "El servicio no existe." });
            res.json({ estado: true, mensaje: "Servicio eliminado." });
        } catch (err) {
            console.log("Error con DELETE /servicios/:servicio_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };
}
