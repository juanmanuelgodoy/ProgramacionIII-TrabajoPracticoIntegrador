import Turnos from "../db/turnos.js";

export default class TurnosServicio {
    constructor() {
        this.turnos = new Turnos();
    }

    // GET: obtener todos los turnos
    buscarTodos = async () => {
        return this.turnos.buscarTodos();
    };

    // GET: obtener turno por ID
    buscarPorId = async (turno_id) => {
        return this.turnos.buscarPorId(turno_id);
    };

    // POST: crear nuevo turno
    crear = async (data) => {
        return this.turnos.crear(data);
    };

    // PUT: editar turno
    editar = async (turno_id, data) => {
        return this.turnos.editar(turno_id, data);
    };

    // DELETE: borrar turno (soft delete)
    borrar = async (turno_id) => {
        return this.turnos.borrar(turno_id);
    };
}
