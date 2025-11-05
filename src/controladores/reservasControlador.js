import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador {
  constructor() { this.reservasServicio = new ReservasServicio(); }

  crear = async (req, res) => {
    try {
      const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero,
              tematica, importe_salon, importe_total, servicios } = req.body;

      const reserva = { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero,
                        tematica, importe_salon, importe_total, servicios };

      const nuevaReserva = await this.reservasServicio.crear(reserva);
      if (!nuevaReserva) {
        return res.status(404).json({ estado:false, mensaje:'Reserva no creada' });
      }
      res.json({ estado:true, mensaje:'Reserva creada!', salon:nuevaReserva });
    } catch (err) {
      console.log('Error en POST /reservas/', err);
      res.status(500).json({ estado:false, mensaje:'Error interno del servidor.' });
    }
  }

  buscarTodos = async (req, res) => {
    try {
      const reservas = await this.reservasServicio.buscarTodos(req.user);
      res.json({ estado:true, datos: reservas });
    } catch (err) {
      console.log('Error en GET /reservas', err);
      res.status(500).json({ estado:false, mensaje:'Error interno del servidor.' });
    }
  }

  buscarPorId = async (req, res) => {
    try {
      const reserva_id = req.params.reserva_id;
      const reserva = await this.reservasServicio.buscarPorId(reserva_id, req.user); 

      if (!reserva) {
        return res.status(404).json({ estado:false, mensaje:'Reserva no encontrada.' });
      }
      res.json({ estado:true, reserva });
    } catch (err) {
      console.log('Error en GET /reservas/:reserva_id', err);
      res.status(500).json({ estado:false, mensaje:'Error interno del servidor.' });
    }
  }
  //modificar reservas
  modificar = async (req, res) => {
    try {
      const reserva_id = req.params.reserva_id;
      const datos = req.body;

      const reservaModificada = await this.reservasServicio.modificar(reserva_id, datos);

      if (!reservaModificada) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no encontrada para ser modificada."
        });
      }

      res.json({
        estado: true,
        mensaje: "¡Reserva modificada!",
        reserva: reservaModificada
      });
    } catch (err) {
  console.log("Error en PUT /reservas/:reserva_id =>",
    err && err.code,
    err && err.errno,
    err && err.sqlState,
    err && err.sqlMessage
  );
  res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  }
  // eliminar reserva
  eliminar = async (req, res) => {
    try {
      const { reserva_id } = req.params;

      const resultado = await this.reservasServicio.eliminar(reserva_id);
      if (resultado === null) {
        return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
      }
      if (resultado === false) {
        // hubo intento pero no afectó filas (raro)
        return res.status(500).json({ estado: false, mensaje: 'No se pudo eliminar la reserva.' });
      }

      res.json({ estado: true, mensaje: '¡Reserva eliminada!' });
    } catch (err) {
      console.log('Error en DELETE /reservas/:reserva_id =>',
        err?.code, err?.errno, err?.sqlState, err?.sqlMessage);
      res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
  }


  // confirmar
  confirmar = async (req, res) => {
  try {
    const ok = await this.reservasServicio.confirmar(req.params.reserva_id);
    if (!ok) {
      return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
    }
    res.json({ estado: true, mensaje: 'Reserva confirmada.' });
  } catch (err) {
    console.log('Error en PUT /reservas/:id/confirmar', err);
    res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
  }
}
}

