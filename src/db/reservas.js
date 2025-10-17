import { conexion } from "./conexion.js";

export default class Reservas {

  // ========== LISTAR ==========
  buscarTodos = async (limit = 50, offset = 0) => {
    const sql = `
      SELECT
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.foto_cumpleaniero,
        r.importe_salon,
        r.importe_total,

        JSON_OBJECT(
          'salon_id', s.salon_id,
          'titulo',   s.titulo
        ) AS salon,

        JSON_OBJECT(
          'turno_id',    t.turno_id,
          'hora_desde',  t.hora_desde,
          'hora_hasta',  t.hora_hasta
        ) AS turno,

        COALESCE(
          JSON_ARRAYAGG(
            IF(sv.servicio_id IS NULL, NULL,
              JSON_OBJECT(
                'servicio_id', sv.servicio_id,
                'descripcion', sv.descripcion,
                'importe',     COALESCE(rs.importe, sv.importe)
              )
            )
          ORDER BY sv.descripcion
          ),
          JSON_ARRAY()
        ) AS servicios

      FROM reservas r
      INNER JOIN salones s ON s.salon_id = r.salon_id AND s.activo = 1
      INNER JOIN turnos  t ON t.turno_id = r.turno_id AND t.activo = 1
      LEFT JOIN reservas_servicios rs ON rs.reserva_id = r.reserva_id
      LEFT JOIN servicios sv ON sv.servicio_id = rs.servicio_id AND sv.activo = 1
      WHERE r.activo = 1
      GROUP BY r.reserva_id
      ORDER BY r.creado DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await conexion.execute(sql, [Number(limit), Number(offset)]);
    return rows.map(r => ({
      reserva_id: r.reserva_id,
      fecha_reserva: r.fecha_reserva,
      tematica: r.tematica,
      foto_cumpleaniero: r.foto_cumpleaniero,
      importe_salon: r.importe_salon,
      importe_total: r.importe_total,
      salon: typeof r.salon === "string" ? JSON.parse(r.salon) : r.salon,
      turno: typeof r.turno === "string" ? JSON.parse(r.turno) : r.turno,
      servicios: typeof r.servicios === "string" ? JSON.parse(r.servicios) : r.servicios
    }));
  };

  // ========== OBTENER POR ID ==========
  buscarPorId = async (reserva_id) => {
    const sql = `
      SELECT
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.foto_cumpleaniero,
        r.importe_salon,
        r.importe_total,

        JSON_OBJECT(
          'salon_id',  s.salon_id,
          'titulo',    s.titulo,
          'direccion', s.direccion,
          'capacidad', s.capacidad,
          'importe',   s.importe
        ) AS salon,

        JSON_OBJECT(
          'turno_id',    t.turno_id,
          'hora_desde',  t.hora_desde,
          'hora_hasta',  t.hora_hasta
        ) AS turno,

        COALESCE(
          JSON_ARRAYAGG(
            IF(sv.servicio_id IS NULL, NULL,
              JSON_OBJECT(
                'servicio_id', sv.servicio_id,
                'descripcion', sv.descripcion,
                'importe',     COALESCE(rs.importe, sv.importe)
              )
            )
          ORDER BY sv.descripcion
          ),
          JSON_ARRAY()
        ) AS servicios

      FROM reservas r
      INNER JOIN salones s ON s.salon_id = r.salon_id AND s.activo = 1
      INNER JOIN turnos  t ON t.turno_id = r.turno_id AND t.activo = 1
      LEFT JOIN reservas_servicios rs ON rs.reserva_id = r.reserva_id
      LEFT JOIN servicios sv ON sv.servicio_id = rs.servicio_id AND sv.activo = 1
      WHERE r.activo = 1 AND r.reserva_id = ?
      GROUP BY r.reserva_id
    `;

    const [rows] = await conexion.execute(sql, [reserva_id]);
    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      reserva_id: r.reserva_id,
      fecha_reserva: r.fecha_reserva,
      tematica: r.tematica,
      foto_cumpleaniero: r.foto_cumpleaniero,
      importe_salon: r.importe_salon,
      importe_total: r.importe_total,
      salon: typeof r.salon === "string" ? JSON.parse(r.salon) : r.salon,
      turno: typeof r.turno === "string" ? JSON.parse(r.turno) : r.turno,
      servicios: typeof r.servicios === "string" ? JSON.parse(r.servicios) : r.servicios
    };
  };

  // ========== CREAR ==========
  crear = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total
    } = reserva;

    const sql = `
      INSERT INTO reservas
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
      VALUES (?,?,?,?,?,?,?,?)
    `;

    const [result] = await conexion.execute(sql, [
      fecha_reserva, salon_id, usuario_id, turno_id,
      foto_cumpleaniero, tematica, importe_salon, importe_total
    ]);

    if (result.affectedRows === 0) return null;

    return this.buscarPorId(result.insertId);
  };

  // ========== DATOS PARA NOTIFICACIÓN ==========
  datosParaNotificacion = async (reserva_id) => {
    const sql = `
      SELECT
        r.fecha_reserva AS fecha,
        s.titulo        AS salon,
        t.orden         AS turno
      FROM reservas r
      INNER JOIN salones s ON s.salon_id = r.salon_id
      INNER JOIN turnos  t ON t.turno_id = r.turno_id
      WHERE r.activo = 1 AND r.reserva_id = ?
    `;
    const [reserva] = await conexion.execute(sql, [reserva_id]);
    if (reserva.length === 0) return null;
    return reserva[0];
  };
}



