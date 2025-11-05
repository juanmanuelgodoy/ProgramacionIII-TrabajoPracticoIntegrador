import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalSrategy } from "passport-local";
import UsuariosService from "../servicios/usuariosServicio.js";

// ============ ESTRATEGIA LOCAL ============
const estrategia = new LocalSrategy(
  {
    usernameField: "nombre_usuario",
    passwordField: "contrasenia",
  },
  async (nombre_usuario, contrasenia, done) => {
    try {
      const usuariosServicio = new UsuariosService();
      const usuario = await usuariosServicio.buscar(nombre_usuario, contrasenia);
      if (!usuario) {
        return done(null, false, { mensaje: "Login incorrecto!" });
      }
      return done(null, usuario, { mensaje: "Login correcto!" });
    } catch (exc) {
      done(exc);
    }
  }
);

// ============ ESTRATEGIA JWT ============
const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, 
  },
  async (jwtPayload, done) => {
    try {

      const uid = jwtPayload?.uid;
      if (!uid) {
        return done(null, false, { mensaje: "Payload sin uid." });
      }

      const usuariosServicio = new UsuariosService();
      const usuario = await usuariosServicio.buscarPorId(uid);
      if (!usuario) {
        return done(null, false, { mensaje: "Token incorrecto!" });
      }

      return done(null, {
        uid: usuario.usuario_id,
        tipo_usuario: usuario.tipo_usuario,
      });
    } catch (err) {
      return done(err, false);
    }
  }
);

export { estrategia, validacion };

