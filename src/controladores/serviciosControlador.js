import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {
  constructor() { this.serviciosServicio = new ServiciosServicio(); }

  buscarTodos = async (_req, res) => {
    try {
      const datos = await this.serviciosServicio.buscarTodos();
      res.json({ estado: true, datos });
    } catch (err) {
      console.log("Error en GET /servicios", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const servicio = await this.serviciosServicio.buscarPorId(servicio_id);
      if (!servicio) return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado." });
      res.json({ estado: true, servicio });
    } catch (err) {
      console.log("Error en GET /servicios/:servicio_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  crear = async (req, res) => {
    try {
      const { descripcion, importe } = req.body;
      const nuevo = await this.serviciosServicio.crear({ descripcion, importe });
      res.json({ estado: true, mensaje: "Servicio creado!", servicio: nuevo });
    } catch (err) {
      console.log("Error en POST /servicios", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  actualizar = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const { descripcion, importe } = req.body;
      const actualizado = await this.serviciosServicio.actualizar(servicio_id, { descripcion, importe });
      if (!actualizado) return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado." });
      res.json({ estado: true, mensaje: "Servicio actualizado!", servicio: actualizado });
    } catch (err) {
      console.log("Error en PUT /servicios/:servicio_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const ok = await this.serviciosServicio.eliminar(servicio_id);
      if (!ok) return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado." });
      res.json({ estado: true, mensaje: "Servicio eliminado!" });
    } catch (err) {
      console.log("Error en DELETE /servicios/:servicio_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };
}

