import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesService from "./notificacionesServicio.js";

export default class ReservasServicio {

  constructor() {
    this.reserva = new Reservas();
    this.reservas_servicios = new ReservasServicios();
    this.notificaciones_servicios = new NotificacionesService(); // ✅ corregido
  }

  // =============================
  // BUSCAR TODOS
  // =============================
  buscarTodos = (usuario) => {
    if (usuario.tipo_usuario < 3) return this.reserva.buscarTodos();
    return this.reserva.buscarPropias(usuario.usuario_id);
  }

  // =============================
  // BUSCAR POR ID
  // =============================
  buscarPorId = async (reserva_id, usuario) => {
    const r = await this.reserva.buscarPorId(reserva_id);
    if (!r) return null;

    // Cliente solo puede ver sus propias reservas
    if (usuario.tipo_usuario === 3 && r.usuario_id !== usuario.usuario_id) {
      return null;
    }

    return r;
  }

  // =============================
  // CREAR RESERVA
  // =============================
  crear = async (reserva) => {

    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      servicios
    } = reserva;

    const nuevaReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total
    };

    // Guardamos la reserva
    const result = await this.reserva.crear(nuevaReserva);
    if (!result) return null;

    // Insertamos servicios
    await this.reservas_servicios.crear(result.reserva_id, servicios);

    // Notificación a administradores
    try {
      const datos = await this.reserva.datosParaNotificacion(result.reserva_id);
      await this.notificaciones_servicios.enviarCorreoAdmins(datos); // ✅ cambiado
      console.log('DATOS NOTIFICACION (CREAR):', datos); //AGREGADO PARA TESTEO 
    } catch (e) {
      console.log('Advertencia: No se pudo enviar el correo a administradores.', e?.message);
    }

    return this.reserva.buscarPorId(result.reserva_id);
  }

  // =============================
  // MODIFICAR RESERVA
  // =============================
  modificar = async (reserva_id, datos) => {
    const existe = await this.reserva.buscarPorId(reserva_id);
    if (!existe) return null;

    return await this.reserva.modificar(reserva_id, datos);
  }

  // =============================
  // ELIMINAR RESERVA
  // =============================
  eliminar = async (reserva_id) => {
    const existe = await this.reserva.buscarPorId(reserva_id);
    if (!existe) return null;  // 404

    const ok = await this.reserva.eliminar(reserva_id);
    return ok; // true / false
  }

  // =============================
  // CONFIRMAR RESERVA (ADMIN/EMPLEADO)
  // =============================
  confirmar = async (reserva_id) => {

    const ok = await this.reserva.marcarConfirmada(reserva_id);
    if (!ok) return false;

    try {
      const datos = await this.reserva.datosParaNotificacion(reserva_id);
      await this.notificaciones_servicios.enviarCorreoCliente(datos); 
      console.log('DATOS NOTIFICACION (CONFIRMAR):', datos); //AGREGADO PARA TESTEO
    } catch (e) {
      console.log('Advertencia: no se pudo enviar el correo de confirmación.', e?.message);
    }

    return true;
  }
}


