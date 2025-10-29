import Turnos from "../db/turnos.js";

export default class TurnosServicio {
  constructor() { this.turnos = new Turnos(); }

  buscarTodos = () => this.turnos.buscarTodos();
  buscarPorId = (id) => this.turnos.buscarPorId(id);

  crear = (dto) => this.turnos.crear(dto);

  actualizar = async (id, dto) => {
    const ok = await this.turnos.actualizar(id, dto);
    if (!ok) return null;
    return this.turnos.buscarPorId(id);
  };

  eliminar = (id) => this.turnos.eliminar(id);
}

