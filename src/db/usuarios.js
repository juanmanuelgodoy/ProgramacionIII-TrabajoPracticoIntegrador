import { conexion } from "./conexion.js";

export default class Usuarios {
    // GET /api/v1/usuarios
    buscarTodos = async () => {
        const sql = `
        SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto
        FROM usuarios
        WHERE activo = 1
    `;
        const [rows] = await conexion.execute(sql);
        return rows;
    };

    // GET /api/v1/usuarios/:usuario_id
    buscarPorId = async (usuario_id) => {
        const sql = `
        SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto
        FROM usuarios
        WHERE usuario_id = ? AND activo = 1
    `;
        const [rows] = await conexion.execute(sql, [usuario_id]);
        return rows[0] || null;
    };

    // POST /api/v1/usuarios
    crear = async ({ nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
        const sql = `
        INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;
        const [result] = await conexion.execute(sql, [
            nombre ?? null,
            apellido ?? null,
            nombre_usuario ?? null,
            contrasenia ?? null,
            tipo_usuario ?? null,
            celular ?? null,
            foto ?? null
        ]);

        return {
            usuario_id: result.insertId,
            nombre,
            apellido,
            nombre_usuario,
            tipo_usuario,
            celular,
            foto
        };
    };

    // PUT /api/v1/usuarios/:usuario_id
    editar = async (usuario_id, { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
        const existente = await this.buscarPorId(usuario_id);
        if (!existente) return null;

        const sql = `
        UPDATE usuarios
        SET nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = ?, tipo_usuario = ?, celular = ?, foto = ?
        WHERE usuario_id = ? AND activo = 1
    `;

        const valores = [
            nombre ?? null,
            apellido ?? null,
            nombre_usuario ?? null,
            contrasenia ?? null,
            tipo_usuario ?? null,
            celular ?? null,
            foto ?? null,
            usuario_id ?? null,
        ];

        await conexion.execute(sql, valores);

        return {
            usuario_id: Number(usuario_id),
            nombre,
            apellido,
            nombre_usuario,
            tipo_usuario,
            celular,
            foto,
        };
    };

    // DELETE /api/v1/usuarios/:usuario_id (soft delete)
    borrar = async (usuario_id) => {
        const existente = await this.buscarPorId(usuario_id);
        if (!existente) return false;

        const sql = "UPDATE usuarios SET activo = 0 WHERE usuario_id = ?";
        await conexion.execute(sql, [usuario_id]);
        return true;
    };
}
