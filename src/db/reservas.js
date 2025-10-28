import { conexion } from "./conexion.js";

export default class Reservas {

    buscarPropias = async(usuario_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND usuario_id = ?';
        const [reservas] = await conexion.execute(sql, [usuario_id]);
        return reservas;
    }
    
    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPorId = async(reserva_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }

        return reserva[0];
    }
   // eliminar reserva
    eliminar = async (reserva_id) => {
  // Limpio servicios asociados (tabla puente) y hago soft delete en reservas
  await conexion.execute(
    'DELETE FROM reservas_servicios WHERE reserva_id = ?',
    [reserva_id]
  );

  const [r] = await conexion.execute(
    'UPDATE reservas SET activo = 0 WHERE reserva_id = ?',
    [reserva_id]
  );

  return r.affectedRows > 0; // true si se marcó como inactiva
}

    crear = async(reserva) => {
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
        
        const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`;
        
        const [result] = await conexion.execute(sql, 
            [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);

        if (result.affectedRows === 0){
            return null;
        }

        return this.buscarPorId(result.insertId);
    }
// modificar reservas
    modificar = async (reserva_id, datos) => {
  const permitidos = [
    'fecha_reserva',
    'salon_id',
    'usuario_id',
    'turno_id',
    'foto_cumpleaniero',
    'tematica',
    'importe_salon',
    'importe_total'
  ];

  const { servicios, ...resto } = datos || {};
  const campos = Object.keys(resto).filter(c => permitidos.includes(c));
  const valores = campos.map(c => resto[c]);

  try {
    // Usamos la MISMA conexión (createConnection) para la transacción
    await conexion.beginTransaction();

    // UPDATE de reservas (si llegó algún campo editable)
    if (campos.length > 0) {
      const setSql = campos.map(c => `${c} = ?`).join(', ');
      const [upd] = await conexion.execute(
        `UPDATE reservas SET ${setSql} WHERE reserva_id = ?`,
        [...valores, reserva_id]
      );
      if (upd.affectedRows === 0) {
        await conexion.rollback();
        return null; // no existe la reserva
      }
    }

    // Reemplazo de servicios SOLO si vino "servicios" en el body
    if (Array.isArray(servicios)) {
      await conexion.execute(`DELETE FROM reservas_servicios WHERE reserva_id = ?`, [reserva_id]);
      if (servicios.length > 0) {
        const sqlIns = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)`;
        for (const s of servicios) {
          await conexion.execute(sqlIns, [reserva_id, s.servicio_id, s.importe]);
        }
      }
    }

    await conexion.commit();
    return await this.buscarPorId(reserva_id);
  } catch (e) {
    try { await conexion.rollback(); } catch {}
    throw e;
  }
}

    datosParaNotificacion = async(reserva_id) => {
        const sql = `CALL obtenerDatosNotificacion(?)`;
        
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }

        return reserva;
    }
    
    // Marcar una reserva como confirmada (sin usar columna "estado")
marcarConfirmada = async (reserva_id) => {
  const sql = `
    UPDATE reservas
    SET activo = 1, modificado = NOW()
    WHERE reserva_id = ?;
  `;
  const [r] = await conexion.execute(sql, [reserva_id]);
  return r.affectedRows > 0;
}
}

