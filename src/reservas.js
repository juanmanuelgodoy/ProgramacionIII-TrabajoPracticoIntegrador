import express from 'express';
//import handlebars from 'handlebars';
//import nodemailer from 'nodemailer';
//import { fileURLToPath} from 'url';
//import { readFile } from 'fs/promises';
//import path from 'path';
//import { conexion } from './db/conexion.js';

// importo rutas
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js';
// inicializo express
const app = express (); 


//las solicitudes con body en json las interpreta como json
app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);



//ruta del estado de api, si esta activa
/*app.get('estado', (req, res) => {
    res.json({'ok':true});
    //res.status(201).send({'estado':true, 'mensaje':'reserva creada'});
})

app.post('/notificacion', async (req, res) => {
    console.log(req.body);

    if(!req.body.fecha || !req.body.salon || !req.body.turno || !req.body.correoDestino){
        res.status(400).send({'estado':false, 'mensaje':'Faltan datos requeridos'});
    }

    try{
        const { fecha, salon, turno, correoDestino} = req.body;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantilla = path.join(__dirname, 'utiles', 'handelbars', 'plantillas.hbs');
        const datos = await readFile(plantilla, 'utf-8');

        const template = handlebars.compile(datos);

        var html = template(
            {   fecha: fecha, 
                salon: salon, 
                turno: turno
            });
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER, //correoOrigen
                pass: process.env.PASS, //Contraseña de la app
            },
        });
        const opciones = {
            to: "aracelitisocco16@gmail.com", //correoDestino
            subject: "Notificación",
            html: html
        }
        transporter.sendMail(opciones, (error, info) => {
            if (error){
                console.log(error);
                res.json({'ok':false, 'mensaje':'Error al enviar el correo.'});
            }
            console.log(info);
            res.json({'ok':true, 'mensaje':'Correo enviado.'});

        });

    
        



    }catch(error){
        console.log(error);

    }


    //res.json({'ok':true});
});

// Ruta tipo GET para obtener todos los salones activos
app.get('/salones', async (req, res) => {
    try {
        const sql = 'SELECT * FROM salones WHERE activo=1';
        const [results, fields] = await conexion.query(sql);

        res.json({
            estado: true,
            datos: salones
        });
    } catch (err) {
        console.log('Error con GET /salones', err);
    }
})

///Ruta tipo GET para obtener 1 salon particular
app.get('/salones/:salon_id', async (req, res) => {
    try {
        // ????
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ${salon_id}`  ;
        const valores = [salon_id];

        const [results, fields] = await conexion.execute(sql, valores);
        if (results.length === 0) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Salón no encontrado.'
            });
        }

        res.json({
            estado:true,
            salon: results[0]
        });
    } catch (err) {
        console.log('Error con GET/ saones/:aslon_id', err);
        res.status(500).json({
            estado: false,
            mensaje:'Error interno del servidor.'
        });
    } 
})

// POST /salones -> Crear un nuevo salón
app.post('/salones', async (req, res) => {
    try {
        if (!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan datos requeridos.'
            });
        }

        const { titulo, direccion, capacidad, importe } = req.body;
        const valores = [titulo, direccion, capacidad, importe];
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?, ?, ?, ?)';
    
        const [results] = await conexion.execute(sql, valores);
    
        res.status(201).json({
            estado: true,
            mensaje: `Salón creado con id ${results.insertId}.`
        });
    } catch (err) {
        console.log('Error con POST /salones', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        });
    }
});

// PUT ruta para editar un salón
app.put('/salones/:salon_id', async (req, res) => {
    try{
        // antes de modificar verifico si id corresponde a un salón existente en la bd
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?`;
                
        const [results] = await conexion.execute(sql, [salon_id]);
                
        // sino existe aviso al cliente
        if(results.length === 0){
            return res.status(404).json({
                estado: false,
                mensaje: 'El salón no existe.'
            })
        }

        if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan campos requeridos.'
            })
        }
        
        const {titulo, direccion, capacidad, importe} = req.body;
        
        const valores = [titulo, direccion, capacidad, importe, salon_id];
        const sql2 = `UPDATE salones 
                        SET titulo = ?, direccion = ?, capacidad = ? , importe = ? 
                        WHERE salon_id = ?`;

        const [result]= await conexion.execute(sql2, valores);

        res.status(200).json({
            estado: true,
            mensaje: `Salón modificado.`
        });
    }catch(err) {
        console.log('Error en PUT /salones/:salon_id', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
});


// DELETE ruta para eliminiar un salón
// eliminación lógica
app.delete('/salones/:salon_id', async (req, res) => {
    try{
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?`;
                
        const [results] = await conexion.execute(sql, [salon_id]);
        
        if(results.length === 0){
            return res.status(404).json({
                estado: false,
                mensaje: 'El salón no existe.'
            })
        }

        const sql2 = `UPDATE salones 
                        SET activo = 0 
                        WHERE salon_id = ?`;

        const [result]= await conexion.execute(sql2, [salon_id]);
        
        res.status(200).json({
            estado: true,
            mensaje: `Salón eliminado.`
        });
    }catch(err) {
        console.log('Error en DELETE /salones/:salon_id', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
});
*/
// carga las variables de entorno
process.loadEnvFile();
//console.log('algo');

// lanzo el servidor express
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor arriba en ${process.env.PUERTO}`);
})