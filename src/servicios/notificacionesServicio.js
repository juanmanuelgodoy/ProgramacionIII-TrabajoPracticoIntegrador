process.loadEnvFile();   // Cargar .env

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesService {

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(__filename);

    // 1) Plantilla
    const plantillaPath = path.join(this.__dirname, '../utiles/plantilla.hbs');
    const plantilla = fs.readFileSync(plantillaPath, 'utf-8');
    this.template = handlebars.compile(plantilla);

    // 2) Elegir credenciales: CORREO/CLAVE o USERCORREO/PASSCORREO
    const user =
      (process.env.CORREO || process.env.USERCORREO || '').trim();
    const pass =
      (process.env.CLAVE  || process.env.PASSCORREO  || '').trim();

    if (!user || !pass) {
      console.error('[MAIL] Faltan variables .env. Setea CORREO/CLAVE o USERCORREO/PASSCORREO.');
    }

    // Guardamos qué user se está usando para usarlo también en "from"
    this.mailUser = user;

    // Logs útiles (sin exponer la clave)
    console.log('[ENV] usando usuario SMTP =', this.mailUser);
    console.log('[ENV] longitud de clave =', pass.length);

    // 3) Transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    // 4) Verificación
    this.transporter.verify()
      .then(() => console.log('[MAIL] Transporter listo para enviar.'))
      .catch(err => console.error('[MAIL] ERROR verify():', err?.message));
  }

  // ------------------------------------------------------------
  // Email a administradores (cuando se crea la reserva)
  // ------------------------------------------------------------
  enviarCorreoAdmins = async (payload) => {
    try {
      const { reserva, admins } = payload || {};
      if (!reserva || !admins?.length) {
        console.warn('[MAIL->ADMINS] Sin admins activos o payload vacío.');
        return false;
      }

      const destinatarios = admins.map(a => a.correoAdmin).join(', ');
      const html = this.template({
        titulo: 'Nueva reserva creada',
        saludo: 'Hola equipo,',
        cuerpo: 'Se registró una nueva reserva.',
        fecha:  reserva.fecha,
        salon:  reserva.salon,
        turno:  reserva.turno,
        nombre: `${reserva.clienteNombre} ${reserva.clienteApellido}`,
        pie:    'Por favor, revisar y confirmar desde el panel.'
      });

      const mailOptions = {
        from: this.mailUser,
        to: destinatarios,
        subject: 'Nueva reserva creada',
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[MAIL->ADMINS] Enviado:', info?.messageId);
      return true;

    } catch (err) {
      console.error('[MAIL->ADMINS] ERROR:', err?.message);
      return false;
    }
  }

  // ------------------------------------------------------------
  // Email al cliente (cuando se confirma la reserva)
  // ------------------------------------------------------------
  enviarCorreoCliente = async (payload) => {
    try {
      const { reserva } = payload || {};
      if (!reserva?.clienteCorreo) {
        console.warn('[MAIL->CLIENTE] clienteCorreo vacío.');
        return false;
      }

      const html = this.template({
        titulo: '¡Tu reserva fue confirmada!',
        saludo: `Hola ${reserva.clienteNombre},`,
        cuerpo: 'Te confirmamos tu reserva.',
        fecha:  reserva.fecha,
        salon:  reserva.salon,
        turno:  reserva.turno,
        nombre: `${reserva.clienteNombre} ${reserva.clienteApellido}`,
        pie: '¡Gracias por elegirnos!'
      });

      const mailOptions = {
        from: this.mailUser,
        to: reserva.clienteCorreo,
        subject: 'Reserva confirmada',
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[MAIL->CLIENTE] Enviado:', info?.messageId);
      return true;

    } catch (err) {
      console.error('[MAIL->CLIENTE] ERROR:', err?.message);
      return false;
    }
  }

// === Enviar correo con contraseña temporal ===
enviarCorreoConContraseniaTemporal = async ({ destino, contraseniaTemporal }) => {
  try {
    if (!destino) return false;

    // Si no te pasan una, usa la fija que querés:
    const pass = contraseniaTemporal ?? "Prog3DW";

    const html = this.template({
      // Cabecera
      titulo: "Contraseña temporal para ingresar",
      saludo: "Hola,",
      cuerpo:
        "Generamos una contraseña temporal para que puedas ingresar y luego cambiarla desde tu perfil.",
      contrasenia_temporal: pass,
      pie: "Enviado por Grupo AX",
    });
    await this.transporter.sendMail({
      from: this.mailUser,
      to: destino,
      subject: "Tu contraseña temporal",
      html,
    });

    return true;
  } catch (error) {
    console.error("[MAIL TEMPORAL] ERROR:", error?.message);
    return false;
  }
};
}

