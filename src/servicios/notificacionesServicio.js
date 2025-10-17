import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesService {
  enviarCorreo = async (datosCorreo) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 1) Armar HTML con Handlebars
    const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
    const plantilla = fs.readFileSync(plantillaPath, 'utf-8');
    const template = handlebars.compile(plantilla);
    const html = template({
      fecha: datosCorreo.fecha,
      salon: datosCorreo.salon,
      turno: datosCorreo.turno
    });

    // 2) Transporter Gmail (App Password en .env)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        // usa .env; si no están definidas, toma los fallback SOLO para prueba local
        user: process.env.CORREO ?? 'usuario1programacion3@gmail.com',
        pass: process.env.CLAVE  ?? 'elavv1cvswuefijj'
      }
    });

    // 3) Destinatario: tu correo para probar
    const mailOptions = {
      from: process.env.CORREO ?? 'usuario1programacion3@gmail.com',
      to: 'aracelitisocco16@gmail.com',
      subject: 'Nueva Reserva',
      html
    };

    // 4) Enviar
    const info = await transporter.sendMail(mailOptions);
    return info.messageId;
  }
}

