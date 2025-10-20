import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
    constructor() {
        this.turnosServicio = new TurnosServicio();
    }

    // GET /api/v1/turnos
    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.turnosServicio.buscarTodos();
            res.json({ estado: true, datos: turnos });
        } catch (err) {
            console.log("Error con GET /turnos", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // GET /api/v1/turnos/:turno_id
    buscarPorId = async (req, res) => {
        try {
            const { turno_id } = req.params;
            const turno = await this.turnosServicio.buscarPorId(turno_id);
            if (!turno) return res.status(404).json({ estado: false, mensaje: "El turno no existe." });
            res.json({ estado: true, datos: turno });
        } catch (err) {
            console.log("Error con GET /turnos/:turno_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // POST /api/v1/turnos
    crear = async (req, res) => {
        try {
            const { orden, hora_desde, hora_hasta } = req.body;
            if (!orden || !hora_desde || !hora_hasta) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }
            const nuevo = await this.turnosServicio.crear({ orden, hora_desde, hora_hasta });
            res.status(201).json({ estado: true, mensaje: "Turno creado.", datos: nuevo });
        } catch (err) {
            console.log("Error con POST /turnos", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // PUT /api/v1/turnos/:turno_id
    editar = async (req, res) => {
        try {
            const { turno_id } = req.params;
            const { orden, hora_desde, hora_hasta } = req.body;
            if (!orden || !hora_desde || !hora_hasta) {
                return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
            }
            const actualizado = await this.turnosServicio.editar(turno_id, { orden, hora_desde, hora_hasta });
            if (!actualizado) return res.status(404).json({ estado: false, mensaje: "El turno no existe." });
            res.json({ estado: true, mensaje: "Turno actualizado.", datos: actualizado });
        } catch (err) {
            console.log("Error con PUT /turnos/:turno_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };

    // DELETE /api/v1/turnos/:turno_id (soft delete)
    borrar = async (req, res) => {
        try {
            const { turno_id } = req.params;
            const ok = await this.turnosServicio.borrar(turno_id);
            if (!ok) return res.status(404).json({ estado: false, mensaje: "El turno no existe." });
            res.json({ estado: true, mensaje: "Turno eliminado." });
        } catch (err) {
            console.log("Error con DELETE /turnos/:turno_id", err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
    };
}
