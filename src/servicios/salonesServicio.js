import Salones from "../db/salones.js";

export default class SalonesServicio {
    constructor() {
        this.salones = new Salones();
    }
    buscarTodos = async () => {
        return this.salones.buscarTodos();
    }

    buscarPorId = async (id) => {
    return this.salones.buscarPorId(id);
  }

  crear = async (data) => {
    return this.salones.crear(data);
  }

  editar = async (id, data) => {
    return this.salones.editar(id, data);
  }

  borrar = async (id) => {
    return this.salones.borrar(id);
  }  
}