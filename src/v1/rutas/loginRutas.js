import { Router } from "express";
import LoginControlador from "../../controladores/authControlador.js";

const controlador = new LoginControlador();
const router = Router();

router.post("/login", controlador.login);

export default router;