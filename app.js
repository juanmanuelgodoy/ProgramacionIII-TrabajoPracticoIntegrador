const sequelize = require('./config/db');
const express = require('express');
require('dotenv').config(); // para usar variables de entorno

const app = express();
app.use(express.json()); // permite recibir datos en formato JSON

// Importar rutas
const servicioRoutes = require('./routes/servicioRoutes');

// Conectar con la base de datos
sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Usar rutas de Servicios
app.use('/api/servicios', servicioRoutes);

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
