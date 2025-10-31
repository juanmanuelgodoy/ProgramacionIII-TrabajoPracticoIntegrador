import ReporteReservasServicio from "../servicios/reporteReservasServicio.js";

export default class ReporteReservasControlador {
  constructor() {
    this.svc = new ReporteReservasServicio();
  }

  generarPDF = async (req, res) => {
    try {
      const { desde, hasta } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({
          estado: false,
          mensaje: "Parámetros: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD",
        });
      }

      const r = await this.svc.generarPDF(desde, hasta);

      return res.json({
        estado: true,
        mensaje: "Reporte PDF generado",
        archivo_url: r.archivo_url,
        archivo_path: r.archivo_path,
        registros: r.registros,
      });
    } catch (err) {
      console.error("[reportereservas PDF] ERROR:", err);
      return res.status(500).json({
        estado: false,
        mensaje: "Error interno al generar PDF",
        detalle: err?.message,     // <<— agrega esto
      });
    }
  };
}


