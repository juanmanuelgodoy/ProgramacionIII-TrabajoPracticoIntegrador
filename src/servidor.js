
// importo la configuracion de la app express
import app from './reservas.js';

// lanzo el servidor del puerto donde esta configurado
process.loadEnvFile();
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor arriba en ${process.env.PUERTO}`);
})

import loginRutas from "./v1/rutas/loginRutas.js";

app.use("/api/v1/auth", loginRutas);