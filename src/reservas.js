import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { estrategia, validacion } from "./config/passport.js";

import { router as authRoutes } from "./v1/rutas/authRutas.js";
import { router as salonesRutas } from "./v1/rutas/salonesRutas.js";
import { router as reservasRutas } from "./v1/rutas/reservasRutas.js";
import { router as serviciosRutas } from "./v1/rutas/serviciosRutas.js";
import { router as turnosRutas } from "./v1/rutas/turnosRutas.js";
import { router as usuariosRutas } from "./v1/rutas/usuariosRutas.js";
import { router as informesRutas } from "./v1/rutas/informesRutas.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =======================
   Middlewares base
======================= */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =======================
   Carpeta pública
======================= */
const PUBLIC_DIR = path.join(__dirname, "../public");
app.use(express.static(PUBLIC_DIR));

/* =======================
   Passport
======================= */
app.use(passport.initialize());
passport.use("local", estrategia);
passport.use("jwt", validacion);

/* =======================
   Rutas públicas
======================= */
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/v1/auth", authRoutes);

/* =======================
   Rutas protegidas
======================= */
app.use("/api/v1/salones", passport.authenticate("jwt", { session: false }), salonesRutas);
app.use("/api/v1/reservas", passport.authenticate("jwt", { session: false }), reservasRutas);
app.use("/api/v1/servicios", passport.authenticate("jwt", { session: false }), serviciosRutas);
app.use("/api/v1/turnos", passport.authenticate("jwt", { session: false }), turnosRutas);
app.use("/api/v1/usuarios", passport.authenticate("jwt", { session: false }), usuariosRutas);
app.use("/api/v1/informes", passport.authenticate("jwt", { session: false }), informesRutas);

/* =======================
   Swagger
======================= */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =======================
   Server
======================= */
const PORT = process.env.PUERTO || 3000;
app.listen(PORT, () => {
   console.log("======================================");
   console.log(`Servidor iniciado en http://localhost:${PORT}`);
   console.log("======================================");
});

export default app;
