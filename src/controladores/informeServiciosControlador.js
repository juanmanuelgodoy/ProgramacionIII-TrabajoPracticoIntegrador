import InformeServiciosServicio from "../servicios/informeServiciosServicio.js";

export default class InformeServiciosControlador {
  constructor() {
    this.svc = new InformeServiciosServicio();
  }

  // GET /api/v1/informes/informeservicios
  generarInformeServiciosCSV = async (_req, res) => {
    try {
      const { rutaAbsoluta, urlPublica, registros } = await this.svc.generarCSV();
      return res.json({
        estado: true,
        mensaje: `Informe generado correctamente (${registros} filas).`,
        archivo_url: urlPublica,
        archivo_path: rutaAbsoluta,
      });
    } catch (err) {
      console.error("[informeservicios] ERROR:", err);
      return res.status(500).json({
        estado: false,
        mensaje: "Error interno al generar el informe.",
      });
    }
  };
}

