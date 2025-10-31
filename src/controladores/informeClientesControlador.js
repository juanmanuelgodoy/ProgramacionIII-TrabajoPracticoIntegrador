import InformeClientesServicio from "../servicios/informeClientesServicio.js";

export default class InformeClientesControlador {
  constructor() {
    this.svc = new InformeClientesServicio();
  }

  // GET /api/v1/informes/informeclientes?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
  generarInformeClientesCSV = async (req, res) => {
    try {
      const { desde, hasta } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({
          estado: false,
          mensaje: "Parámetros requeridos: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD",
        });
      }

      const { urlPublica, rutaAbsoluta, registros } = await this.svc.generarCSV(desde, hasta);
      return res.json({
        estado: true,
        mensaje: `Informe generado correctamente (${registros} filas).`,
        archivo_url: urlPublica,
        archivo_path: rutaAbsoluta,
      });
    } catch (err) {
      console.error("[informeclientes] ERROR:", err);
      return res.status(500).json({ estado: false, mensaje: "Error interno al generar el informe." });
    }
  };
}

