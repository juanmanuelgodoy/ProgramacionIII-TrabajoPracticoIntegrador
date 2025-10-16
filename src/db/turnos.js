import { conexion } from "./conexion.js";

export default class Turnos {
    // GET todos los turnos activos
    buscarTodos = async () => {
        const sql = "SELECT turno_id, orden, hora_desde, hora_hasta FROM turnos WHERE activo = 1 ORDER BY orden ASC";
        const [rows] = await conexion.execute(sql);
        return rows;
    };

    // GET por ID
    buscarPorId = async (turno_id) => {
        const sql = "SELECT turno_id, orden, hora_desde, hora_hasta FROM turnos WHERE turno_id = ? AND activo = 1";
        const [rows] = await conexion.execute(sql, [turno_id]);
        return rows[0] || null;
    };

    // POST crear turno
    crear = async ({ orden, hora_desde, hora_hasta }) => {
        const sql = "INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)";
        const [result] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
        return { turno_id: result.insertId, orden, hora_desde, hora_hasta };
    };

    // PUT editar turno
    editar = async (turno_id, { orden, hora_desde, hora_hasta }) => {
        const existente = await this.buscarPorId(turno_id);
        if (!existente) return null;

        const sql = "UPDATE turnos SET orden = ?, hora_desde = ?, hora_hasta = ? WHERE turno_id = ?";
        await conexion.execute(sql, [orden, hora_desde, hora_hasta, turno_id]);
        return { turno_id: Number(turno_id), orden, hora_desde, hora_hasta };
    };

    // DELETE soft delete
    borrar = async (turno_id) => {
        const existente = await this.buscarPorId(turno_id);
        if (!existente) return false;

        const sql = "UPDATE turnos SET activo = 0 WHERE turno_id = ?";
        await conexion.execute(sql, [turno_id]);
        return true;
    };
}
