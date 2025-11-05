import { conexion } from "./conexion.js";

export default class Turnos {

  buscarTodos = async () => {
    const sql = `
      SELECT turno_id, orden, TIME_FORMAT(hora_desde, '%H:%i') AS hora_desde,
            TIME_FORMAT(hora_hasta, '%H:%i') AS hora_hasta
      FROM turnos
      WHERE activo = 1
      ORDER BY orden ASC
    `;
    const [filas] = await conexion.execute(sql);
    return filas;
  };

  buscarPorId = async (turno_id) => {
    const sql = `
      SELECT turno_id, orden, TIME_FORMAT(hora_desde, '%H:%i') AS hora_desde,
            TIME_FORMAT(hora_hasta, '%H:%i') AS hora_hasta
      FROM turnos
      WHERE activo = 1 AND turno_id = ?
    `;
    const [filas] = await conexion.execute(sql, [turno_id]);
    if (filas.length === 0) return null;
    return filas[0];
  };

  crear = async ({ orden, hora_desde, hora_hasta }) => {
    const sql = `
      INSERT INTO turnos (orden, hora_desde, hora_hasta, activo, creado, modificado)
      VALUES (?, ?, ?, 1, NOW(), NOW())
    `;
    const [res] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
    return { turno_id: res.insertId, orden, hora_desde, hora_hasta };
  };

  actualizar = async (turno_id, { orden, hora_desde, hora_hasta }) => {
    const sql = `
      UPDATE turnos
      SET orden = ?, hora_desde = ?, hora_hasta = ?, modificado = NOW()
      WHERE turno_id = ? AND activo = 1
    `;
    const [res] = await conexion.execute(sql, [orden, hora_desde, hora_hasta, turno_id]);
    return res.affectedRows > 0;
  };

  eliminar = async (turno_id) => {
    const sql = `
      UPDATE turnos
      SET activo = 0, modificado = NOW()
      WHERE turno_id = ?
    `;
    const [res] = await conexion.execute(sql, [turno_id]);
    return res.affectedRows > 0;
  };
}

