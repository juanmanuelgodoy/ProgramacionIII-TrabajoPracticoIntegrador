import express from 'express';

// importo rutas
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js';
// inicializo express
const app = express (); 


//las solicitudes con body en json las interpreta como json
app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);

// carga las variables de entorno
process.loadEnvFile();

// lanzo el servidor express
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor arriba en ${process.env.PUERTO}`);
})