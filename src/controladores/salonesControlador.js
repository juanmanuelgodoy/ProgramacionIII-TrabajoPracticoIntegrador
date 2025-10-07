import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador {
  constructor() {
    this.salonesServicio = new SalonesServicio();
  }

  // GET /api/v1/salones
  buscarTodos = async (req, res) => {
    try {
      const salones = await this.salonesServicio.buscarTodos();
      res.json({ estado: true, datos: salones });
    } catch (err) {
      console.log("Error con GET /salones", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // GET /api/v1/salones/:id
  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const salon = await this.salonesServicio.buscarPorId(id);
      if (!salon) return res.status(404).json({ estado: false, mensaje: "El salón no existe." });
      res.json({ estado: true, datos: salon });
    } catch (err) {
      console.log("Error con GET /salones/:id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // POST /api/v1/salones
  crear = async (req, res) => {
    try {
      const { titulo, direccion, capacidad, importe } = req.body;
      if (!titulo || !direccion || !capacidad || !importe) {
        return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
      }
      const nuevo = await this.salonesServicio.crear({ titulo, direccion, capacidad, importe });
      res.status(201).json({ estado: true, mensaje: "Salón creado.", datos: nuevo });
    } catch (err) {
      console.log("Error con POST /salones", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // PUT /api/v1/salones/:salon_id
  editar = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const { titulo, direccion, capacidad, importe } = req.body;
      if (!titulo || !direccion || !capacidad || !importe) {
        return res.status(400).json({ estado: false, mensaje: "Faltan datos requeridos." });
      }
      const actualizado = await this.salonesServicio.editar(salon_id, {
        titulo, direccion, capacidad, importe
      });
      if (!actualizado) return res.status(404).json({ estado: false, mensaje: "El salón no existe." });
      res.json({ estado: true, mensaje: "Salón actualizado.", datos: actualizado });
    } catch (err) {
      console.log("Error con PUT /salones/:salon_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  // DELETE /api/v1/salones/:salon_id
  borrar = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const ok = await this.salonesServicio.borrar(salon_id);
      if (!ok) return res.status(404).json({ estado: false, mensaje: "El salón no existe." });
      res.json({ estado: true, mensaje: "Salón eliminado." });
    } catch (err) {
      console.log("Error con DELETE /salones/:salon_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };
}


