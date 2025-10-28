import { conexion } from "./conexion.js";

export default class Servicios {

  buscarTodos = async () => {
    const sql = `
      SELECT servicio_id, descripcion, importe
      FROM servicios
      WHERE activo = 1
      ORDER BY descripcion
    `;
    const [filas] = await conexion.execute(sql);
    return filas;
  };

  buscarPorId = async (servicio_id) => {
    const sql = `
      SELECT servicio_id, descripcion, importe
      FROM servicios
      WHERE activo = 1 AND servicio_id = ?
    `;
    const [filas] = await conexion.execute(sql, [servicio_id]);
    if (filas.length === 0) return null;
    return filas[0];
  };

  crear = async ({ descripcion, importe }) => {
    const sql = `
      INSERT INTO servicios (descripcion, importe, activo, creado, modificado)
      VALUES (?, ?, 1, NOW(), NOW())
    `;
    const [res] = await conexion.execute(sql, [descripcion, importe]);
    return { servicio_id: res.insertId, descripcion, importe };
  };

  actualizar = async (servicio_id, { descripcion, importe }) => {
    const sql = `
      UPDATE servicios
      SET descripcion = ?, importe = ?, modificado = NOW()
      WHERE servicio_id = ? AND activo = 1
    `;
    const [res] = await conexion.execute(sql, [descripcion, importe, servicio_id]);
    return res.affectedRows > 0;
  };

  eliminar = async (servicio_id) => {
    const sql = `
      UPDATE servicios
      SET activo = 0, modificado = NOW()
      WHERE servicio_id = ?
    `;
    const [res] = await conexion.execute(sql, [servicio_id]);
    return res.affectedRows > 0;
  };
}

