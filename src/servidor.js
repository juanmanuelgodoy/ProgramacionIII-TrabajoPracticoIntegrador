import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import { estrategia, validacion } from "./config/passport.js";

import { router as authRoutes } from "./v1/rutas/authRoutes.js";
import { router as salonesRutas } from "./v1/rutas/salonesRutas.js";
import { router as reservasRutas } from "./v1/rutas/reservasRutas.js";
import { router as serviciosRutas } from "./v1/rutas/serviciosRutas.js";
import { router as turnosRutas } from "./v1/rutas/turnosRutas.js";
import { router as usuariosRutas } from "./v1/rutas/usuariosRutas.js";

process.loadEnvFile();

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Passport
app.use(passport.initialize());
passport.use("local", estrategia);   // login local
passport.use("jwt", validacion);     // validación de token

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Rutas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/salones", salonesRutas);
app.use("/api/v1/reservas", reservasRutas);
app.use("/api/v1/servicios", serviciosRutas);
app.use("/api/v1/turnos", turnosRutas);
app.use("/api/v1/usuarios", usuariosRutas);

const PORT = process.env.PUERTO || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en ${PORT}`);
});

export default app;
