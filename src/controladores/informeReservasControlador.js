import InformeReservasServicio from "../servicios/informeReservasServicio.js";

export default class InformeReservasControlador {
  constructor() {
    this.informeServicio = new InformeReservasServicio();
  }

  // GET /api/v1/informes/informereservas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
  generarInformeReservasCSV = async (req, res) => {
    try {
      const { desde, hasta } = req.query;
      console.log("[informereservas] params:", { desde, hasta, user: req.user?.usuario_id, rol: req.user?.tipo_usuario });

      if (!desde || !hasta) {
        console.warn("[informereservas] faltan params");
        return res.status(400).json({
          estado: false,
          mensaje: "Parámetros requeridos: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD",
        });
      }

      const { urlPublica, rutaAbsoluta, registros } =
        await this.informeServicio.generarCSV(desde, hasta);

      console.log("[informereservas] OK ->", { registros, urlPublica, rutaAbsoluta });

      return res.json({
        estado: true,
        mensaje: `Informe generado correctamente (${registros} filas).`,
        archivo_url: urlPublica,
        archivo_path: rutaAbsoluta,
      });
    } catch (err) {
      console.error("[informereservas] ERROR:", err?.stack || err);
      return res.status(500).json({
        estado: false,
        mensaje: "Error interno al generar el informe.",
        detalle: err?.message || "sin detalle",
      });
    }
  };
}




