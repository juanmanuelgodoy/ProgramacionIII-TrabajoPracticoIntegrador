import Servicios from "../db/servicios.js";

export default class ServiciosServicio {
    constructor() {
        this.servicios = new Servicios();
    }

    // GET: obtener todos los servicios
    buscarTodos = async () => {
        return this.servicios.buscarTodos();
    };

    // GET: obtener servicio por ID
    buscarPorId = async (servicio_id) => {
        return this.servicios.buscarPorId(servicio_id);
    };

    // POST: crear nuevo servicio
    crear = async (data) => {
        return this.servicios.crear(data);
    };

    // PUT: editar servicio
    editar = async (servicio_id, data) => {
        return this.servicios.editar(servicio_id, data);
    };

    // DELETE: borrar servicio (soft delete)
    borrar = async (servicio_id) => {
        return this.servicios.borrar(servicio_id);
    };
}
