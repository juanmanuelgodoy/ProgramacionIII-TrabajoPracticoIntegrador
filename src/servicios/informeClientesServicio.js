import { conexion } from "../db/conexion.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR = path.join(__dirname, "..", "..", "public", "informes", "clientes");

export default class InformeClientesServicio {
  constructor() {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
      console.log("[informeclientes] carpeta creada:", DIR);
    }
  }

  async obtenerDatos(desde, hasta) {
    console.log("[informeclientes] CALL sp_informe_clientes:", { desde, hasta });
    const [rows] = await conexion.query("CALL sp_informe_clientes(?, ?)", [desde, hasta]);
    const datos = Array.isArray(rows) ? (Array.isArray(rows[0]) ? rows[0] : rows) : [];
    console.log("[informeclientes] filas:", datos.length);
    return datos;
  }

  nombreArchivo(desde, hasta) {
    const ts = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    return `informeclientes_${desde}_a_${hasta}_${ts}.csv`;
  }

  async generarCSV(desde, hasta) {
    const datos = await this.obtenerDatos(desde, hasta);
    const filename = this.nombreArchivo(desde, hasta);
    const filePath = path.join(DIR, filename);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "nombre",          title: "nombre" },
        { id: "apellido",        title: "apellido" },
        { id: "nombre_usuario",  title: "nombre_usuario" },
        { id: "cantidad_total",  title: "cantidad_total" },
      ],
      fieldDelimiter: ",",  // lo dejamos con comas, como querés
      alwaysQuote: false,
      encoding: "utf8",
    });

    await csvWriter.writeRecords(
      (datos || []).map(r => ({
        nombre: r.nombre,
        apellido: r.apellido,
        nombre_usuario: r.nombre_usuario,
        cantidad_total: Number(r.cantidad_total ?? 0),
      }))
    );

    const urlPublica = `/informes/clientes/${filename}`;
    return { rutaAbsoluta: filePath, urlPublica, registros: datos.length };
  }
}

