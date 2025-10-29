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

  // ------------------------------------------------------------
  // Email al usuario cuando se reinicia su contraseña
  // ------------------------------------------------------------
  enviarCorreoReinicio = async (payload) => {
    try {
      const { usuario, nuevaPass } = payload || {};

      // En la DB el correo es nombre_usuario
      const destino = usuario?.nombre_usuario || '';

      if (!destino) {
        console.warn('[MAIL->REINICIO] El usuario no tiene correo cargado.');
        return false;
      }

      const html = this.template({
        titulo: 'Reinicio de contraseña',
        saludo: `Hola ${usuario?.nombre},`,
        cuerpo: 'Tu contraseña ha sido restablecida por un administrador.',
        fecha: '',
        salon: '',
        turno: '',
        nombre: `${usuario?.nombre} ${usuario?.apellido}`,
        pie: `Tu nueva contraseña temporal es: ${nuevaPass}`
      });

      const mailOptions = {
        from: this.mailUser,
        to: destino,
        subject: 'Tu contraseña fue reiniciada',
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[MAIL->REINICIO] Enviado:', info?.messageId);
      return true;

    } catch (err) {
      console.error('[MAIL->REINICIO] ERROR:', err?.message);
      return false;
    }
  }
}

