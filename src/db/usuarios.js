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

// Actualizar contraseña → siempre guarda SHA256
  actualizarContrasenia = async (usuario_id, nuevaContrasenia) => {
    const [r] = await conexion.query(
      "UPDATE usuarios SET contrasenia = SHA2(?,256) WHERE usuario_id = ?",
      [nuevaContrasenia, usuario_id]
    );
    return r.affectedRows === 1;
  };

  // Cambio atómico: valida actual y setea nueva
  cambiarConContraseniaActual = async (usuario_id, actual, nueva) => {
    const [r] = await conexion.query(
      `UPDATE usuarios
          SET contrasenia = SHA2(?,256)
        WHERE usuario_id = ?
          AND contrasenia = SHA2(?,256)`,
      [nueva, usuario_id, actual]
    );
    return r.affectedRows === 1;
  };

  // ─────────────── Tokens de reinicio ───────────────

  crearResetToken = async ({ usuario_id, token_hash, expira_en }) => {
    const sql = `
      INSERT INTO usuarios_resets (usuario_id, token_hash, expira_en, usado)
      VALUES (?, ?, ?, 0)
    `;
    const [result] = await conexion.execute(sql, [
      usuario_id,
      token_hash,
      expira_en,
    ]);
    return result.insertId;
  };

  buscarResetPorTokenHash = async (token_hash) => {
    const sql = `
      SELECT reset_id, usuario_id, expira_en, usado
      FROM usuarios_resets
      WHERE token_hash = ?
      LIMIT 1
    `;
    const [rows] = await conexion.execute(sql, [token_hash]);
    return rows[0] || null;
  };

  marcarResetComoUsado = async (reset_id) => {
    const sql = `
      UPDATE usuarios_resets
      SET usado = 1
      WHERE reset_id = ?
    `;
    const [result] = await conexion.execute(sql, [reset_id]);
    return result.affectedRows > 0;
  };

  invalidarTokensUsuario = async (usuario_id) => {
    const sql = `
      UPDATE usuarios_resets
      SET usado = 1
      WHERE usuario_id = ? AND usado = 0
    `;
    await conexion.execute(sql, [usuario_id]);
  };

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

    const [r] = await conexion.execute(sql, [
      nombre, apellido, nombre_usuario, contrasenia, tipo_usuario
    ]);

    if (r.affectedRows === 0) return null;
    return this.buscarPorId(r.insertId);
  };

  modificar = async (usuario_id, datos) => {
    const permitidos = ['nombre', 'apellido', 'nombre_usuario', 'contrasenia', 'tipo_usuario'];

    const campos = Object.keys(datos).filter(k => permitidos.includes(k));
    if (campos.length === 0) return await this.buscarPorId(usuario_id);

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


