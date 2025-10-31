import { conexion } from "../db/conexion.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INFORMES_RESERVAS_DIR = path.join(__dirname, "..", "..", "public", "informes", "reservas");

export default class InformeReservasServicio {
  constructor() {
    if (!fs.existsSync(INFORMES_RESERVAS_DIR)) {
      fs.mkdirSync(INFORMES_RESERVAS_DIR, { recursive: true });
      console.log("[informereservas] carpeta creada:", INFORMES_RESERVAS_DIR);
    }
  }

  /** Llama al SP y devuelve array de filas */
  async obtenerDatos(desde, hasta) {
    console.log("[informereservas] llamando SP sp_informe_reservas:", { desde, hasta });
    const [rows, fields] = await conexion.query("CALL sp_informe_reservas(?, ?)", [desde, hasta]);

    // Distintos MariaDB/mysql2 pueden devolver formas diferentes con CALL.
    // Normalmente rows[0] es la 1ª tabla (array de filas).
    let datos = [];
    if (Array.isArray(rows)) {
      if (Array.isArray(rows[0])) {
        datos = rows[0];
      } else {
        datos = rows;
      }
    } else {
      datos = [];
    }

    console.log("[informereservas] filas devueltas:", Array.isArray(datos) ? datos.length : "no-array");
    return datos;
  }

  generarNombreArchivo(desde, hasta) {
    const ts = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    return `informereservas_${desde}_a_${hasta}_${ts}.csv`;
  }

  async generarCSV(desde, hasta) {
    const datos = await this.obtenerDatos(desde, hasta);

    const filename = this.generarNombreArchivo(desde, hasta);
    const filePath = path.join(INFORMES_RESERVAS_DIR, filename);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "fecha_reserva",      title: "fecha_reserva" },
        { id: "cantidad_reservas",  title: "cantidad_reservas" },
        { id: "suma_importe_total", title: "suma_importe_total" },
      ],
      fieldDelimiter: ",",
      alwaysQuote: false,
      encoding: "utf8",
    });

    const registros = Array.isArray(datos) ? datos.length : 0;

    await csvWriter.writeRecords(
      (datos || []).map((r) => ({
        fecha_reserva: r.fecha_reserva,
        cantidad_reservas: r.cantidad_reservas ?? 0,
        suma_importe_total: r.suma_importe_total ?? 0,
      }))
    );

    const urlPublica = `/informes/reservas/${filename}`;
    console.log("[informereservas] CSV generado:", { registros, urlPublica, filePath });

    return { rutaAbsoluta: filePath, urlPublica, registros };
  }
}




