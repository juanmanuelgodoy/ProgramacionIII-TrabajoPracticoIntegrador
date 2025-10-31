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
// El secret debe ser el MISMO que uses al firmar el token en el login
const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Se usa  mismo env en el login
  },
  async (jwtPayload, done) => {
    try {
      // Unificamos a `uid` en el payload
      const uid = jwtPayload?.uid;
      if (!uid) {
        return done(null, false, { mensaje: "Payload sin uid." });
      }

      const usuariosServicio = new UsuariosService();
      const usuario = await usuariosServicio.buscarPorId(uid);
      if (!usuario) {
        return done(null, false, { mensaje: "Token incorrecto!" });
      }

      // Devolvemos un objeto compacto, con `uid` y `tipo_usuario`
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

