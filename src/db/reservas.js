import { conexion } from "./conexion.js";

export default class Reservas {

    // ================================
    // BUSCAR RESERVAS
    // ================================
    buscarPropias = async (usuario_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND usuario_id = ?';
        const [reservas] = await conexion.execute(sql, [usuario_id]);
        return reservas;
    }

    buscarTodos = async () => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPorId = async (reserva_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if (reserva.length === 0) {
            return null;
        }
        return reserva[0];
    }

    // ================================
    // ELIMINAR (SOFT DELETE + BORRAR SERVICIOS)
    // ================================
    eliminar = async (reserva_id) => {

        // Borro servicios asociados
        await conexion.execute(
            'DELETE FROM reservas_servicios WHERE reserva_id = ?',
            [reserva_id]
        );

        // Soft delete
        const [r] = await conexion.execute(
            'UPDATE reservas SET activo = 0 WHERE reserva_id = ?',
            [reserva_id]
        );

        return r.affectedRows > 0; // true si se marcó como inactiva
    }

    // ================================
    // CREAR RESERVA
    // ================================
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
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total
        ]);

        if (result.affectedRows === 0) {
            return null;
        }

        return this.buscarPorId(result.insertId);
    }

    // ================================
    // MODIFICAR RESERVA + SERVICIOS
    // ================================
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
            await conexion.beginTransaction();

            // Si hay campos editables, hacer UPDATE
            if (campos.length > 0) {
                const setSql = campos.map(c => `${c} = ?`).join(', ');
                const [upd] = await conexion.execute(
                    `UPDATE reservas SET ${setSql} WHERE reserva_id = ?`,
                    [...valores, reserva_id]
                );

                if (upd.affectedRows === 0) {
                    await conexion.rollback();
                    return null;
                }
            }

            // Si vienen servicios, reemplazar
            if (Array.isArray(servicios)) {
                await conexion.execute(
                    `DELETE FROM reservas_servicios WHERE reserva_id = ?`,
                    [reserva_id]
                );

                if (servicios.length > 0) {
                    const sqlIns = `
                        INSERT INTO reservas_servicios (reserva_id, servicio_id, importe)
                        VALUES (?, ?, ?)
                    `;
                    for (const s of servicios) {
                        await conexion.execute(sqlIns, [
                            reserva_id,
                            s.servicio_id,
                            s.importe
                        ]);
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

    // ================================
    // OBTENER CORREOS DE ADMINS
    // ================================
    obtenerCorreosAdmins = async () => {
        const sql = `
            SELECT nombre_usuario AS correoAdmin
            FROM usuarios
            WHERE tipo_usuario = 1 AND activo = 1
        `;
        const [rows] = await conexion.execute(sql);

        // 🔎 LOG: qué admins hay en la DB
        console.log('[DB] ADMIN EN DB:', rows);

        return rows; // [{correoAdmin:"..."}, ...]
    }

    // ================================
    // DATOS PARA EMAIL (CLIENTE + ADMINS)
    // ================================
    datosParaNotificacion = async (reserva_id) => {

        const sql = `
            SELECT 
                DATE_FORMAT(r.fecha_reserva, '%d/%m/%Y') AS fecha,
                s.titulo AS salon,
                CONCAT(
                    TIME_FORMAT(t.hora_desde, '%H:%i'),
                    ' - ',
                    TIME_FORMAT(t.hora_hasta, '%H:%i')
                ) AS turno,
                u.nombre AS clienteNombre,
                u.apellido AS clienteApellido,
                u.nombre_usuario AS clienteCorreo
            FROM reservas r
            INNER JOIN salones s ON r.salon_id = s.salon_id
            INNER JOIN turnos t  ON r.turno_id = t.turno_id
            INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
            WHERE r.activo = 1 AND r.reserva_id = ?
            LIMIT 1
        `;

        const [rows] = await conexion.execute(sql, [reserva_id]);
        if (rows.length === 0) {
            console.warn('[DB] datosParaNotificacion: no hay filas para reserva_id=', reserva_id);
            return null;
        }

        // 🔎 LOG: qué datos de la reserva se van a usar
        console.log('[DB] DATOS NOTIF RESERVA:', rows[0]);

        const admins = await this.obtenerCorreosAdmins();

        // 🔎 LOG: admins (por si viene vacío)
        console.log('[DB] ADMIN EN DB (desde datosParaNotificacion):', admins);

        return {
            reserva: rows[0],
            admins: admins
        };
    }

    // ================================
    // CONFIRMAR RESERVA
    // ================================
    marcarConfirmada = async (reserva_id) => {
        const sql = `
            UPDATE reservas
            SET activo = 1, modificado = NOW()
            WHERE reserva_id = ?
        `;
        const [r] = await conexion.execute(sql, [reserva_id]);
        return r.affectedRows > 0;
    }
}


