import { Router } from "express";
import LoginControlador from "../../controladores/loginControlador.js";

const r = Router();
const c = new LoginControlador();

r.post("/login", c.login);

export default r;

