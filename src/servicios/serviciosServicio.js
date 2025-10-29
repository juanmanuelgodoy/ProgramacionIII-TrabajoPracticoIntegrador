import Servicios from "../db/servicios.js";

export default class ServiciosServicio {
  constructor() { this.servicios = new Servicios(); }

  buscarTodos = () => this.servicios.buscarTodos();
  buscarPorId = (id) => this.servicios.buscarPorId(id);

  crear = (dto) => this.servicios.crear(dto);

  actualizar = async (id, dto) => {
    const ok = await this.servicios.actualizar(id, dto);
    if (!ok) return null;
    return this.servicios.buscarPorId(id);
  };

  eliminar = (id) => this.servicios.eliminar(id);
}

