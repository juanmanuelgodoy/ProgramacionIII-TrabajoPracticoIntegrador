import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
  constructor() { this.turnosServicio = new TurnosServicio(); }

  buscarTodos = async (_req, res) => {
    try {
      const datos = await this.turnosServicio.buscarTodos();
      res.json({ estado: true, datos });
    } catch (err) {
      console.log("Error en GET /turnos", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { turno_id } = req.params;
      const turno = await this.turnosServicio.buscarPorId(turno_id);
      if (!turno) return res.status(404).json({ estado: false, mensaje: "Turno no encontrado." });
      res.json({ estado: true, turno });
    } catch (err) {
      console.log("Error en GET /turnos/:turno_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  crear = async (req, res) => {
    try {
      const { orden, hora_desde, hora_hasta } = req.body;
      const nuevo = await this.turnosServicio.crear({ orden, hora_desde, hora_hasta });
      res.json({ estado: true, mensaje: "Turno creado!", turno: nuevo });
    } catch (err) {
      console.log("Error en POST /turnos", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  actualizar = async (req, res) => {
    try {
      const { turno_id } = req.params;
      const { orden, hora_desde, hora_hasta } = req.body;
      const actualizado = await this.turnosServicio.actualizar(turno_id, { orden, hora_desde, hora_hasta });
      if (!actualizado) return res.status(404).json({ estado: false, mensaje: "Turno no encontrado." });
      res.json({ estado: true, mensaje: "Turno actualizado!", turno: actualizado });
    } catch (err) {
      console.log("Error en PUT /turnos/:turno_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { turno_id } = req.params;
      const ok = await this.turnosServicio.eliminar(turno_id);
      if (!ok) return res.status(404).json({ estado: false, mensaje: "Turno no encontrado." });
      res.json({ estado: true, mensaje: "Turno eliminado!" });
    } catch (err) {
      console.log("Error en DELETE /turnos/:turno_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };
}

