import { conexion } from "../db/conexion.js";

export default class ReservasServicios {
    crear = async (reservaServicio) => {
        try {
            await conexion.beginTransaction();
            for (const servicio of ReservasServicios) {
                const sql = 'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)';
                conexion.execute(sql, [reservaServicio.reserva_id, servicio.servicio_id, servicio.importe]);
            }
            conexion.commit();
            return true;
        } catch (error) {
            await conexion.rollback();
            console.log('Error en crear reservaServicio', error);
            throw error;
        }
    }
}
