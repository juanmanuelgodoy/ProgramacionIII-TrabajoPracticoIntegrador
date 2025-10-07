import {conexion} from "./conexion.js";

export default class salones {
    buscarTodos = async () => {
        const sql = 'SELECT * FROM salones WHERE activo=1';
        const [results, fields] = await conexion.execute(sql);
        return salones;
    }

    // GET /api/v1/salones
  buscarTodos = async () => {
    const sql = "SELECT salon_id, titulo, direccion, capacidad, importe FROM salones WHERE activo = 1";
    const [rows] = await conexion.execute(sql);
    return rows;
  };

  // GET /api/v1/salones/:id
  buscarPorId = async (id) => {
    const sql = "SELECT salon_id, titulo, direccion, capacidad, importe FROM salones WHERE salon_id = ? AND activo = 1";
    const [rows] = await conexion.execute(sql, [id]);
    return rows[0] || null;
  };

  // POST /api/v1/salones
  crear = async ({ titulo, direccion, capacidad, importe }) => {
    const sql = "INSERT INTO salones (titulo, direccion, capacidad, importe, activo) VALUES (?, ?, ?, ?, 1)";
    const [result] = await conexion.execute(sql, [titulo, direccion, capacidad, importe]);
    return { salon_id: result.insertId, titulo, direccion, capacidad, importe };
  };

  // PUT /api/v1/salones/:salon_id
  editar = async (id, { titulo, direccion, capacidad, importe }) => {
    // Verifico que el salón exista
    const existente = await this.buscarPorId(id);
    if (!existente) return null;

    const sql = "UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?";
    await conexion.execute(sql, [titulo, direccion, capacidad, importe, id]);
    return { salon_id: Number(id), titulo, direccion, capacidad, importe };
  };

  // DELETE /api/v1/salones/:salon_id (soft delete)
  borrar = async (id) => {
    const existente = await this.buscarPorId(id);
    if (!existente) return false;

    const sql = "UPDATE salones SET activo = 0 WHERE salon_id = ?";
    await conexion.execute(sql, [id]);
    return true;
  };
}

