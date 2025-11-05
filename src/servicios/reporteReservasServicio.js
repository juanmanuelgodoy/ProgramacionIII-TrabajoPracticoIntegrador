import { conexion } from "../db/conexion.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR = path.join(__dirname, "..", "..", "public", "informes", "reservas");

export default class ReporteReservasServicio {
  constructor() {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
    }
  }

  async obtenerDatos(desde, hasta) {
    const [rows] = await conexion.query(
      "CALL sp_reporte_reservas_detallado(?, ?)",
      [desde, hasta]
    );
    return Array.isArray(rows) ? rows[0] : [];
  }

  generarNombreArchivo(desde, hasta) {
    const ts = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    return `reporte_reservas_${desde}_a_${hasta}_${ts}.pdf`;
  }

  construirHTML(desde, hasta, data) {
    const fmt = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 });

    const formatoFechaLocal = (fechaStrOrDate) => {
      if (!fechaStrOrDate) return '';
      const f = (fechaStrOrDate instanceof Date)
        ? fechaStrOrDate
        : new Date(String(fechaStrOrDate).includes('T') ? fechaStrOrDate : (String(fechaStrOrDate) + 'T00:00:00'));
      if (isNaN(f.getTime())) return '';
      return f.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const safeNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const filas = (Array.isArray(data) ? data : []).map(r => {
      const id = r.reserva_id ?? '';
      const fecha = formatoFechaLocal(r.fecha_reserva);
      const salon = r.salon_nombre ?? '';
      const cliente = `${r.cliente_nombre ?? ''} ${r.cliente_apellido ?? ''}`.trim() || '';
      const horario = r.turno_horario ? `${r.turno_horario} h` : '';
      const tematica = r.tematica ?? '';
      const servicios = r.servicios ?? 'Sin servicios';

      const importeSalon = safeNum(r.importe_salon);
      const importeServicios = safeNum(r.total_servicios);
      const totalReserva = safeNum(r.importe_total);

      return `
      <tr>
        <td>${id}</td>
        <td>${fecha}</td>
        <td>${salon}</td>
        <td>${cliente}</td>
        <td>${horario}</td>
        <td>${tematica}</td>
        <td>${servicios}</td>
        <td class="num">$${fmt.format(importeSalon)}</td>
        <td class="num">$${fmt.format(importeServicios)}</td>
        <td class="num">$${fmt.format(totalReserva)}</td>
      </tr>
    `;
    }).join("");

    const desdeFmt = formatoFechaLocal(desde);
    const hastaFmt = formatoFechaLocal(hasta);

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Reporte de Reservas</title>
<style>
  body { font-family: Arial; font-size: 12px; }
  h1 { text-align:center; }
  table { width: 100%; border-collapse: collapse; margin-top:20px; }
  th, td { border:1px solid #ccc; padding:6px; }
  th { background:#efefef; }
  .num { text-align:right; }
</style>
</head>
<body>

<h1>Reporte de Reservas</h1>
<p><strong>Período:</strong> ${desdeFmt} a ${hastaFmt}</p>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Fecha</th>
      <th>Salón</th>
      <th>Cliente</th>
      <th>Horario</th>
      <th>Temática</th>
      <th>Servicios</th>
      <th>Importe Salón</th>
      <th>Importe Servicios</th>
      <th>Total Reserva</th>
    </tr>
  </thead>
  <tbody>
    ${filas}
  </tbody>
</table>

</body>
</html>`;
  }
  async generarPDF(desde, hasta) {
    const datos = await this.obtenerDatos(desde, hasta);
    const filename = this.generarNombreArchivo(desde, hasta);
    const filePath = path.join(DIR, filename);

    const html = this.construirHTML(desde, hasta, datos);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" }
    });

    await browser.close();

    return {
      archivo_url: `/informes/reservas/${filename}`,
      archivo_path: filePath,
      registros: datos.length
    };
  }
}



