import { conexion } from "./conexion.js";

export default class Usuarios {

  buscar = async (nombre_usuario, contrasenia) => {
    const sql = `
      SELECT u.usuario_id, CONCAT(u.nombre, ' ', u.apellido) AS usuario, u.tipo_usuario
      FROM usuarios u
      WHERE u.nombre_usuario = ?
        AND u.contrasenia = SHA2(?, 256)
        AND u.activo = 1;
    `;
    const [result] = await conexion.query(sql, [nombre_usuario, contrasenia]);
    return result[0];
  };

  buscarPorId = async (usuario_id) => {
    const sql = `
      SELECT u.usuario_id, u.tipo_usuario, u.nombre, u.apellido, u.nombre_usuario,
             CONCAT(u.nombre, ' ', u.apellido) AS usuario
      FROM usuarios u
      WHERE u.usuario_id = ? AND u.activo = 1;
    `;
    const [result] = await conexion.query(sql, [usuario_id]);
    return result[0];
  };

  // ======= NUEVOS =======

  buscarTodos = async () => {
    const sql = `
      SELECT u.usuario_id, u.nombre, u.apellido, u.nombre_usuario, u.tipo_usuario
      FROM usuarios u
      WHERE u.activo = 1
      ORDER BY u.usuario_id DESC;
    `;
    const [rows] = await conexion.query(sql);
    return rows;
  };

  crear = async (datos) => {
    const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = datos;

    const sql = `
      INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo)
      VALUES (?, ?, ?, SHA2(?,256), ?, 1)
    `;

    const [r] = await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario]);
    if (r.affectedRows === 0) return null;
    return this.buscarPorId(r.insertId);
  };

  modificar = async (usuario_id, datos) => {
    const permitidos = ['nombre', 'apellido', 'nombre_usuario', 'contrasenia', 'tipo_usuario'];

    const campos = Object.keys(datos).filter(k => permitidos.includes(k));
    if (campos.length === 0) return await this.buscarPorId(usuario_id);

    // SET dinámico con hash si viene 'contrasenia'
    const parts = [];
    const values = [];
    for (const c of campos) {
      if (c === 'contrasenia') {
        parts.push(`contrasenia = SHA2(?,256)`);
        values.push(datos[c]);
      } else {
        parts.push(`${c} = ?`);
        values.push(datos[c]);
      }
    }
    const setSql = parts.join(', ');

    const [upd] = await conexion.execute(
      `UPDATE usuarios SET ${setSql} WHERE usuario_id = ?`,
      [...values, usuario_id]
    );
    if (upd.affectedRows === 0) return null;
    return this.buscarPorId(usuario_id);
  };

  eliminar = async (usuario_id) => {
    const [r] = await conexion.execute(
      `UPDATE usuarios SET activo = 0 WHERE usuario_id = ?`,
      [usuario_id]
    );
    return r.affectedRows > 0;
  };
}

