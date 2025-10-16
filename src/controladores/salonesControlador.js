import apicache from 'apicache';
import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador{

    constructor(){
        this.salonesServicio = new SalonesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const salones = await this.salonesServicio.buscarTodos();

            res.json({
                estado: true, 
                datos: salones
            });
    
        } catch (err) {
            console.log('Error en GET /salones', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorID = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarPorId(salon_id);

            if (!salon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                })
            }

            res.json({
                estado: true, 
                salon: salon
            });
    
        } catch (err) {
            console.log('Error en GET /salones/salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    modificar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const datos = req.body;

            const salonModificado = await this.salonesServicio.modificar(salon_id, datos);

            if (!salonModificado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado para ser modificado.'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Salón modificado!',
                salon: salonModificado
            });
    
        } catch (err) {
            console.log('Error en PUT /salones/:salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const {titulo, direccion, capacidad, importe} = req.body;

            const salon =  {
                titulo, 
                direccion, 
                capacidad, 
                importe
            }
            
            const nuevoSalon = await this.salonesServicio.crear(salon);

            if (!nuevoSalon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no creado'
                })
            }

            // limpiaR cache del grupo "salones" para que el próximo GET traiga datos frescos
            apicache.clear('salones');
            console.log('Cache "salones" limpiada después de crear');

            res.json({
                estado: true, 
                mensaje: 'Salón creado!',
                salon: nuevoSalon
            });
    
        } catch (err) {
            console.log('Error en POST /salones/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    eliminar = async (req, res) => {
  try {
    const salon_id = req.params.salon_id;

    // llamo al servicio para eliminar el salón
    const salonEliminado = await this.salonesServicio.eliminar(salon_id);

    if (!salonEliminado) {
      return res.status(404).json({
        estado: false,
        mensaje: 'Salón no encontrado o ya eliminado.'
      });
    }

    // limpio la caché para que el GET traiga datos actualizados
    apicache.clear('salones');
    console.log('Cache "salones" limpiada después de eliminar');

    res.json({
      estado: true,
      mensaje: 'Salón eliminado correctamente.'
    });

  } catch (err) {
    console.log('Error en DELETE /salones/:salon_id', err);
    res.status(500).json({
      estado: false,
      mensaje: 'Error interno del servidor.'
    });
  }
}
}
