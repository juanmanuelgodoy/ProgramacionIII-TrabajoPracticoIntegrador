import { conexion } from "./conexion.js";

export default class servicios {
    buscarTodosServiciosCompletos = async () => {
        const sql = "SELECT * FROM servicios WHERE activo = 1";
        const [results] = await conexion.execute(sql);
        return results;
    };

    // GET /api/v1/servicios
    buscarTodos = async () => {
        const sql = "SELECT servicio_id, descripcion, importe FROM servicios WHERE activo = 1";
        const [rows] = await conexion.execute(sql);
        return rows;
    };

    // GET /api/v1/servicios/:servicio_id
    buscarPorId = async (servicio_id) => {
        const sql = "SELECT servicio_id, descripcion, importe FROM servicios WHERE servicio_id = ? AND activo = 1";
        const [rows] = await conexion.execute(sql, [servicio_id]);
        return rows[0] || null;
    };

    // POST /api/v1/servicios
    crear = async ({ descripcion, importe }) => {
        const sql = "INSERT INTO servicios (descripcion, importe) VALUES (?, ?)";
        const [result] = await conexion.execute(sql, [descripcion, importe]);
        return { servicio_id: result.insertId, descripcion, importe };
    };

    // PUT /api/v1/servicios/:servicio_id
    editar = async (servicio_id, { descripcion, importe }) => {
        const existente = await this.buscarPorId(servicio_id);
        if (!existente) return null;

        const sql = "UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?";
        await conexion.execute(sql, [descripcion, importe, servicio_id]);
        return { servicio_id: Number(servicio_id), descripcion, importe };
    };

    // DELETE /api/v1/servicios/:servicio_id (soft delete)
    borrar = async (servicio_id) => {
        const existente = await this.buscarPorId(servicio_id);
        if (!existente) return false;

        const sql = "UPDATE servicios SET activo = 0 WHERE servicio_id = ?";
        await conexion.execute(sql, [servicio_id]);
        return true;
    };
}
