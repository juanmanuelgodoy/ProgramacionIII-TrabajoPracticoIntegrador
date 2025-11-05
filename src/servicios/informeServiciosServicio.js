import { conexion } from "../db/conexion.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR = path.join(__dirname, "..", "..", "public", "informes", "servicios");

export default class InformeServiciosServicio {
  constructor() {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
      console.log("[informeservicios] carpeta creada:", DIR);
    }
  }

  async obtenerDatos() {
    console.log("[informeservicios] CALL sp_informe_servicios");
    const [rows] = await conexion.query("CALL sp_informe_servicios()");
    const datos = Array.isArray(rows) ? (Array.isArray(rows[0]) ? rows[0] : rows) : [];
    console.log("[informeservicios] filas:", datos.length);
    return datos;
  }

  nombreArchivo() {
    const ts = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    return `informeservicios_${ts}.csv`;
  }

  async generarCSV() {
    const datos = await this.obtenerDatos();
    const filename = this.nombreArchivo();
    const filePath = path.join(DIR, filename);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "descripcion", title: "Descripcion" },
        { id: "importe", title: "Importe" },
        { id: "cantidad_reservas", title: "Cantidad de reservas de este servicio" },
      ],
      fieldDelimiter: ",",
      alwaysQuote: false,
      encoding: "utf8",
    });

    await csvWriter.writeRecords(
      (datos || []).map(r => ({
        descripcion: r.descripcion,
        importe: Number(r.importe),
        cantidad_reservas: Number(r.cantidad_reservas || 0),
      }))
    );

    const urlPublica = `/informes/servicios/${filename}`;
    return { rutaAbsoluta: filePath, urlPublica, registros: (datos || []).length };
  }
}

